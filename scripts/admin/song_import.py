#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Importar canciones «sueltas» al cantoral: texto pegado → ChordPro.

Formatos de entrada (se detectan solos, ver `detect_format`):

  - ``chordpro``      ya trae los ``[acordes]`` dentro de la letra.
  - ``chords_above``  acordes en la línea de encima (Ultimate Guitar, LaCuerda,
                      un Word…). Es lo más habitual.
  - ``lyrics``        letra sola, sin acordes.

Todo pasa por el mismo modelo y la misma tubería::

    texto → bloques (estrofas) de líneas con acordes por posición
          → estribillos (etiqueta, texto repetido o MAYÚSCULAS)
          → «Estribillo» suelto = repetir el estribillo ahí, escrito entero
          → deducción de acordes en las estrofas que no los traen
          → ChordPro + informe de avisos

Es determinista a propósito: lo mismo entra, lo mismo sale, y no cuesta nada.
La IA, si se usa, sólo REVISA el resultado y señala lo raro (ver ai_review.py).

Estrofas con acordes deducidos
------------------------------
Una estrofa sin acordes que se rellena a partir de otra lleva delante la línea
``{x_acordes_deducidos: …}`` (ver chordpro.DEDUCED_DIRECTIVE). El editor la
pinta en ámbar con un botón «✓ dar por buena» que la quita, y el generador del
JSON la elimina, así que la app nunca la ve. Un estribillo repetido con el
mismo texto que uno que ya tiene acordes se copia tal cual y NO se marca: no
hay nada inventado.
"""
from __future__ import annotations

import bisect
import re
import sys
import unicodedata
from copy import deepcopy
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
for _p in (str(SCRIPT_DIR), str(SCRIPTS_DIR)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import chordpro as cp  # noqa: E402
from doceacordes_import import translate_chord_token  # noqa: E402
from docx2chordpro import pretty_title_case  # noqa: E402


# ─────────────────────────── Acordes ─────────────────────────── #

# Sufijos de acorde: m, 7, maj7, sus4, add9, dim, aug, m7b5, 7(b9)…
_SUFFIX = (
    r"(?:maj|min|m|M|dim|aug|sus|add|\+|°|ø)?\d{0,2}"
    r"(?:(?:maj|sus|add|dim|aug|b|#|\+)\d{1,2})*"
    r"(?:\([#b]?\d{1,2}\))?"
)
_EN_ROOT = r"[A-G](?:#|b)?"
_ES_ROOT = r"(?:Do|Re|Mi|Fa|Sol|La|Si)(?:#|b)?"
# Acorde inglés ya traducido (lo que se guarda en el .cho).
EN_CHORD_RX = re.compile(rf"^{_EN_ROOT}{_SUFFIX}(?:/{_EN_ROOT})?$")
# Acorde «de verdad», sin dudas: raíz en mayúscula (inglés) o nota española
# capitalizada / en mayúsculas. Es lo que se usa para decidir si una línea ES
# una línea de acordes, así que tiene que ser estricto: «la», «mi» o «si» en
# minúscula son palabras de la letra mucho más a menudo que acordes.
_STRICT_RX = re.compile(
    rf"^(?:{_EN_ROOT}|{_ES_ROOT}|(?:DO|RE|MI|FA|SOL|LA|SI)(?:#|b)?){_SUFFIX}"
    rf"(?:/(?:{_EN_ROOT}|{_ES_ROOT}|DO|RE|MI|FA|SOL|LA|SI))?$"
)
# Nota española en minúscula CON sufijo («lam», «fa#m», «sim», «mi7»): la
# convención de doceacordes y de muchos cantoriles. Sin sufijo no cuenta.
_ES_LOWER_SUFFIXED_RX = re.compile(
    r"^(?:do|re|mi|fa|sol|la|si)(?:#|b)?(?:m|7|9|6|maj7|sus[24]?|dim|aug|add9)\w*$")
# Dentro de una línea que YA sabemos que es de acordes se acepta cualquier cosa
# con pinta de acorde, también en minúscula («la», «em»).
_LENIENT_RX = re.compile(
    rf"^(?:{_EN_ROOT}|[a-g][#b]?|(?:do|re|mi|fa|sol|la|si)(?:#|b)?)"
    rf"(?:{_SUFFIX})(?:/\S+)?$", re.IGNORECASE)

# Tokens que pueden ir en una línea de acordes sin ser acordes.
_NEUTRAL_RX = re.compile(
    r"^(?:\||/|-|–|%|\.+|…|:|\(?x\s?\d\)?|\(?bis\)?|\(?\d\s?x\)?|N\.?C\.?)$", re.IGNORECASE)
# Sufijo suelto que se ha separado de su acorde: «Sol 7», «La m».
_DETACHED_SUFFIX_RX = re.compile(r"^(?:m|M|7|9|6|11|13|m7|maj7|sus[24]|add9|dim|aug)$")
# Etiqueta delante de unos acordes: «INTRO: G D Em C», «Instrumental: …»
_CHORD_LABEL_RX = re.compile(
    r"^(intro|instrumental|interludio|final|outro|solo|puente|rueda)\s*:?$", re.IGNORECASE)


def _strip_parens(tok: str) -> str:
    return tok.strip("()[]")


def is_strict_chord(tok: str) -> bool:
    t = _strip_parens(tok)
    return bool(t) and bool(_STRICT_RX.match(t) or _ES_LOWER_SUFFIXED_RX.match(t))


def is_lenient_chord(tok: str) -> bool:
    t = _strip_parens(tok)
    return bool(t) and bool(_LENIENT_RX.match(t))


def to_english(tok: str) -> str:
    """Acorde en cualquier notación → inglés («Sol7» → G7, «sim» → Bm, «em» → Em)."""
    t = _strip_parens(tok)
    # «FA#» / «SOL#m»: la nota en mayúsculas no puede llevar el sostenido
    # pegado en la traducción de doceacordes, que espera «Fa#». Se normaliza
    # la caja de la nota antes de traducir.
    m = re.match(r"^(DO|RE|MI|FA|SOL|LA|SI)(.*)$", t)
    if m:
        t = m.group(1).capitalize() + m.group(2)
    return translate_chord_token(t)


# ─────────────────────────── Modelo ─────────────────────────── #

@dataclass
class Line:
    kind: str                 # 'lyric' | 'chords' | 'comment' | 'directive' | 'blank'
    text: str = ""            # letra / texto del comentario / directiva literal
    chords: List[Tuple[int, str]] = field(default_factory=list)  # (posición, acorde EN)
    suffix: str = ""          # 'chords': lo que va detrás, p.ej. "(x2)"


@dataclass
class Block:
    lines: List[Line]
    chorus: bool = False
    deduced_from: Optional[int] = None   # nº de estrofa (1..n) de la que salen los acordes
    copied_from: Optional[int] = None    # copia exacta de otro estribillo
    repeat_chorus: int = 0               # «Estribillo (x2)» suelto: repetir N veces
    deduced_label: str = ""              # marca {x_acordes_deducidos: …} que ya traía el .cho

    def lyric_lines(self) -> List[Line]:
        return [ln for ln in self.lines if ln.kind == "lyric"]

    def has_chords(self) -> bool:
        return any(ln.chords for ln in self.lines if ln.kind in ("lyric", "chords"))


@dataclass
class Note:
    level: str     # 'info' | 'warn'
    msg: str

    def to_dict(self) -> Dict[str, str]:
        return {"level": self.level, "msg": self.msg}


@dataclass
class ImportResult:
    format: str
    meta: Dict[str, object]
    blocks: List[Block]
    notes: List[Note]
    cho: str = ""

    def to_dict(self) -> Dict[str, object]:
        return {
            "format": self.format,
            "meta": self.meta,
            "cho": self.cho,
            "notes": [n.to_dict() for n in self.notes],
            "stats": {
                "blocks": len(self.blocks),
                "chorus": sum(1 for b in self.blocks if b.chorus),
                "deduced": sum(1 for b in self.blocks if b.deduced_from),
                "copied": sum(1 for b in self.blocks if b.copied_from),
            },
        }


# ─────────────────────────── Sílabas ─────────────────────────── #
# Mismo silabeo aproximado que el editor visual (syllableStartsInWord en
# static/app.js), para que un acorde deducido caiga donde el editor lo dejaría
# al arrastrarlo.

_VOWELS = set("aeiouáéíóúüy")
_INSEP = {"pr", "br", "tr", "dr", "cr", "gr", "fr", "pl", "bl", "cl", "gl", "fl", "ch", "ll", "rr"}


def _is_vowel(c: str) -> bool:
    return c.lower() in _VOWELS


def _syllable_starts_in_word(word: str) -> List[int]:
    w = word.lower()
    starts = [0]
    i = 0
    while i < len(w):
        while i < len(w) and not _is_vowel(w[i]):
            i += 1
        while i < len(w) and _is_vowel(w[i]):
            i += 1
        c_start = i
        while i < len(w) and not _is_vowel(w[i]):
            i += 1
        if i >= len(w):
            break
        cluster = w[c_start:i]
        if len(cluster) == 0:
            nxt = i
        elif len(cluster) == 1:
            nxt = c_start
        elif len(cluster) == 2:
            nxt = c_start if cluster in _INSEP else c_start + 1
        else:
            nxt = i - 2 if cluster[-2:] in _INSEP else i - 1
        if nxt > starts[-1]:
            starts.append(nxt)
    return starts


def syllable_starts(lyric: str) -> List[int]:
    """Posiciones donde empieza cada sílaba de la línea (sin el final)."""
    out: List[int] = []
    for m in re.finditer(r"\S+", lyric):
        word = m.group(0)
        # La puntuación inicial («¿», «"», «(») no es sílaba: se salta.
        lead = len(word) - len(word.lstrip("¡¿\"'“«(-—"))
        for s in _syllable_starts_in_word(word[lead:]):
            if lead + s < len(word):
                out.append(m.start() + lead + s)
    return out or [0]


def _snap_to_syllable(pos: int, lyric: str, max_dist: int = 2) -> int:
    """Acerca el acorde al inicio de sílaba más cercano si está a ≤ max_dist."""
    starts = syllable_starts(lyric)
    best = min(starts, key=lambda s: abs(s - pos))
    return best if abs(best - pos) <= max_dist else pos


# ─────────────────────────── Detección ─────────────────────────── #

_BRACKET_RX = re.compile(r"\[([^\]\n]+)\]")
_DIRECTIVE_LINE_RX = re.compile(r"^\s*\{[^}]*\}\s*$")


def _tokens_with_cols(line: str) -> List[Tuple[int, str]]:
    return [(m.start(), m.group(0)) for m in re.finditer(r"\S+", line)]


def _merge_chord_tokens(toks: List[Tuple[int, str]]) -> List[Tuple[int, str]]:
    """«Sol 7» → «Sol7»; «RE-LA» → «RE» + «LA»."""
    out: List[Tuple[int, str]] = []
    for col, tok in toks:
        if (out and _DETACHED_SUFFIX_RX.match(tok) and is_strict_chord(out[-1][1])
                and col - (out[-1][0] + len(out[-1][1])) == 1):
            pcol, ptok = out.pop()
            out.append((pcol, ptok + tok))
            continue
        if "-" in tok and not tok.startswith("-"):
            parts = tok.split("-")
            if len(parts) > 1 and all(p and is_lenient_chord(p) for p in parts):
                c = col
                for p in parts:
                    out.append((c, p))
                    c += len(p) + 1
                continue
        out.append((col, tok))
    return out


def classify_chord_line(line: str) -> Optional[Tuple[str, List[Tuple[int, str]], str]]:
    """Si la línea es de acordes devuelve (etiqueta, [(col, acorde_original)], sufijo).

    Una línea es de acordes cuando, quitando una posible etiqueta delante
    («INTRO:») y los separadores neutros («|», «(x2)»), TODO lo que queda son
    acordes estrictos. Basta una palabra que no lo sea para que sea letra.
    """
    toks = _merge_chord_tokens(_tokens_with_cols(line.expandtabs(8)))
    if not toks:
        return None
    label = ""
    if _CHORD_LABEL_RX.match(toks[0][1]) and len(toks) > 1:
        label = toks[0][1].rstrip(":").strip()
        toks = toks[1:]
    elif re.match(r"^(intro|instrumental|interludio|final|outro|solo|puente|rueda):\S", toks[0][1], re.I):
        # «INTRO:G» pegado
        lab, rest = toks[0][1].split(":", 1)
        label = lab
        toks = [(toks[0][0] + len(lab) + 1, rest)] + toks[1:]
    chords: List[Tuple[int, str]] = []
    suffix_parts: List[str] = []
    for col, tok in toks:
        if _NEUTRAL_RX.match(tok):
            if re.search(r"x\s?\d|\d\s?x|bis", tok, re.I):
                suffix_parts.append(tok)
            continue
        if is_strict_chord(tok):
            chords.append((col, tok))
            continue
        return None
    if not chords:
        return None
    return label, chords, " ".join(suffix_parts)


def detect_format(text: str) -> str:
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return "lyrics"
    inline = 0
    for ln in lines:
        if _DIRECTIVE_LINE_RX.match(ln):
            continue
        found = [c for c in _BRACKET_RX.findall(ln) if is_lenient_chord(c.strip())]
        if found:
            inline += 1
    if inline >= 2 or (inline >= 1 and len(lines) <= 3):
        return "chordpro"
    if any(classify_chord_line(ln) for ln in lines):
        return "chords_above"
    return "lyrics"


# ─────────────────────────── Metadatos ─────────────────────────── #

_CAPO_RX = re.compile(
    r"^\(?\s*(?:cejilla|capo|cejuela)\s*(?:en\s+(?:el\s+)?)?(?:(?:traste|tr\.)\s*)?"
    r"(\d{1,2})\s*(?:º|ª|°|o|er|do|ro|to|vo|no)?\s*(?:traste)?\s*\)?\.?\s*$",
    re.IGNORECASE)
_ARTIST_RX = re.compile(
    r"^\s*(?:autor(?:a)?|letra y m[uú]sica|m[uú]sica|artista|grupo|int[eé]rprete)\s*:\s*(.+?)\s*$",
    re.IGNORECASE)
_KEY_RX = re.compile(r"^\s*(?:tono|tonalidad|key)\s*:\s*(\S+)\s*$", re.IGNORECASE)
_TITLE_NUM_RX = re.compile(r"^\s*\d{1,3}\s*[.\-–)]\s*")
# «C/2», «C/O» al final del título: cejilla 2 / cejilla 0 (O de «cero»).
_TITLE_CAPO_RX = re.compile(r"\s+C/\s*([0-9Oo])\s*$")
_SECTION_RX = re.compile(
    r"^\s*[\(\[]?\s*(estribillo|coro|estrofa|verso|puente|pre-?estribillo|precoro|"
    r"final|outro|intro|instrumental|interludio|solo)\b\s*(\d*)\s*[:.]?\s*"
    r"(\(?\s*(?:x\s?\d|\d\s?x|bis)\s*\)?)?\s*[\)\]]?\s*:?\s*$",
    re.IGNORECASE)
_CHORUS_WORDS = {"estribillo", "coro"}


def _caps_ratio(s: str) -> float:
    letters = [c for c in s if c.isalpha()]
    if len(letters) < 6:
        return 0.0
    return sum(1 for c in letters if c.isupper()) / len(letters)


def _repeat_count(token: Optional[str]) -> int:
    if not token:
        return 1
    if re.search(r"bis", token, re.I):
        return 2
    m = re.search(r"\d", token)
    return int(m.group(0)) if m else 1


def _extract_meta(lines: List[str], notes: List[Note]) -> Tuple[Dict[str, object], List[str]]:
    """Saca título, autor, tono y cejilla del principio y devuelve el resto."""
    meta: Dict[str, object] = {"title": "", "artist": "", "key": "", "capo": 0}
    body = list(lines)

    def next_nonblank(i: int) -> int:
        while i < len(body) and not body[i].strip():
            i += 1
        return i

    # Metadatos sueltos en cualquier sitio (cejilla, autor, tono): son líneas
    # que no pueden ser letra.
    kept: List[str] = []
    for ln in body:
        s = ln.strip()
        m = _CAPO_RX.match(s)
        if m and not meta["capo"]:
            meta["capo"] = int(m.group(1))
            continue
        m = _ARTIST_RX.match(s)
        if m and not meta["artist"]:
            meta["artist"] = m.group(1)
            continue
        m = _KEY_RX.match(s)
        if m and not meta["key"]:
            meta["key"] = to_english(m.group(1))
            continue
        kept.append(ln)
    body = kept

    # Título: la primera línea si va sola (seguida de una línea en blanco) o
    # lleva número delante («58. HURACÁN», «19 - Hoy ha nacido»). Si hay dos
    # candidatas seguidas («VILLANCICOS» y «91. HOY EN BELÉN»), gana la que lleva
    # número: la otra suele ser la cabecera de la página.
    def title_candidate(i: int) -> bool:
        if i >= len(body):
            return False
        s = body[i].strip()
        if not s or classify_chord_line(s) or len(s.split()) > 10:
            return False
        if _SECTION_RX.match(s):
            return False
        nxt = i + 1
        alone = nxt >= len(body) or not body[nxt].strip()
        return alone or bool(_TITLE_NUM_RX.match(s))

    i = next_nonblank(0)
    if title_candidate(i):
        j = next_nonblank(i + 1)
        if (title_candidate(j) and _TITLE_NUM_RX.match(body[j].strip())
                and not _TITLE_NUM_RX.match(body[i].strip())):
            notes.append(Note("info", f"«{body[i].strip()}» parece la cabecera de la página: se ignora."))
            i = j
        raw = body[i].strip()
        title = _TITLE_NUM_RX.sub("", raw)
        m = _TITLE_CAPO_RX.search(title)
        if m:
            title = title[:m.start()]
            if not meta["capo"]:
                meta["capo"] = 0 if m.group(1) in "oO" else int(m.group(1))
        if _caps_ratio(title) > 0.7:
            title = pretty_title_case(title)
        meta["title"] = title.strip(" .-–")
        # Lo que hubiera antes del título (blancos o la cabecera de página) fuera.
        body = body[i + 1:]
    return meta, body


# ─────────────────────────── Parseo ─────────────────────────── #

def _place_chords(chords: List[Tuple[int, str]], lyric_raw: str) -> Tuple[str, List[Tuple[int, str]]]:
    """Pasa las columnas de la línea de acordes a posiciones de la letra.

    - La sangría de la letra (texto centrado, espacios) se descuenta.
    - Un acorde encima de un espacio pertenece a la palabra que viene detrás.
    - Si está a un par de letras de un inicio de sílaba, se pega a él (es donde
      lo habría dejado el editor visual).
    - Lo que cae más allá del final va al final de la línea.
    """
    raw = lyric_raw.expandtabs(8).rstrip()
    indent = len(raw) - len(raw.lstrip())
    lyric = raw.strip()
    out: List[Tuple[int, str]] = []
    for col, ch in chords:
        p = max(0, col - indent)
        if p >= len(lyric):
            out.append((len(lyric), ch))
            continue
        while p < len(lyric) and lyric[p] == " ":
            p += 1
        out.append((_snap_to_syllable(p, lyric), ch))
    out.sort(key=lambda x: x[0])
    return lyric, out


def _translate_chords(chords: List[Tuple[int, str]], unknown: Dict[str, str],
                      ambiguous: set) -> List[Tuple[int, str]]:
    res = []
    for pos, tok in chords:
        t = _strip_parens(tok)
        if re.match(r"^(?:do|re|mi|fa|sol|la|si)$", t):
            ambiguous.add(t)
        en = to_english(t)
        if not EN_CHORD_RX.match(en):
            unknown[tok] = en
        res.append((pos, en))
    return res


def _parse_plain(lines: List[str], fmt: str, notes: List[Note],
                 unknown: Dict[str, str], ambiguous: set) -> List[Block]:
    """Texto con acordes encima (o letra sola) → bloques."""
    blocks: List[Block] = []
    cur: List[Line] = []
    pending_chorus = False
    pending_label: Optional[str] = None

    def flush():
        nonlocal cur, pending_chorus
        if cur:
            blocks.append(Block(lines=cur, chorus=pending_chorus))
        cur = []
        pending_chorus = False

    i = 0
    n = len(lines)
    while i < n:
        raw = lines[i].rstrip()
        s = raw.strip()
        if not s:
            flush()
            i += 1
            continue

        sec = _SECTION_RX.match(s)
        if sec:
            word = sec.group(1).lower()
            nxt_blank = i + 1 >= n or not lines[i + 1].strip()
            if word in _CHORUS_WORDS:
                if nxt_blank and not cur:
                    # «Estribillo» suelto: aquí se canta el estribillo.
                    flush()
                    blocks.append(Block(lines=[], repeat_chorus=_repeat_count(sec.group(3))))
                else:
                    flush()
                    pending_chorus = True
                i += 1
                continue
            # Otras secciones (puente, estrofa 2, intro…) quedan como comentario.
            label = s.strip("()[]: ").strip()
            label = label[:1].upper() + label[1:].lower() if label.isupper() else label
            if cur and not nxt_blank:
                flush()
            cur.append(Line(kind="comment", text=label))
            i += 1
            continue

        info = classify_chord_line(raw)
        if info:
            label, chords, suffix = info
            if label:
                cur.append(Line(kind="comment", text=label.capitalize()))
            # ¿La siguiente línea es la letra de estos acordes?
            j = i + 1
            nxt = lines[j].rstrip() if j < n else ""
            if (not label and nxt.strip() and not classify_chord_line(nxt)
                    and not _SECTION_RX.match(nxt.strip())):
                lyric, placed = _place_chords(chords, nxt)
                placed = _translate_chords(placed, unknown, ambiguous)
                cur.append(Line(kind="lyric", text=lyric, chords=placed))
                i += 2
                continue
            seq = _translate_chords([(k, c) for k, (_, c) in enumerate(chords)], unknown, ambiguous)
            cur.append(Line(kind="chords", chords=seq, suffix=suffix))
            i += 1
            continue

        cur.append(Line(kind="lyric", text=s))
        i += 1
    flush()
    return blocks


_MARK_RX = re.compile(r"^\s*\{\s*" + cp.DEDUCED_DIRECTIVE + r"\s*(?::\s*([^}]*))?\}\s*$", re.I)
_SOC_RX = re.compile(r"^\s*\{\s*(?:soc|start_of_chorus)\s*(?::[^}]*)?\}\s*$", re.I)
_EOC_RX = re.compile(r"^\s*\{\s*(?:eoc|end_of_chorus)\s*\}\s*$", re.I)
_META_DIR_RX = re.compile(r"^\s*\{\s*(title|t|artist|author|key|capo)\s*:\s*(.*?)\s*\}\s*$", re.I)


def _parse_chordpro(lines: List[str], notes: List[Note], meta: Dict[str, object],
                    unknown: Dict[str, str], ambiguous: set) -> List[Block]:
    blocks: List[Block] = []
    cur: List[Line] = []
    in_chorus = False
    pending_mark = ""

    def flush(chorus: bool):
        nonlocal cur, pending_mark
        while cur and cur[-1].kind == "blank":
            cur.pop()
        if cur:
            blocks.append(Block(lines=cur, chorus=chorus, deduced_label=pending_mark))
            pending_mark = ""
        cur = []

    for raw in lines:
        s = raw.rstrip()
        if _SOC_RX.match(s):
            flush(False)
            in_chorus = True
            continue
        if _EOC_RX.match(s):
            flush(True)
            in_chorus = False
            continue
        m = _META_DIR_RX.match(s)
        if m:
            k, v = m.group(1).lower(), m.group(2)
            k = {"t": "title", "author": "artist"}.get(k, k)
            if k == "capo":
                meta["capo"] = int(v) if v.isdigit() else meta.get("capo", 0)
            elif k == "key":
                meta["key"] = to_english(v)
            elif not meta.get(k):
                meta[k] = v
            continue
        if not s.strip():
            if in_chorus:
                cur.append(Line(kind="blank"))
            else:
                flush(False)
            continue
        if _DIRECTIVE_LINE_RX.match(s):
            mk = _MARK_RX.match(s)
            if mk:
                # Se conserva: es trabajo de revisión pendiente que no hay que perder.
                flush(in_chorus) if cur else None
                pending_mark = (mk.group(1) or "").strip() or "revisar"
                continue
            cur.append(Line(kind="directive", text=s.strip()))
            continue
        # Letra con [acordes] dentro
        lyric_parts: List[str] = []
        chords: List[Tuple[int, str]] = []
        pos = 0
        last = 0
        for mm in _BRACKET_RX.finditer(s):
            seg = s[last:mm.start()]
            lyric_parts.append(seg)
            pos += len(seg)
            chords.append((pos, mm.group(1).strip()))
            last = mm.end()
        lyric_parts.append(s[last:])
        lyric = "".join(lyric_parts)
        lstrip = len(lyric) - len(lyric.lstrip())
        lyric = lyric.strip()
        chords = [(max(0, min(p - lstrip, len(lyric))), c) for p, c in chords]
        chords = _translate_chords(chords, unknown, ambiguous)
        rest = _REPEAT_TAIL_RX.sub("", lyric).strip()
        if chords and not rest:
            # «[G] [D] [Em] [C] (x2)»: línea de acordes sola
            cur.append(Line(kind="chords", chords=chords, suffix=lyric.strip()))
        else:
            cur.append(Line(kind="lyric", text=lyric, chords=chords))
    flush(in_chorus)
    if in_chorus:
        notes.append(Note("warn", "Hay un {soc} sin su {eoc}: se ha cerrado al final."))
    return blocks


# ─────────────────────────── Estribillos ─────────────────────────── #

def _norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\((?:x\s?\d|\d\s?x|bis)\)|\bbis\b", "", s)
    s = re.sub(r"[^a-zñ0-9 ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _block_key(b: Block) -> str:
    return " / ".join(_norm(ln.text) for ln in b.lyric_lines())


def _split_by_caps(blocks: List[Block]) -> List[Block]:
    """Parte un bloque donde cambia de minúsculas a MAYÚSCULAS (o al revés).

    Muchos cantorales marcan el estribillo en mayúsculas y lo pegan sin línea
    en blanco a la estrofa de antes («Hacia Belén»). Si toda la canción está en
    mayúsculas no significa nada y no se toca.
    """
    lyr = [ln for b in blocks for ln in b.lyric_lines() if ln.text]
    if not lyr:
        return blocks
    caps_share = sum(1 for ln in lyr if _caps_ratio(ln.text) > 0.7) / len(lyr)
    if caps_share == 0 or caps_share > 0.8:
        return blocks
    out: List[Block] = []
    for b in blocks:
        if b.chorus or b.repeat_chorus or not b.lines:
            out.append(b)
            continue
        groups: List[Tuple[bool, List[Line]]] = []
        for ln in b.lines:
            caps = ln.kind == "lyric" and _caps_ratio(ln.text) > 0.7
            kind = caps if ln.kind == "lyric" else (groups[-1][0] if groups else False)
            if groups and groups[-1][0] == kind:
                groups[-1][1].append(ln)
            else:
                groups.append((kind, [ln]))
        for caps, lns in groups:
            nb = Block(lines=lns)
            nb.chorus = caps and len([x for x in lns if x.kind == "lyric"]) >= 2
            out.append(nb)
    return out


def _mark_repeated_as_chorus(blocks: List[Block]) -> None:
    """Un bloque de 2+ líneas cuyo texto aparece más de una vez es estribillo."""
    seen: Dict[str, List[int]] = {}
    for i, b in enumerate(blocks):
        if len(b.lyric_lines()) >= 2:
            seen.setdefault(_block_key(b), []).append(i)
    for idxs in seen.values():
        if len(idxs) > 1:
            for i in idxs:
                blocks[i].chorus = True


def _expand_repeats(blocks: List[Block], notes: List[Note]) -> List[Block]:
    """«Estribillo» suelto → el estribillo escrito entero ahí (tal cual se canta)."""
    out: List[Block] = []
    for i, b in enumerate(blocks):
        if not b.repeat_chorus:
            out.append(b)
            continue
        src = None
        src_idx = None
        for k in range(len(out) - 1, -1, -1):
            if out[k].chorus and out[k].lyric_lines():
                src, src_idx = out[k], k
                break
        if src is None:
            for k in range(i + 1, len(blocks)):
                if blocks[k].chorus and blocks[k].lyric_lines():
                    src = blocks[k]
                    break
        if src is None:
            notes.append(Note("warn", "Hay un «Estribillo» suelto pero no se ha encontrado cuál es el estribillo."))
            out.append(Block(lines=[Line(kind="comment", text="Estribillo")]))
            continue
        for _ in range(b.repeat_chorus):
            nb = deepcopy(src)
            nb.copied_from = (src_idx + 1) if src_idx is not None else None
            nb.deduced_from = None
            out.append(nb)
        notes.append(Note("info", f"«Estribillo» suelto: se ha escrito el estribillo entero"
                                  f"{' ×' + str(b.repeat_chorus) if b.repeat_chorus > 1 else ''}."))
    return out


# ─────────────────────────── Deducción de acordes ─────────────────────────── #

_REPEAT_TAIL_RX = re.compile(r"\s*\(?\s*(?:x\s?\d|\d\s?x|bis)\s*\)?\s*$", re.IGNORECASE)


def map_line_chords(src: Line, dst_text: str) -> List[Tuple[int, str]]:
    """Lleva los acordes de una línea a otra letra, sílaba a sílaba.

    El acorde que está en la sílaba k de N se pone en la sílaba
    round(k·(M-1)/(N-1)) de M. Con el mismo número de sílabas (lo normal entre
    estrofas de la misma melodía) es la misma sílaba; si no, se reparte en
    proporción. Lo que estaba al final de la línea sigue al final.
    """
    # «(x2)» / «(bis)» al final no se cantan como sílabas: fuera del cálculo, y
    # los acordes del final de la línea se quedan delante de la marca.
    src_core = _REPEAT_TAIL_RX.sub("", src.text).rstrip()
    dst_core = _REPEAT_TAIL_RX.sub("", dst_text).rstrip()
    s_starts = syllable_starts(src_core)
    d_starts = syllable_starts(dst_core)
    n, m = len(s_starts), len(d_starts)
    out: List[Tuple[int, str]] = []
    last_k = -1
    for pos, ch in sorted(src.chords, key=lambda x: x[0]):
        if pos >= len(src_core):
            out.append((len(dst_core), ch))
            continue
        k = max(0, bisect.bisect_right(s_starts, pos) - 1)
        nk = k if n == m else (round(k * (m - 1) / (n - 1)) if n > 1 else 0)
        nk = min(nk, m - 1)
        # Dos acordes en sílabas distintas del original no deben acabar en la
        # misma sílaba de la copia: el segundo pasa a la siguiente si la hay.
        if nk <= last_k and last_k + 1 < m:
            nk = last_k + 1
        last_k = max(last_k, nk)
        out.append((d_starts[nk], ch))
    return out


def _apply_template(dst: Block, tpl: Block) -> bool:
    t_lines = tpl.lyric_lines()
    d_lines = dst.lyric_lines()
    if not t_lines or not d_lines:
        return False
    for i, ln in enumerate(d_lines):
        src = t_lines[i % len(t_lines)]
        ln.chords = map_line_chords(src, ln.text) if src.chords else []
    return True


def _deduce(blocks: List[Block], notes: List[Note]) -> None:
    if not any(b.has_chords() for b in blocks):
        return  # letra sola: no hay de dónde sacar nada (lo avisa import_text)
    for i, b in enumerate(blocks):
        if b.has_chords() or not b.lyric_lines():
            continue
        key = _block_key(b)
        # 1) Mismo texto que un bloque que ya tiene acordes: copia, no invento.
        same = next((j for j, o in enumerate(blocks)
                     if j != i and o.has_chords() and _block_key(o) == key), None)
        if same is not None:
            _apply_template(b, blocks[same])
            b.copied_from = same + 1
            continue
        # 2) Plantilla del mismo tipo (estribillo con estribillo, estrofa con
        #    estrofa). Se prefiere la del mismo nº de líneas y, entre esas, la
        #    más cercana por arriba.
        #    Una plantilla vale si casi todas sus líneas llevan acordes y tiene
        #    como mucho una línea de diferencia: estirar un «Lele lele» de una
        #    línea sobre una estrofa de cuatro es inventar, no deducir.
        n = len(b.lyric_lines())
        cands = [j for j, o in enumerate(blocks)
                 if j != i and o.chorus == b.chorus and o.has_chords()
                 and not o.deduced_from and not o.copied_from and not o.deduced_label
                 and _coverage(o) >= 0.6
                 and abs(len(o.lyric_lines()) - n) <= 1]
        if not cands:
            notes.append(Note("info", f"«{_short(b.lyric_lines()[0].text)}»: sin acordes y sin otra "
                                      "estrofa parecida de donde sacarlos. Se queda sin acordes."))
            continue

        def score(j: int) -> Tuple[int, int, int]:
            same_len = len(blocks[j].lyric_lines()) == n
            above = j < i
            return (0 if same_len else 1, 0 if above else 1, abs(i - j))

        j = min(cands, key=score)
        tpl = blocks[j]
        if _apply_template(b, tpl):
            b.deduced_from = j + 1
            tn = len(tpl.lyric_lines())
            what = "del estribillo" if b.chorus else "de la estrofa"
            where = "de arriba" if j < i else "de más abajo"
            first = _short(b.lyric_lines()[0].text)
            if tn != n:
                notes.append(Note("warn", f"👁 «{first}»: acordes deducidos {what} «{_short(tpl.lyric_lines()[0].text, 20)}», "
                                          f"que tiene {tn} líneas (esta {n}). Revísala con calma."))
            else:
                notes.append(Note("info", f"👁 «{first}»: acordes deducidos {what} {where}."))


def _coverage(b: Block) -> float:
    lyr = b.lyric_lines()
    return sum(1 for ln in lyr if ln.chords) / len(lyr) if lyr else 0.0


def _short(s: str, n: int = 32) -> str:
    return s if len(s) <= n else s[:n - 1].rstrip() + "…"


def _check_partial(blocks: List[Block], notes: List[Note]) -> None:
    for b in blocks:
        lyr = b.lyric_lines()
        if not b.has_chords() or len(lyr) < 2:
            continue
        missing = [ln for ln in lyr if not ln.chords]
        if missing and len(missing) < len(lyr):
            notes.append(Note("info", f"«{_short(lyr[0].text)}»: {len(missing)} de {len(lyr)} líneas "
                                      "sin acordes dentro de una estrofa que sí los tiene."))


# ─────────────────────────── Render ─────────────────────────── #

def render_line(ln: Line) -> str:
    if ln.kind == "blank":
        return ""
    if ln.kind == "directive":
        return ln.text
    if ln.kind == "comment":
        return f"{{comment: {ln.text}}}"
    if ln.kind == "chords":
        # Cada acorde con hueco debajo de su ancho: si sólo los separa un
        # espacio, en la app (y en la vista previa) se pisan unos con otros.
        s = "".join(f"[{c}]" + " " * (len(c) + 2) for _, c in ln.chords)
        return (s + (ln.suffix if ln.suffix else "")).rstrip() + " "
    text = ln.text
    chords = sorted(ln.chords, key=lambda x: x[0])
    out: List[str] = []
    last = 0
    tail: List[str] = []
    for pos, ch in chords:
        if pos >= len(text):
            tail.append(f"[{ch}]")
            continue
        out.append(text[last:pos])
        out.append(f"[{ch}]")
        last = pos
    out.append(text[last:])
    res = "".join(out)
    if tail:
        res = res.rstrip() + " " + "".join(tail) + " "
    return res


def render(meta: Dict[str, object], blocks: List[Block]) -> str:
    out: List[str] = []
    if meta.get("title"):
        out.append(f"{{title: {meta['title']}}}")
    if meta.get("artist"):
        out.append(f"{{artist: {meta['artist']}}}")
    if meta.get("key"):
        out.append(f"{{key: {meta['key']}}}")
    if meta.get("capo"):
        out.append(f"{{capo: {meta['capo']}}}")
    for b in blocks:
        if not b.lines:
            continue
        out.append("")
        if b.deduced_from:
            tpl = blocks[b.deduced_from - 1].lyric_lines()
            src = _short(tpl[0].text, 28) if tpl else f"estrofa {b.deduced_from}"
            out.append(f"{{{cp.DEDUCED_DIRECTIVE}: de «{src}»}}")
        elif b.deduced_label:
            out.append(f"{{{cp.DEDUCED_DIRECTIVE}: {b.deduced_label}}}")
        if b.chorus:
            out.append("{soc}")
        out.extend(render_line(ln) for ln in b.lines)
        if b.chorus:
            out.append("{eoc}")
    return "\n".join(out).strip("\n") + "\n"


def with_meta(cho: str, meta: Dict[str, object]) -> str:
    """Cambia la cabecera (título, autor, tono, cejilla) de un .cho importado.

    En el modal se puede corregir el título o la cejilla que se detectaron; se
    quitan las directivas que hubiera y se ponen las del formulario arriba.
    """
    body = [ln for ln in cho.splitlines() if not _META_DIR_RX.match(ln)]
    while body and not body[0].strip():
        body.pop(0)
    head = []
    if meta.get("title"):
        head.append(f"{{title: {meta['title']}}}")
    if meta.get("artist"):
        head.append(f"{{artist: {meta['artist']}}}")
    if meta.get("key"):
        head.append(f"{{key: {meta['key']}}}")
    try:
        capo = int(meta.get("capo") or 0)
    except (TypeError, ValueError):
        capo = 0
    if capo:
        head.append(f"{{capo: {capo}}}")
    return "\n".join(head + [""] + body).strip("\n") + "\n"


# ─────────────────────────── Entrada principal ─────────────────────────── #

def import_text(text: str, fmt: Optional[str] = None) -> ImportResult:
    """Texto pegado → ImportResult (ChordPro + metadatos + avisos)."""
    text = unicodedata.normalize("NFC", (text or "").replace("\r\n", "\n").replace("\r", "\n"))
    text = text.replace(" ", " ").replace("\t", "    ")
    fmt = fmt or detect_format(text)
    notes: List[Note] = []
    unknown: Dict[str, str] = {}
    ambiguous: set = set()
    lines = text.split("\n")

    if fmt == "chordpro":
        meta: Dict[str, object] = {"title": "", "artist": "", "key": "", "capo": 0}
        blocks = _parse_chordpro(lines, notes, meta, unknown, ambiguous)
    else:
        meta, body = _extract_meta(lines, notes)
        blocks = _parse_plain(body, fmt, notes, unknown, ambiguous)
        blocks = _split_by_caps(blocks)
        _mark_repeated_as_chorus(blocks)
        blocks = _expand_repeats(blocks, notes)

    _deduce(blocks, notes)
    _check_partial(blocks, notes)

    if not meta.get("key"):
        first = next((c for b in blocks for ln in b.lines for _, c in ln.chords), "")
        if first:
            meta["key"] = first
            notes.append(Note("info", f"Tono deducido del primer acorde: {first}."))
    for tok, en in unknown.items():
        notes.append(Note("warn", f"Acorde que no reconozco: «{tok}». Se ha dejado como «{en}»."))
    if ambiguous:
        lst = ", ".join(sorted(ambiguous))
        notes.append(Note("warn", f"Acordes en minúscula sin «m» ({lst}): los he tomado como mayores. "
                                  "Si en el original eran menores, cámbialos."))
    if fmt != "chordpro" and not any(b.has_chords() for b in blocks):
        notes.append(Note("info", "La letra no trae acordes. Búscala en doceacordes o añádelos en el editor."))

    res = ImportResult(format=fmt, meta=meta, blocks=blocks, notes=notes)
    res.cho = render(meta, blocks)
    return res


if __name__ == "__main__":  # pragma: no cover - uso manual: python song_import.py < texto.txt
    r = import_text(sys.stdin.read())
    sys.stdout.write(r.cho)
    for nt in r.notes:
        sys.stderr.write(f"[{nt.level}] {nt.msg}\n")
