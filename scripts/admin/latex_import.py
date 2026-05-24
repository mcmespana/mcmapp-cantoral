#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Escaneo / conversión NO interactiva de archivos LaTeX (.tex) → ChordPro.

Reutiliza la lógica de `tab2chordpro.py` (carpeta padre) pero parchea su
`translate()` para que NUNCA pregunte por consola (los acordes desconocidos
se devuelven tal cual y se reportan como aviso).
"""
from __future__ import annotations

import re
import shutil
import sys
import time
import unicodedata
from pathlib import Path
from typing import Dict, List, Optional

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
REPO_DIR = SCRIPTS_DIR.parent
INPUT_DIR = SCRIPTS_DIR / "input"
PROCESSED_DIR = INPUT_DIR / "processed"

sys.path.insert(0, str(SCRIPTS_DIR))
import tab2chordpro as t2c  # noqa: E402

# ─────────── Parche: translate() sin prompts ─────────── #

_unknown_collected: List[str] = []


def _translate_silent(tok: str, line_no: int = 0) -> str:
    if not tok:
        return tok
    t = t2c.clean_chord(tok)
    if '/' in t:
        left, right = t.split('/', 1)
        return _translate_silent(left, line_no) + '/' + _translate_silent(right, line_no)
    if t in t2c.SP_EN:
        return t2c.SP_EN[t]
    if t.lower() in t2c.SP_EN:
        return t2c.SP_EN[t.lower()]
    if t2c.CHORD_RE.match(t):
        return t
    _unknown_collected.append(tok)
    return t


# Sustituimos la función del módulo (lo usa internamente latex_to_chordpro)
t2c.translate = _translate_silent

# ─────────── Mapeo de carpetas LaTeX → letra de categoría ─────────── #

LATEX_CATEGORY_MAP: Dict[str, str] = {
    "entrada": "A",
    "gloria": "B",
    "salmos": "C",
    "aleluya": "D",
    "ofertorio": "E",
    "santo": "F",
    "padrenuestro": "G",
    "paz": "H",
    "comunion": "I",
    "salida": "J",
    "himnos": "K",
    "gracias": "L",
    "alianza": "M",
    "navidad": "N",
    "pascua": "O",
    "adoracion": "X",
    "estribillos": "Y",
    "a saber": "Z",
    "otras": "Z",
}


def latex_category_letter(folder_name: str) -> Optional[str]:
    return LATEX_CATEGORY_MAP.get((folder_name or "").lower().strip())


# ─────────── Conversión de un .tex ─────────── #

def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s or "cancion"


def parse_latex_song(tex_path: Path) -> dict:
    """Convierte un .tex a un dict con metadatos + cuerpo ChordPro (sin guardarlo)."""
    content = tex_path.read_text(encoding="utf-8")

    title_m = re.search(r"\\beginsong\{([^}]+)\}", content)
    title = ""
    if title_m:
        title = title_m.group(1).replace(r"\\", " — ").strip()
    if not title:
        title = tex_path.stem.replace("_", " ").strip().title()

    artist_m = re.search(r"by=\{([^}]+)\}", content)
    artist = artist_m.group(1).strip() if artist_m else ""

    tono_m = re.search(r"\\\[([A-Ga-g][#b]?m?[^\]\s/]*)", content)
    tono_raw = tono_m.group(1) if tono_m else ""
    try:
        tono = t2c.normalize_key(tono_raw) if tono_raw else ""
    except Exception:
        tono = ""

    # Conversión completa del cuerpo (silenciosa)
    global _unknown_collected
    _unknown_collected = []
    try:
        body, transpose_val, capo_val, musica_val = t2c.latex_to_chordpro(content)
    except Exception as e:
        body, transpose_val, capo_val, musica_val = "", "", "", ""
        _unknown_collected.append(f"<error: {e}>")
    unknown = sorted(set(_unknown_collected))

    return {
        "title": title,
        "artist": artist,
        "key": tono,
        "capo": capo_val or "",
        "transpose": transpose_val or "",
        "musica": musica_val or "",
        "body": body or "",
        "unknown_chords": unknown,
    }


def _add_trailing_space_after_chord(text: str) -> str:
    """Si una línea acaba en ']' (acorde suelto), añade un espacio final."""
    out = []
    for ln in text.split("\n"):
        rstripped = ln.rstrip()
        if rstripped.endswith("]"):
            out.append(rstripped + " ")
        else:
            out.append(ln)
    return "\n".join(out)


def render_latex_cho(parsed: dict) -> str:
    """Construye el contenido .cho con cabecera TO DO + metadatos."""
    todo = "{comment: TO DO: PENDIENTE REVISIÓN ACORDES}"
    header = [todo, f"{{title: {parsed['title']}}}"]
    if parsed.get("artist"):
        header.append(f"{{artist: {parsed['artist']}}}")
    if parsed.get("musica"):
        header.append(f"{{comment: Música: {parsed['musica']}}}")
    if parsed.get("key"):
        header.append(f"{{key: {parsed['key']}}}")
    if parsed.get("capo"):
        header.append(f"{{capo: {parsed['capo']}}}")
    if parsed.get("transpose"):
        header.append(f"{{comment: Transpose original LaTeX: {parsed['transpose']}}}")
    body = _add_trailing_space_after_chord(parsed.get("body") or "")
    return "\n".join(header) + "\n\n" + body.rstrip() + "\n"


# ─────────── Escaneo de toda la carpeta /input ─────────── #

def scan_latex_files(include_parsed: bool = False) -> List[dict]:
    """Lista todos los .tex de scripts/input/* (excluye processed/)."""
    out: List[dict] = []
    if not INPUT_DIR.exists():
        return out
    for cat_dir in sorted(INPUT_DIR.iterdir()):
        if not cat_dir.is_dir() or cat_dir.name == "processed":
            continue
        cat_letter = latex_category_letter(cat_dir.name)
        for tex in sorted(cat_dir.glob("*.tex")):
            rel = str(tex.relative_to(REPO_DIR))
            try:
                parsed = parse_latex_song(tex)
            except Exception as e:
                parsed = {
                    "title": tex.stem.replace("_", " ").title(),
                    "artist": "", "key": "", "capo": "", "transpose": "",
                    "musica": "", "body": "", "unknown_chords": [f"<error: {e}>"],
                }
            entry = {
                "id": rel,
                "filename": tex.name,
                "latex_folder": cat_dir.name,
                "category_letter": cat_letter,
                "title": parsed["title"],
                "artist": parsed["artist"],
                "key": parsed["key"],
                "capo": parsed["capo"],
                "transpose": parsed["transpose"],
                "musica": parsed["musica"],
                "unknown_chords": parsed["unknown_chords"],
                "suggested_slug": slugify(tex.stem.replace("_", " ")),
            }
            if include_parsed:
                entry["body"] = parsed["body"]
            out.append(entry)
    return out


def resolve_tex_path(rel_id: str) -> Path:
    p = (REPO_DIR / rel_id).resolve()
    # Seguridad: debe estar bajo INPUT_DIR
    try:
        p.relative_to(INPUT_DIR.resolve())
    except ValueError:
        raise ValueError("Path fuera de scripts/input")
    if not p.exists():
        raise FileNotFoundError(rel_id)
    return p


def move_to_processed(tex_path: Path) -> Path:
    """Mueve el .tex a scripts/input/processed/ (manteniendo nombre)."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    dest = PROCESSED_DIR / tex_path.name
    if dest.exists():
        ts = int(time.time())
        dest = PROCESSED_DIR / f"{tex_path.stem}.dup-{ts}.tex"
    shutil.move(str(tex_path), str(dest))
    return dest
