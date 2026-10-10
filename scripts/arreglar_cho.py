#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arregla los .cho de forma segura y mecánica, lo que `revisar_cho.py` señala.

Uso:
    python scripts/arreglar_cho.py --dry-run      # dice qué cambiaría, no toca nada
    python scripts/arreglar_cho.py                # arregla todas las canciones
    python scripts/arreglar_cho.py songs/A.\\ Entrada/17.seas_quien_seas.cho

Solo hace lo que no necesita oído ni criterio musical:

1. «ESTRIBILLO» escrito como letra → `{chorus}` (y fuera el `{soc}`/`{eoc}`
   que solo envolvía esa palabra).
2. Numeración a mano al principio de una estrofa («1. Hay muchas…») → fuera:
   la app numera sola. Si el acorde iba sobre el número, pasa a la palabra.
3. Intros en un comentario con acordes en español («Intro: lam | SOL | DO
   x2») → `{c: Intro}` + una línea de acordes de verdad (`[Am] [G] [C] x2`),
   que así se transporta y cambia de notación.
4. Estrofas copiadas de un PDF (una línea larga cortada a mitad de frase y la
   siguiente empezando en minúscula) → se unen.
5. Líneas de más de 70 caracteres → una línea por frase: se parten tras
   punto, coma, punto y coma… agrupando frases hasta ~50 caracteres. Un
   acorde que caía justo en el corte pasa a la línea nueva. Si la línea no
   tiene puntuación, se queda como está.

NO toca: «REVISAR ACORDES» (eso es tocar y escuchar), estribillos sin marcar,
mayúsculas ni muros de texto: necesitan una persona.

Reglas completas en `docs/CAMPOS_CANCIONES.md` §4.6. Sin dependencias.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "songs"

CHORD_RE = re.compile(r"\[[^\]]*\]")
DIRECTIVE_RE = re.compile(r"^\s*\{[^}]*\}\s*$")
PLACEHOLDER_RE = re.compile(
    r"^\(?\s*(estribillo|coro)\s*\)?\s*(\(?\s*(bis|x\s?\d+)\s*\)?)?\s*[.:]?$", re.I)
MANUAL_NUMBER_RE = re.compile(r"^((?:\s*\[[^\]]*\])*)\s*\d{1,2}\s*(?:[.)º°ª]|\.-)\s+")
INTRO_RE = re.compile(
    r"^\s*\{\s*(?:c|comment)\s*:\s*\"?\s*(intro|instrumental)\s*:\s*(.+?)\"?\s*\}\s*$", re.I)

LONG = 70          # a partir de aquí no es un verso: se parte por frases
TARGET = 50        # largo máximo al agrupar frases
HARD_WRAP_MIN = 60
ENDS_PHRASE_RE = re.compile(r"[.,;:!?…)»\"'”]\s*$")
STARTS_LOWER_RE = re.compile(r"^[a-záéíóúüñ]")

ES2EN = {"DO": "C", "RE": "D", "MI": "E", "FA": "F", "SOL": "G", "LA": "A", "SI": "B"}
ES_CHORD_RE = re.compile(r"^(do|re|mi|fa|sol|la|si)([#b]?)(m(?!aj))?(.*)$", re.I)


def lyric(line):
    return CHORD_RE.sub("", line).strip()


def es_chord_to_en(tok):
    """«lam» → «Am», «SOL7» → «G7», «FA#m» → «F#m», «Do» → «C». None si no es acorde."""
    m = ES_CHORD_RE.match(tok)
    if not m:
        return None
    root, acc, minor, rest = m.groups()
    if rest and not re.fullmatch(r"(maj|sus|dim|aug|add)?\d*(/[A-Za-z#b]+)?", rest):
        return None
    return ES2EN[root.upper()] + acc + ("m" if minor else "") + (rest or "")


def intro_line(kind, body):
    """«lam | SOL | DO x2» → («Intro», «[Am] [G] [C] x2»), o None si no son acordes."""
    body = body.strip().rstrip(".").strip()
    note = ""
    m = re.search(r"\s*(\(?x\s?\d+\)?)\s*$", body, re.I)
    if m:
        note = m.group(1)
        body = body[:m.start()]
    toks = [t for t in re.split(r"[\s|,·\-]+", body) if t and t not in ("...", "…")]
    toks = [t.rstrip(".…") for t in toks]
    chords = [es_chord_to_en(t) for t in toks]
    if not chords or any(c is None for c in chords):
        return None
    label = "Intro" if kind.lower() == "intro" else "Instrumental"
    return label, " ".join(f"[{c}]" for c in chords) + (f" {note}" if note else "")


# ── Partir líneas largas por frases ───────────────────────────────────────────
def normalize_head(piece):
    """Acordes del principio pegados a la primera palabra: «[G] En» → «[G]En»."""
    m = re.match(r"^((?:\s*\[[^\]]*\])*)\s*", piece)
    chords = re.sub(r"\s+", "", m.group(1))
    return chords + piece[m.end():]


def split_long(raw):
    if len(lyric(raw)) <= LONG:
        return [raw]
    indent = re.match(r"^\s*", raw).group(0)
    body = raw.strip()
    # Un acorde pegado a la puntuación («voz.[G] En») va a la frase siguiente.
    pos = 0
    pieces = []
    for m in re.finditer(r"([,.;:!?…]+[\"'»”)]*)((?:\[[^\]]*\])*)(\s+)", body):
        end_punct = m.start(2)
        if lyric(body[end_punct:]):
            pieces.append(body[pos:end_punct].rstrip())
            pos = end_punct
    pieces.append(body[pos:])
    pieces = [normalize_head(p.strip()) for p in pieces if lyric(p) or CHORD_RE.search(p)]
    if len(pieces) < 2:
        return [raw]
    # Agrupar frases en líneas: las menos posibles, sin pasar de TARGET (una
    # frase sola sí puede), equilibradas y sin un trozo cortito al final.
    n = len(pieces)
    lens = [len(lyric(p)) for p in pieces]
    best = [0.0] + [float("inf")] * n
    back = [0] * (n + 1)
    for j in range(1, n + 1):
        for i in range(j - 1, -1, -1):
            width = sum(lens[i:j]) + (j - i - 1)
            if width > TARGET and j - i > 1:
                break
            cost = best[i] + 1000 + (TARGET - min(width, TARGET)) ** 2
            if width < 16:
                cost += 4000
            if cost < best[j]:
                best[j], back[j] = cost, i
    out = []
    j = n
    while j > 0:
        i = back[j]
        out.insert(0, " ".join(pieces[i:j]))
        j = i
    return [indent + o for o in out]


WEAK_END_RE = re.compile(
    r"\b(el|la|los|las|un|una|mi|tu|su|de|del|al|a|en|y|que|con|por|para|sin|se|te|me|nos|lo)\s*$", re.I)


def is_hard_wrap(prev, nxt):
    lp, ln = lyric(prev), lyric(nxt)
    if not ln:
        return False
    # Una línea larga que acaba en «el», «de», «y»… sigue en la siguiente,
    # esté en mayúsculas o no («…DE ALEGRÍA, EL» / «AMOR ES LA CRUZ…»).
    if len(lp) > HARD_WRAP_MIN and WEAK_END_RE.search(lp):
        return True
    if not STARTS_LOWER_RE.match(ln):
        return False
    if len(lp) > LONG:
        return True
    return len(lp) > HARD_WRAP_MIN and not ENDS_PHRASE_RE.search(lp)


def arreglar(text):
    """Devuelve (texto_nuevo, {arreglo: nº})."""
    done = {}

    def count(k, n=1):
        done[k] = done.get(k, 0) + n

    lines = text.split("\n")
    out = []
    first_in_block = True
    for raw in lines:
        stripped = raw.strip()
        if not stripped:
            out.append(raw)
            first_in_block = True
            continue
        im = INTRO_RE.match(raw)
        if im:
            res = intro_line(im.group(1), im.group(2))
            if res:
                out.append("{c: %s}" % res[0])
                out.append(res[1])
                count("intro_comentario")
                continue
        if DIRECTIVE_RE.match(raw):
            out.append(raw)
            if re.match(r"^\s*\{\s*(soc|start_of_chorus|eoc|end_of_chorus|c|comment)\b", raw, re.I):
                first_in_block = True
            continue
        if PLACEHOLDER_RE.match(lyric(raw)) and not CHORD_RE.search(raw):
            out.append("{chorus}")
            count("estribillo_texto")
            first_in_block = True
            continue
        if first_in_block:
            m = MANUAL_NUMBER_RE.match(raw)
            if m and lyric(raw[m.end():]):
                raw = m.group(1).strip() + raw[m.end():]
                count("numeracion")
        first_in_block = False
        out.append(raw)

    # {soc}/{eoc} que solo envuelven un {chorus} (y huecos) sobran.
    text2 = "\n".join(out)
    text2, n = re.subn(
        r"\{\s*(?:soc|start_of_chorus)\s*\}\s*\n(\s*\n)*\{chorus\}\s*\n(\s*\n)*\{\s*(?:eoc|end_of_chorus)\s*\}",
        "{chorus}", text2, flags=re.I)

    # Unir líneas de PDF y partir las largas por frases.
    lines = text2.split("\n")
    joined = []
    for raw in lines:
        prev = joined[-1] if joined else None
        if (prev is not None and prev.strip() and raw.strip()
                and not DIRECTIVE_RE.match(prev) and not DIRECTIVE_RE.match(raw)
                and is_hard_wrap(prev, raw)
            and all(len(lyric(x)) <= LONG
                    for x in split_long(prev.rstrip() + " " + raw.strip()))):
            # Solo si al volver a partir por frases todo queda en líneas
            # razonables: si no, el corte original era el bueno.
            joined[-1] = prev.rstrip() + " " + raw.strip()
            count("linea_partida")
            continue
        joined.append(raw)
    final = []
    for raw in joined:
        if raw.strip() and not DIRECTIVE_RE.match(raw):
            parts = split_long(raw)
            if len(parts) > 1:
                count("linea_larga")
            final.extend(parts)
        else:
            final.append(raw)
    return "\n".join(final), done


def main(argv):
    dry = "--dry-run" in argv
    files = [Path(a) for a in argv if not a.startswith("--")] or sorted(ROOT.glob("*/*.cho"))
    total = {}
    changed = 0
    for f in files:
        old = f.read_text(encoding="utf-8")
        new, done = arreglar(old)
        if new == old:
            continue
        changed += 1
        for k, v in done.items():
            total[k] = total.get(k, 0) + v
        name = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        print(f"  {name}: " + ", ".join(f"{k} {v}" for k, v in done.items()))
        if not dry:
            f.write_text(new, encoding="utf-8")
    verb = "cambiarían" if dry else "cambiadas"
    print(f"\n{changed} canciones {verb}. " + ", ".join(f"{k}: {v}" for k, v in total.items()))


if __name__ == "__main__":
    main(sys.argv[1:])
