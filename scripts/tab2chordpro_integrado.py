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
import unicodedata
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
    "SIb":"Bb","Sib":"Bb","rem":"Dm","do#m":"C#m","dom":"Cm","SI7":"B7","si7":"B7",
    "FA#":"F#m","sol#m":"G#m","SOL#m":"G#m"
}

CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|sus4|dim|aug|7)?$")

# --- Helpers de normalización para acordes ---
_ZERO_WIDTH_RE = re.compile(r"[\u200B-\u200D\uFEFF\u2060\u00A0]")  # zero-width + NBSP
def _norm_tok(tok: str) -> str:
    t = unicodedata.normalize("NFKC", tok).strip()
    t = _ZERO_WIDTH_RE.sub("", t)
    t = t.replace("♭", "b").replace("♯", "#")
    return t

_SP_ROOTS = {"do":"C","re":"D","mi":"E","fa":"F","sol":"G","la":"A","si":"B"}
_SP_RE = re.compile(r"^(do|re|mi|fa|sol|la|si)([#b]?)(.*)$", re.IGNORECASE)

def translate(tok:str, line_no:int=0)->str:
    t = _norm_tok(tok)
    if '/' in t:
        left, right = t.split('/', 1)
        return translate(left, line_no) + '/' + translate(right, line_no)
    # 1) Mapa definido por el usuario en runtime
    if t in USER_MAP:
        return USER_MAP[t]
    # 2) Diccionario explícito
    if t in SP_EN:
        return SP_EN[t]
    if t.lower() in SP_EN:
        return SP_EN[t.lower()]
    # 3) Traducción DO/RE/MI + alteración + sufijos
    m = _SP_RE.match(t)
    if m:
        root, acc, suf = m.groups()
        if suf == '' and t.lower().endswith('m'):
            suf = 'm'
        cand = f"{_SP_ROOTS[root.lower()]}{acc}{suf}"
        if CHORD_RE.match(cand):
            return cand
    # 4) Ya es inglés válido
    if CHORD_RE.match(t):
        return t
    # 5) Interactiva como último recurso
    resp = input(c(
        f"🤔  No conosco el acorde '{tok}' (línea {line_no}). "
        "¿Con qué lo sustituyo? (ENTER = dejar tal cual) ➜ ", YELL)).strip()
    USER_MAP[t] = resp or t
    return USER_MAP[t]

def parse_chords_line(line:str)->List[Tuple[float,str,float]]:
    """Parsea línea de acordes a [(x_inicio_px, token, ancho_px)]. Sin expandir tabs."""
    font = ___pix_get_font()
    s = line
    out=[]; i=0; n=len(s)
    while i<n:
        if s[i]!=" ":
            j=i
            while j<n and s[j]!=" ":
                j+=1
            tok = s[i:j]
            x_left = _pix_get_length(font, s[:i])
            w_tok  = _pix_get_length(font, tok)
            out.append((x_left, tok, w_tok))
            i=j
        else:
            i+=1
    return out

def ajusta_posiciones(pos:List[Tuple[float,str,float]], lyrics:str)->List[Tuple[float,str,float]]:
    """Con métrica por píxeles no ajustamos por espacios; devolvemos tal cual."""
    return pos


def inject(pos:List[Tuple[float,str,float]], lyrics:str, line_no:int=0)->str:
    """Inserta acordes usando posiciones por píxel. Anclaje al centro y snap a 2ª letra."""
    if not pos: return lyrics
    font = ___pix_get_font()
    cum = _pix_cum(font, lyrics)
    if not cum: return lyrics
    ws = _pix_word_starts(lyrics)
    by_idx = {}
    for x_left, tok, w_tok in pos:
        x = x_left + w_tok/2.0
        idx = _pix_index_for_x(cum, x)
        if idx in ws and idx+1 <= len(lyrics):
            idx += 1
        try:
            chord_txt = translate(tok, line_no)
        except TypeError:
            chord_txt = translate(tok)
        by_idx.setdefault(idx, []).append(chord_txt)
    pieces=[]; last=0
    for idx in sorted(by_idx.keys()):
        pieces.append(lyrics[last:idx])
        pieces.append("".join(f"[{t}]" for t in by_idx[idx]))
        last = idx
    pieces.append(lyrics[last:])
    return "".join(pieces)

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

        slug = ask("Nombre de ARCHIVO (minúsculas_con_barrabajas sin extensión ni número)").strip()
        while not re.fullmatch(r"[a-z0-9_]+", slug):
            slug = ask("❗ Solo minúsculas, números y _ (sin espacios)").strip()

        titulo  = ask("Título de la canción (el 'bonito')").strip()
        artista = ask("Artista / Autor (opcional)").strip()
        tono    = normalize_key(ask("Tono (ej: C, Am, DO, lam)").strip())
        capo_in = ask("Cejilla (0 o en blanco)").strip()
        capo    = capo_in if capo_in.isdigit() and int(capo_in)>0 else ""



#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI mega-friendly para convertir tabs ES ➜ ChordPro
└─ Versión 2025-07-25-d
   • Numeración auto + padding
   • Estribillo ≥70 % mayúsculas
   • Acordes desconocidos → prompt interactivo
   • Soporta bloques de letra sin acordes (estrofas sueltas) ✅
"""

import os, re, sys, random, subprocess
from pathlib import Path
from typing import List, Tuple, Dict
from PIL import ImageFont

# ---------- Métrica por píxeles (Calibri) ---------- #
_PIX_FONT = None
def ___pix_get_font():
    global _PIX_FONT
    if _PIX_FONT is not None:
        return _PIX_FONT
    try:
        ask_fn = ask
    except NameError:
        def ask_fn(p): return input(p + ": ")
    try:
        size_s = ask_fn("¿En qué tamaño estaba la fuente antes de copiar y pegar? [Por defecto, 14]").strip()
    except Exception:
        size_s = ""
    try:
        size = int(size_s) if size_s else 14
    except Exception:
        size = 14
    try:
        _PIX_FONT = ImageFont.truetype("fuente.ttf", size)
    except Exception as e:
        try:
            warn(f"No pude cargar 'fuente.ttf' (tamaño {size}). Uso fuente por defecto. Detalle: {e}")
        except Exception:
            print(f"Advertencia: no pude cargar 'fuente.ttf' (tamaño {size}). {e}", file=sys.stderr)
        _PIX_FONT = ImageFont.load_default()
    return _PIX_FONT

def _pix_get_length(font, text:str)->float:
    if hasattr(font, "getlength"):
        try: return float(font.getlength(text))
        except Exception: pass
    try:
        bbox = font.getbbox(text); return float(bbox[2]-bbox[0])
    except Exception: pass
    try:
        w, _ = font.getsize(text); return float(w)
    except Exception:
        return float(len(text)*8)

def _pix_cum(font, s:str):
    xs=[0.0]; acc=0.0
    for ch in s:
        acc += _pix_get_length(font, ch)
        xs.append(acc)
    return xs

def _pix_index_for_x(cum, x:float)->int:
    if x <= cum[0]: return 0
    if x >= cum[-1]: return len(cum)-2
    j = bisect.bisect_right(cum, x) - 1
    return max(0, min(j, len(cum)-2))

def _pix_word_starts(s:str):
    ws=set(); prev=" "
    for i,ch in enumerate(s):
        if ch!=" " and prev==" ":
            ws.add(i)
        prev=ch
    return ws

import bisect

# ───────── Colores ANSI + emojis ───────── #
RESET="\033[0m"; CYAN="\033[96m"; GREEN="\033[92m"; YELL="\033[93m"; MAG="\033[95m"
EMO_ASK=["🎤","🎷","🎸","🎺","🥁","🎹"]; EMO_OK=["✅","🎶","👌","🙌","🥳","🚀"]
EMO_ERR=["❌","😵","⚠️","🤔","🚫"]; EMO_AGAIN=[
    "¿Otra rondita, jefe? 🤠","¿Nos marcamos otro hit? 🎵","¡Siguiente temazo? 🔥",
    "¿Te animas a otra? 🥁","¿Más madera musical? 🚂","¿Otra cancioncita, máquina? 🎸",
    "¿Repetimos jugada? 🕺","¿Seguimos la jam? 🎷","¿Otra ronda, compadre? 🍻",
    "¿Un bonus track? 💿","¿Te queda cuerda? 🤹","¿Más acordes al viento? 🌬️",
    "¿Otro tema fresco? 🍃","¿Vamos con otra pieza? 🎻","¿Le damos al REC otra vez? 🔴",
]
c   = lambda t,col: f"{col}{t}{RESET}"
ask = lambda p: input(c(f"{random.choice(EMO_ASK)} {p}: ",CYAN))
def ok(msg):   print(c(f"{random.choice(EMO_OK)} {msg}",GREEN))
def warn(msg): print(c(f"{random.choice(EMO_ERR)} {msg}",YELL),file=sys.stderr)

# ───────── Diccionario ES ➜ EN ───────── #
USER_MAP: Dict[str,str] = {}              # Traducciones aprendidas en la sesión
CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|sus[24]?|dim|aug|add9|7|9|11|13)?$")

# ───────── Helpers acordes ───────── #
def is_known_chord(tok:str)->bool:
    t = _norm_tok(tok)
    if '/' in t:
        left, right = t.split('/', 1)
        return is_known_chord(left) and is_known_chord(right)
    if t in SP_EN or t.lower() in SP_EN or CHORD_RE.match(t):
        return True
    m = _SP_RE.match(t)
    if not m:
        return False
    root, acc, suf = m.groups()
    if suf == '' and t.lower().endswith('m'):
        suf = 'm'
    cand = f"{_SP_ROOTS[root.lower()]}{acc}{suf}"
    return bool(CHORD_RE.match(cand))

def is_chord_line(line:str)->bool:
    tokens=re.findall(r"\S+",line.expandtabs(8))
    if not tokens: return False
    recog=sum(1 for t in tokens if is_known_chord(t))
    return recog/len(tokens) >= 0.6     # ≥60 % tokens parecen acordes

# ───────── Parsing posiciones ───────── #
def parse_chords_line(line:str)->List[Tuple[float,str,float]]:
    """Parsea línea de acordes a [(x_inicio_px, token, ancho_px)]. Sin expandir tabs."""
    font = ___pix_get_font()
    s = line
    out=[]; i=0; n=len(s)
    while i<n:
        if s[i]!=" ":
            j=i
            while j<n and s[j]!=" ":
                j+=1
            tok = s[i:j]
            x_left = _pix_get_length(font, s[:i])
            w_tok  = _pix_get_length(font, tok)
            out.append((x_left, tok, w_tok))
            i=j
        else:
            i+=1
    return out

def ajusta_posiciones(pos:List[Tuple[float,str,float]], lyrics:str)->List[Tuple[float,str,float]]:
    """Con métrica por píxeles no ajustamos por espacios; devolvemos tal cual."""
    return pos

def inject(pos:List[Tuple[float,str,float]], lyrics:str, line_no:int=0)->str:
    """Inserta acordes usando posiciones por píxel. Anclaje al centro y snap a 2ª letra."""
    if not pos: return lyrics
    font = ___pix_get_font()
    cum = _pix_cum(font, lyrics)
    if not cum: return lyrics
    ws = _pix_word_starts(lyrics)
    by_idx = {}
    for x_left, tok, w_tok in pos:
        x = x_left + w_tok/2.0
        idx = _pix_index_for_x(cum, x)
        if idx in ws and idx+1 <= len(lyrics):
            idx += 1
        try:
            chord_txt = translate(tok, line_no)
        except TypeError:
            chord_txt = translate(tok)
        by_idx.setdefault(idx, []).append(chord_txt)
    pieces=[]; last=0
    for idx in sorted(by_idx.keys()):
        pieces.append(lyrics[last:idx])
        pieces.append("".join(f"[{t}]" for t in by_idx[idx]))
        last = idx
    pieces.append(lyrics[last:])
    return "".join(pieces)

def convert_lines(lines:List[str])->str:
    out=[]; i=0; total=len(lines)
    while i<total:
        ln=lines[i]
        if ln.strip()=="":
            out.append(""); i+=1; continue
        if is_chord_line(ln):
            chords_line=ln
            # busca la siguiente línea NO de acordes (puede haber varias chords seguidas, raro pero…)
            j=i+1
            while j<total and is_chord_line(lines[j]): j+=1
            if j<total and lines[j].strip()!="":
                lyrics_line=lines[j]
                out.append(inject(
                    ajusta_posiciones(parse_chords_line(chords_line),lyrics_line),
                    lyrics_line,j+1))
                i=j+1
            else:
                # no hay letra: muestra acordes (traducidos) separados por espacio
                tokens=[translate(t, i+1) for _,t in parse_chords_line(chords_line)]
                out.append(" ".join(f"[{t}]" for t in tokens))
                i=j
        else:
            out.append(ln)  # línea solo de letra
            i+=1
    return "\n".join(out)

# ───────── Estribillo {soc}/{eoc} ───────── #
def mark_chorus(text:str)->str:
    lines=text.splitlines(); marked=[]; in_c=False
    for ln in lines:
        clean=re.sub(r"\[.*?\]","",ln).strip()
        letters=[c for c in clean if c.isalpha()]
        upp=[c for c in letters if c.isupper()]
        caps=letters and len(upp)/len(letters)>=0.7
        if caps and not in_c: marked.append(""); marked.append("{soc}"); in_c=True
        if not caps and in_c: marked.append("{eoc}"); in_c=False
        marked.append(ln)
    if in_c: marked.append("{eoc}")
    return "\n".join(marked)

# ───────── Miscelánea ───────── #
def normalize_key(k:str)->str:
    if not k.strip(): return ""
    t=translate(k.strip(),0); return t[0].upper()+t[1:]

def next_song_number(folder:Path)->int:
    maxn=0
    for f in folder.iterdir():
        m=re.match(r"(\d+)\.",f.name)
        if m: maxn=max(maxn,int(m.group(1)))
    return maxn+1

def resolve_category_folder(base:Path,letter:str)->Path:
    for p in base.iterdir():
        if p.is_dir() and p.name.upper().startswith(f"{letter}."): return p
    new=base/f"{letter}. Sin_categoria"; new.mkdir(parents=True,exist_ok=True); return new

# ───────── CLI principal ───────── #
def main():
    ok("Bienvenido al ♪ conversor mega-friendly ♪")
    base=Path(__file__).resolve().parent.parent/"songs"; base.mkdir(parents=True,exist_ok=True)

    while True:
        cat=ask("Letra de la categoría del cantoral (A-Z)").upper()
        while not(len(cat)==1 and 'A'<=cat<='Z'): cat=ask("⚠️ Solo una letra A-Z").upper()
        folder=resolve_category_folder(base,cat)

        num_in=ask("Número de la canción (si no lo pones la añadiré al final)").strip()
        if num_in and not num_in.isdigit(): warn("No es número, lo ignoro"); num_in=""
        num=(num_in or str(next_song_number(folder))).zfill(2)
        if not num_in: ok(f"Número asignado automáticamente (pura IA) ➜ {num}")

        slug=ask("Nombre archivo (minus_barrabaja_nombre_corto_y_en_este_formato)").strip()
        while not re.fullmatch(r"[a-z0-9_]+",slug): slug=ask("❗ solo minúsculas/números/_").strip()

        titulo =ask("Título de la canción").strip()
        artista=ask("Artista / Autor").strip()
        tono   =normalize_key(ask("Tono (C, Am, DO, lam…)").strip())
        capo   =ask("Cejilla (en blanco = 0)").strip(); capo=capo if capo.isdigit() and int(capo)>0 else ""

        ___pix_get_font()
        ok("¡Pega tu canción! (líneas ACORDES/LETRA, FIN para acabar)")
        print(c("Termina con 'FIN' en línea aparte ➜ ENTER",MAG))
        raw=[]
        while True:
            try: l=input()
            except EOFError: warn("Entrada terminada inesperadamente"); break
            if l.strip()=="FIN": break
            raw.append(l)
        if not raw: warn("Nada pegado… iniciamos de nuevo 🤷"); continue

        cuerpo=mark_chorus(convert_lines(raw))
        header=[f"{{title: {titulo}}}",f"{{artist: {artista}}}"]
        if tono: header.append(f"{{key: {tono}}}")
        if capo: header.append(f"{{capo: {capo}}}")
        fname=f"{num}.{slug}.cho"; fpath=folder/fname
        fpath.write_text("\n".join(header)+"\n\n"+cuerpo,encoding="utf-8")
        ok(f"Archivo creado en ➜ {fpath}")
        print(c("💾 Recuerda hacer un commit al repo para subir tu nuevo temazo 😉",MAG))

        try:
            if sys.platform.startswith("darwin"): subprocess.Popen(["open",str(fpath)])
            elif os.name=="nt": os.startfile(str(fpath))      # type: ignore
            else: subprocess.Popen(["xdg-open",str(fpath)])
        except Exception: warn("No pude abrir el archivo automáticamente pero revísalo porfi 😅")

        if input(c(random.choice(EMO_AGAIN)+" (s/n) ",CYAN)).strip().lower()!="s":
            ok("¡Hasta la próxima, crack! 👋"); break

if __name__=="__main__":
    try: main()
    except KeyboardInterrupt:
        print(); warn("Cancelado por el usuario")

# OCR opcional (comentado)
"""
# import cv2, pytesseract
# def ocr_image(path:str)->List[str]:
#     ...
"""