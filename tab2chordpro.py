#!/usr/bin/env python3
"""CLI tool to convert tabulated Spanish chord sheets to ChordPro."""

from __future__ import annotations

import argparse
import re
import sys
import shutil
from pathlib import Path
from typing import List, Tuple

# Map of Spanish chord names to their English equivalents
SP_EN = {
    "DO": "C", "RE": "D", "MI": "E", "FA": "F", "SOL": "G", "LA": "A", "SI": "B",
    "do": "C", "re": "D", "mi": "E", "fa": "F", "sol": "G", "la": "A", "si": "B",
    "lam": "Am", "mim": "Em", "sim": "Bm", "fa#m": "F#m", "sol7": "G7",
}

# Regex for already English-style chord symbols
EN_CHORD_RE = re.compile(r"^[A-G](?:#|b)?(?:m|maj7|sus4|dim|aug|7)?$")

# ---------------------------------------------------------------------------
# Parsing utilities
# ---------------------------------------------------------------------------

def parse_chords_line(line: str) -> List[Tuple[int, str]]:
    """Return a list of (column_index, chord_token) extracted from a line."""
    positions: List[Tuple[int, str]] = []
    i = 0
    while i < len(line):
        if line[i].isspace():
            i += 1
            continue
        start = i
        token = []
        while i < len(line) and not line[i].isspace():
            token.append(line[i])
            i += 1
        positions.append((start, "".join(token)))
    return positions

# ---------------------------------------------------------------------------
# Conversion routines
# ---------------------------------------------------------------------------

def convert_pair(chords_line: str, lyric_line: str, line_no: int) -> str:
    """Inject chords over a single lyric line and return the result."""
    chords_line = chords_line.replace("\t", " " * 8)
    lyric_line = lyric_line.replace("\t", " " * 8)
    chords = parse_chords_line(chords_line)
    result = []
    chord_iter = iter(sorted(chords, key=lambda x: x[0]))
    current = next(chord_iter, None)
    for idx, char in enumerate(lyric_line):
        while current and idx == current[0]:
            token = current[1]
            translated = SP_EN.get(token, token)
            if translated == token and not EN_CHORD_RE.match(token):
                print(
                    f"Warning: Unrecognized chord '{token}' on line {line_no}",
                    file=sys.stderr,
                )
            result.append(f"[{translated}]")
            current = next(chord_iter, None)
        result.append(char)
    while current:  # chords beyond end of lyric line
        token = current[1]
        translated = SP_EN.get(token, token)
        if translated == token and not EN_CHORD_RE.match(token):
            print(
                f"Warning: Unrecognized chord '{token}' on line {line_no}",
                file=sys.stderr,
            )
        result.append(f"[{translated}]")
        current = next(chord_iter, None)
    return "".join(result)


def convert_lines(lines: List[str]) -> str:
    """Process all input text and return converted ChordPro text."""
    output = []
    for i in range(0, len(lines), 2):
        chord = lines[i] if i < len(lines) else ""
        lyric = lines[i + 1] if i + 1 < len(lines) else ""
        output.append(convert_pair(chord, lyric, i + 1))
    return "\n".join(output)

# ---------------------------------------------------------------------------
# Optional OCR handling
# ---------------------------------------------------------------------------

def ocr_image(path: str) -> str:
    """Run OCR over an image/PDF and return the detected text."""
    if not shutil.which("tesseract"):
        print(
            "Tesseract OCR engine is not installed. Please install it to use image mode.",
            file=sys.stderr,
        )
        sys.exit(1)
    try:
        import cv2
        import numpy as np
        from PIL import Image
        import pytesseract
    except ImportError as exc:  # pragma: no cover - dependency check
        print(f"Required OCR libraries missing: {exc}", file=sys.stderr)
        sys.exit(1)

    img = cv2.imread(path)
    if img is None:
        try:
            img = cv2.cvtColor(np.array(Image.open(path)), cv2.COLOR_RGB2BGR)
        except Exception as exc:
            print(f"Failed to load image {path}: {exc}", file=sys.stderr)
            sys.exit(1)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    coords = cv2.findNonZero(255 - gray)
    if coords is not None:
        angle = cv2.minAreaRect(coords)[-1]
        angle = -(90 + angle) if angle < -45 else -angle
        (h, w) = gray.shape[:2]
        M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
        gray = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    text = pytesseract.image_to_string(gray, lang="spa+eng")
    return text

# ---------------------------------------------------------------------------
# Main CLI
# ---------------------------------------------------------------------------

def main() -> None:
    """Entry point for the interactive command line interface."""
    parser = argparse.ArgumentParser(description="Tab chord to ChordPro converter")
    parser.add_argument("-i", "--image", metavar="IMAGE_PATH", help="Path to image/PDF for OCR")
    args = parser.parse_args()

    title = input("Song title? ").strip()
    if args.image:
        text = ocr_image(args.image)
        lines = text.splitlines()
    else:
        print('Paste the chord + lyric lines below. End with a single line that contains ONLY "EOF".')
        lines = []
        while True:
            try:
                line = input()
            except EOFError:
                break
            if line == "EOF":
                break
            lines.append(line)

    chordpro = convert_lines(lines)
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    out_path = output_dir / f"{title}.cho"
    with out_path.open("w", encoding="utf-8") as fh:
        fh.write(chordpro)
    print(f"Saved {out_path}")


if __name__ == "__main__":
    main()
