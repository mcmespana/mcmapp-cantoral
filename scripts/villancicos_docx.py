#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""villancicos_docx.py — Word de los Villancicos Solidarios → ChordPro.

Está hecho para UN documento: «Cantoral Villancicos Solidarios - Canciones
Nuevas» (el Google Doc exportado a .docx, en scripts/villancicos/). Ese Word
tiene su aquel, y por eso no vale el conversor del cantoral normal
(docx2chordpro.py):

- **Acordes a la izquierda, letra centrada.** Las líneas de acordes son
  párrafos alineados a la izquierda y rellenos de espacios; la letra hereda el
  centrado del documento. El acorde está sobre una sílaba en el papel, pero
  contando caracteres no se encuentra: hay que medir en píxeles las dos líneas,
  cada una con su alineación, su tamaño y su negrita/cursiva (una línea en
  negrita mide más). Se mide con Carlito (mismas medidas que Calibri), en
  scripts/fonts/.
- **Dos columnas** hechas de dos maneras: tablas de 2 celdas (cada celda corre
  varias páginas) y secciones a 2 columnas. Una canción puede empezar en la
  columna izquierda y seguir arriba de la derecha.
- **Formato con significado**: negrita = estribillo; cursiva = 2ª voz, eco o la
  parte del otro grupo; subrayado = altas/bajas. Van como {soc}/{eoc} y como
  marcado ChordPro <i> <u> <b> (ver chordpro.APP_MARKUP).
- **Texto que no se canta**: notas de arreglo en letra pequeña y a la derecha
  («Estrofa 1: Se añade bombo batería»), etiquetas con acordes («Toda la
  canción: sim SOL RE LA», «INTRO → RE MI fa#m (x2)»), «[CLAP CLAP]» dentro
  de la letra, «Nota C: lo que esté en cursiva tiene 2ª voz»…
- Títulos «19 - Hoy ha Nacido C/0» (número del cantoral y cejilla) y el autor
  en el subtítulo.

Uso:
    python scripts/villancicos_docx.py list           # canciones del Word
    python scripts/villancicos_docx.py show 19        # una, ya convertida
    python scripts/villancicos_docx.py show "pastores"
    python scripts/villancicos_docx.py extract --all  # todas a scripts/staging_villancicos/

Lo normal es usarlo desde el admin (🎄 Villancicos → Importar del Word), que
enseña cada canción convertida al lado del original y la crea con su TO DO.
"""
from __future__ import annotations

import argparse
import re
import statistics
import sys
import unicodedata
import zipfile
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Dict, Iterator, List, Optional, Tuple
from xml.etree import ElementTree as ET

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
if str(SCRIPT_DIR / "admin") not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR / "admin"))

import docx2chordpro as d2c  # noqa: E402  (anclaje de acordes a sílaba/palabra)
import song_import as si  # noqa: E402  (reconocer acordes en cualquier notación)
from arreglar_cho import arreglar  # noqa: E402

VILLANCICOS_DIR = SCRIPT_DIR / "villancicos"
DOCX_GLOB = "*Canciones*Nuevas*.docx"
STAGING_DIR = SCRIPT_DIR / "staging_villancicos"
FONTS_DIR = SCRIPT_DIR / "fonts"
SOURCE_LABEL = "Cantoral Villancicos Solidarios · Canciones nuevas"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
W = lambda tag: f"{{{W_NS}}}{tag}"  # noqa: E731
PX_PER_DXA = (1 / 20) * (96 / 72)
DEFAULT_TAB_DXA = 720
DEFAULT_CELL_MARGIN_DXA = 108


# ─────────────────────────── Medir texto ─────────────────────────── #

_FONT_FILES = {
    (False, False): "CantoralMetrics-Regular.ttf",
    (True, False): "CantoralMetrics-Bold.ttf",
    (False, True): "CantoralMetrics-Italic.ttf",
    (True, True): "CantoralMetrics-BoldItalic.ttf",
}


@lru_cache(maxsize=64)
def _font(bold: bool, italic: bool, sz: int):
    from PIL import ImageFont
    px = max(int(round((sz / 2) * 96 / 72)), 6)
    path = FONTS_DIR / _FONT_FILES[(bold, italic)]
    if not path.exists():  # sin las fuentes, la de siempre (Calibri normal)
        path = d2c.FONT_PATH
    return ImageFont.truetype(str(path), px)


@lru_cache(maxsize=200_000)
def char_width(ch: str, sz: int, bold: bool, italic: bool) -> float:
    """Ancho en px (96 dpi) de un carácter. Word no aplica kerning por defecto,
    así que la suma de anchos es el ancho de la línea."""
    return float(_font(bold, italic, sz or 24).getlength(ch))


# ─────────────────────────── Leer el Word ─────────────────────────── #

@dataclass(frozen=True)
class Fmt:
    sz: int = 24
    b: bool = False
    i: bool = False
    u: bool = False
    font: str = "Calibri"


@dataclass
class Para:
    style: Optional[str]
    jc: str                      # left | center | right | both
    ind_left: float              # dxa
    ind_right: float
    ind_first: float
    tabs: List[float]
    width: float                 # ancho útil del contenedor (celda / columna), dxa
    container: Tuple             # ('body', sección) | ('cell', tabla, fila, celda)
    lines: List[List[Tuple[str, str, Fmt]]]   # líneas lógicas: [(ch, kind, fmt)]

    def text(self) -> str:
        return "\n".join("".join(c for c, _, _ in ln) for ln in self.lines)


def _on(el: Optional[ET.Element]) -> Optional[bool]:
    if el is None:
        return None
    return el.get(W("val")) not in ("0", "false", "none", "off")


def _rpr_fmt(rpr: Optional[ET.Element], base: dict) -> dict:
    out = dict(base)
    if rpr is None:
        return out
    sz = rpr.find(W("sz"))
    if sz is not None and (sz.get(W("val")) or "").replace(".", "").isdigit():
        out["sz"] = int(float(sz.get(W("val"))))
    for tag, key in (("b", "b"), ("i", "i"), ("u", "u")):
        v = _on(rpr.find(W(tag)))
        if v is not None:
            out[key] = v
    f = rpr.find(W("rFonts"))
    if f is not None and f.get(W("ascii")):
        out["font"] = f.get(W("ascii"))
    return out


class Styles:
    """Lo justo de styles.xml: alineación y formato de cada estilo de párrafo."""

    def __init__(self, xml: Optional[bytes]):
        self.default_rpr = {"sz": 24, "b": False, "i": False, "u": False, "font": "Calibri"}
        self.default_jc = "left"
        self._styles: Dict[str, ET.Element] = {}
        if not xml:
            return
        root = ET.fromstring(xml)
        dd = root.find(W("docDefaults"))
        if dd is not None:
            self.default_rpr = _rpr_fmt(dd.find(f"{W('rPrDefault')}/{W('rPr')}"), self.default_rpr)
            jc = dd.find(f"{W('pPrDefault')}/{W('pPr')}/{W('jc')}")
            if jc is not None:
                self.default_jc = jc.get(W("val")) or "left"
        for st in root.findall(W("style")):
            if st.get(W("type")) == "paragraph" and st.get(W("styleId")):
                self._styles[st.get(W("styleId"))] = st

    def _chain(self, sid: Optional[str]) -> List[ET.Element]:
        chain, seen = [], set()
        while sid and sid in self._styles and sid not in seen:
            seen.add(sid)
            st = self._styles[sid]
            chain.append(st)
            based = st.find(W("basedOn"))
            sid = based.get(W("val")) if based is not None else None
        return list(reversed(chain))

    def para_jc(self, sid: Optional[str]) -> str:
        jc = self.default_jc
        for st in self._chain(sid):
            el = st.find(f"{W('pPr')}/{W('jc')}")
            if el is not None:
                jc = el.get(W("val")) or jc
        return jc

    def para_rpr(self, sid: Optional[str]) -> dict:
        fmt = dict(self.default_rpr)
        for st in self._chain(sid):
            fmt = _rpr_fmt(st.find(W("rPr")), fmt)
        return fmt


def _norm_jc(jc: str) -> str:
    return {"start": "left", "end": "right", "distribute": "both", "justify": "both"}.get(jc, jc)


def _num(v) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _para_lines(p: ET.Element, base_rpr: dict) -> List[List[Tuple[str, str, Fmt]]]:
    """Líneas lógicas del párrafo (se parten en cada <w:br/>), carácter a
    carácter con su formato. Lo que va dentro de dibujos o cuadros de texto no
    cuenta: en este Word no hay letra ahí."""
    lines: List[List[Tuple[str, str, Fmt]]] = [[]]

    def runs(el: ET.Element) -> Iterator[ET.Element]:
        for ch in el:
            tag = ch.tag.split("}")[-1]
            if tag == "r":
                yield ch
            elif tag in ("hyperlink", "smartTag", "ins", "fldSimple", "sdt", "sdtContent"):
                yield from runs(ch)

    for r in runs(p):
        fmt = Fmt(**_rpr_fmt(r.find(W("rPr")), base_rpr))
        for c in r:
            tag = c.tag.split("}")[-1]
            if tag == "t":
                for ch in c.text or "":
                    lines[-1].append((ch, "t", fmt))
            elif tag == "tab":
                lines[-1].append(("\t", "tab", fmt))
            elif tag in ("br", "cr"):
                lines.append([])
            elif tag == "noBreakHyphen":
                lines[-1].append(("-", "t", fmt))
    return lines


def _section_widths(body: ET.Element) -> List[float]:
    """Ancho útil (dxa) de cada sección, en orden. Con columnas, el de una
    columna."""
    widths = []
    sects = [p.find(f"{W('pPr')}/{W('sectPr')}") for p in body.findall(W("p"))]
    sects = [s for s in sects if s is not None]
    final = body.find(W("sectPr"))
    if final is not None:
        sects.append(final)
    for s in sects:
        pg = s.find(W("pgSz"))
        mar = s.find(W("pgMar"))
        page_w = _num(pg.get(W("w"))) if pg is not None else 11906
        left = _num(mar.get(W("left"))) if mar is not None else 1440
        right = _num(mar.get(W("right"))) if mar is not None else 1440
        width = page_w - left - right
        cols = s.find(W("cols"))
        if cols is not None and int(_num(cols.get(W("num")) or 1)) > 1:
            col = cols.find(W("col"))
            if col is not None and _num(col.get(W("w"))):
                width = _num(col.get(W("w")))
            else:
                n = int(_num(cols.get(W("num"))))
                width = (width - _num(cols.get(W("space")) or 720) * (n - 1)) / n
        widths.append(width)
    return widths or [9026.0]


def read_paragraphs(docx_path: Path) -> List[Para]:
    """Todos los párrafos del Word, en orden de lectura (tabla: fila a fila,
    celda izquierda y luego derecha), con su alineación y el ancho de donde
    están."""
    with zipfile.ZipFile(docx_path) as z:
        doc = ET.fromstring(z.read("word/document.xml"))
        styles = Styles(z.read("word/styles.xml") if "word/styles.xml" in z.namelist() else None)
    body = doc.find(W("body"))
    sec_widths = _section_widths(body)
    out: List[Para] = []
    sec = 0

    def make(p: ET.Element, width: float, container: Tuple) -> Para:
        ppr = p.find(W("pPr"))
        sid = None
        jc = None
        ind_l = ind_r = ind_f = 0.0
        tabs: List[float] = []
        if ppr is not None:
            st = ppr.find(W("pStyle"))
            sid = st.get(W("val")) if st is not None else None
            j = ppr.find(W("jc"))
            jc = j.get(W("val")) if j is not None else None
            ind = ppr.find(W("ind"))
            if ind is not None:
                ind_l = _num(ind.get(W("left")) or ind.get(W("start")))
                ind_r = _num(ind.get(W("right")) or ind.get(W("end")))
                ind_f = _num(ind.get(W("firstLine"))) - _num(ind.get(W("hanging")))
            t = ppr.find(W("tabs"))
            if t is not None:
                tabs = sorted(_num(x.get(W("pos"))) for x in t.findall(W("tab"))
                              if x.get(W("val")) != "clear")
        jc = _norm_jc(jc or styles.para_jc(sid))
        return Para(style=sid, jc=jc, ind_left=ind_l, ind_right=ind_r, ind_first=ind_f,
                    tabs=tabs, width=width, container=container,
                    lines=_para_lines(p, styles.para_rpr(sid)))

    for t_idx, el in enumerate(body):
        tag = el.tag.split("}")[-1]
        if tag == "p":
            out.append(make(el, sec_widths[min(sec, len(sec_widths) - 1)], ("body", sec)))
            if el.find(f"{W('pPr')}/{W('sectPr')}") is not None:
                sec += 1
        elif tag == "tbl":
            out.extend(_table_paragraphs(el, t_idx, make))
    return out


def _table_paragraphs(tbl: ET.Element, t_idx: int, make) -> List[Para]:
    tpr = tbl.find(W("tblPr"))
    tbl_w = 0.0
    margin = DEFAULT_CELL_MARGIN_DXA * 2
    if tpr is not None:
        tw = tpr.find(W("tblW"))
        tbl_w = _num(tw.get(W("w"))) if tw is not None else 0.0
        cm = tpr.find(W("tblCellMar"))
        if cm is not None:
            margin = sum(_num((cm.find(W(s)) if cm.find(W(s)) is not None else cm.find(W(e))).get(W("w")))
                         if (cm.find(W(s)) is not None or cm.find(W(e)) is not None) else DEFAULT_CELL_MARGIN_DXA
                         for s, e in (("left", "start"), ("right", "end")))
    grid = [_num(g.get(W("w"))) for g in tbl.iter(W("gridCol"))]
    out: List[Para] = []
    for r_idx, tr in enumerate(tbl.findall(W("tr"))):
        cells = tr.findall(W("tc"))
        # Google Docs a veces repite la rejilla (4 columnas para 2 celdas).
        g = grid[:len(cells)] if tbl_w and sum(grid) > tbl_w * 1.5 else grid
        col = 0
        for c_idx, tc in enumerate(cells):
            tcpr = tc.find(W("tcPr"))
            span = 1
            width = 0.0
            cell_margin = margin
            if tcpr is not None:
                gs = tcpr.find(W("gridSpan"))
                span = int(_num(gs.get(W("val")))) if gs is not None else 1
                tcw = tcpr.find(W("tcW"))
                if tcw is not None and tcw.get(W("type")) in (None, "dxa"):
                    width = _num(tcw.get(W("w")))
                mar = tcpr.find(W("tcMar"))
                if mar is not None:
                    parts = []
                    for s, e in (("left", "start"), ("right", "end")):
                        m = mar.find(W(s)) if mar.find(W(s)) is not None else mar.find(W(e))
                        parts.append(_num(m.get(W("w"))) if m is not None else DEFAULT_CELL_MARGIN_DXA)
                    cell_margin = sum(parts)
            if not width:
                width = sum(g[col:col + span]) if g[col:col + span] else (tbl_w / max(len(cells), 1))
            col += span
            for p in tc.findall(W("p")):
                out.append(make(p, max(width - cell_margin, 1000.0), ("cell", t_idx, r_idx, c_idx)))
    return out


# ─────────────────────────── Posiciones ─────────────────────────── #

def _tab_stop(x_px: float, stops_px: List[float]) -> float:
    for s in stops_px:
        if s > x_px + 0.01:
            return s
    step = DEFAULT_TAB_DXA * PX_PER_DXA
    return (int(x_px // step) + 1) * step


def line_positions(para: Para, line: List[Tuple[str, str, Fmt]], first: bool = True) -> List[float]:
    """x (px) del borde izquierdo de cada carácter de la línea, más el final.

    Tiene en cuenta la alineación del párrafo: centrado y a la derecha se
    calculan con el ancho de la línea SIN los espacios del final (Word no los
    cuenta). Si la línea no cabe y Word la parte, solo cuenta el primer
    renglón: los acordes de encima son de ese renglón (el resto va a +inf).
    """
    stops = [s * PX_PER_DXA for s in para.tabs]
    xs = [0.0]
    x = 0.0
    for ch, kind, f in line:
        x = _tab_stop(x, stops) if kind == "tab" else x + char_width(ch, f.sz, f.b, f.i)
        xs.append(x)
    n = len(line)
    avail = (para.width - para.ind_left - para.ind_right) * PX_PER_DXA
    indent = (para.ind_left + (para.ind_first if first else 0)) * PX_PER_DXA
    # Renglón de verdad: si no cabe, el corte de Word (último espacio que cabe).
    cut = n
    if xs[n] > avail > 0:
        best = None
        for k in range(1, n):
            if line[k][0] == " " and xs[k] <= avail:
                best = k
        cut = (best + 1) if best else n
    end = cut
    while end > 0 and line[end - 1][0].isspace():
        end -= 1
    width = xs[end]
    if para.jc == "center":
        x0 = indent + max(0.0, (avail - width) / 2)
    elif para.jc == "right":
        x0 = indent + max(0.0, avail - width)
    else:
        x0 = indent
    out = [x0 + v for v in xs]
    for k in range(cut + 1, n + 1):
        out[k] = float("inf")
    return out


# ─────────────────────────── Acordes ─────────────────────────── #

_ES_ROOT_RX = re.compile(r"^(do|re|mi|fa|sol|la|si)([#b]?)(.*)$", re.IGNORECASE)
_NEUTRAL_RX = re.compile(
    r"^(?:\||\|\||/|-|–|—|→|->|↑|↓|%|\.+|…+|:|∞|\(?\s*[x×]\s?\d+\s*\)?|\(?\d+\s?[x×]\)?|"
    r"\(\d\)|\(?bis\)?|\(?veces\)?)$", re.IGNORECASE)
_EDGE_PUNCT = "¡!¿?,.;:«»\"“”"


def _chord_one(tok: str) -> Optional[str]:
    """Un acorde en cualquier notación de este cantoral → inglés, o None.

    Además de lo que ya entiende song_import («DO», «lam», «fa#m», «SIm»…):
    - «+» detrás de una nota en español es MAYOR («Sol+», «LA+»): en estos
      cantorales «+» y «-» son mayor y menor, no aumentado.
    - «-» es menor: «la-» → Am, «si-7» → Bm7.
    - «FA#M» con todo en mayúsculas se lee menor (F#m): es «fa#m» escrito con
      el bloqueo de mayúsculas. Se avisa.
    """
    t = tok.strip(_EDGE_PUNCT)
    if not t:
        return None
    m = _ES_ROOT_RX.match(t)
    if m:
        root, acc, rest = m.groups()
        acc = acc.lower()                      # «SIB» = Si bemol (la regex no distingue caja)
        if rest.startswith("+"):
            rest = rest[1:]
        elif rest.startswith("-"):
            rest = "m" + rest[1:]
        elif rest == "M" and root.isupper():
            rest = "m"
        t = root + acc + rest
    if si.is_lenient_chord(t):
        en = si.to_english(t)
        if en and si.EN_CHORD_RX.match(en):
            return en
    return None


def translate_token(tok: str, prev: Optional[str] = None) -> Optional[List[str]]:
    """Un token de una línea de acordes → lista de acordes en inglés.

    «DO» → [C] · «SOL-FA-SOL» → [G, F, G] · «(LA)» → [(A)] · «FA(rem)» →
    [F, (Dm)] · «Sib(m)» → [Bb, (Bbm)] · «+7» → el acorde anterior con 7ª
    («SOL +7» = G G7). None si no es un acorde.
    """
    t = d2c.normalize_token(tok).strip(_EDGE_PUNCT)
    if not t:
        return None
    if t in ("+7", "7") and prev:
        base = re.sub(r"^\(|\)$", "", prev)
        return [base if base.endswith("7") else base + "7"]
    if t.startswith("(") and t.endswith(")") and len(t) > 2:
        inner = translate_token(t[1:-1], prev)
        return [f"({c})" for c in inner] if inner else None
    one = _chord_one(t)
    if one:
        return [one]
    m = re.match(r"^([^()]+)\(([^()]+)\)$", t)          # «FA(rem)», «Sib(m)»
    if m:
        main = _chord_one(m.group(1))
        alt = _chord_one(m.group(2)) or (_chord_one(m.group(1) + m.group(2))
                                          if re.fullmatch(r"m|7|maj7|m7|9", m.group(2)) else None)
        if main and alt:
            return [main, f"({alt})"]
    if "-" in t.strip("-"):                              # «SOL-FA-SOL», «sol-do»
        parts = [x for x in t.split("-") if x]
        out = [_chord_one(x) for x in parts]
        if parts and all(out):
            return out  # type: ignore[return-value]
    return None


def _is_symbols(tok: str) -> bool:
    """Solo emojis/símbolos («🎺🥁», «🤫🤫»): indicación, no acorde ni letra."""
    return bool(tok) and all(unicodedata.category(c)[0] in "SZ" or c in "\u200d\ufe0f" for c in tok)


def is_neutral(tok: str) -> bool:
    return bool(_NEUTRAL_RX.match(tok.strip()))


# ─────────────────────────── Texto ─────────────────────────── #

# Mayúscula en estas palabras al pasar un estribillo de MAYÚSCULAS a normal
# (§4.6 de docs/CAMPOS_CANCIONES.md).
_PROPER = {
    "dios", "señor", "jesús", "jesus", "cristo", "jesucristo", "maría", "josé",
    "belén", "navidad", "nochebuena", "emanuel", "enmanuel", "padre", "reino",
    "rey", "espíritu", "salvador", "mesías", "israel", "judá", "nazaret",
    "jerusalén", "consolación", "aleluya", "christmas", "santa", "claus",
    "i", "i'm", "i'll", "i've", "i'd", "god", "lord", "mª", "melchor", "gaspar",
    "baltasar", "papá", "noel",
}
_WORD_RX = re.compile(r"[^\W\d_]+(?:['’][^\W\d_]+)?", re.UNICODE)


def is_upper_line(text: str) -> bool:
    letters = [c for c in text if c.isalpha()]
    return len(letters) >= 6 and sum(c.isupper() for c in letters) / len(letters) >= 0.7


def sentence_case(text: str) -> str:
    """«HOY HA NACIDO EL DIOS DEL AMOR» → «Hoy ha nacido el Dios del amor».
    Mismo número de caracteres (los índices de los acordes siguen valiendo)."""
    low = text.lower()

    def fix(m: re.Match) -> str:
        w = m.group(0)
        return w[:1].upper() + w[1:] if w in _PROPER else w

    out = list(_WORD_RX.sub(fix, low))
    start = True
    for k, ch in enumerate(out):
        if ch.isalpha():
            if start:
                out[k] = ch.upper()
            start = False
        elif ch in ".!?¡¿":
            start = True
    res = "".join(out)
    return res if len(res) == len(text) else text


def _squash(s: str) -> str:
    """Espacios seguidos (y tabuladores) → uno, sin los de los extremos."""
    return re.sub(r"\s+", " ", s).strip()


def _label_case(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip(" :→-")
    if is_upper_line(s) or s.isupper():
        s = s[:1].upper() + s[1:].lower()
    s = re.sub(r"(?i)^estrribillo", "Estribillo", s)   # erratas del Word
    s = re.sub(r"(?<=\s)([a-z])$", lambda m: m.group(1).upper(), s)   # «Estrofa A»
    return s[:1].upper() + s[1:] if s else s


# ─────────────────────────── Canciones ─────────────────────────── #

_TITLE_RX = re.compile(
    r"^\s*(?:(?P<num>\d{1,3})\s*[-–—]\s*)?(?P<title>.*?)"
    r"(?:\s+C\s*/\s*(?P<capo>[0-9Oo](?:\s*[-–]\s*[0-9Oo])*)?)?\s*$")


@dataclass
class Song:
    id: int
    number: Optional[int]
    title: str
    title_raw: str
    capo: Optional[int]
    capo_raw: str
    artist: str = ""
    extra: List[str] = field(default_factory=list)       # más subtítulos
    paras: List[Para] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    container: Tuple = ()


def _is_poiret(p: Para) -> Tuple[float, int]:
    chars = [f for ln in p.lines for c, _, f in ln if not c.isspace()]
    if not chars:
        return 0.0, 0
    poiret = [f for f in chars if "poiret" in (f.font or "").lower()]
    return len(poiret) / len(chars), max((f.sz for f in poiret), default=0)


def is_title(p: Para) -> bool:
    if not p.text().strip():
        return False
    if p.style == "Title":
        return True
    ratio, size = _is_poiret(p)
    return ratio >= 0.6 and size >= 28


def is_subtitle(p: Para) -> bool:
    if not p.text().strip():
        return False
    if p.style == "Subtitle":
        return True
    ratio, size = _is_poiret(p)
    return ratio >= 0.6 and 0 < size < 28


def _looks_like_subtitle(p: Para) -> bool:
    """Con la fuente del título pero sin número ni cejilla: es el autor que va
    debajo («Funambulista», «Maldita Nerea»), no otra canción."""
    sizes = [f.sz for ln in p.lines for c, _, f in ln if not c.isspace()]
    if p.style == "Title" and (not sizes or max(sizes) >= 28):
        return False      # con estilo Título y a tamaño de título: es una canción
    num, _, _, capo_raw = parse_title(p.text().split("\n")[0])
    return num is None and not capo_raw and not re.search(r"C\s*/", p.text())


def parse_title(raw: str) -> Tuple[Optional[int], str, Optional[int], str]:
    raw = unicodedata.normalize("NFC", re.sub(r"\s+", " ", raw)).strip()
    m = _TITLE_RX.match(raw)
    num = int(m.group("num")) if m and m.group("num") else None
    title = (m.group("title") if m else raw).strip(" -–")
    capo_raw = (m.group("capo") or "").strip() if m else ""
    capo = None
    if capo_raw:
        first = re.split(r"\s*[-–]\s*", capo_raw)[0].replace("O", "0").replace("o", "0")
        capo = int(first) if first.isdigit() else None
    if title.isupper():
        title = d2c.pretty_title_case(title)
    return num, title, capo, capo_raw


def split_songs(paras: List[Para]) -> List[Song]:
    """Corta el Word en canciones por los títulos.

    Lo que hay al principio de una celda antes de cualquier título es una
    canción que viene de antes: en la celda de la derecha, la que está arriba
    del todo en la celda izquierda de la misma fila (misma página); en
    cualquier otro sitio, la última que empezó.
    """
    songs: List[Song] = []
    current: Optional[Song] = None
    first_in_cell: Dict[Tuple, Song] = {}
    seen_title_in: set = set()
    last_container: Tuple = ()
    expect_subtitle = False
    for p in paras:
        cont = p.container
        if cont != last_container:
            last_container = cont
            if cont[0] == "cell" and cont[3] > 0:
                left = first_in_cell.get((cont[1], cont[2], 0))
                if left is not None:
                    current = left
        if is_title(p) and not (expect_subtitle and _looks_like_subtitle(p)):
            num, title, capo, capo_raw = parse_title(p.text().split("\n")[0])
            current = Song(id=len(songs), number=num, title=title, title_raw=p.text().strip(),
                           capo=capo, capo_raw=capo_raw, container=cont)
            if capo_raw and re.search(r"[-–]", capo_raw):
                current.warnings.append(f"Cejilla con alternativas en el Word: «C/{capo_raw}». "
                                        f"Se pone la {capo}.")
            songs.append(current)
            if cont[0] == "cell":
                first_in_cell.setdefault((cont[1], cont[2], cont[3]), current)
            seen_title_in.add(cont)
            expect_subtitle = True
            continue
        if current is None:
            continue
        if expect_subtitle and (is_subtitle(p) or (is_title(p) and _looks_like_subtitle(p))):
            txt = re.sub(r"\s+", " ", p.text()).strip()
            if not current.artist and not re.search(r"(\w)\1{3,}", txt, re.IGNORECASE):
                current.artist = txt
            else:
                current.extra.append(txt)
            continue
        if p.text().strip():
            expect_subtitle = False
        if cont not in seen_title_in and cont[0] == "cell" and p.text().strip():
            seen_title_in.add(cont)
            if cont != current.container:
                current.warnings.append("Sigue en la otra columna del Word: comprueba que el "
                                        "trozo del final va en su sitio.")
        current.paras.append(p)
    return songs


# ─────────────────────────── Clasificar líneas ─────────────────────────── #

_INSTRUMENTS = re.compile(
    r"\b(guitarr|bater[ií]a|bajo|piano|bombo|palmad|charles|cascabel|pandere|campan|"
    r"teclado|capella|a capella|trompet|golpes?|instrument|[óo]rgano|arpe?gio|toms?|"
    r"el[ée]ctrica|uke|percusi|huevo|parón|par[oó]n|solo |todos|segunda voz|2[ªa] voz|"
    r"suave|fuerte|crescendo|r[ií]tmica|muted|riff)", re.IGNORECASE)
# Para decidir que una línea suelta es una indicación hacen falta dos de estas
# (distintas): «bajo» o «campana» solas salen en la letra de muchos villancicos.
_ARRANGE_STRONG = re.compile(
    r"\b(guitarr\w*|bater[ií]a|bajo|piano|bombo|palmad\w*|charles|cascabel\w*|pandere\w*|"
    r"campan\w*|teclado|a?capella|trompet\w*|[óo]rgano|arpe?gio|toms|el[ée]ctrica|uke\w*|"
    r"percusi\w*|huevo|par[oó]n|mute|riff|golpes|bat|guit)\b", re.IGNORECASE)
_KNOWN_LABEL_RX = re.compile(
    r"^(intro\b.*|estrofa\b.*|estr+ibillo\b.*|pre-?estribillo\b.*|puente\b.*|final\b.*|coda\b.*|"
    r"solo\b.*|rueda\b.*|toda la canci[oó]n.*|resto de la canci[oó]n.*|parte\s*\d.*|"
    r"subida de tono.*|instrumental\b.*|nota\b.*|[uú]ltimo\b.*|to+l? rato.*|piano\b.*|"
    r"lararara.*|pum pum.*|oh oh\b.*|tono\b.*|\d\s*parte.*)$", re.IGNORECASE)
_LABEL_SPLIT_RX = re.compile(r"^(?P<label>[^:→\[\]()]{1,40}?)\s*(?P<sep>:|→|->|↑)\s*(?P<rest>.*)$")
_CHORUS_REF_RX = re.compile(
    r"^\(?\s*(estribillo|coro)\s*\)?[\s.…]*(\(?\s*(?:x\s?\d|\d\s?x|bis|\d)\s*\)?)?[\s.…]*$", re.I)
_TRAILING_CHORUS_RX = re.compile(r"^(?P<text>.*\S)\s*(?:…|\.\.\.)?\s*\bESTRIBILLO\s*[.…]*\s*$")


@dataclass
class LLine:
    """Una línea lógica con su párrafo y su formato carácter a carácter."""
    chars: List[Tuple[str, str, Fmt]]
    para: Para
    first: bool

    @property
    def text(self) -> str:
        return "".join(" " if k == "tab" else c for c, k, _ in self.chars)

    def sub(self, a: int, b: int) -> "LLine":
        return LLine(self.chars[a:b], self.para, self.first and a == 0)

    def ratio(self, attr: str, skip_brackets: bool = True) -> float:
        tot = hit = 0
        depth = 0
        for c, _, f in self.chars:
            if c == "[":
                depth += 1
            elif c == "]":
                depth = max(0, depth - 1)
            if not c.isalpha() or (skip_brackets and depth):
                continue
            tot += 1
            hit += bool(getattr(f, attr))
        return hit / tot if tot else 0.0

    def avg_size(self) -> float:
        szs = [f.sz for c, _, f in self.chars if not c.isspace()]
        return sum(szs) / len(szs) if szs else 24.0


def tokens_with_x(ln: LLine) -> List[Tuple[float, str, int, int]]:
    """Palabras de la línea con su x (px) y su tramo de caracteres."""
    xs = line_positions(ln.para, ln.chars, ln.first)
    out = []
    text = ln.text
    for m in re.finditer(r"\S+", text):
        out.append((xs[m.start()], m.group(0), m.start(), m.end()))
    return out


@dataclass
class ChordParse:
    chords: List[Tuple[float, str]]      # (x, acorde en inglés)
    notes: List[str]                     # paréntesis/corchetes que no son acordes
    tail: List[str]                      # (x2), | … que se quedan al final
    unknown: List[str]


def parse_chord_tokens(toks: List[Tuple[float, str, int, int]]) -> Optional[ChordParse]:
    """¿Es una línea de acordes? Agrupa «( … )» y «[ … ]» antes de decidir:
    «(1parte: suave)» al final de una línea de acordes es una nota, no letra."""
    groups: List[Tuple[float, str]] = []
    k = 0
    while k < len(toks):
        x, t, _, _ = toks[k]
        for opener, closer in (("(", ")"), ("[", "]")):
            if t.startswith(opener) and closer not in t:
                j = k
                while j + 1 < len(toks) and closer not in toks[j][1]:
                    j += 1
                if j > k and closer in toks[j][1]:
                    t = " ".join(tt for _, tt, _, _ in toks[k:j + 1])
                    k = j
                break
        groups.append((x, t))
        k += 1
    chords: List[Tuple[float, str]] = []
    notes: List[str] = []
    tail: List[str] = []
    unknown: List[str] = []
    n_real = 0
    prev = None
    for x, t in groups:
        lead = re.match(r"^[^\w#(\[+\-|→↑.…]+", t)
        if lead and t[lead.end():]:            # «🎺🥁sim»: emojis pegados al acorde
            notes.append(lead.group(0))
            t = t[lead.end():]
        elif lead and _is_symbols(t):
            notes.append(t)
            continue
        rep = re.match(r"^(.+?)(\(\s*x?\d+\s*\))$", t)
        if rep and translate_token(rep.group(1), prev):   # «LA(x2)»
            tail.append(rep.group(2).replace("(", "(x").replace("xx", "x")
                        if not rep.group(2).lower().startswith("(x") else rep.group(2))
            t = rep.group(1)
        q = t.lower().strip("!¡.")
        if q in ("mayor", "menor") and chords:  # «FA# mayor!!!»
            if q == "menor" and not chords[-1][1].endswith("m"):
                chords[-1] = (chords[-1][0], chords[-1][1] + "m")
            continue
        if is_neutral(t):
            if re.search(r"\d|bis|veces", t, re.I):
                tail.append(t if t.startswith("(") else f"({t.lower()})" if re.match(r"x\d", t, re.I) else t)
            elif t in ("|", "||"):
                tail.append(t)
            continue
        if t.startswith("[") and t.endswith("]"):
            notes.append(t[1:-1].strip())
            continue
        tr = translate_token(t, prev)
        if tr is None and t.startswith("(") and t.endswith(")") and " " in t:
            inner = [translate_token(w) for w in t[1:-1].split()]
            if all(inner):
                tr = [f"({c[0]})" for c in inner]   # «(FA FA SOL)»
        if tr is None and t.startswith("(") and t.endswith(")"):
            notes.append(t[1:-1].strip())
            continue
        n_real += 1
        if tr is None:
            unknown.append(t)
            continue
        prev = tr[-1]
        for c in tr:
            chords.append((x, c))
    if not chords:
        return None
    ratio = (n_real - len(unknown)) / n_real if n_real else 0.0
    if ratio >= 0.75 or (ratio >= 0.6 and len(unknown) <= 1 and len(chords) >= 3):
        return ChordParse(chords, notes, tail, unknown)
    return None


# Notas que también son palabras de la letra cuando no van en mayúsculas.
_AMBIGUOUS_RX = re.compile(r"^(?:la|mi|si|do|re|sol|fa|La|Mi|Si|Do|Re|Sol|Fa)$")


def is_chord_line(ln: LLine) -> Optional[ChordParse]:
    toks = tokens_with_x(ln)
    if not toks:
        return None
    cp_ = parse_chord_tokens(toks)
    if cp_ is None:
        return None
    # «La la la la laaaa | Oh happy day»: palabras de la letra que también son
    # notas. Una línea de acordes de verdad deja huecos grandes entre acordes o
    # no tiene ninguna palabra que no sea acorde.
    text = ln.text.strip()
    wide = bool(re.search(r"\S(?: {2,}|\t+)\S", text)) or len(toks) <= 2
    if not wide and cp_.unknown:
        return None
    if not wide:
        # Sin huecos grandes, «La la la la» o «Si mi Dios» son letra: hace falta
        # algún acorde que no sea también una palabra (SOL, DO, lam, fa#m, G7…).
        words = [t for _, t, _, _ in toks if not is_neutral(t)]
        clear = [t for t in words if not _AMBIGUOUS_RX.match(t.strip(_EDGE_PUNCT))]
        if len(clear) * 2 < len(words):
            return None
    return cp_


# ─────────────────────────── Convertir ─────────────────────────── #

def _markup_spans(ln: LLine, text: str, chorus: bool) -> List[Tuple[int, int, str]]:
    """Tramos de <i>, <u> y <b> de la línea, ajustados a palabras enteras."""
    spans = []
    attrs = [("i", "i"), ("u", "u")] + ([] if chorus else [("b", "b")])
    n = len(text)
    for attr, tag in attrs:
        k = 0
        while k < n:
            if getattr(ln.chars[k][2], attr) and not text[k].isspace():
                j = k
                while j < n and (getattr(ln.chars[j][2], attr) or
                                 (text[j].isspace() and j + 1 < n and getattr(ln.chars[j + 1][2], attr))):
                    j += 1
                a, b = k, j
                while b > a and text[b - 1].isspace():
                    b -= 1
                # A palabra entera: si el tramo empieza o acaba a media palabra,
                # se queda con la palabra si cubría la mayor parte.
                if a > 0 and text[a - 1].isalnum():
                    ws = a
                    while ws > 0 and text[ws - 1].isalnum():
                        ws -= 1
                    we = a
                    while we < n and text[we].isalnum():
                        we += 1
                    a = ws if (we - a) >= (a - ws) else we
                if b < n and b > 0 and text[b - 1].isalnum() and text[b].isalnum():
                    ws = b
                    while ws > 0 and text[ws - 1].isalnum():
                        ws -= 1
                    we = b
                    while we < n and text[we].isalnum():
                        we += 1
                    b = we if (b - ws) >= (we - b) else ws
                while a < b and text[a].isspace():
                    a += 1
                while b > a and text[b - 1].isspace():
                    b -= 1
                while b < n and text[b] in ".,;:!?…)»\"”'":
                    b += 1          # «…panderetas (2)»: el paréntesis va dentro
                while a > 0 and text[a - 1] in "(¡¿«\"“":
                    a -= 1
                seg = text[a:b]
                if b > a and re.search(r"[^\W_]", seg) and not re.fullmatch(r"\[[^\]]*\]", seg.strip()):
                    spans.append((a, b, tag))
                k = j
            else:
                k += 1
    return spans


def _render_lyric(ln: LLine, chord_parse: Optional[ChordParse], chord_line: Optional[LLine],
                  warnings: List[str]) -> Tuple[str, bool, List[str]]:
    """Letra con acordes, marcado y anotaciones → (línea ChordPro, ¿estribillo?, notas aparte)."""
    raw = ln.text
    xs = line_positions(ln.para, ln.chars, ln.first)
    chorus = ln.ratio("b") >= 0.6 or is_upper_line(re.sub(r"\[[^\]]*\]", "", raw))
    notes: List[str] = []
    # Corchetes dentro de la letra: «[CLAP]» → anotación [*CLAP]; textos largos → nota.
    keep: List[int] = []
    annots: Dict[int, List[str]] = {}
    k = 0
    while k < len(raw):
        if raw[k] == "(" and ")" in raw[k:] and keep:
            j = raw.index(")", k)
            inner = raw[k + 1:j].strip()
            if _ARRANGE_STRONG.search(inner) and len(inner.split()) <= 4:
                annots.setdefault(len(keep), []).append(f"[*{inner.lower()}]")   # «(CAMPANA)»
                k = j + 1
                continue
        if raw[k] == "[" and "]" in raw[k:]:
            j = raw.index("]", k)
            inner = re.sub(r"\s+", " ", raw[k + 1:j]).strip().replace(",", "")
            rep = re.fullmatch(r"(?i)(\d+)\s*veces|x\s?(\d+)", inner)
            if rep:
                annots.setdefault(len(keep), []).append(f"(x{rep.group(1) or rep.group(2)})")
            elif inner:
                if len(inner.split()) <= 3:
                    annots.setdefault(len(keep), []).append(f"[*{inner}]")
                else:
                    notes.append(inner)
            k = j + 1
            continue
        keep.append(k)
        k += 1
    text = "".join(raw[i] for i in keep)
    pos = [xs[i] for i in keep] + [xs[keep[-1] + 1] if keep else xs[-1]]
    sub_chars = [ln.chars[i] for i in keep]
    view = LLine(sub_chars, ln.para, ln.first)
    if is_upper_line(text):
        text = sentence_case(text)
    ins: Dict[int, List[str]] = {}
    if chord_parse and chord_parse.chords and text.strip():
        ins = d2c.chord_anchor_map(text, pos, chord_parse.chords, translate=lambda c: [c])
    elif chord_parse and chord_parse.chords:
        ins = {len(text): ["".join(f"[{c}]" for _, c in chord_parse.chords)]}
    spans = _markup_spans(view, text, chorus) if len(text) == len(sub_chars) else []
    opens: Dict[int, List[str]] = {}
    closes: Dict[int, List[str]] = {}
    for a, b, tag in sorted(spans, key=lambda s: (s[0], -s[1])):
        opens.setdefault(a, []).append(f"<{tag}>")
        closes.setdefault(b, []).insert(0, f"</{tag}>")
    out: List[str] = []
    for i in range(len(text) + 1):
        out += closes.get(i, [])
        out += ins.get(i, [])
        out += annots.get(i, [])
        out += opens.get(i, [])
        if i < len(text):
            out.append(text[i])
    line = "".join(out)
    line = re.sub(r"(?<=\S) {2,}(?=\S)", " ", line).strip()
    line = re.sub(r"\(\s*(\d)\s*\)", lambda m: f"(x{m.group(1)})", line)
    if chord_parse:
        for t in chord_parse.tail:
            if t not in ("|", "||") and t.lower() not in line.lower():
                line += f" {t}"
        notes = chord_parse.notes + notes
    return line, chorus, notes


def _chords_only(cp_: ChordParse) -> str:
    parts = [f"[{c}]" for _, c in cp_.chords]
    tail = [t for t in cp_.tail if t not in ("|", "||")]
    return " ".join(parts + tail)


def _label_then_chords(ln: LLine) -> Optional[Tuple[str, ChordParse]]:
    """«Toda la cancioncita   FA DO SOL lam»: unas palabras (en negrita o
    conocidas) y detrás solo acordes. None si no es eso."""
    toks = list(re.finditer(r"\S+", ln.text))
    if len(toks) < 3:
        return None
    for k in range(1, min(6, len(toks) - 1)):
        head = ln.text[:toks[k].start()].strip()
        prev_tok = toks[k - 1].group(0)
        if translate_token(prev_tok) and not _AMBIGUOUS_RX.match(prev_tok):
            return None          # la «etiqueta» ya acaba en acorde: no lo es
        rest = ln.sub(toks[k].start(), len(ln.chars))
        cp_ = is_chord_line(rest)
        if cp_ and len(cp_.chords) >= 2 and not cp_.unknown:
            head_line = ln.sub(0, toks[k].start())
            if _KNOWN_LABEL_RX.match(head) or head_line.ratio("b") >= 0.6 or head.isupper():
                return head, cp_
            return None
    return None


def _split_soft_wrapped(ln: LLine) -> Optional[Tuple[LLine, LLine]]:
    """«DO FA DO … SOL SOMOS CONSOLACIÓN, LLEVAMOS…»: acordes y letra en el
    mismo renglón lógico (en el papel la letra baja sola porque no cabe)."""
    toks = list(re.finditer(r"\S+", ln.text))
    k = 0
    prev = None
    while k < len(toks) and (translate_token(toks[k].group(0), prev) or is_neutral(toks[k].group(0))):
        tr = translate_token(toks[k].group(0), prev)
        prev = tr[-1] if tr else prev
        k += 1
    rest = toks[k:]
    head = ln.text[:rest[0].start()] if rest else ""
    if k >= 2 and len(rest) >= 3 and re.search(r"\S(?: {3,}|\t+)\S", head):
        rest_chords = sum(1 for t in rest if translate_token(t.group(0)))
        if rest_chords / len(rest) < 0.3:
            cut = rest[0].start()
            return ln.sub(0, cut), LLine(ln.chars[cut:], ln.para, True)
    return None


@dataclass
class Item:
    kind: str            # blank | dir | chords | lyric
    text: str = ""
    chorus: bool = False


def _note_item(text: str) -> Item:
    t = re.sub(r"\s+", " ", text).strip()
    while len(t) > 2 and t[0] + t[-1] in ("()", "[]"):
        t = t[1:-1].strip()
    if is_upper_line(t):
        t = sentence_case(t)
    if re.match(r"(?i)^nota\b", t):
        return Item("dir", f"{{c: {t}}}")
    if re.match(r"(?i)^(estribillo|estrofa|puente|intro|coro|pre-?estribillo|final)\b[\w ]{0,12}$", t):
        return Item("dir", f"{{c: {_label_case(t)}}}")
    return Item("dir", f"{{arr: {t}}}")


def convert_song(song: Song) -> Dict[str, object]:
    """Canción del Word → {title, number, artist, key, capo, cho, warnings}."""
    warnings = list(song.warnings)
    lines: List[LLine] = []
    for p in song.paras:
        for k, chars in enumerate(p.lines):
            lines.append(LLine(chars, p, k == 0))

    sizes = [ln.avg_size() for ln in lines if ln.text.strip()]
    body_sz = statistics.median(sizes) if sizes else 24.0

    def is_small(ln: LLine) -> bool:
        return ln.avg_size() <= body_sz - 3

    items: List[Item] = []
    pending: Optional[Tuple[LLine, ChordParse]] = None
    unknown: List[str] = []
    first_chord: Optional[str] = None
    key_from_label: Optional[str] = None

    def flush_pending():
        nonlocal pending
        if pending is not None:
            _, cp_ = pending
            for n in cp_.notes:
                items.append(_note_item(n))
            items.append(Item("chords", _chords_only(cp_)))
            pending = None

    def add_chords(cp_: ChordParse):
        nonlocal first_chord
        unknown.extend(cp_.unknown)
        if first_chord is None and cp_.chords:
            first_chord = re.sub(r"^\(|\)$", "", cp_.chords[0][1])

    queue = list(lines)
    while queue:
        ln = queue.pop(0)
        text = ln.text.strip()
        if not text:
            flush_pending()
            items.append(Item("blank"))
            continue
        if re.fullmatch(r"[.…·\s]+", text):
            continue            # «...»: puntos suspensivos sueltos, nada que cantar

        # «Estribillo» suelto: se canta el estribillo.
        if _CHORUS_REF_RX.match(text):
            flush_pending()
            items.append(Item("dir", "{chorus}"))
            continue

        # Etiqueta: «Toda la canción: sim SOL RE LA», «INTRO → RE MI», «Estrofa 1: Se añade…»
        m = _LABEL_SPLIT_RX.match(ln.text)
        if m and (pending is None or m.group("rest").strip()):
            label = m.group("label").strip()
            lab_end = m.start("rest")
            lab_line = ln.sub(0, m.end("label"))
            known = bool(_KNOWN_LABEL_RX.match(label))
            bold = lab_line.ratio("b") >= 0.6
            if (known or (bold and len(label.split()) <= 4 and not ln.ratio("b") >= 0.95)) \
                    and not label.lower().startswith(("http", "www")):
                flush_pending()
                sep = m.group("sep")
                rest_line = ln.sub(lab_end, len(ln.chars))
                rest = rest_line.text.strip()
                arrow = " ↑" if sep == "↑" or rest.startswith("↑") else ""
                rest = rest.lstrip("↑ ").strip()
                if re.match(r"(?i)^tono$", label):
                    tr = translate_token(rest.split()[0]) if rest else None
                    if tr:
                        key_from_label = tr[0]
                        continue
                if re.match(r"(?i)^nota\b", label):
                    items.append(Item("dir", "{c: " + _label_case(label) + ": " + _squash(rest) + "}"))
                    continue
                items.append(Item("dir", f"{{c: {_label_case(label)}{arrow}}}"))
                if not rest:
                    continue
                cp_ = is_chord_line(rest_line) if rest_line.text.strip() else None
                if cp_:
                    add_chords(cp_)
                    for n in cp_.notes:
                        items.append(_note_item(n))
                    items.append(Item("chords", _chords_only(cp_)))
                elif is_small(rest_line) or rest_line.ratio("i") >= 0.6 and _INSTRUMENTS.search(rest) \
                        or _INSTRUMENTS.search(rest) and len(rest.split()) <= 12 and not rest_line.ratio("b") >= 0.6:
                    items.append(Item("dir", "{arr: " + _squash(rest) + "}"))
                else:
                    queue.insert(0, LLine(rest_line.chars, ln.para, False))
                continue

        # Etiqueta sin dos puntos y luego acordes: «Toda la cancioncita FA DO SOL lam».
        lab = _label_then_chords(ln)
        if lab is not None:
            flush_pending()
            label, cp_ = lab
            add_chords(cp_)
            items.append(Item("dir", f"{{c: {_label_case(label)}}}"))
            for n in cp_.notes:
                items.append(_note_item(n))
            items.append(Item("chords", _chords_only(cp_)))
            continue

        # Línea de acordes.
        cp_ = is_chord_line(ln)
        if cp_:
            flush_pending()
            add_chords(cp_)
            pending = (ln, cp_)
            continue

        # Acordes y letra en el mismo renglón (salto automático de Word).
        split = _split_soft_wrapped(ln)
        if split:
            cpart, lpart = split
            cp2 = is_chord_line(cpart)
            if cp2:
                flush_pending()
                add_chords(cp2)
                pending = (cpart, cp2)
                queue.insert(0, lpart)
                warnings.append("Acordes y letra venían en el mismo renglón: revisa dónde caen.")
                continue

        # Notas: letra pequeña, alineadas a la derecha, entre paréntesis o corchetes.
        only_brackets = re.fullmatch(r"(\s*(\([^)]*\)|\[[^\]]*\])\s*)+", text)
        if only_brackets and "[" not in text and not (is_small(ln) or _INSTRUMENTS.search(text)
                                                      or ln.para.jc == "right"):
            only_brackets = None    # «(And he taught me how…)»: letra que canta otro
        emoji_only = not re.search(r"[^\W\d_]", text)
        if re.match(r"(?i)^(instrumental|interludio|solo|coda|outro)\b", text) and \
                len(text.split()) <= 4 and (ln.ratio("b") >= 0.6 or is_upper_line(text)):
            flush_pending()
            items.append(Item("dir", f"{{c: {_label_case(text)}}}"))
            continue
        stems = {m.group(1).lower()[:5] for m in _ARRANGE_STRONG.finditer(text)}
        if (text.startswith("+") and len(text.split()) <= 6) or len(stems) >= 2:
            flush_pending()
            if only_brackets:
                parts = [a or b for a, b in re.findall(r"\(([^)]*)\)|\[([^\]]*)\]", text)]
                items.append(_note_item(" · ".join(x.strip() for x in parts if x.strip())))
            else:
                items.append(_note_item(text.lstrip("+ ").strip() if text.startswith("+") else text))
            continue
        if only_brackets or (is_small(ln) and pending is None) or emoji_only or \
                (ln.para.jc == "right" and pending is None and len(text.split()) <= 14):
            flush_pending()
            if only_brackets:
                parts = [a or b for a, b in re.findall(r"\(([^)]*)\)|\[([^\]]*)\]", text)]
                if len(parts) > 1 and not any(re.match(r"(?i)^(estribillo|estrofa|puente|nota)", x.strip())
                                              for x in parts):
                    parts = [" · ".join(x.strip() for x in parts if x.strip())]
                for part in parts:
                    items.append(_note_item(part))
            else:
                items.append(_note_item(text))
            continue

        # «… ESTRIBILLO» al final de la letra.
        tm = _TRAILING_CHORUS_RX.match(ln.text)
        trailing_chorus = False
        if tm and re.search(r"(?i)(\by|\be|\+|\bm[aá]s)\s*$", tm.group("text")) and \
                len(tm.group("text").split()) <= 5:
            # «1 rueda y ESTRIBILLO»: indicación de cómo sigue, no letra.
            flush_pending()
            items.append(_note_item(ln.text.strip()))
            continue
        if tm and len(tm.group("text").strip()) > 3:
            ln = ln.sub(0, len(tm.group("text")))
            trailing_chorus = True
        # «ESTRIBILLO Y LALALA», «2 ESTRIBILLOS + 2 INSTRUMENTAL»: indicación.
        if re.search(r"(?i)\bestribillos?\b", ln.text) and is_upper_line(ln.text) and pending is None \
                and len(ln.text.split()) <= 8:
            items.append(Item("dir", "{arr: " + sentence_case(_squash(ln.text)) + "}"))
            continue

        chord_parse = pending[1] if pending else None
        line, chorus, notes = _render_lyric(ln, chord_parse, pending[0] if pending else None, warnings)
        pending = None
        for n in notes:
            items.append(_note_item(n))
        if line:
            items.append(Item("lyric", line, chorus))
        if trailing_chorus:
            items.append(Item("dir", "{chorus}"))
    flush_pending()

    items = [x for it in items for x in _split_on_annotations(it)]
    body = _assemble(items)
    body = balance_markup(arreglar(body)[0])

    key = key_from_label or first_chord or ""
    if unknown:
        uniq = list(dict.fromkeys(unknown))[:6]
        warnings.append("Sin reconocer en líneas de acordes: " + ", ".join(f"«{u}»" for u in uniq) + ".")
    if any("M" == re.sub(r"^(DO|RE|MI|FA|SOL|LA|SI)[#b]?", "", t)
           for p in song.paras for t in re.findall(r"\S+", p.text())):
        warnings.append("Hay acordes tipo «FA#M» (todo mayúsculas): se han leído como menores (F#m).")
    header = [f"{{title: {song.title}}}"]
    if song.artist:
        header.append(f"{{artist: {song.artist}}}")
    if key:
        header.append(f"{{key: {key}}}")
    if song.capo:
        header.append(f"{{capo: {song.capo}}}")
    src = SOURCE_LABEL + (f" (nº {song.number})" if song.number is not None else "")
    header.append(f"{{fuente: {src}}}")
    comments = list(song.extra)
    if song.capo_raw and re.search(r"[-–]", song.capo_raw):
        comments.append(f"Cejilla según el Word: C/{song.capo_raw}")
    if comments:
        header.append("{comentario: " + " · ".join(c.replace("}", ")") for c in comments) + "}")
    cho = "\n".join(header) + "\n\n" + body.strip("\n") + "\n"
    return {
        "id": song.id,
        "number": song.number,
        "title": song.title,
        "title_raw": song.title_raw,
        "artist": song.artist,
        "key": key,
        "capo": song.capo or 0,
        "cho": cho,
        "warnings": warnings,
    }


_ANNOT_SPLIT_RX = re.compile(
    r"(\[\*[^\]]+\][.,;:!?…]*(?:\s*\(x\d\))?|\(x?\d\))\s+(?=[^\s(])")


def _split_on_annotations(it: Item) -> List[Item]:
    """Una estrofa entera en un solo párrafo con «[CLAP]» entre frase y frase
    («…descendió [CLAP] la tierra entera se alegró [CLAP] Escucha…»): cada
    [*CLAP] cierra una frase, así que se parte ahí."""
    plain = re.sub(r"\[[^\]]*\]|</?[ibu]>", "", it.text)
    if it.kind != "lyric" or len(plain) <= 60 or not re.search(r"\[\*|\(x?\d\)\s+\S", it.text):
        return [it]
    text = _ANNOT_SPLIT_RX.sub(lambda m: m.group(1) + "\n", it.text)
    text = re.sub(r"\((\d)\)(?=\n|$)", r"(x\1)", text)
    parts = [p.strip() for p in text.split("\n")]
    return [Item("lyric", p, it.chorus) for p in parts if p]


def _assemble(items: List[Item]) -> str:
    """Ítems → cuerpo ChordPro: estribillos agrupados en {soc}/{eoc}, una sola
    línea en blanco entre estrofas."""
    out: List[str] = []
    in_chorus = False

    def blank():
        if out and out[-1] != "":
            out.append("")

    def close():
        nonlocal in_chorus
        if in_chorus:
            while out and out[-1] == "":
                out.pop()
            out.append("{eoc}")
            in_chorus = False

    for k, it in enumerate(items):
        if it.kind == "blank":
            close()
            blank()
        elif it.kind == "lyric":
            if it.chorus and not in_chorus:
                blank()
                out.append("{soc}")
                in_chorus = True
            elif not it.chorus and in_chorus:
                close()
                blank()
            out.append(it.text)
        elif it.kind == "chords":
            # Una línea de acordes dentro de un estribillo se queda dentro.
            nxt = next((x for x in items[k + 1:] if x.kind != "blank"), None)
            if in_chorus and not (nxt and nxt.kind == "lyric" and nxt.chorus):
                close()
            out.append(it.text)
        else:
            if in_chorus and it.text not in ("{chorus}",) and not it.text.startswith("{arr"):
                close()
                blank()
            elif it.text == "{chorus}":
                close()
            if it.text.startswith("{c:") and out and out[-1] != "" and not out[-1].startswith("{"):
                blank()
            out.append(it.text)
    close()
    text = "\n".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip("\n") + "\n"


_TAG_RX = re.compile(r"<(/?)(i|b|u)>")


def balance_markup(text: str) -> str:
    """Ninguna etiqueta cruza de una línea a otra (lo exige el contrato). Si
    al partir una línea larga se quedó una abierta, se cierra al final y se
    vuelve a abrir en la línea siguiente de letra."""
    out = []
    carry: List[str] = []
    for line in text.split("\n"):
        is_lyric = line.strip() and not line.strip().startswith("{")
        if not is_lyric:
            carry = []
            out.append(line)
            continue
        prefix = "".join(f"<{t}>" for t in carry)
        stack = list(carry)
        for m in _TAG_RX.finditer(line):
            tag = m.group(2)
            if m.group(1):
                if tag in stack:
                    stack.remove(tag)
            else:
                stack.append(tag)
        suffix = "".join(f"</{t}>" for t in reversed(stack))
        line = prefix + line + suffix
        line = re.sub(r"<(i|b|u)></\1>", "", line)
        carry = stack
        out.append(line)
    return "\n".join(out)


# ─────────────────────────── Vista «como en el papel» ─────────────────────────── #

def layout_text(song: Song) -> str:
    """La canción tal y como está en el Word, en texto de ancho fijo: cada
    carácter en la columna que le toca por su posición medida, así que los
    acordes quedan sobre su sílaba y la letra centrada sale centrada. Es lo que
    se enseña al lado de la conversión para comparar (y en 📄 Original)."""
    col = char_width("n", 24, False, False) * 1.08     # ancho de una «columna»
    out = [song.title_raw]
    if song.artist:
        out.append(song.artist)
    out += song.extra
    out.append("")
    for p in song.paras:
        for k, chars in enumerate(p.lines):
            if not chars or not "".join(c for c, _, _ in chars).strip():
                out.append("")
                continue
            xs = line_positions(p, chars, k == 0)
            row: List[str] = []
            for i, (ch, kind, _) in enumerate(chars):
                if kind == "tab" or ch.isspace() or xs[i] == float("inf"):
                    if xs[i] == float("inf") and not ch.isspace():
                        row.append(ch)        # lo que Word baja de renglón, seguido
                    continue
                if i > 0 and not chars[i - 1][0].isspace() and chars[i - 1][1] != "tab":
                    c = len(row)                       # dentro de una palabra, seguido
                else:
                    c = max(int(round(xs[i] / col)), len(row) + 1 if row else 0)
                row.extend(" " * (c - len(row)))
                row.append(ch)
            out.append("".join(row).rstrip())
    text = "\n".join(out)
    return re.sub(r"\n{3,}", "\n\n", text).strip("\n") + "\n"


# ─────────────────────────── API ─────────────────────────── #

def find_docx() -> Optional[Path]:
    found = sorted(VILLANCICOS_DIR.glob(DOCX_GLOB))
    return found[0] if found else None


_cache: Dict[str, object] = {"mtime": None, "songs": None, "conv": {}}


def load_songs(docx_path: Optional[Path] = None) -> List[Song]:
    path = docx_path or find_docx()
    if path is None:
        return []
    mtime = (str(path), path.stat().st_mtime)
    if _cache["mtime"] != mtime:
        _cache["songs"] = split_songs(read_paragraphs(path))
        _cache["conv"] = {}
        _cache["mtime"] = mtime
    return _cache["songs"]  # type: ignore[return-value]


def converted(song: Song) -> Dict[str, object]:
    conv = _cache["conv"].get(song.id)  # type: ignore[union-attr]
    if conv is None:
        conv = convert_song(song)
        _cache["conv"][song.id] = conv  # type: ignore[index]
    return conv


def select(songs: List[Song], spec: str) -> Song:
    if spec.isdigit():
        n = int(spec)
        for s in songs:
            if s.number == n:
                return s
        if 0 <= n < len(songs):
            return songs[n]
    key = d2c.normalize_title_for_match(spec)
    for s in songs:
        if key in d2c.normalize_title_for_match(s.title):
            return s
    raise SystemExit(f"No encuentro «{spec}». Prueba con «list».")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    sh = sub.add_parser("show")
    sh.add_argument("spec")
    ex = sub.add_parser("extract")
    ex.add_argument("spec", nargs="?")
    ex.add_argument("--all", action="store_true")
    ap.add_argument("--docx", type=Path)
    args = ap.parse_args(argv)
    songs = load_songs(args.docx)
    if not songs:
        print(f"No encuentro el Word ({DOCX_GLOB}) en {VILLANCICOS_DIR}", file=sys.stderr)
        return 2
    if args.cmd == "list":
        for s in songs:
            c = converted(s)
            warn = f"  ⚠ {len(c['warnings'])}" if c["warnings"] else ""
            num = f"{s.number:>3}" if s.number is not None else "  -"
            print(f"{s.id:>3} {num}  {s.title:<40} {s.artist[:24]:<24} {c['key']:<4} C/{c['capo']}{warn}")
        return 0
    if args.cmd == "show":
        c = converted(select(songs, args.spec))
        print(c["cho"])
        for w in c["warnings"]:
            print(f"⚠ {w}", file=sys.stderr)
        return 0
    STAGING_DIR.mkdir(exist_ok=True)
    chosen = songs if args.all or not args.spec else [select(songs, args.spec)]
    for s in chosen:
        c = converted(s)
        num = f"{s.number:02d}" if s.number is not None else "xx"
        out = STAGING_DIR / f"{num}.{d2c.slugify(s.title)}.cho"
        out.write_text(c["cho"], encoding="utf-8")
        print(f"→ {out.relative_to(SCRIPT_DIR.parent)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
