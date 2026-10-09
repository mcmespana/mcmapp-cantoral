#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Revisa los .cho y dice qué hay que limpiar para que se vean bien en la app.

Uso:
    python scripts/revisar_cho.py              # resumen + las 40 peores
    python scripts/revisar_cho.py --todas      # todas las canciones con algo
    python scripts/revisar_cho.py --md         # tabla Markdown (para un issue)
    python scripts/revisar_cho.py songs/A.\\ Entrada/17.seas_quien_seas.cho

No toca ningún fichero: solo informa. Las reglas salen de cómo pinta la app
cada canción (`utils/songSheet.ts` en el repo `mcmapp`) y están explicadas en
`docs/CAMPOS_CANCIONES.md` §4.6 («Cómo escribir un .cho que se lea bien»).
Sin dependencias.
"""
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "songs"

CHORD_RE = re.compile(r"\[([^\]]*)\]")
DIRECTIVE_RE = re.compile(r"^\s*\{([^}:]+)(?::\s*([^}]*))?\}\s*$")
REVIEW_RE = re.compile(r"revis|pendiente|\bto ?do\b", re.I)
PLACEHOLDER_RE = re.compile(
    r"^\(?\s*(estribillo|coro)\s*\)?\s*(\(?\s*(bis|x\s?\d+)\s*\)?)?\s*[.:]?$", re.I)
MANUAL_NUMBER_RE = re.compile(r"^\s*\d{1,2}\s*(?:[.)º°ª]|\.-)\s+")
ES_CHORD = r"(?:DO|RE|MI|FA|SOL|LA|SI)[#b]?(?:m|maj|sus|dim|aug|\d)*"
ES_CHORDS_IN_TEXT_RE = re.compile(
    r"\b(?:%s|(?:do|re|mi|fa|sol|la|si)[#b]?m\d*)\b" % ES_CHORD)

# A partir de aquí una línea ya no cabe ni en un móvil con la letra del
# sistema y hay que partirla: mejor que la parta quien conoce la melodía.
LINEA_LARGA = 70
# Un bloque sin línea en blanco más largo que esto es un muro de texto.
MURO = 14

# Qué es cada problema, en orden de lo que más se nota en la app.
CHECKS = [
    ("linea_larga", "Líneas de más de %d caracteres (estrofa en una sola línea)" % LINEA_LARGA),
    ("revision", "Marca «REVISAR ACORDES» / «PENDIENTE»"),
    ("sin_estribillo", "Sin {soc} ni {c: Estribillo}"),
    ("estribillo_texto", "«ESTRIBILLO» escrito como letra (mejor {chorus})"),
    ("numeracion", "Estrofas numeradas a mano («1. …»)"),
    ("intro_comentario", "Acordes escritos en un comentario («Intro: lam | SOL»)"),
    ("muro", "Bloque de %d+ líneas sin línea en blanco" % MURO),
    ("mayusculas", "Líneas enteras en MAYÚSCULAS"),
]
LABELS = dict(CHECKS)


def lyric_of(line):
    return CHORD_RE.sub("", line).strip()


def is_upper(text):
    letters = [c for c in text if c.isalpha()]
    return len(letters) >= 6 and sum(c.isupper() for c in letters) / len(letters) > 0.8


def revisar(text):
    """Devuelve {check: nº de apariciones} para el texto de un .cho."""
    found = Counter()
    has_chorus = False
    block = 0
    for raw in text.splitlines():
        d = DIRECTIVE_RE.match(raw)
        if d:
            name = d.group(1).strip().lower()
            value = (d.group(2) or "").strip()
            if name in ("soc", "start_of_chorus", "chorus"):
                has_chorus = True
            if name in ("c", "comment", "ci", "comment_italic"):
                if REVIEW_RE.search(value):
                    found["revision"] += 1
                elif re.match(r"\W*(estribillo|coro)\b", value, re.I):
                    has_chorus = True
                elif ES_CHORDS_IN_TEXT_RE.search(value) and re.search(r"intro|instrumental|final", value, re.I):
                    found["intro_comentario"] += 1
            if name in ("soc", "eoc", "start_of_chorus", "end_of_chorus"):
                block = 0
            continue
        if not raw.strip():
            block = 0
            continue
        lyric = lyric_of(raw)
        if not lyric:
            continue
        block += 1
        if block == MURO:
            found["muro"] += 1
        if PLACEHOLDER_RE.match(lyric) and not CHORD_RE.search(raw):
            found["estribillo_texto"] += 1
            has_chorus = True
            continue
        if len(lyric) > LINEA_LARGA:
            found["linea_larga"] += 1
        if MANUAL_NUMBER_RE.match(lyric):
            found["numeracion"] += 1
        if is_upper(lyric):
            found["mayusculas"] += 1
    if not has_chorus:
        found["sin_estribillo"] += 1
    return found


def _sort_key(item):
    path, found = item
    # Primero las que tienen más tipos de problema; luego las de más líneas largas.
    return (-len(found), -found.get("linea_larga", 0), str(path))


def main(argv):
    md = "--md" in argv
    todas = "--todas" in argv
    files = [Path(a) for a in argv if not a.startswith("--")]
    if not files:
        files = sorted(ROOT.glob("*/*.cho"))
    results = []
    for f in files:
        found = revisar(f.read_text(encoding="utf-8", errors="replace"))
        if found:
            results.append((f, found))

    total = len(files)
    print(f"{total} canciones revisadas, {len(results)} con algo que limpiar.\n")
    for key, label in CHECKS:
        n = sum(1 for _, fd in results if fd.get(key))
        if n:
            print(f"  {n:4d}  {label}")
    print()

    rows = sorted(results, key=_sort_key)
    if not todas and len(files) > 1:
        rows = rows[:40]
    if md:
        print("| Canción | " + " | ".join(k for k, _ in CHECKS) + " |")
        print("|---|" + "---|" * len(CHECKS))
        for f, fd in rows:
            name = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
            print(f"| {name} | " + " | ".join(str(fd.get(k, "")) for k, _ in CHECKS) + " |")
    else:
        for f, fd in rows:
            name = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
            detail = ", ".join(f"{k} {v}" for k, v in fd.items())
            print(f"  {name}: {detail}")


if __name__ == "__main__":
    main(sys.argv[1:])
