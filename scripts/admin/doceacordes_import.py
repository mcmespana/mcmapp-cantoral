#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Importador de canciones desde doceacordes.es → ChordPro estilo MCM.

De dónde sale la canción
------------------------
La ruta `https://doceacordes.es/cancion/{ID}/chordpro` que usábamos **ya no
existe** (404): rehicieron la web con Astro y la quitaron. Su botón
«Descargar → ChordPro» tampoco sirve para nosotros, porque no es un enlace sino
un `blob:` que su JavaScript fabrica en el navegador — no hay nada que pedirle al
servidor.

Lo que sí pasa es que **todo lo que ese fichero contiene está en el HTML de la
ficha**: el cuerpo viaja en las props del componente `SongChordProViewer` y el
resto (título, autor, álbum, parroquia, vídeo) en el marcado. Así que se compone
el .cho desde la ficha. Comprobado contra una descarga real de su botón: sale
idéntico salvo una blanca que su JS mete tras cada `{end_of_chorus}`. Encima nos
sale más barato, porque la ficha ya la descargábamos para los metadatos: una
petición en vez de dos.

Adaptación a nuestras convenciones:
  - {start_of_chorus}/{end_of_chorus} → {soc}/{eoc}
  - Acordes en español (Do, Re, Mi…) → inglés (C, D, E…), tolerando erratas de
    su web (`SOl7`, `[[la]`) y acordes ingleses en minúscula (`[c]`, `[b7]`)
  - {key} deducido de `toneFrom` + el modo del primer acorde (su propia descarga
    no incluye el tono)
  - Prepend {comment: TO DO: PENDIENTE REVISIÓN ACORDES}
  - Limpia espacios sobrantes dentro de los corchetes ([F ] → [F])

Usa el JSON local scripts/canciones_doce_acordes.json como índice
título/artista → ID. **Es la única fuente del listado**: ya no hay API pública,
así que si borras ese fichero no hay forma de regenerarlo salvo recorriendo su
sitemap.
"""
from __future__ import annotations

import html as html_mod
import json
import re
import sys
import unicodedata
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
REPO_DIR = SCRIPTS_DIR.parent
DOCE_INDEX_JSON = SCRIPTS_DIR / "canciones_doce_acordes.json"
CACHE_DIR = SCRIPTS_DIR / "cache_doceacordes"

TODO_COMMENT_LINE = "{comment: TO DO: PENDIENTE REVISIÓN ACORDES}"
BASE_URL = "https://doceacordes.es"

# Módulo común: mapeo campo↔directiva y normalización de URLs de YouTube.
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))
import chordpro as cp  # noqa: E402

# ─────────── Traducción ES → EN de acordes ─────────── #

# Notas: el orden importa, primero las largas para que regex matchee "Sol" antes que "So".
ES_NOTE_MAP = {
    "Do": "C", "Re": "D", "Mi": "E", "Fa": "F", "Sol": "G", "La": "A", "Si": "B",
    "DO": "C", "RE": "D", "MI": "E", "FA": "F", "SOL": "G", "LA": "A", "SI": "B",
    "do": "C", "re": "D", "mi": "E", "fa": "F", "sol": "G", "la": "A", "si": "B",
}

# Regex que captura una nota española al inicio de un token de acorde
# Acepta variantes: Sol, La, Do# sostenido, Mib, Solm, Lam7, Re/Fa#…
_NOTE_RE = re.compile(
    r"\b(Sol|SOL|sol|Do|DO|do|Re|RE|re|Mi|MI|mi|Fa|FA|fa|La|LA|la|Si|SI|si)"
    r"(?![a-rt-zA-RT-Z])"  # evita matchear "Sol" dentro de "Solo" pero permite "Solm"
)


def translate_chord_token(tok: str) -> str:
    """Traduce un solo token de acorde español→inglés. Idempotente para acordes ya en EN."""
    if not tok:
        return tok
    # Corchetes sueltos: en doceacordes hay erratas tipo "[[la]", que el parser
    # nos entrega como "[la". Se limpian antes de intentar traducir.
    tok = tok.strip().strip("[]").strip()
    if not tok:
        return tok
    # Procesa "Do/Mi" → "C/E"
    if "/" in tok:
        parts = tok.split("/")
        return "/".join(translate_chord_token(p) for p in parts)

    # Buscar la nota española al inicio. Sin distinguir mayúsculas: el mayor o
    # menor lo marca el sufijo ("m"), no la caja de la nota, y en su web hay
    # erratas de caja como "SOl7" que antes se quedaban sin traducir.
    m = re.match(
        r"^(sol|do|re|mi|fa|la|si)(.*)$",
        tok,
        re.IGNORECASE,
    )
    if not m:
        # No es español. Puede ser un acorde inglés escrito en minúscula
        # ("[c]", "[em]", "[b7]"): se le pone la raíz en mayúscula, que es como
        # lo espera el resto del cantoral. Es inequívoco porque ninguna nota
        # española es una sola letra a-g.
        m_en = re.match(r"^([a-g])([#b]?)(.*)$", tok)
        if m_en:
            return m_en.group(1).upper() + m_en.group(2) + m_en.group(3)
        return tok
    note_es, rest = m.group(1), m.group(2)
    note_en = ES_NOTE_MAP.get(note_es, ES_NOTE_MAP.get(note_es.capitalize(), note_es))
    # En español "m" minúscula = menor; en inglés también "m". OK pasa tal cual.
    # "M" mayúscula a veces se usa para mayor, en inglés se omite.
    if rest.startswith("M") and not rest.startswith("Maj") and not rest.startswith("m"):
        rest = rest[1:]
    return note_en + rest


def translate_chord_in_brackets(content: str) -> str:
    """Traduce todos los [Acorde] del cuerpo."""
    def repl(m: re.Match) -> str:
        inner = m.group(1).strip()  # limpia "[F ]" → "F"
        if not inner:
            return "[]"
        return "[" + translate_chord_token(inner) + "]"
    return re.sub(r"\[([^\]]+)\]", repl, content)


def translate_key_value(key_es: str) -> str:
    """Traduce el valor de {key: Re} → 'D'. Acepta ya en inglés."""
    if not key_es:
        return key_es
    return translate_chord_token(key_es.strip())


# ─────────── Adaptación del .cho completo ─────────── #

def _ensure_trailing_space_after_chord(line: str) -> str:
    """Si la línea acaba en un acorde [X], añade un espacio final.
    Así ninguna línea termina con un acorde 'suelto' sin texto/espacio detrás.
    """
    if re.search(r"\][^\]]*$", line):
        # último ] está después del último '['; comprobamos si es justo el final
        pass
    # Más simple: si el último carácter no-whitespace es ']'
    rstripped = line.rstrip()
    if rstripped.endswith("]"):
        return rstripped + " "
    return line


def _uppercase_lyrics_outside_chords(line: str) -> str:
    """Pone en MAYÚSCULAS solo las letras (texto fuera de [acordes])."""
    parts = re.split(r"(\[[^\]]*\])", line)
    return "".join(p if p.startswith("[") else p.upper() for p in parts)


def _strip_envelope_parens_from_block(block_lines: List[str]) -> List[str]:
    """Si todo el bloque de estribillo está envuelto por un par '(' … ')' externo,
    los quita. Preserva paréntesis internos balanceados (ej. '(bis)', '(x2)').

    Algoritmo:
      1. Concatena todo el bloque ignorando [acordes].
      2. Localiza el primer '(' del bloque y su ')' correspondiente
         (matching paren).
      3. Si entre el inicio del bloque y ese '(' solo hay whitespace,
         y entre ese ')' y el final solo hay whitespace o sufijos
         tipo '(bis)' / '(x2)' / '(2 veces)', se considera envoltorio
         y se elimina del texto original (manteniendo los [acordes]).
    """
    if not block_lines:
        return block_lines
    text = "\n".join(block_lines)
    # Texto sin acordes para análisis posicional
    no_chords_parts: List[Tuple[int, str]] = []  # (pos_real, char)
    i = 0
    while i < len(text):
        if text[i] == "[":
            end = text.find("]", i)
            if end == -1:
                end = len(text) - 1
            i = end + 1
            continue
        no_chords_parts.append((i, text[i]))
        i += 1
    clean = "".join(ch for _, ch in no_chords_parts)
    pos_map = [p for p, _ in no_chords_parts]  # clean[k] → text[pos_map[k]]

    # Localizar primer '(' y su matching ')'
    first_open = -1
    matching_close = -1
    depth = 0
    for k, ch in enumerate(clean):
        if ch == "(":
            if depth == 0 and first_open == -1:
                first_open = k
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0 and first_open != -1:
                matching_close = k
                break
    if first_open == -1 or matching_close == -1:
        return block_lines

    # Antes del '(': solo whitespace
    if clean[:first_open].strip():
        return block_lines
    # Después del ')': solo whitespace y/o un sufijo tipo (bis), (x2), (2 veces)
    tail = clean[matching_close + 1:].strip()
    if tail and not re.fullmatch(
        r"\(\s*(?:bis|x\s*\d+|\d+\s*veces?|repetir)\s*\)", tail, re.IGNORECASE
    ):
        return block_lines

    # Eliminar los caracteres en text correspondientes a first_open y matching_close
    p_open = pos_map[first_open]
    p_close = pos_map[matching_close]
    new_text = text[:p_open] + text[p_open + 1:p_close] + text[p_close + 1:]
    return new_text.split("\n")


def _process_chorus_blocks(text: str) -> str:
    """Dentro de cada {soc}...{eoc}: quita paréntesis envolventes del bloque
    y pone la letra (no acordes) en MAYÚSCULAS para que destaque.
    """
    out_lines: List[str] = []
    chorus_buf: List[str] = []
    in_chorus = False
    for ln in text.split("\n"):
        if re.match(r"\s*\{\s*soc\s*\}", ln, re.IGNORECASE):
            in_chorus = True
            chorus_buf = []
            out_lines.append(ln)
            continue
        if re.match(r"\s*\{\s*eoc\s*\}", ln, re.IGNORECASE):
            # Procesar el buffer: quitar paréntesis envolventes y subir letras
            cleaned_block = _strip_envelope_parens_from_block(chorus_buf)
            for bln in cleaned_block:
                if bln.strip() and not re.match(r"\s*\{", bln):
                    bln = _uppercase_lyrics_outside_chords(bln)
                out_lines.append(bln)
            in_chorus = False
            chorus_buf = []
            out_lines.append(ln)
            continue
        if in_chorus:
            chorus_buf.append(ln)
        else:
            out_lines.append(ln)
    return "\n".join(out_lines)


def ensure_no_dangling_chords(text: str) -> str:
    """Aplica `_ensure_trailing_space_after_chord` línea a línea."""
    return "\n".join(_ensure_trailing_space_after_chord(ln) for ln in text.split("\n"))


def adapt_chordpro(raw: str) -> str:
    """Toma el .cho crudo de doceacordes y lo deja estilo MCM."""
    text = raw.replace("\r\n", "\n").replace("\r", "\n")

    # Compactar blancas: doceacordes mete 1 blanca entre cada línea y 2-3
    # blancas como separador de estrofa. Convertimos 1 blanca → 0,
    # 2+ blancas → 1 (separador de estrofa).
    lines = text.split("\n")
    out: List[str] = []
    blank_run = 0
    for ln in lines:
        if ln.strip() == "":
            blank_run += 1
        else:
            if out:
                # Si veníamos de >= 2 blancas → separador de párrafo (1 blanca)
                # Si veníamos de 1 blanca → era ruido (0 blancas)
                if blank_run >= 2:
                    out.append("")
            out.append(ln)
            blank_run = 0
    text = "\n".join(out)

    # Marcadores de estribillo
    text = re.sub(r"\{\s*start_of_chorus\s*\}", "{soc}", text, flags=re.IGNORECASE)
    text = re.sub(r"\{\s*end_of_chorus\s*\}", "{eoc}", text, flags=re.IGNORECASE)

    # Traducir el valor de {key: ...}
    def _key_repl(m: re.Match) -> str:
        return "{key: " + translate_key_value(m.group(1)) + "}"
    text = re.sub(r"\{\s*key\s*:\s*([^}]+)\}", _key_repl, text, flags=re.IGNORECASE)

    # Traducir acordes dentro de [...]
    text = translate_chord_in_brackets(text)

    # Procesar bloques de estribillo: quitar paréntesis envolventes y
    # poner las letras (no acordes) en MAYÚSCULAS para que destaquen.
    text = _process_chorus_blocks(text)

    # Que ninguna línea termine en un acorde 'suelto': añadir espacio final.
    text = ensure_no_dangling_chords(text)

    # Prepend TO DO si no está
    if not re.search(r"\bTO\s+DO\b", text):
        # Insertar como primera línea (antes de cualquier directive)
        text = TODO_COMMENT_LINE + "\n" + text.lstrip("\n")

    # Asegurar newline final
    if not text.endswith("\n"):
        text += "\n"
    return text


def extract_meta_from_cho(content: str) -> Dict[str, str]:
    """Extrae title/artist/key/capo de un .cho."""
    def get(key: str) -> str:
        m = re.search(r"\{\s*" + key + r"\s*:\s*(.*?)\s*\}", content, re.IGNORECASE)
        return m.group(1).strip() if m else ""
    return {
        "title": get("title"),
        "artist": get("artist"),
        "key": get("key"),
        "capo": get("capo"),
    }


# ─────────── Descarga ─────────── #

def _cache_path(doce_id: str) -> Path:
    CACHE_DIR.mkdir(exist_ok=True)
    return CACHE_DIR / f"{doce_id}.cho"


def _cache_html_path(doce_id: str) -> Path:
    CACHE_DIR.mkdir(exist_ok=True)
    return CACHE_DIR / f"{doce_id}.html"


class DoceFormatoCambiado(RuntimeError):
    """La ficha no tiene el ChordPro donde lo esperamos.

    Se lanza a propósito en vez de devolver vacío: si doceacordes vuelve a
    rediseñar su web, es mejor que el import falle con un mensaje claro que
    generar un .cho sin canción dentro.
    """


# El cuerpo de la canción viaja en las props del componente Astro que pinta el
# visor de ChordPro. Ojo: la ruta /cancion/<id>/chordpro que usábamos antes YA NO
# EXISTE (404 desde el rediseño de la web); y el botón "Descargar → ChordPro" no
# es un enlace, es un blob que su JavaScript fabrica en el navegador, así que no
# hay nada que pedir al servidor. Todo lo que ese fichero contiene está aquí.
_ISLAND_RE = re.compile(
    r'component-export="SongChordProViewer"[^>]*?props="([^"]*)"', re.IGNORECASE | re.DOTALL
)


def _astro_prop(props: dict, key: str) -> str:
    """Lee una prop de un astro-island.

    Astro serializa cada valor como `[tipo, valor]`; el tipo 0 es un valor
    plano. Se acepta también el valor suelto por si cambian el formato.
    """
    v = props.get(key)
    if isinstance(v, list) and len(v) > 1:
        return v[1] if isinstance(v[1], str) else ""
    return v if isinstance(v, str) else ""


def extract_song_from_page(page_html: str) -> Tuple[str, str]:
    """Devuelve (cuerpo_chordpro, tono) leídos de la ficha de la canción."""
    m = _ISLAND_RE.search(page_html)
    if not m:
        raise DoceFormatoCambiado(
            "no encuentro el visor de ChordPro en la ficha (¿han cambiado otra vez la web?)"
        )
    try:
        props = json.loads(html_mod.unescape(m.group(1)))
    except Exception as e:
        raise DoceFormatoCambiado(f"no puedo leer las props del visor: {e}") from e
    return _astro_prop(props, "songText"), _astro_prop(props, "toneFrom")


def guess_key(body: str, tone_from: str) -> str:
    """Tono de la canción, ya en inglés.

    `toneFrom` sólo trae la nota raíz y siempre en mayúsculas, así que pierde el
    modo: una canción en La menor viene como "LA". Recuperamos el menor del
    primer acorde del cuerpo, pero sólo si su raíz coincide con la de `toneFrom`
    (si la canción empieza en un acorde que no es la tónica, no inventamos).
    """
    root = translate_key_value(tone_from) if tone_from else ""
    m = re.search(r"\[([^\]\n]+)\]", body or "")
    first = translate_chord_token(m.group(1)) if m else ""
    if first and root and first.startswith(root):
        return first
    return root


def compose_chordpro(doce_id: str, page_html: str) -> str:
    """Rehace el .cho que antes servía /chordpro, a partir de la ficha.

    Comprobado contra una descarga real del botón de su web: sale idéntico
    salvo una línea en blanco que su JS mete tras cada {end_of_chorus} (y que
    `adapt_chordpro` normaliza de todas formas). Además añadimos {key}, que su
    propia descarga no incluye.
    """
    body, tone = extract_song_from_page(page_html)
    if not (body or "").strip():
        raise DoceFormatoCambiado("la ficha no trae letra en el visor de ChordPro")

    entry = get_entry(doce_id) or {}
    page_meta = extract_metadata_from_html(page_html)
    title = entry.get("title") or page_meta.get("titulo") or f"cancion-{doce_id}"
    artist = entry.get("artist") or page_meta.get("autor") or ""

    header = [f"{{title: {title}}}"]
    if artist:
        header.append(f"{{artist: {artist}}}")
    key = guess_key(body, tone)
    if key:
        header.append(f"{{key: {key}}}")
    header.append("{capo: 0}")
    return "\n".join(header) + "\n\n" + body


def fetch_chordpro(doce_id: str, use_cache: bool = True) -> str:
    """Devuelve el .cho de una canción, componiéndolo desde su ficha."""
    doce_id = str(doce_id)
    cache = _cache_path(doce_id)
    if use_cache and cache.exists():
        return cache.read_text(encoding="utf-8")
    raw = compose_chordpro(doce_id, fetch_html(doce_id, use_cache=use_cache))
    cache.write_text(raw, encoding="utf-8")
    return raw


def _page_looks_current(page: str) -> bool:
    """¿Esta ficha es de la web actual?

    El visor de ChordPro está incluso en las canciones que no tienen acordes, así
    que su ausencia significa que la página es de la web vieja.
    """
    return bool(_ISLAND_RE.search(page or ""))


def fetch_html(doce_id: str, use_cache: bool = True) -> str:
    """Descarga la ficha HTML de la canción (de ahí sale TODO: letra y metadatos)."""
    doce_id = str(doce_id)
    cache = _cache_html_path(doce_id)
    if use_cache and cache.exists():
        cached = cache.read_text(encoding="utf-8")
        # Las fichas guardadas antes del rediseño no sirven: se tiran y se
        # vuelven a bajar solas, sin tener que vaciar la cache a mano.
        if _page_looks_current(cached):
            return cached
    url = f"{BASE_URL}/cancion/{doce_id}"
    req = urllib.request.Request(
        url, headers={"User-Agent": "mcmapp-cantoral admin/1.0"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
    cache.write_text(raw, encoding="utf-8")
    return raw


# ─────────── Scraping metadatos HTML ─────────── #

def _strip_html(s: str) -> str:
    """Elimina tags HTML y decodifica entidades básicas."""
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", " ", s)
    s = (s.replace("&aacute;", "á").replace("&eacute;", "é").replace("&iacute;", "í")
           .replace("&oacute;", "ó").replace("&uacute;", "ú").replace("&ntilde;", "ñ")
           .replace("&Aacute;", "Á").replace("&Eacute;", "É").replace("&Iacute;", "Í")
           .replace("&Oacute;", "Ó").replace("&Uacute;", "Ú").replace("&Ntilde;", "Ñ")
           .replace("&amp;", "&").replace("&quot;", '"').replace("&#39;", "'")
           .replace("&nbsp;", " "))
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Bloque de datos de la ficha: pares de <div> con la etiqueta en gris y el valor
# debajo. Las etiquetas vistas son "Autor", "Album" y "Título original".
_INFO_PAIR_RE = re.compile(
    r'<div class="text-gray-500">([^<]{1,40})</div>\s*<div class="text-gray-700">(.*?)</div>',
    re.IGNORECASE | re.DOTALL,
)
_PARISH_RE = re.compile(r"Footer - Parish\s*-->\s*<div[^>]*>([^<]*)</div>", re.IGNORECASE)
_H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.IGNORECASE | re.DOTALL)


def extract_metadata_from_html(html: str) -> Dict[str, object]:
    """Extrae los metadatos que la ficha de doceacordes sigue publicando.

    Tras el rediseño de su web quedan: título, autor, álbum, título original,
    parroquia, vídeo embebido y algún link de YouTube. Ya NO publican ritmo,
    tiempo litúrgico, momento, fiestas ni comentario, así que esas claves se
    devuelven vacías (se mantienen para no romper a quien las lea).
    """
    meta: Dict[str, object] = {
        "titulo": "", "autor": "", "album": "", "titulo_original": "",
        "parroquia": "", "video_embed": "", "youtube_links": [],
        # Ya no vienen en la ficha; se conservan por compatibilidad.
        "ritmo": "", "momento": "", "tiempo_liturgico": "",
        "fiestas": [], "comentario": "",
    }

    m = _H1_RE.search(html)
    if m:
        meta["titulo"] = _strip_html(m.group(1))

    for m in _INFO_PAIR_RE.finditer(html):
        k = _strip_html(m.group(1)).rstrip(":").lower()
        v = _strip_html(m.group(2))
        if not v:
            continue
        if k.startswith("autor"):
            meta["autor"] = v
        elif k.startswith("album") or k.startswith("álbum"):
            meta["album"] = v
        elif k.startswith("t") and "original" in k:
            meta["titulo_original"] = v

    m = _PARISH_RE.search(html)
    if m:
        meta["parroquia"] = _strip_html(m.group(1))

    # Vídeo embebido (primer iframe de youtube)
    m = re.search(r'<iframe[^>]+src="([^"]*youtube[^"]*)"', html, re.IGNORECASE)
    if m:
        meta["video_embed"] = m.group(1)

    # Links de YouTube sueltos. Se acepta cualquier forma (watch, youtu.be,
    # shorts…) y se descarta el que ya sea el vídeo embebido para no duplicarlo.
    embed_id = cp.youtube_id(meta["video_embed"])
    seen = {embed_id} if embed_id else set()
    for m in re.finditer(
        r'<a[^>]+href="([^"]*youtu[^"]*)"[^>]*>(.*?)</a>',
        html, re.IGNORECASE | re.DOTALL,
    ):
        url = m.group(1)
        vid = cp.youtube_id(url)
        if not vid or vid in seen:
            continue
        seen.add(vid)
        label = _strip_html(m.group(2)) or "YouTube"
        meta["youtube_links"].append({"label": label, "url": url})

    return meta


def fetch_extra_meta(doce_id: str, use_cache: bool = True) -> Dict[str, object]:
    """Descarga el HTML y extrae metadatos extra."""
    html = fetch_html(doce_id, use_cache=use_cache)
    return extract_metadata_from_html(html)


def render_meta_directives(extra: Dict[str, object]) -> List[str]:
    """Convierte el dict de metadatos extra en líneas de directives ChordPro."""
    lines: List[str] = []
    if extra.get("ritmo"):
        lines.append(f"{{ritmo: {extra['ritmo']}}}")
    if extra.get("album"):
        lines.append(f"{{album: {extra['album']}}}")
    # tiempo litúrgico + fiestas fusionados con " | "
    tiempos = []
    if extra.get("tiempo_liturgico"):
        tiempos.append(extra["tiempo_liturgico"])
    fiestas = extra.get("fiestas") or []
    for f in fiestas:
        if f not in tiempos:
            tiempos.append(f)
    if tiempos:
        lines.append(f"{{tiempo: {' | '.join(tiempos)}}}")
    if extra.get("momento"):
        # momento va como otro tiempo, separado: lo unimos al campo tiempo
        # (se podría sacar a campo propio, pero lo mantenemos en tiempo)
        if not any("tiempo:" in ln for ln in lines):
            lines.append(f"{{tiempo: {extra['momento']}}}")
        else:
            lines[-1] = lines[-1][:-1] + f" | {extra['momento']}" + "}"
    fuente_parts = ["doceacordes.es"]
    if extra.get("parroquia"):
        fuente_parts.append(f"Parroquia {extra['parroquia']}")
    lines.append(f"{{fuente: {' - '.join(fuente_parts)}}}")
    # Normalizamos a embed igual que el editor: doceacordes da el iframe ya en
    # /embed/ pero los links de la ficha vienen como /watch?v=.
    if extra.get("video_embed"):
        lines.append(f"{{video: {cp.to_youtube_embed(extra['video_embed'])}}}")
    for yt in (extra.get("youtube_links") or []):
        label = yt.get("label") or "YouTube"
        url = cp.to_youtube_embed(yt.get("url") or "")
        if url:
            lines.append(f"{{youtube: {label} | {url}}}")
    if extra.get("comentario"):
        lines.append(f"{{comentario: {extra['comentario']}}}")
    return lines


# ─────────── Índice título/artista → ID ─────────── #

def _normalize(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return s.strip()


def _tokens(s: str) -> set:
    return {t for t in _normalize(s).split() if t and len(t) > 1}


def load_doce_index() -> List[dict]:
    """Devuelve la lista completa del JSON con campo extra `_norm_title`/`_norm_artist`."""
    if not DOCE_INDEX_JSON.exists():
        return []
    data = json.loads(DOCE_INDEX_JSON.read_text(encoding="utf-8"))
    for i, entry in enumerate(data):
        entry["_idx"] = i
        entry["_norm_title"] = _normalize(entry.get("title", ""))
        entry["_norm_artist"] = _normalize(entry.get("artist", ""))
        entry["_tok_title"] = _tokens(entry.get("title", ""))
        entry["_tok_artist"] = _tokens(entry.get("artist", ""))
    return data


_doce_cache: Dict[str, object] = {"items": None, "by_token": None, "by_id": None}


def doce_items() -> List[dict]:
    if _doce_cache["items"] is None:
        _doce_cache["items"] = load_doce_index()
    return _doce_cache["items"]  # type: ignore


def _doce_by_token() -> Dict[str, List[dict]]:
    """Índice invertido token → entradas que lo contienen en el título.

    El índice tiene ~1700 canciones y el catálogo pide candidatos para cada
    canción del repo y cada una que falta (~250 consultas). Recorrer la lista
    entera en cada consulta es el cuello de botella; con el índice invertido
    sólo puntuamos las entradas que comparten al menos un token, que son unas
    pocas decenas.
    """
    if _doce_cache["by_token"] is None:
        idx: Dict[str, List[dict]] = {}
        for entry in doce_items():
            for tok in entry["_tok_title"]:
                idx.setdefault(tok, []).append(entry)
        _doce_cache["by_token"] = idx
    return _doce_cache["by_token"]  # type: ignore


def _doce_by_id() -> Dict[str, dict]:
    if _doce_cache["by_id"] is None:
        _doce_cache["by_id"] = {str(e.get("id")): e for e in doce_items()}
    return _doce_cache["by_id"]  # type: ignore


def find_candidates(title: str, artist: str = "", top: int = 3) -> List[dict]:
    """Devuelve top-N candidatos del JSON con un score de similitud por tokens.

    Cuando el artista coincide:
      - perfecto (igual normalizado): score *= 2.0  → hasta 200 %, _artist_match='perfect'
      - parcial (al menos 1 token común):  score *= 1.3, _artist_match='partial'
    Sin coincidencia (o sin artist input): _artist_match='none'.
    """
    norm_t = _normalize(title)
    toks_t = _tokens(title)
    if not toks_t:
        return []
    norm_a = _normalize(artist)
    toks_a = _tokens(artist)
    # Sólo las entradas que comparten algún token pueden pasar el umbral: las
    # que no comparten ninguno se descartaban igual con `if not inter: continue`.
    by_token = _doce_by_token()
    candidates: Dict[int, dict] = {}
    for tok in toks_t:
        for entry in by_token.get(tok, ()):
            candidates[entry["_idx"]] = entry
    out: List[Tuple[float, dict, str]] = []
    for entry in candidates.values():
        # Score base por título
        if entry["_norm_title"] == norm_t:
            base = 100.0
        else:
            inter = toks_t & entry["_tok_title"]
            union = toks_t | entry["_tok_title"]
            base = 100.0 * len(inter) / len(union)
        # Penaliza si tamaños muy distintos
        size_ratio = min(len(toks_t), len(entry["_tok_title"])) / max(len(toks_t), len(entry["_tok_title"]))
        base *= 0.5 + 0.5 * size_ratio
        # Match de artista
        artist_match = "none"
        if norm_a and entry["_norm_artist"]:
            if norm_a == entry["_norm_artist"]:
                artist_match = "perfect"
                base *= 2.0
            elif toks_a & entry["_tok_artist"]:
                artist_match = "partial"
                base *= 1.3
        # Umbral mínimo
        if base < 30:
            continue
        out.append((base, entry, artist_match))
    # Desempate por posición en el índice: el orden del índice invertido no es
    # el del JSON, así que sin esto los empates de score salían en orden
    # arbitrario y el "top 3" bailaba entre llamadas.
    out.sort(key=lambda x: (-x[0], x[1]["_idx"]))
    result = []
    for score, entry, am in out[:top]:
        e = {k: v for k, v in entry.items() if not k.startswith("_")}
        e["_score"] = round(score, 1)
        e["_artist_match"] = am
        result.append(e)
    return result


def find_best_id(title: str, artist: str = "") -> Optional[str]:
    cands = find_candidates(title, artist, top=1)
    if not cands:
        return None
    # Sólo considerar match "fiable" si score alto
    if cands[0]["_score"] < 70:
        return None
    return cands[0]["id"]


def get_entry(doce_id: str) -> Optional[dict]:
    entry = _doce_by_id().get(str(doce_id))
    if entry is None:
        return None
    return {k: v for k, v in entry.items() if not k.startswith("_")}


# ─────────── Render final ─────────── #

def fetch_and_adapt(doce_id: str, use_cache: bool = True,
                    include_meta: bool = True) -> Tuple[str, Dict[str, str]]:
    """Compone el .cho desde la ficha, lo adapta y devuelve (contenido, meta).

    Una sola petición: la letra y los metadatos salen de la MISMA página. Antes
    eran dos URLs (el .cho y la ficha) que se pedían en paralelo; desde que
    doceacordes quitó la ruta /chordpro todo vive en la ficha, así que esto es
    además más rápido que antes.
    """
    # fetch_chordpro compone desde la ficha (o usa el .cho ya cacheado, que
    # incluye los que se bajaron con la ruta vieja y siguen siendo válidos).
    raw = fetch_chordpro(doce_id, use_cache=use_cache)
    adapted = adapt_chordpro(raw)
    if include_meta:
        try:
            # La ficha ya está en cache tras el paso anterior: 0 peticiones extra.
            page = fetch_html(doce_id, use_cache=use_cache)
            meta_lines = render_meta_directives(extract_metadata_from_html(page))
            if meta_lines:
                adapted = inject_meta_lines(adapted, meta_lines)
        except Exception:
            # Si el scraping de los extras falla, devolvemos el .cho sin ellos:
            # la canción (que es lo importante) ya la tenemos.
            pass
    meta = extract_meta_from_cho(adapted)
    return adapted, meta


def prefetch(doce_id: str) -> bool:
    """Deja la ficha de una canción en cache. True si ya estaba o si se pudo."""
    doce_id = str(doce_id)
    if _cache_html_path(doce_id).exists():
        return True
    try:
        fetch_html(doce_id)
    except Exception:
        return False
    return True


def inject_meta_lines(content: str, meta_lines: List[str]) -> str:
    """Inserta las líneas de metadatos en el header, justo tras {capo}/{key}."""
    if not meta_lines:
        return content
    # Normalizar blancas: el chordpro de doceacordes mete líneas en blanco entre
    # cada directive del header. Compactamos el header antes de insertar.
    lines = content.split("\n")
    # 1) Filtrar repeticiones de meta-directives previas (idempotente)
    meta_keys_new = {ln.split(":", 1)[0].strip("{ ").lower() for ln in meta_lines}
    repeatable = {"youtube", "audio"}
    filtered: List[str] = []
    for ln in lines:
        m = re.match(r"\s*\{\s*([a-zA-Z_]+)\s*:", ln)
        if m and m.group(1).lower() in meta_keys_new:
            if m.group(1).lower() in repeatable:
                continue
            continue
        filtered.append(ln)
    # 2) Encontrar el final del bloque "header": secuencia inicial de directives
    #    permitiendo blancas intercaladas. Termina al ver una línea NO-blanca
    #    y NO-directive.
    insert_at = 0
    seen_directive = False
    for i, ln in enumerate(filtered):
        if re.match(r"\s*\{[a-zA-Z_]+\s*:", ln):
            insert_at = i + 1
            seen_directive = True
        elif ln.strip() == "":
            # blanca: la incluimos en el header sólo si ya vimos alguna directive
            if seen_directive:
                continue
            break
        else:
            break
    new_lines = filtered[:insert_at] + meta_lines + filtered[insert_at:]
    return "\n".join(new_lines)
