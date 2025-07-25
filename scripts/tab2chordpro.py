#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI mega-friendly para convertir tabs ES ➜ ChordPro
└─ Versión 2025-07-25-b: numeración auto-padding, aviso de commit,
   fix líneas vacías & estrbillo ≥70 % mayúsculas.
"""

import os
import re
import sys
import random
import subprocess
from pathlib import Path
from typing import List, Tuple

# ---------- Colores ANSI + emojis ---------- #
RESET = "\033[0m"; CYAN = "\033[96m"; GREEN = "\033[92m"
YELL  = "\033[93m"; MAG  = "\033[95m"

EMO_ASK  = ["🎤","🎷","🎸","🎺","🥁","🎹"]
EMO_OK   = ["✅","🎶","👌","🙌","🥳","🚀"]
EMO_ERR  = ["❌","😵","⚠️","🤔","🚫"]
EMO_AGAIN = [
    "¿Otra rondita, jefe? 🤠","¿Nos marcamos otro hit? 🎵",
    "¡Siguiente temazo? 🔥","¿Te animas a otra? 🥁",
    "¿Más madera musical? 🚂","¿Otra cancioncita, máquina? 🎸",
    "¿Repetimos jugada? 🕺","¿Seguimos la jam? 🎷",
    "¿Otra ronda, compadre? 🍻","¿Un bonus track? 💿",
    "¿Te queda cuerda? 🤹","¿Más acordes al viento? 🌬️",
    "¿Otro tema fresco? 🍃","¿Vamos con otra pieza? 🎻",
    "¿Le damos al REC otra vez? 🔴",
]

def c(t:str,col:str)->str: return f"{col}{t}{RESET}"
def ask(p:str)->str:       return input(c(f"{random.choice(EMO_ASK)} {p}: ",CYAN))
def ok(msg:str):           print(c(f"{random.choice(EMO_OK)} {msg}",GREEN))
def warn(msg:str):         print(c(f"{random.choice(EMO_ERR)} {msg}",YELL),file=sys.stderr)

# ---------- Diccionario ES ➜ EN ---------- #
SP_EN = {
    "DO":"C","RE":"D","MI":"E","FA":"F","SOL":"G","LA":"A","SI":"B",
    "do":"C","re":"D","mi":"E","fa":"F","sol":"G","la":"A","si":"B",
    "lam":"Am","mim":"Em","sim":"Bm","fa#m":"F#m","sol7":"G7",
}
CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|sus4|dim|aug|7)?$")

# ---------- Parsing de acordes ---------- #
def parse_chords_line(line:str)->List[Tuple[int,str]]:
    line = line.expandtabs(8)             # tabs → stops reales
    out, i = [], 0
    while i < len(line):
        if line[i] != " ":
            start, tok = i, []
            while i < len(line) and line[i] != " ":
                tok.append(line[i]); i += 1
            out.append((start, "".join(tok)))
        else:
            i += 1
    return out

def ajusta_posiciones(pos:List[Tuple[int,str]], lyrics:str)->List[Tuple[int,str]]:
    ajust, ocupadas = [], set(); L = len(lyrics)
    for col, tok in pos:
        p = col
        while p < L and lyrics[p].isspace(): p += 1
        if p > L: p = L
        while p in ocupadas and p < L: p += 1
        ocupadas.add(p); ajust.append((p, tok))
    return sorted(ajust, key=lambda x: x[0])

def translate(tok:str)->str:
    return SP_EN.get(tok) or SP_EN.get(tok.lower()) or tok

def inject(pos:List[Tuple[int,str]], lyrics:str)->str:
    res, it = [], iter(pos); cur = next(it, None)
    for idx, ch in enumerate(lyrics):
        while cur and cur[0] == idx:
            res.append(f"[{translate(cur[1])}]"); cur = next(it, None)
            # (si varios acordes comparten columna se añaden seguidos)
        res.append(ch)
    if cur:                                    # acordes tras final de línea
        end = len(lyrics)
        while cur:
            res.append(" " * max(cur[0]-end,0))
            res.append(f"[{translate(cur[1])}]")
            end = cur[0]; cur = next(it, None)
    return "".join(res)

# ---------- Conversión de pares ---------- #
def convert_lines(lines:List[str])->str:
    neat = [ln for ln in lines if ln.strip() != ""]     # ← IGNORA vacías
    out = []
    for i in range(0, len(neat), 2):
        chords = neat[i]
        lyrics = neat[i+1] if i+1 < len(neat) else ""
        out.append(inject(ajusta_posiciones(parse_chords_line(chords), lyrics), lyrics))
    return "\n".join(out)

# ---------- Estribillo {soc}/{eoc} ---------- #
def mark_chorus(text:str)->str:
    lines = text.splitlines(); marked, in_ch = [], False
    for line in lines:
        clean = re.sub(r"\[.*?\]", "", line).strip()
        letters = [c for c in clean if c.isalpha()]
        uppers  = [c for c in letters if c.isupper()]
        is_caps = letters and len(uppers)/len(letters) >= 0.7   # ← ≥70 %
        if is_caps and not in_ch:
            marked.append(""); marked.append("{soc}"); in_ch = True
        if not is_caps and in_ch:
            marked.append("{eoc}"); in_ch = False
        marked.append(line)
    if in_ch: marked.append("{eoc}")
    return "\n".join(marked)

# ---------- Helpers varios ---------- #
def normalize_key(k:str)->str:
    if not k.strip(): return ""
    t = translate(k.strip())
    return t[0].upper() + t[1:]

def next_song_number(folder:Path)->int:
    max_n = 0
    for f in folder.iterdir():
        m = re.match(r"(\d+)\.", f.name)
        if m: max_n = max(max_n, int(m.group(1)))
    return max_n + 1

def resolve_category_folder(base:Path, letter:str)->Path:
    for p in base.iterdir():
        if p.is_dir() and p.name.upper().startswith(f"{letter.upper()}."):
            return p
    new = base / f"{letter.upper()}. Sin_categoria"
    new.mkdir(parents=True, exist_ok=True); return new

# ---------- CLI principal ---------- #
def main():
    ok("Bienvenido al ♪ conversor mega-friendly ♪")

    base = Path(__file__).resolve().parent.parent / "songs"
    base.mkdir(parents=True, exist_ok=True)

    while True:
        cat = ask("Letra de la categoría (A-Z)").upper()
        while not (len(cat)==1 and 'A'<=cat<='Z'):
            cat = ask("⚠️ Introduce SOLO una letra A-Z").upper()

        folder = resolve_category_folder(base, cat)

        num_in = ask("Número de la canción (si no lo pones la añadiré al final)").strip()
        if num_in and not num_in.isdigit():
            warn("No es un número, lo ignoro"); num_in = ""
        num = (num_in or str(next_song_number(folder))).zfill(2)
        if not num_in:
            ok(f"Número asignado automáticamente ➜ {num}")

        slug = ask("Nombre de ARCHIVO (minúsculas_con_barrabajas)").strip()
        while not re.fullmatch(r"[a-z0-9_]+", slug):
            slug = ask("❗ Solo minúsculas, números y _ (sin espacios)").strip()

        titulo  = ask("Título de la canción (el 'bonito')").strip()
        artista = ask("Artista / Autor (opcional)").strip()
        tono    = normalize_key(ask("Tono (ej: C, Am, DO, lam)").strip())
        capo_in = ask("Cejilla (0 o en blanco)").strip()
        capo    = capo_in if capo_in.isdigit() and int(capo_in)>0 else ""

        ok("¡A pastear tu canción! (líneas de ACORDES/LETRA alternas)")
        print(c("Cuando termines escribe 'FIN' en una línea aparte ➜ ENTER", MAG))
        raw = []
        while True:
            try: ln = input()
            except EOFError: warn("Entrada terminada inesperadamente"); break
            if ln.strip() == "FIN": break
            raw.append(ln)
        if not raw: warn("No se pegó nada… volvemos al principio 🤷"); continue

        cuerpo = mark_chorus(convert_lines(raw))
        header = [f"{{title: {titulo}}}", f"{{artist: {artista}}}"]
        if tono: header.append(f"{{key: {tono}}}")
        if capo: header.append(f"{{capo: {capo}}}")
        header_text = "\n".join(header) + "\n\n"

        fname = f"{num}.{slug}.cho"
        fpath = folder / fname
        fpath.write_text(header_text + cuerpo, encoding="utf-8")
        ok(f"Archivo creado en ➜ {fpath}")

        print(c("💾 Recuerda hacer un commit en el repositorio para que se suba automáticamente tu nuevo temazo 😉", MAG))
        try:
            if sys.platform.startswith("darwin"): subprocess.Popen(["open", str(fpath)])
            elif os.name == "nt": os.startfile(str(fpath))            # type: ignore
            else: subprocess.Popen(["xdg-open", str(fpath)])
        except Exception:
            warn("No pude abrir el archivo automáticamente 😅")

        again = input(c(random.choice(EMO_AGAIN)+" (s/n) ", CYAN)).strip().lower()
        if again != "s":
            ok("¡Hasta la próxima, crack! 👋"); break

if __name__ == "__main__":
    try: main()
    except KeyboardInterrupt:
        print(); warn("Cancelado por el usuario")

# ---------- OCR (opcional, desactivado) ---------- #
"""
# Si algún día quieres OCR:
# import cv2, pytesseract
# def ocr_image(path:str)->List[str]:
#     ...
"""