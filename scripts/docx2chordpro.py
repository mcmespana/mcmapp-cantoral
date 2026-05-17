#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""docx2chordpro.py

Migra las canciones del Word "Cantoral Consolación Castellón v2.0.4.docx" a ChordPro.

El script está pensado EXCLUSIVAMENTE para ese .docx. Lee el XML directamente y
reconstruye la posición de los acordes en píxeles (Calibri, tamaño per-run del
propio docx, tabuladores en DXA) para emparejarlos con el carácter de la letra
que está debajo. Soporta tabuladores y espacios indistintamente, y respeta los
tamaños de fuente excepcionales (canciones que se reducen para caber).

Uso típico (Windows / Mac / Linux):

  python docx2chordpro.py list                      # lista todas las canciones
  python docx2chordpro.py list --section A          # solo cantos de entrada
  python docx2chordpro.py list --missing            # solo las que faltan en /songs
  python docx2chordpro.py show 12                   # imprime la canción 12 ya convertida
  python docx2chordpro.py extract 12                # guarda en scripts/staging_docx2cho/
  python docx2chordpro.py extract 12 --write        # guarda directamente en songs/<categoria>/
  python docx2chordpro.py extract --all             # vuelca todas a staging
  python docx2chordpro.py compare 12                # diff entre conversion y .cho existente
  python docx2chordpro.py compare --all             # idem para todas las que ya existen

El id puede ser:
  - número entero (índice mostrado por 'list')
  - una porción del título, ej. "dios esta aqui"
"""

from __future__ import annotations

import argparse
import bisect
import difflib
import os
import re
import sys
import unicodedata
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple
from xml.etree import ElementTree as ET

try:
    from PIL import ImageFont
except ImportError:
    print("Falta Pillow. Instálalo con:  pip install pillow", file=sys.stderr)
    sys.exit(1)


# ─────────── Rutas y constantes ─────────── #

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_DIR = SCRIPT_DIR.parent
SONGS_DIR = REPO_DIR / "songs"
STAGING_DIR = SCRIPT_DIR / "staging_docx2cho"
FONT_PATH = SCRIPT_DIR / "fuente.ttf"  # Calibri Regular (verificado)
DOCX_GLOB = "Cantoral*Castell*v2.0.4.docx"  # tolerante a NFC/NFD del nombre

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
W = lambda tag: f"{{{W_NS}}}{tag}"

DEFAULT_TAB_DXA = 720  # twips (1.27 cm = 36 pt)
PX_PER_PT = 96 / 72  # 96 dpi
PT_PER_DXA = 1 / 20

# Categorías del docx → carpetas reales del repo (prefijo de letra debe coincidir)
# El script usa el prefijo "A.", "B.", ... y busca la carpeta correspondiente en /songs.


# ─────────── Colores / impresión ─────────── #

USE_COLOR = sys.stdout.isatty() and os.name != "nt" or os.environ.get("FORCE_COLOR") == "1"
def _c(s: str, code: str) -> str:
    return f"\033[{code}m{s}\033[0m" if USE_COLOR else s
def cyan(s): return _c(s, "96")
def green(s): return _c(s, "92")
def yellow(s): return _c(s, "93")
def magenta(s): return _c(s, "95")
def red(s): return _c(s, "91")
def dim(s): return _c(s, "2")


# ─────────── Acordes ES → EN ─────────── #

SP_ROOTS = {"do": "C", "re": "D", "mi": "E", "fa": "F", "sol": "G", "la": "A", "si": "B"}
SP_RE = re.compile(r"^(do|re|mi|fa|sol|la|si)([#b]?)(.*)$", re.IGNORECASE)
EN_CHORD_RE = re.compile(
    r"^[A-G][#b]?(?:m|maj7|maj9|sus[24]?|dim|aug|add9|m7|6|7|9|11|13)?$"
)
_INVIS_RE = re.compile(r"[​-‍﻿⁠ ]")


def normalize_token(tok: str) -> str:
    t = unicodedata.normalize("NFKC", tok)
    t = _INVIS_RE.sub("", t)
    t = t.replace("♭", "b").replace("♯", "#").strip()
    return t


def translate_one_chord(tok: str) -> Optional[str]:
    """Traduce UN acorde ES→EN. Devuelve None si no lo reconoce."""
    t = normalize_token(tok)
    if not t:
        return None
    # Acorde con bajo: DO/SOL → C/G
    if "/" in t:
        left, right = t.split("/", 1)
        lt = translate_one_chord(left)
        rt = translate_one_chord(right)
        if lt and rt:
            return f"{lt}/{rt}"
        return None
    # ES (DO, RE, MI, FA, SOL, LA, SI con sufijos)
    m = SP_RE.match(t)
    if m:
        root, acc, suf = m.groups()
        cand = f"{SP_ROOTS[root.lower()]}{acc}{suf}"
        if EN_CHORD_RE.match(cand):
            return cand
    # Ya está en EN
    if EN_CHORD_RE.match(t):
        return t
    return None


def translate_chord_token(tok: str) -> Optional[List[str]]:
    """Traduce un token del cantoral que puede contener:
       - un acorde simple:      "DO"        → ["C"]
       - múltiples con guion:   "DO-mim-lam" → ["C","Em","Am"]
       - entre paréntesis:      "(SOL7)"    → ["(G7)"]
       Devuelve None si no se reconoce ningún acorde."""
    t = normalize_token(tok)
    if not t:
        return None
    paren = t.startswith("(") and t.endswith(")")
    if paren:
        t = t[1:-1]
    # progresión con guiones
    if "-" in t:
        out = []
        for part in t.split("-"):
            tr = translate_one_chord(part)
            if tr is None:
                return None  # si alguno falla, descartamos el token entero
            out.append(tr)
        return [f"({c})" for c in out] if paren else out
    tr = translate_one_chord(t)
    if tr is None:
        return None
    return [f"({tr})"] if paren else [tr]


def is_chord_token(tok: str) -> bool:
    return translate_chord_token(tok) is not None


# ─────────── Métrica de texto ─────────── #

_font_cache: Dict[int, "ImageFont.ImageFont"] = {}


def get_font(sz_halfpoints: int) -> "ImageFont.ImageFont":
    sz_halfpoints = max(sz_halfpoints or 24, 8)
    # Tamaño en píxeles a 96 dpi
    px = max(int(round((sz_halfpoints / 2) * PX_PER_PT)), 6)
    if px not in _font_cache:
        try:
            _font_cache[px] = ImageFont.truetype(str(FONT_PATH), px)
        except Exception:
            _font_cache[px] = ImageFont.load_default()
    return _font_cache[px]


def text_width_px(text: str, sz_halfpoints: int) -> float:
    if not text:
        return 0.0
    return float(get_font(sz_halfpoints).getlength(text))


def dxa_to_px(dxa: float) -> float:
    return float(dxa) * PT_PER_DXA * PX_PER_PT


# ─────────── Lectura del docx ─────────── #


def find_docx() -> Path:
    matches = list(SCRIPT_DIR.glob(DOCX_GLOB))
    if not matches:
        print(red(f"No encuentro el .docx ({DOCX_GLOB}) en {SCRIPT_DIR}"), file=sys.stderr)
        sys.exit(2)
    return matches[0]


def load_paragraphs(docx_path: Path) -> List[ET.Element]:
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(W("body"))
    return list(body.findall(W("p"))) if body is not None else []


# ─────────── Estructura del docx ─────────── #


def paragraph_style(p: ET.Element) -> Optional[str]:
    ppr = p.find(W("pPr"))
    if ppr is None:
        return None
    pStyle = ppr.find(W("pStyle"))
    return pStyle.get(W("val")) if pStyle is not None else None


def paragraph_text(p: ET.Element) -> str:
    return "".join(t.text or "" for t in p.iter(W("t")))


def paragraph_default_sz(p: ET.Element) -> int:
    ppr = p.find(W("pPr"))
    if ppr is not None:
        rpr = ppr.find(W("rPr"))
        if rpr is not None:
            sz = rpr.find(W("sz"))
            if sz is not None:
                try:
                    return int(sz.get(W("val")))
                except (TypeError, ValueError):
                    pass
    return 24  # 12 pt por defecto


def run_sz(r: ET.Element, default: int) -> int:
    rpr = r.find(W("rPr"))
    if rpr is not None:
        sz = rpr.find(W("sz"))
        if sz is not None:
            try:
                return int(sz.get(W("val")))
            except (TypeError, ValueError):
                pass
    return default


def run_is_bold(r: ET.Element) -> bool:
    rpr = r.find(W("rPr"))
    if rpr is None:
        return False
    b = rpr.find(W("b"))
    if b is None:
        return False
    val = b.get(W("val"))
    return val is None or val not in ("0", "false")


def paragraph_indent_dxa(p: ET.Element) -> float:
    ppr = p.find(W("pPr"))
    if ppr is None:
        return 0.0
    ind = ppr.find(W("ind"))
    if ind is None:
        return 0.0
    left = float(ind.get(W("left")) or 0)
    first = float(ind.get(W("firstLine")) or 0)
    hanging = float(ind.get(W("hanging")) or 0)
    return left + first - hanging


def paragraph_tab_stops_dxa(p: ET.Element) -> List[float]:
    ppr = p.find(W("pPr"))
    if ppr is None:
        return []
    tabs = ppr.find(W("tabs"))
    if tabs is None:
        return []
    stops: List[float] = []
    for tab in tabs.findall(W("tab")):
        if tab.get(W("val")) == "clear":
            continue
        pos = tab.get(W("pos"))
        if pos:
            try:
                stops.append(float(pos))
            except ValueError:
                pass
    return sorted(stops)


def next_tab_stop_px(x_px: float, custom_stops_px: Sequence[float],
                     default_dxa: int = DEFAULT_TAB_DXA) -> float:
    """Devuelve la siguiente posición de tabulador estrictamente mayor que x_px."""
    for s in custom_stops_px:
        if s > x_px + 0.01:
            return s
    base_px = custom_stops_px[-1] if custom_stops_px else 0.0
    if x_px < base_px:
        x_px = base_px
    delta = x_px - base_px
    step_px = dxa_to_px(default_dxa)
    n = int(delta // step_px) + 1
    return base_px + n * step_px


# ─────────── Extracción de líneas lógicas ─────────── #
# Cada párrafo puede contener varios <w:br/> que separan "líneas visuales".

Atom = Tuple[str, Optional[str], int, bool]  # (kind, value, sz, bold). kind in {'tab','text'}


def paragraph_logical_lines(p: ET.Element) -> List[List[Atom]]:
    """Devuelve lista de líneas lógicas. Cada línea es lista de Atoms en orden."""
    default_sz = paragraph_default_sz(p)
    lines: List[List[Atom]] = [[]]
    for r in p.findall(W("r")):
        sz = run_sz(r, default_sz)
        bold = run_is_bold(r)
        for child in r:
            tag = child.tag.split("}")[-1]
            if tag == "tab":
                lines[-1].append(("tab", None, sz, bold))
            elif tag == "t":
                if child.text:
                    lines[-1].append(("text", child.text, sz, bold))
            elif tag == "br":
                lines.append([])
    return lines


# ─────────── Parsing de líneas ─────────── #


def parse_chord_line(atoms: List[Atom], start_x_dxa: float,
                     tab_stops_dxa: Sequence[float]) -> List[Tuple[float, str]]:
    """Devuelve lista (x_px, token_acorde_tal_cual_aparece_en_docx)."""
    cur_x = dxa_to_px(start_x_dxa)
    tab_stops_px = [dxa_to_px(s) for s in tab_stops_dxa]
    positions: List[Tuple[float, str]] = []
    for kind, value, sz, _bold in atoms:
        if kind == "tab":
            cur_x = next_tab_stop_px(cur_x, tab_stops_px)
        elif kind == "text":
            text = value or ""
            # Encontrar tokens (no-espacios) con su offset px dentro del segmento
            i = 0
            while i < len(text):
                if not text[i].isspace():
                    j = i
                    while j < len(text) and not text[j].isspace():
                        j += 1
                    tok = text[i:j]
                    tok_x = cur_x + text_width_px(text[:i], sz)
                    positions.append((tok_x, tok))
                    i = j
                else:
                    i += 1
            cur_x += text_width_px(text, sz)
    return positions


def parse_lyric_line(atoms: List[Atom], start_x_dxa: float,
                     tab_stops_dxa: Sequence[float]) -> Tuple[str, List[float]]:
    """Devuelve (texto_visible, posiciones_px_por_caracter).
    `posiciones[i]` es la x del carácter i. Hay len(texto)+1 entradas (la última = x final)."""
    cur_x = dxa_to_px(start_x_dxa)
    tab_stops_px = [dxa_to_px(s) for s in tab_stops_dxa]
    chars: List[str] = []
    positions: List[float] = [cur_x]
    for kind, value, sz, _bold in atoms:
        if kind == "tab":
            cur_x = next_tab_stop_px(cur_x, tab_stops_px)
            # Representamos el tab como un espacio en la letra final
            chars.append(" ")
            positions.append(cur_x)
        elif kind == "text":
            text = value or ""
            for ch in text:
                cur_x += text_width_px(ch, sz)
                chars.append(ch)
                positions.append(cur_x)
    return "".join(chars), positions


def line_atoms_text(atoms: List[Atom]) -> str:
    """Texto de la línea con tabuladores expandidos a un espacio (para clasificar)."""
    out = []
    for kind, value, _sz, _bold in atoms:
        if kind == "tab":
            out.append(" ")
        elif kind == "text":
            out.append(value or "")
    return "".join(out)


def line_is_bold(atoms: List[Atom]) -> bool:
    """True si la mayoría del texto no-espacio de la línea es negrita."""
    bold_chars = 0
    total_chars = 0
    for kind, value, _sz, bold in atoms:
        if kind == "text" and value:
            for ch in value:
                if not ch.isspace():
                    total_chars += 1
                    if bold:
                        bold_chars += 1
    return total_chars > 0 and bold_chars / total_chars >= 0.6


def line_is_uppercase(text: str) -> bool:
    """True si la línea está mayoritariamente en MAYÚSCULAS (>=70% de letras)."""
    letters = [ch for ch in text if ch.isalpha()]
    if len(letters) < 3:
        return False
    upper = sum(1 for ch in letters if ch.isupper())
    return upper / len(letters) >= 0.70


def classify_line(atoms: List[Atom]) -> str:
    """Devuelve 'chord' | 'lyric' | 'empty'."""
    text = line_atoms_text(atoms).strip()
    if not text:
        return "empty"
    tokens = re.findall(r"\S+", text)
    if not tokens:
        return "empty"
    recognized = sum(1 for tok in tokens if is_chord_token(tok))
    return "chord" if recognized / len(tokens) >= 0.6 else "lyric"


# ─────────── Inyección de acordes ─────────── #


def closest_index(positions: List[float], x: float) -> int:
    pos = bisect.bisect_left(positions, x)
    if pos == 0:
        return 0
    if pos >= len(positions):
        return len(positions) - 1
    if abs(positions[pos] - x) < abs(positions[pos - 1] - x):
        return pos
    return pos - 1


def word_start_indices(text: str) -> List[int]:
    """Devuelve los índices donde empieza cada palabra (no-espacio precedido de espacio o BOL)."""
    starts: List[int] = []
    prev_space = True
    for i, ch in enumerate(text):
        if not ch.isspace() and prev_space:
            starts.append(i)
        prev_space = ch.isspace()
    return starts


def snap_to_word_start(precise_idx: int, lyric_text: str,
                       char_positions: List[float], chord_x: float) -> int:
    """Snap el índice al inicio de palabra más cercano en PÍXELES.
    Si no hay palabras (línea solo de espacios), devuelve precise_idx."""
    starts = word_start_indices(lyric_text)
    if not starts:
        return precise_idx
    # candidate: cada inicio de palabra + final de línea (para acordes que caen al final)
    candidates = list(starts) + [len(lyric_text)]
    best = min(candidates, key=lambda s: abs(char_positions[s] - chord_x))
    return best


def inject_chords(lyric_text: str, char_positions: List[float],
                  chord_positions: List[Tuple[float, str]]) -> str:
    """Inserta los acordes traducidos en la letra. Conserva el texto tal cual.
    Política:
      - Snap al inicio de palabra más cercano en píxeles.
      - Si dos acordes (de tokens diferentes) caen en la misma palabra, se hace
        un "spread": el segundo acorde busca el siguiente inicio de palabra libre.
      - Los acordes derivados de un único token con guiones (ej. "DO-mim-lam")
        se mantienen apilados en la misma posición, que es lo esperado.
    """
    if not chord_positions:
        return lyric_text
    if not lyric_text.strip():
        chunks = []
        for _, tok in chord_positions:
            chords = translate_chord_token(tok) or [tok]
            chunks.append("".join(f"[{c}]" for c in chords))
        return " ".join(chunks)

    word_starts = word_start_indices(lyric_text)
    candidates = sorted(set(word_starts + [0, len(lyric_text)]),
                        key=lambda s: char_positions[s])

    insertions: Dict[int, List[str]] = {}
    claimed: set = set()
    for x, tok in sorted(chord_positions, key=lambda p: p[0]):
        chords = translate_chord_token(tok) or [tok]
        unclaimed = [c for c in candidates if c not in claimed]
        if unclaimed:
            idx = min(unclaimed, key=lambda c: abs(char_positions[c] - x))
        else:
            idx = min(candidates, key=lambda c: abs(char_positions[c] - x))
        claimed.add(idx)
        insertions.setdefault(idx, []).extend(f"[{c}]" for c in chords)

    out: List[str] = []
    for i, ch in enumerate(lyric_text):
        if i in insertions:
            out.extend(insertions[i])
        out.append(ch)
    if len(lyric_text) in insertions:
        out.extend(insertions[len(lyric_text)])
    return "".join(out)


# ─────────── Procesado de una canción completa ─────────── #


def split_into_songs(paras: List[ET.Element]) -> List[dict]:
    """Devuelve [{section, title_raw, title_para, paragraphs}] en orden del docx.

    `title_para` es el propio Heading2 (puede contener líneas adicionales separadas
    por <w:br/> que forman parte del cuerpo: caso de canciones que pegaron todo
    junto en un único párrafo Heading2)."""
    songs: List[dict] = []
    current_section: Optional[str] = None
    current_title_raw: Optional[str] = None
    current_title_para: Optional[ET.Element] = None
    current_paras: List[ET.Element] = []
    for p in paras:
        style = paragraph_style(p)
        text = paragraph_text(p).strip()
        if style == "Heading1":
            if current_title_raw is not None:
                songs.append({
                    "section": current_section,
                    "title_raw": current_title_raw,
                    "title_para": current_title_para,
                    "paragraphs": current_paras,
                })
                current_title_raw = None
                current_title_para = None
                current_paras = []
            if text:
                current_section = text
        elif style == "Heading2":
            if current_title_raw is not None:
                songs.append({
                    "section": current_section,
                    "title_raw": current_title_raw,
                    "title_para": current_title_para,
                    "paragraphs": current_paras,
                })
            # El título: primera línea lógica del párrafo
            first_line_atoms = paragraph_logical_lines(p)[0]
            current_title_raw = line_atoms_text(first_line_atoms).strip()
            current_title_para = p
            current_paras = []
        else:
            if current_title_raw is not None:
                current_paras.append(p)
    if current_title_raw is not None:
        songs.append({
            "section": current_section,
            "title_raw": current_title_raw,
            "title_para": current_title_para,
            "paragraphs": current_paras,
        })
    # Descartar canciones con título vacío (separadores)
    return [s for s in songs if s["title_raw"]]


CAPO_SUFFIX_RE = re.compile(r"\s+C\s*/\s*(\d+)\s*$", re.IGNORECASE)


def parse_title(raw: str) -> Tuple[str, Optional[int]]:
    raw = unicodedata.normalize("NFC", raw).strip()
    capo = None
    m = CAPO_SUFFIX_RE.search(raw)
    if m:
        try:
            capo = int(m.group(1))
        except ValueError:
            capo = None
        raw = raw[: m.start()].strip()
    return raw, capo


# Palabras que conservan minúsculas en títulos en español
TITLE_LOWER = {"a", "ante", "bajo", "con", "de", "del", "desde", "en", "entre",
               "hacia", "hasta", "para", "por", "según", "segun", "sin", "sobre",
               "tras", "y", "e", "o", "u", "la", "el", "los", "las", "lo",
               "un", "una", "al", "ni", "si", "que"}


_WORD_RE = re.compile(r"[A-Za-zÀ-ÿñÑ]+")


def pretty_title_case(s: str) -> str:
    """Capitaliza estilo español: primera y resto Capitalizadas excepto preposiciones.
    Tolera puntuación como '(autor)' o comas."""
    s = unicodedata.normalize("NFC", s).strip()
    if not s:
        return s
    s = s.lower()
    word_count = [0]

    def cap(m: re.Match) -> str:
        w = m.group(0)
        word_count[0] += 1
        if word_count[0] > 1 and w in TITLE_LOWER:
            return w
        return w[:1].upper() + w[1:]

    return _WORD_RE.sub(cap, s)


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "cancion"


def section_letter(section_raw: Optional[str]) -> Optional[str]:
    if not section_raw:
        return None
    m = re.match(r"\s*([A-Z](?:\+\d+)?)\.\s*", section_raw)
    if not m:
        return None
    return m.group(1)


def resolve_target_folder(section_raw: Optional[str]) -> Optional[Path]:
    letter = section_letter(section_raw)
    if not letter:
        return None
    for p in SONGS_DIR.iterdir():
        if not p.is_dir():
            continue
        m = re.match(r"\s*([A-Z](?:\+\d+)?)\.", p.name)
        if m and m.group(1) == letter:
            return p
    return None


def next_song_number(folder: Path) -> int:
    maxn = 0
    if not folder.exists():
        return 1
    for f in folder.iterdir():
        m = re.match(r"(\d+)\.", f.name)
        if m:
            try:
                maxn = max(maxn, int(m.group(1)))
            except ValueError:
                pass
    return maxn + 1


# ─────────── Conversión de una canción ─────────── #


def convert_song(song: dict) -> dict:
    """Devuelve {title, capo, key, section, body, slug, warnings, n_chord_lines}."""
    title_clean, capo = parse_title(song["title_raw"])
    section = song["section"]
    warnings: List[str] = []
    first_chord_en: Optional[str] = None

    # 1. Aplanar todos los párrafos en una lista de "logical lines" con metadata.
    #    Si el Heading2 contiene más de una línea lógica, las extras forman parte del cuerpo.
    lines: List[dict] = []  # {kind, atoms, start_x, tab_stops, bold, text}

    def add_lines_from(p: ET.Element, skip_first: bool = False):
        start_x = paragraph_indent_dxa(p)
        tab_stops = paragraph_tab_stops_dxa(p)
        all_logical = paragraph_logical_lines(p)
        for k, atoms in enumerate(all_logical):
            if skip_first and k == 0:
                continue
            text = line_atoms_text(atoms)
            lines.append({
                "kind": classify_line(atoms),
                "atoms": atoms,
                "start_x": start_x,
                "tab_stops": tab_stops,
                "bold": line_is_bold(atoms),
                "text": text,
            })

    if song.get("title_para") is not None:
        add_lines_from(song["title_para"], skip_first=True)
    for p in song["paragraphs"]:
        add_lines_from(p)

    # 2. Emparejar líneas de acordes con su letra y emitir.
    out_lines: List[str] = []
    in_chorus = False
    pending_chord: Optional[dict] = None
    last_was_blank = True

    def emit(line: str):
        nonlocal last_was_blank
        if line == "" and last_was_blank:
            return  # evita encadenar líneas vacías
        out_lines.append(line)
        last_was_blank = (line == "")

    def open_chorus():
        nonlocal in_chorus
        if not in_chorus:
            if not last_was_blank:
                emit("")
            emit("{soc}")
            in_chorus = True

    def close_chorus():
        nonlocal in_chorus, last_was_blank
        if in_chorus:
            while out_lines and out_lines[-1] == "":
                out_lines.pop()
            last_was_blank = False
            emit("{eoc}")
            emit("")
            in_chorus = False

    n_chord_lines = 0
    for ln in lines:
        if ln["kind"] == "empty":
            if pending_chord is not None:
                # acordes huérfanos sin letra debajo
                chord_pos = parse_chord_line(pending_chord["atoms"],
                                             pending_chord["start_x"],
                                             pending_chord["tab_stops"])
                if chord_pos and first_chord_en is None:
                    tr = translate_chord_token(chord_pos[0][1])
                    if tr:
                        first_chord_en = tr[0]
                emit(inject_chords("", [], chord_pos))
                pending_chord = None
                n_chord_lines += 1
            if not last_was_blank:
                emit("")
            continue

        if ln["kind"] == "chord":
            if pending_chord is not None:
                # 2 líneas de acordes seguidas → emitir la anterior sola
                chord_pos = parse_chord_line(pending_chord["atoms"],
                                             pending_chord["start_x"],
                                             pending_chord["tab_stops"])
                if chord_pos and first_chord_en is None:
                    tr = translate_chord_token(chord_pos[0][1])
                    if tr:
                        first_chord_en = tr[0]
                emit(inject_chords("", [], chord_pos))
                n_chord_lines += 1
            pending_chord = ln
            continue

        # ln["kind"] == "lyric"
        chord_pos: List[Tuple[float, str]] = []
        if pending_chord is not None:
            # IMPORTANTE: usamos el indentado de la LETRA (no del de los acordes), porque
            # el cantoral a veces aplica un indent extra al primer párrafo de acordes
            # que rompe la alineación. Los tab stops del párrafo de acordes sí se respetan.
            chord_pos = parse_chord_line(pending_chord["atoms"],
                                         ln["start_x"],
                                         pending_chord["tab_stops"])
            n_chord_lines += 1
            if chord_pos and first_chord_en is None:
                tr = translate_chord_token(chord_pos[0][1])
                if tr:
                    first_chord_en = tr[0]
        lyric_text, char_positions = parse_lyric_line(ln["atoms"], ln["start_x"], ln["tab_stops"])
        line_out = inject_chords(lyric_text, char_positions, chord_pos).rstrip()

        # Detección de estribillo por mayúsculas (más fiable que negrita en este cantoral).
        is_chorus_line = line_is_uppercase(lyric_text)
        if is_chorus_line and not in_chorus:
            open_chorus()
        elif not is_chorus_line and in_chorus:
            close_chorus()

        emit(line_out)
        pending_chord = None

    if pending_chord is not None:
        chord_pos = parse_chord_line(pending_chord["atoms"],
                                     pending_chord["start_x"],
                                     pending_chord["tab_stops"])
        emit(inject_chords("", [], chord_pos))
    close_chorus()

    # 3. Limpiar líneas en blanco múltiples al final
    while out_lines and out_lines[-1] == "":
        out_lines.pop()

    if n_chord_lines == 0:
        warnings.append("No se detectó ninguna línea de acordes")

    pretty = pretty_title_case(title_clean)
    return {
        "title": pretty,
        "title_raw": title_clean,
        "capo": capo,
        "key": first_chord_en,
        "section": section,
        "section_letter": section_letter(section),
        "slug": slugify(pretty),
        "body": "\n".join(out_lines),
        "warnings": warnings,
        "n_chord_lines": n_chord_lines,
    }


def render_cho(song: dict) -> str:
    header = [f"{{title: {song['title']}}}"]
    if song.get("key"):
        header.append(f"{{key: {song['key']}}}")
    if song.get("capo"):
        header.append(f"{{capo: {song['capo']}}}")
    return "\n".join(header) + "\n\n" + song["body"] + "\n"


# ─────────── Catálogo y matching contra .cho existentes ─────────── #


TITLE_KEY_RE = re.compile(r"\{\s*title\s*:\s*(.*?)\s*\}", re.IGNORECASE)


def normalize_title_for_match(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return s.strip()


def index_existing_cho() -> Dict[str, Path]:
    """{title_normalizado: path} de todos los .cho existentes en /songs."""
    idx: Dict[str, Path] = {}
    if not SONGS_DIR.exists():
        return idx
    for cho in SONGS_DIR.rglob("*.cho"):
        try:
            head = cho.read_text(encoding="utf-8", errors="replace")[:500]
        except Exception:
            continue
        m = TITLE_KEY_RE.search(head)
        if not m:
            continue
        title = m.group(1).strip()
        idx[normalize_title_for_match(title)] = cho
    return idx


def find_existing_cho(song: dict, existing_idx: Dict[str, Path]) -> Optional[Path]:
    key = normalize_title_for_match(song["title"])
    if key in existing_idx:
        return existing_idx[key]
    # Match difuso por substring
    for k, p in existing_idx.items():
        if key and (key in k or k in key):
            return p
    return None


# ─────────── Selección de canción por id ─────────── #


def select_song(songs: List[dict], spec: str) -> Tuple[int, dict]:
    if spec.isdigit():
        i = int(spec)
        if not (0 <= i < len(songs)):
            print(red(f"Índice {i} fuera de rango (0..{len(songs)-1})"), file=sys.stderr)
            sys.exit(2)
        return i, songs[i]
    norm = normalize_title_for_match(spec)
    candidates = [(i, s) for i, s in enumerate(songs)
                  if norm in normalize_title_for_match(s["title_raw"])]
    if not candidates:
        print(red(f"Sin coincidencias para '{spec}'"), file=sys.stderr)
        sys.exit(2)
    if len(candidates) > 1:
        print(yellow(f"Varias coincidencias para '{spec}':"))
        for i, s in candidates[:20]:
            print(f"  {i:3d}  {s['title_raw']}")
        sys.exit(2)
    return candidates[0]


# ─────────── Comandos CLI ─────────── #


def cmd_list(args, songs: List[dict]):
    existing = index_existing_cho() if args.missing or args.with_status else {}
    converted_cache: Dict[int, dict] = {}
    section_filter = args.section.upper() if args.section else None
    for i, s in enumerate(songs):
        letter = section_letter(s["section"]) or "?"
        if section_filter and letter != section_filter:
            continue
        conv = None
        if args.missing or args.with_status:
            conv = convert_song(s)
            converted_cache[i] = conv
            existing_path = find_existing_cho(conv, existing)
            if args.missing and existing_path is not None:
                continue
        title_raw = s["title_raw"]
        if args.with_status:
            existing_path = find_existing_cho(conv, existing)
            mark = green("OK") if existing_path else yellow("..")
            print(f"  {i:3d}  [{letter}] {mark}  {title_raw}")
        else:
            print(f"  {i:3d}  [{letter}]  {title_raw}")


def cmd_show(args, songs: List[dict]):
    i, s = select_song(songs, args.id)
    conv = convert_song(s)
    print(magenta(f"# {i}  [{conv['section_letter']}]  {conv['title']}"))
    if conv["warnings"]:
        for w in conv["warnings"]:
            print(yellow(f"# WARN: {w}"))
    print(render_cho(conv), end="")


def _write_song(conv: dict, songs_folder_default: Path, write_real: bool) -> Path:
    if write_real:
        folder = resolve_target_folder(conv["section"])
        if folder is None:
            print(red(f"No encuentro carpeta destino para sección '{conv['section']}'."),
                  file=sys.stderr)
            sys.exit(2)
        num = next_song_number(folder)
        fname = f"{num:02d}.{conv['slug']}.cho"
    else:
        letter = conv["section_letter"] or "X"
        section_clean = conv["section"] or "Sin categoría"
        section_clean = re.sub(r"^\s*[A-Z](?:\+\d+)?\.\s*", "", section_clean)
        folder = songs_folder_default / f"{letter}. {section_clean}"
        folder.mkdir(parents=True, exist_ok=True)
        fname = f"{conv['slug']}.cho"
    fpath = folder / fname
    fpath.write_text(render_cho(conv), encoding="utf-8")
    return fpath


def cmd_extract(args, songs: List[dict]):
    targets: List[Tuple[int, dict]]
    if args.all:
        targets = list(enumerate(songs))
    else:
        if not args.id:
            print(red("Indica un id o usa --all"), file=sys.stderr)
            sys.exit(2)
        targets = [select_song(songs, args.id)]

    written: List[Path] = []
    for i, s in targets:
        conv = convert_song(s)
        fpath = _write_song(conv, STAGING_DIR, args.write)
        written.append(fpath)
        warn = "  " + yellow("|".join(conv["warnings"])) if conv["warnings"] else ""
        print(f"  {green('✓')} {i:3d}  {fpath.relative_to(REPO_DIR)}{warn}")
    print()
    print(green(f"Listo: {len(written)} canción(es) escritas."))
    if not args.write:
        print(dim(f"(Modo staging — los .cho están en {STAGING_DIR.relative_to(REPO_DIR)}/)"))
        print(dim("Para escribir directamente en /songs/<categoría>/ con número auto, añade --write."))


def cmd_compare(args, songs: List[dict]):
    existing = index_existing_cho()
    targets: List[Tuple[int, dict]]
    if args.all:
        targets = list(enumerate(songs))
    else:
        targets = [select_song(songs, args.id)]

    n_compared = n_missing = 0
    for i, s in targets:
        conv = convert_song(s)
        existing_path = find_existing_cho(conv, existing)
        if existing_path is None:
            if not args.all:
                print(yellow(f"No existe .cho equivalente para '{conv['title']}'"))
            n_missing += 1
            continue
        n_compared += 1
        original = existing_path.read_text(encoding="utf-8")
        generated = render_cho(conv)
        if args.all:
            ratio = difflib.SequenceMatcher(None, original, generated).ratio()
            tag = green("OK") if ratio > 0.85 else (yellow("~~") if ratio > 0.6 else red("XX"))
            print(f"  {tag} {ratio:5.1%}  {i:3d}  [{conv['section_letter']}] {conv['title']}"
                  f"  -> {existing_path.relative_to(REPO_DIR)}")
        else:
            print(magenta(f"# {i}  {conv['title']}  vs  {existing_path.relative_to(REPO_DIR)}"))
            diff = difflib.unified_diff(
                original.splitlines(keepends=False),
                generated.splitlines(keepends=False),
                fromfile=f"existing/{existing_path.name}",
                tofile=f"generated/{existing_path.name}",
                lineterm="",
            )
            shown = False
            for line in diff:
                shown = True
                if line.startswith("+++") or line.startswith("---"):
                    print(magenta(line))
                elif line.startswith("@@"):
                    print(cyan(line))
                elif line.startswith("+"):
                    print(green(line))
                elif line.startswith("-"):
                    print(red(line))
                else:
                    print(line)
            if not shown:
                print(green("  (idéntico)"))
    if args.all:
        print()
        print(green(f"Comparadas: {n_compared}.  Sin equivalente .cho: {n_missing}."))


# ─────────── Main ─────────── #


def main():
    parser = argparse.ArgumentParser(description="Migra canciones del Cantoral Castellón .docx a ChordPro")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list", help="Lista las canciones del docx")
    p_list.add_argument("--section", help="Filtra por letra de sección (A, B, ...)")
    p_list.add_argument("--missing", action="store_true", help="Solo las que no existen aún como .cho")
    p_list.add_argument("--with-status", action="store_true", help="Marca OK/.. según existan ya")

    p_show = sub.add_parser("show", help="Imprime una canción convertida")
    p_show.add_argument("id", help="Índice numérico o trozo del título")

    p_ext = sub.add_parser("extract", help="Extrae a fichero(s) .cho")
    g = p_ext.add_mutually_exclusive_group()
    g.add_argument("id", nargs="?", help="Índice o trozo del título")
    g.add_argument("--all", action="store_true", help="Todas las canciones")
    p_ext.add_argument("--write", action="store_true",
                       help="Escribe directamente en /songs/<categoría>/ con número auto. "
                            "Por defecto se vuelca a scripts/staging_docx2cho/.")

    p_cmp = sub.add_parser("compare", help="Diff con .cho ya existente")
    g2 = p_cmp.add_mutually_exclusive_group()
    g2.add_argument("id", nargs="?", help="Índice o trozo del título")
    g2.add_argument("--all", action="store_true", help="Compara todas las que tengan equivalente")

    args = parser.parse_args()

    docx = find_docx()
    paras = load_paragraphs(docx)
    songs = split_into_songs(paras)

    if args.cmd == "list":
        cmd_list(args, songs)
    elif args.cmd == "show":
        cmd_show(args, songs)
    elif args.cmd == "extract":
        cmd_extract(args, songs)
    elif args.cmd == "compare":
        cmd_compare(args, songs)


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        pass
    except KeyboardInterrupt:
        print()
        sys.exit(130)
