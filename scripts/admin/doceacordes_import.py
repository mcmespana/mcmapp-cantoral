#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Importador de canciones desde doceacordes.es → ChordPro estilo MCM.

Descarga el ChordPro de https://doceacordes.es/cancion/{ID}/chordpro y lo
adapta a nuestras convenciones:
  - {start_of_chorus}/{end_of_chorus} → {soc}/{eoc}
  - Acordes en español (Do, Re, Mi…) → inglés (C, D, E…)
  - {key: Re} → {key: D}
  - Prepend {comment: TO DO: PENDIENTE REVISIÓN ACORDES}
  - Limpia espacios sobrantes dentro de los corchetes ([F ] → [F])

Usa el JSON local scripts/canciones_doce_acordes.json como índice
título/artista → ID. Permite matching difuso para sugerir candidatos.
"""
from __future__ import annotations

import json
import re
import unicodedata
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
REPO_DIR = SCRIPTS_DIR.parent
DOCE_INDEX_JSON = SCRIPTS_DIR / "canciones_doce_acordes.json"
CACHE_DIR = SCRIPTS_DIR / "cache_doceacordes"

TODO_COMMENT_LINE = "{comment: TO DO: PENDIENTE REVISIÓN ACORDES}"
BASE_URL = "https://doceacordes.es"

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
    # Procesa "Do/Mi" → "C/E"
    if "/" in tok:
        parts = tok.split("/")
        return "/".join(translate_chord_token(p) for p in parts)

    # Buscar la nota española al inicio
    m = re.match(
        r"^(Sol|SOL|sol|Do|DO|do|Re|RE|re|Mi|MI|mi|Fa|FA|fa|La|LA|la|Si|SI|si)(.*)$",
        tok,
    )
    if not m:
        return tok
    note_es, rest = m.group(1), m.group(2)
    note_en = ES_NOTE_MAP.get(note_es, note_es)
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


def _strip_chorus_parens(line: str) -> str:
    """Si la línea va envuelta en paréntesis (a veces sucede en estribillos
    de doceacordes), los quita. Tolera [acordes] al principio.
    """
    s = line
    # Quitar paréntesis exterior si abre con '(' y cierra con ')'
    # incluso si hay [acorde] al principio
    m = re.match(r"^(\s*(?:\[[^\]]*\]\s*)*)\((.*)\)(\s*)$", s)
    if m:
        return m.group(1) + m.group(2) + m.group(3)
    return s


def _process_chorus_blocks(text: str) -> str:
    """Dentro de cada {soc}...{eoc}: quita paréntesis envolventes y pone
    la letra en MAYÚSCULAS para que el estribillo destaque visualmente."""
    out_lines: List[str] = []
    in_chorus = False
    for ln in text.split("\n"):
        if re.match(r"\s*\{\s*soc\s*\}", ln, re.IGNORECASE):
            in_chorus = True
            out_lines.append(ln)
            continue
        if re.match(r"\s*\{\s*eoc\s*\}", ln, re.IGNORECASE):
            in_chorus = False
            out_lines.append(ln)
            continue
        if in_chorus and ln.strip() and not re.match(r"\s*\{", ln):
            cleaned = _strip_chorus_parens(ln)
            cleaned = _uppercase_lyrics_outside_chords(cleaned)
            out_lines.append(cleaned)
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


def fetch_chordpro(doce_id: str, use_cache: bool = True) -> str:
    """Descarga (o lee de cache) el .cho crudo de una canción."""
    doce_id = str(doce_id)
    cache = _cache_path(doce_id)
    if use_cache and cache.exists():
        return cache.read_text(encoding="utf-8")
    url = f"{BASE_URL}/cancion/{doce_id}/chordpro"
    req = urllib.request.Request(
        url, headers={"User-Agent": "mcmapp-cantoral admin/1.0"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
    cache.write_text(raw, encoding="utf-8")
    return raw


def fetch_html(doce_id: str, use_cache: bool = True) -> str:
    """Descarga la página HTML de la canción (para extraer metadatos extra)."""
    doce_id = str(doce_id)
    cache = _cache_html_path(doce_id)
    if use_cache and cache.exists():
        return cache.read_text(encoding="utf-8")
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


def extract_metadata_from_html(html: str) -> Dict[str, object]:
    """Extrae metadatos extra del HTML de doceacordes (sin BeautifulSoup).

    Returns dict con: ritmo, parroquia, album, momento, tiempo_liturgico,
    fiestas (list), comentario, video_embed, youtube_links (list of {label,url}).
    """
    meta: Dict[str, object] = {
        "ritmo": "", "parroquia": "", "album": "", "momento": "",
        "tiempo_liturgico": "", "fiestas": [], "comentario": "",
        "video_embed": "", "youtube_links": [],
    }

    # Video embebido (primer iframe de youtube)
    m = re.search(r'<iframe[^>]+src="([^"]*youtube[^"]*)"', html, re.IGNORECASE)
    if m:
        meta["video_embed"] = m.group(1)

    # Links de YouTube (no embed) con su texto como etiqueta
    for m in re.finditer(
        r'<a[^>]+href="([^"]*youtube\.com/watch[^"]*)"[^>]*>(.*?)</a>',
        html, re.IGNORECASE | re.DOTALL,
    ):
        url = m.group(1)
        label = _strip_html(m.group(2)) or "YouTube"
        meta["youtube_links"].append({"label": label, "url": url})

    # Pares <b>Campo</b> [<br>] <i>Valor</i>  → "Álbum", "Momento", "Tiempo litúrgico", "Comentario"
    for m in re.finditer(
        r"<b[^>]*>([^<]+)</b>\s*(?:<br\s*/?>\s*)?<i[^>]*>(.*?)</i>",
        html, re.IGNORECASE | re.DOTALL,
    ):
        k = _strip_html(m.group(1)).rstrip(":").lower()
        v = _strip_html(m.group(2))
        if not v:
            continue
        if k.startswith("álbum") or k.startswith("album"):
            meta["album"] = v
        elif k.startswith("momento"):
            meta["momento"] = v
        elif k.startswith("tiempo"):
            meta["tiempo_liturgico"] = v
        elif k.startswith("comentario"):
            meta["comentario"] = v

    # Fiestas: badges
    for m in re.finditer(
        r'class="[^"]*badge[^"]*"[^>]*>(.*?)</', html, re.IGNORECASE | re.DOTALL,
    ):
        v = _strip_html(m.group(1))
        if v and v.lower() not in ("álbum", "momento", "tiempo litúrgico", "comentario"):
            meta["fiestas"].append(v)

    # Cejilla, Ritmo, Parroquia (en card-footer)
    fm = re.search(r'class="[^"]*card-footer[^"]*"[^>]*>(.*?)</div>',
                   html, re.IGNORECASE | re.DOTALL)
    footer_text = _strip_html(fm.group(1)) if fm else ""
    if not footer_text:
        # Fallback: buscar palabras clave en todo el HTML
        footer_text = _strip_html(html)
    rm = re.search(r"Ritmo:\s*([^\n,]+?)(?:\s+(?:Parroquia|Cejilla)|$)",
                   footer_text, re.IGNORECASE)
    if rm:
        meta["ritmo"] = rm.group(1).strip()
    pm = re.search(r"Parroquia\s+([^\n]+?)(?:\s+(?:Ritmo|Cejilla)|$)",
                   footer_text, re.IGNORECASE)
    if pm:
        meta["parroquia"] = pm.group(1).strip()

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
    if extra.get("video_embed"):
        lines.append(f"{{video: {extra['video_embed']}}}")
    for yt in (extra.get("youtube_links") or []):
        label = yt.get("label") or "YouTube"
        url = yt.get("url") or ""
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
    for entry in data:
        entry["_norm_title"] = _normalize(entry.get("title", ""))
        entry["_norm_artist"] = _normalize(entry.get("artist", ""))
        entry["_tok_title"] = _tokens(entry.get("title", ""))
    return data


_doce_cache: Dict[str, object] = {"items": None}


def doce_items() -> List[dict]:
    if _doce_cache["items"] is None:
        _doce_cache["items"] = load_doce_index()
    return _doce_cache["items"]  # type: ignore


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
    out: List[Tuple[float, dict, str]] = []
    for entry in doce_items():
        # Score base por título
        if entry["_norm_title"] == norm_t:
            base = 100.0
        else:
            inter = toks_t & entry["_tok_title"]
            if not inter:
                continue
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
            else:
                entry_toks_a = _tokens(entry["artist"])
                if toks_a & entry_toks_a:
                    artist_match = "partial"
                    base *= 1.3
        # Umbral mínimo
        if base < 30:
            continue
        out.append((base, entry, artist_match))
    out.sort(key=lambda x: -x[0])
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
    doce_id = str(doce_id)
    for entry in doce_items():
        if str(entry.get("id")) == doce_id:
            return {k: v for k, v in entry.items() if not k.startswith("_")}
    return None


# ─────────── Render final ─────────── #

def fetch_and_adapt(doce_id: str, use_cache: bool = True,
                    include_meta: bool = True) -> Tuple[str, Dict[str, str]]:
    """Descarga el .cho, lo adapta y devuelve (contenido, meta).

    Si include_meta=True, además descarga el HTML, extrae los metadatos extra
    (ritmo, album, video, youtube_links, etc.) y los inserta como custom
    directives en el header del .cho resultante.
    """
    raw = fetch_chordpro(doce_id, use_cache=use_cache)
    adapted = adapt_chordpro(raw)
    if include_meta:
        try:
            extra = fetch_extra_meta(doce_id, use_cache=use_cache)
            meta_lines = render_meta_directives(extra)
            if meta_lines:
                adapted = inject_meta_lines(adapted, meta_lines)
        except Exception:
            # Si el scraping falla, devolvemos el .cho sin meta extra
            pass
    meta = extract_meta_from_cho(adapted)
    return adapted, meta


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
