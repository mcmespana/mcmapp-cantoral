#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REVI-SPLITTER v2
-----------------
Divide un bloque grande de canciones en ficheros .cho **sin acordes**.

Flujo:
1. Te pido la categoría (carpeta destino).
2. Pegas el bloque con varias canciones.
3. Detecto cada canción por su cabecera (mayúsculas, posible (Autor) y opcional "C/x" de cejilla). Reglas endurecidas.
4. Extraigo: nº de orden, título en minúsculas bonitas, autor, cejilla.
5. Elimino TODAS las líneas de acordes/progresiones.
6. Creo los .cho:  `XX.REVI-nombre_de_cancion.cho`  (XX con ceros a la izquierda).
7. Encabezado ChordPro “guay” al inicio.
"""

from __future__ import annotations
import argparse
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Match

# ------------------ Utilidades ------------------ #

def slugify(txt: str) -> str:
    """Convierte texto a slug seguro para nombre de fichero."""
    txt = txt.strip().lower()
    txt = unicodedata.normalize('NFKD', txt).encode('ascii', 'ignore').decode('ascii')
    txt = re.sub(r"[^a-z0-9]+", "_", txt)
    txt = re.sub(r"_+", "_", txt).strip("_")
    return txt or "cancion"

# Regex de acordes en inglés/español
EN_CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|m7|7|sus4|sus2|dim|aug|add\d+|m\+5|m6|6|9|11|13)?(?:/[A-G][#b]?)?$")
ES_CHORD_RE = re.compile(r"^(do|re|mi|fa|sol|la|si)([#b]?)(m|m7|7|sus2|sus4|dim|aug|add\d+)?$", re.IGNORECASE)

LINE_CHORD_RATIO = 0.6  # >=60% tokens son acordes => es línea de acordes
INTRO_LABEL_RE   = re.compile(r"^\s*(introduccion|intro|todo el rato|puente|riff|verso|estrofa|estribillo)\s*:.*$", re.IGNORECASE)

def is_chord_word(tok: str) -> bool:
    tok = tok.strip().replace("-", "")
    if not tok:
        return False
    return bool(EN_CHORD_RE.match(tok) or ES_CHORD_RE.match(tok))

def is_chord_line(line: str) -> bool:
    if INTRO_LABEL_RE.match(line):
        return True
    cand = re.sub(r"[()\[\]{}.,:;!¡¿?]", " ", line)
    toks = [t for t in cand.split() if t]
    if not toks:
        return False
    hits = sum(1 for t in toks if is_chord_word(t))
    return hits / len(toks) >= LINE_CHORD_RATIO

# ------------------ Detección de cabeceras ------------------ #

HEADER_RE = re.compile(r"^\s*([A-ZÁÉÍÓÚÜÑ0-9'.,!¡¿? \-]+?)(?:\s*\(([^)]+)\))?(?:\s*C\/(\d+))?\s*$")

def is_header(line: str, prev_blank: bool, require_paren_or_c: bool = True) -> Optional[Match[str]]:
    """Match si la línea es cabecera válida."""
    if not prev_blank:
        return None
    if is_chord_line(line):
        return None
    m = HEADER_RE.match(line)
    if not m:
        return None
    if require_paren_or_c and ("(" not in line and "C/" not in line.upper()):
        return None
    if len(m.group(1).split()) <= 1:  # evitar "ESTRIBILLO"
        return None
    return m

# ------------------ Datos ------------------ #

@dataclass
class Song:
    order: int
    raw_header: str
    title: str
    author: Optional[str]
    capo: Optional[int]
    body_lines: List[str]

    def cho_header(self) -> str:
        lines = [f"{{title: {self.title}}}"]
        if self.author:
            lines.append(f"{{subtitle: ({self.author})}}")
        if self.capo is not None:
            lines.append(f"{{capo: {self.capo}}}")
        lines.append("{comment: Generado automáticamente por REVI-SPLITTER}")
        return "\n".join(lines) + "\n\n"

    def filename(self, width: int) -> str:
        return f"{str(self.order).zfill(width)}.REVI-{slugify(self.title)}.cho"

# ------------------ Parsing principal ------------------ #

def split_songs(big_text: str, require_paren_or_c: bool = True) -> List[Song]:
    songs: List[Song] = []
    current: Optional[Song] = None
    order = 0
    prev_blank = True

    for raw_line in big_text.splitlines():
        line = raw_line.rstrip("\n")
        m = is_header(line, prev_blank, require_paren_or_c)
        if m:
            if current:
                songs.append(current)
            order += 1
            title_raw, author, capo = m.group(1), m.group(2), m.group(3)
            title_clean = " ".join(w.capitalize() for w in title_raw.strip().lower().split())
            current = Song(order, line, title_clean, author, int(capo) if capo else None, [])
        else:
            if current is not None and not is_chord_line(line):
                current.body_lines.append(line)
        prev_blank = (line.strip() == "")

    if current:
        songs.append(current)

    return songs

# ------------------ Escritura ------------------ #

def write_songs(songs: List[Song], category_dir: Path) -> None:
    category_dir.mkdir(parents=True, exist_ok=True)
    width = max(2, len(str(len(songs))))
    for s in songs:
        content = s.cho_header() + "\n".join(s.body_lines).rstrip() + "\n"
        out_path = category_dir / s.filename(width)
        out_path.write_text(content, encoding="utf-8")
        print(f"✔ {out_path}")

# ------------------ CLI ------------------ #

def main(argv: List[str]) -> int:
    p = argparse.ArgumentParser(description="Divide un bloque de canciones en .cho sin acordes")
    p.add_argument("categoria", nargs="?", help="Nombre de la categoría (carpeta destino)")
    p.add_argument("input", nargs="?", help="Fichero de entrada (si no, STDIN)")
    p.add_argument("-o", "--out", default=".", help="Directorio raíz donde crear la carpeta de categoría")
    p.add_argument("--allow-no-paren", action="store_true", help="Permitir cabeceras sin paréntesis/C/x")
    args = p.parse_args(argv)

    categoria = args.categoria or input("Categoría / carpeta destino: ").strip()
    root = Path(args.out)

    if args.input:
        big_text = Path(args.input).read_text(encoding="utf-8")
    else:
        print("Pega tu mega-bloque de canciones y termina con Ctrl-D (o Ctrl-Z en Windows)\n---")
        big_text = sys.stdin.read()

    songs = split_songs(big_text, require_paren_or_c=not args.allow_no_paren)
    if not songs:
        print("⚠ No se detectó ninguna canción. Revisa el formato de cabeceras.")
        return 1

    cat_dir = root / categoria
    write_songs(songs, cat_dir)
    print(f"\nListo, máquina. {len(songs)} archivo(s) .cho creados en '{cat_dir}'. 🙌")
    return 0

if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))