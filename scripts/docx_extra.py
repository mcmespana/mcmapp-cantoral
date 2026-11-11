#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""docx_extra.py — Words sueltos con canciones del cantoral normal.

Además del Word grande del cantoral (`docx2chordpro.py`), a veces llegan Words
sueltos con unas pocas canciones (p. ej. «Letras con acordes guitarra.docx»).
Se dejan en `scripts/input/word/` y el admin las enseña en «📥 Importar del
cantoral» junto a las del Word grande: misma lista, mismos botones. La única
diferencia es que estos Words no tienen secciones (Heading1), así que la
categoría se elige al importar.

Formato esperado (el de esos Words, exportados de Google Docs):
  - Título en Heading2, con numeración opcional: «1️. LA FUERZA DE UN SUEÑO».
  - Debajo, «Letra y música: X» o «Letra: X» + «Música: Y» → {artist:}.
  - Acordes en negrita, en notación española (menores en minúscula: rem, sol#m),
    alineados con espacios sobre la letra. Estribillo en MAYÚSCULAS.

La conversión es la misma que la del Word grande (posición de los acordes en
píxeles), pero midiendo con la fuente que el propio .docx lleva incrustada
(Roboto en vez de Calibri). Sin fuente incrustada, se mide con Calibri.

Uso:
  python docx_extra.py list            # canciones de todos los Words sueltos
  python docx_extra.py show N          # canción N convertida a ChordPro
"""

from __future__ import annotations

import copy
import io
import re
import sys
import unicodedata
import zipfile
from collections import Counter
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from xml.etree import ElementTree as ET

import docx2chordpro as d2c

SCRIPT_DIR = Path(__file__).resolve().parent
EXTRA_DIR = SCRIPT_DIR / "input" / "word"

W = d2c.W

# «1️. TÍTULO», «7.  TÍTULO» (el emoji de tecla lleva U+FE0F / U+20E3)
_NUM_PREFIX_RE = re.compile(r"^\s*\d+[️⃣]*\s*[.)-]\s*")
_CREDIT_RE = re.compile(r"^\s*(letra\s+y\s+m[uú]sica|letra|m[uú]sica)\s*:\s*(.+?)\s*$",
                        re.IGNORECASE)
# «INTRO →», «Intro:» al principio de una línea de acordes
_INTRO_RE = re.compile(r"^\s*intro\b\s*[:→>-]*\s*", re.IGNORECASE)


def list_extra_docx() -> List[Path]:
    """Words de `scripts/input/word/` (sin los temporales «~$…» de Word)."""
    if not EXTRA_DIR.exists():
        return []
    return sorted(p for p in EXTRA_DIR.glob("*.docx") if not p.name.startswith("~$"))


# ─────────── Fuente incrustada ─────────── #


def _main_font_family(paras: List[ET.Element]) -> Optional[str]:
    """Fuente con más caracteres en el documento (la de letra y acordes)."""
    count: Counter = Counter()
    for p in paras:
        for r in p.iter(W("r")):
            rpr = r.find(W("rPr"))
            fonts = rpr.find(W("rFonts")) if rpr is not None else None
            fam = fonts.get(W("ascii")) if fonts is not None else None
            n = sum(len(t.text or "") for t in r.iter(W("t")))
            if fam and n:
                count[fam] += n
    return count.most_common(1)[0][0] if count else None


def embedded_fonts(docx_path: Path) -> Tuple[Optional[str], Optional[bytes], Optional[bytes]]:
    """(familia, ttf regular, ttf negrita) de la fuente principal, si viene incrustada."""
    from PIL import ImageFont

    paras = d2c.load_paragraphs(docx_path)
    family = _main_font_family(paras)
    if not family:
        return None, None, None
    regular = bold = None
    with zipfile.ZipFile(docx_path) as z:
        for name in z.namelist():
            if not (name.startswith("word/fonts/") and name.lower().endswith(".ttf")):
                continue
            data = z.read(name)
            try:
                fam, style = ImageFont.truetype(io.BytesIO(data), 12).getname()
            except Exception:
                continue
            if fam.replace(" ", "").lower() != family.replace(" ", "").lower():
                continue
            style = (style or "").lower()
            if style == "regular":
                regular = data
            elif style == "bold":
                bold = data
    return family, regular, bold


# ─────────── Lectura ─────────── #


def _run_text(r: ET.Element) -> str:
    return "".join(t.text or "" for t in r.iter(W("t")))


def _split_glued_chord_line(p: ET.Element) -> ET.Element:
    """Separa la línea de acordes que quedó pegada al final de una letra.

    En estos Words a veces la letra termina con muchos espacios y, en el mismo
    párrafo, sigue en negrita la línea de acordes de la frase siguiente: Word la
    pinta en otra línea porque no cabe. Aquí se mete un salto de línea (<w:br/>)
    antes de esos acordes para que el conversor los vea como línea propia.
    """
    runs = p.findall(W("r"))
    texts = [_run_text(r) for r in runs]
    for k in range(1, len(runs)):
        before = "".join(texts[:k])
        after = "".join(texts[k:])
        if not before.strip() or not after.strip():
            continue
        # Antes tiene que haber letra (no solo acordes) acabada en espacios…
        if d2c.classify_line([("text", before, 24, False)]) != "lyric":
            continue
        if not re.search(r"\s{3,}$", before):
            continue
        # …y después solo acordes, empezando por un run en negrita.
        if not d2c.run_is_bold(runs[k]) or not texts[k].strip():
            continue
        tokens = after.split()
        if not all(d2c.is_chord_token(t) for t in tokens):
            continue
        p = copy.deepcopy(p)
        runs = p.findall(W("r"))
        first_t = runs[k].find(W("t"))
        if first_t is not None and first_t.text:
            first_t.text = first_t.text.lstrip()
        br_run = ET.Element(W("r"))
        ET.SubElement(br_run, W("br"))
        children = list(p)
        p.insert(children.index(runs[k]), br_run)
        return p
    return p


def _clean_title(raw: str) -> str:
    raw = unicodedata.normalize("NFC", raw).strip()
    return _NUM_PREFIX_RE.sub("", raw).strip()


def _is_title(p: ET.Element) -> bool:
    """Título = «N. TEXTO EN MAYÚSCULAS» (con o sin estilo Heading2)."""
    text = unicodedata.normalize("NFC", d2c.paragraph_text(p)).strip()
    m = _NUM_PREFIX_RE.match(text)
    return bool(m) and d2c.line_is_uppercase(text[m.end():])


def _text_paragraph(text: str) -> ET.Element:
    """Párrafo sintético con un solo run de texto (sin negrita)."""
    p = ET.Element(W("p"))
    r = ET.SubElement(p, W("r"))
    t = ET.SubElement(r, W("t"))
    t.text = text
    return p


def _song_body(paras: List[ET.Element]) -> Tuple[List[ET.Element], List[str]]:
    """(párrafos del cuerpo, créditos «Letra y música: …»).

    - Los créditos de antes de la primera línea con contenido se quitan.
    - Los Heading2 que no son título (notas tipo «Opción 2ª C4 MI= DOM») se
      juntan en un `{comment: …}`.
    - Las líneas de acordes pegadas al final de una letra se separan.
    """
    credits: List[str] = []
    body: List[ET.Element] = []
    notes: List[str] = []
    started = False

    def flush_notes():
        if notes:
            body.append(_text_paragraph("{comment: " + " · ".join(notes) + "}"))
            notes.clear()

    for p in paras:
        text = d2c.paragraph_text(p).strip()
        if not started:
            m = _CREDIT_RE.match(text)
            if m:
                who = m.group(2).strip()
                if who not in credits:
                    credits.append(who)
                continue
        if d2c.paragraph_style(p) == "Heading2":
            if text:
                notes.append(re.sub(r"\s+", " ", text))
            continue
        flush_notes()
        if text:
            started = True
        body.append(_split_glued_chord_line(p))
    flush_notes()
    return body, credits


def split_songs(docx_path: Path) -> List[dict]:
    """Canciones del Word, en el formato de `docx2chordpro.split_into_songs`
    (sin sección) más `artist` y `source` (nombre del .docx)."""
    paras = d2c.load_paragraphs(docx_path)
    groups: List[Tuple[str, List[ET.Element]]] = []
    for p in paras:
        if _is_title(p):
            groups.append((d2c.paragraph_text(p), []))
        elif groups:
            groups[-1][1].append(p)
    out = []
    for title, paras_ in groups:
        body, credits = _song_body(paras_)
        out.append({
            "section": None,
            "title_raw": _clean_title(title),
            "title_para": None,
            "paragraphs": body,
            "artist": " / ".join(credits) or None,
            "source": docx_path.name,
        })
    return out


# ─────────── Conversión ─────────── #


_fonts_cache: Dict[str, Tuple[float, tuple]] = {}


def _fonts_for(docx_path: Path) -> tuple:
    mtime = docx_path.stat().st_mtime
    hit = _fonts_cache.get(str(docx_path))
    if hit and hit[0] == mtime:
        return hit[1]
    fonts = embedded_fonts(docx_path)
    _fonts_cache[str(docx_path)] = (mtime, fonts)
    return fonts


def _fix_intro_lines(body: str) -> str:
    """«[INTRO][→][C]  [F]» → «{comment: Intro}» + línea de acordes."""
    out = []
    for ln in body.split("\n"):
        m = re.match(r"^\s*\[(?:INTRO|Intro|intro)\](?:\s*\[(?:→|:|->)\])?\s*(.*)$", ln)
        if m:
            out.append("{comment: Intro}")
            if m.group(1).strip():
                out.append(m.group(1).strip())
            continue
        out.append(ln)
    return "\n".join(out)


def _is_chord(tok: str) -> bool:
    tok = tok.strip()
    if tok.startswith("(") and tok.endswith(")"):
        tok = tok[1:-1]
    return bool(tok) and all(d2c.EN_CHORD_RE.match(part) for part in tok.split("/"))


def _unbracket_non_chords(body: str) -> str:
    """«[(instrumental)]» → «(instrumental)»: lo que no es acorde vuelve a texto."""
    return re.sub(r"\[([^\]]+)\]",
                  lambda m: m.group(0) if _is_chord(m.group(1)) else m.group(1), body)


def convert_song(song: dict, docx_path: Optional[Path] = None) -> dict:
    """Como `docx2chordpro.convert_song`, midiendo con la fuente del Word y
    añadiendo `artist` y `source`."""
    path = docx_path or (EXTRA_DIR / song["source"])
    family, regular, bold = _fonts_for(path)
    if regular:
        with d2c.measuring_with(f"{path.name}:{family}", regular, bold):
            conv = d2c.convert_song(song)
    else:
        conv = d2c.convert_song(song)
    conv["body"] = _unbracket_non_chords(_fix_intro_lines(conv["body"]))
    conv["artist"] = song.get("artist")
    conv["source"] = song.get("source")
    return conv


def load_all() -> List[dict]:
    """Canciones de todos los Words de `scripts/input/word/`, en orden."""
    out: List[dict] = []
    for path in list_extra_docx():
        try:
            out.extend(split_songs(path))
        except Exception as e:  # un Word roto no debe tumbar el admin
            print(f"[docx_extra] No se pudo leer {path.name}: {e}", file=sys.stderr)
    return out


def _main(argv: List[str]) -> int:
    songs = load_all()
    if not argv or argv[0] == "list":
        for i, s in enumerate(songs):
            print(f"{i:3d}  {s['title_raw']:<40} {s.get('artist') or '':<45} [{s['source']}]")
        return 0
    if argv[0] == "show" and len(argv) > 1:
        s = songs[int(argv[1])]
        conv = convert_song(s)
        print(f"{{title: {conv['title']}}}")
        if conv.get("artist"):
            print(f"{{artist: {conv['artist']}}}")
        if conv.get("key"):
            print(f"{{key: {conv['key']}}}")
        print()
        print(conv["body"])
        if conv["warnings"]:
            print("\n# Avisos:", "; ".join(conv["warnings"]), file=sys.stderr)
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(_main(sys.argv[1:]))
