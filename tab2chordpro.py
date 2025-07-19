"""Command-line tool to convert Spanish chord tabs to ChordPro."""

import argparse
import os
import re
import sys
from typing import List, Tuple

try:
    import cv2
    import pytesseract
except Exception:
    cv2 = None
    pytesseract = None

SP_EN = {
    "DO": "C",
    "RE": "D",
    "MI": "E",
    "FA": "F",
    "SOL": "G",
    "LA": "A",
    "SI": "B",
    "do": "C",
    "re": "D",
    "mi": "E",
    "fa": "F",
    "sol": "G",
    "la": "A",
    "si": "B",
    "lam": "Am",
    "mim": "Em",
    "sim": "Bm",
    "fa#m": "F#m",
    "sol7": "G7",
}

CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|sus4|dim|aug|7)?$")


def parse_chords_line(line: str) -> List[Tuple[int, str]]:
    line = line.replace("\t", "        ")
    positions = []
    i = 0
    while i < len(line):
        if line[i] != " ":
            start = i
            token = []
            while i < len(line) and line[i] != " ":
                token.append(line[i])
                i += 1
            positions.append((start, "".join(token)))
        else:
            i += 1
    return positions


def translate_chord(token: str, line_no: int) -> str:
    translated = SP_EN.get(token)
    if translated:
        return translated
    if CHORD_RE.match(token):
        return token
    print(f"Warning: unrecognized chord '{token}' on line {line_no}", file=sys.stderr)
    return token


def inject_chords(positions: List[Tuple[int, str]], lyric_line: str, line_no: int) -> str:
    result = []
    pos_iter = iter(sorted(positions, key=lambda x: x[0]))
    current = next(pos_iter, None)
    for idx, ch in enumerate(lyric_line):
        while current and current[0] == idx:
            chord = translate_chord(current[1], line_no)
            result.append(f"[{chord}]")
            current = next(pos_iter, None)
        result.append(ch)
    # handle chords beyond end of line
    if current:
        end_len = len(lyric_line)
        while current:
            spaces = current[0] - end_len
            if spaces > 0:
                result.append(" " * spaces)
                end_len = current[0]
            chord = translate_chord(current[1], line_no)
            result.append(f"[{chord}]")
            current = next(pos_iter, None)
    return "".join(result)


def convert_lines(lines: List[str]) -> str:
    output = []
    for i in range(0, len(lines), 2):
        chords_line = lines[i] if i < len(lines) else ""
        lyrics_line = lines[i + 1] if i + 1 < len(lines) else ""
        positions = parse_chords_line(chords_line)
        converted = inject_chords(positions, lyrics_line, i + 1)
        output.append(converted)
    return "\n".join(output)


def ocr_image(path: str) -> List[str]:
    if cv2 is None or pytesseract is None:
        print("OCR dependencies not installed. Install OpenCV and pytesseract.", file=sys.stderr)
        return []
    image = cv2.imread(path)
    if image is None:
        print(f"Cannot read image: {path}", file=sys.stderr)
        return []
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    coords = cv2.findNonZero(gray)
    angle = 0.0
    if coords is not None:
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = gray.shape
        M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
        gray = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    try:
        text = pytesseract.image_to_string(gray, lang="spa+eng")
    except pytesseract.pytesseract.TesseractNotFoundError:
        print("Tesseract is not installed. Cannot perform OCR.", file=sys.stderr)
        return []
    return text.splitlines()


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert Spanish chord sheets to ChordPro syntax")
    parser.add_argument("-i", "--image", help="Path to image or PDF for OCR")
    args = parser.parse_args()

    title = input("Song title? ").strip()

    if args.image:
        lines = ocr_image(args.image)
        if not lines:
            return
    else:
        print('Paste the chord + lyric lines below. End with a single line that contains ONLY "EOF".')
        lines = []
        while True:
            try:
                line = input()
            except EOFError:
                break
            if line.strip() == 'EOF':
                break
            lines.append(line)

    if not lines:
        print("No input provided.", file=sys.stderr)
        return

    converted = convert_lines(lines)

    os.makedirs("output", exist_ok=True)
    file_path = os.path.join("output", f"{title}.cho")
    with open(file_path, "w", encoding="utf-8") as fh:
        fh.write(converted)
    print(f"Wrote {file_path}")


if __name__ == "__main__":
    main()
