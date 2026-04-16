#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI mega-friendly para convertir tabs ES ➜ ChordPro
└─ Versión 2025-07-25-f
   • Soporte total para memorizar acordes (^) y resolverlos.
   • Gestión de Capo, Transpose y Música (m={...}).
   • Limpieza inteligente de comandos LaTeX (\ifchorded, \echo, \rep, \nolyrics, etc.).
   • Formateo de títulos dobles (\\ -> -).
"""

import os, re, sys, random, subprocess, shutil
from pathlib import Path
from typing import List, Tuple, Dict

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

def ask_default(p: str, default: str) -> str:
    if default:
        ans = input(c(f"{random.choice(EMO_ASK)} {p} [{default}]: ", CYAN)).strip()
        return ans if ans else default
    return ask(p)

def ok(msg):   print(c(f"{random.choice(EMO_OK)} {msg}",GREEN))
def warn(msg): print(c(f"{random.choice(EMO_ERR)} {msg}",YELL),file=sys.stderr)

# ───────── Diccionario ES ➜ EN ───────── #
SP_EN: Dict[str,str] = {
    "DO":"C","RE":"D","MI":"E","FA":"F","SOL":"G","LA":"A","SI":"B",
    "do":"C","re":"D","mi":"E","fa":"F","sol":"G","la":"A","si":"B",
    "lam":"Am","mim":"Em","sim":"Bm","fa#m":"F#m","sol7":"G7", "SIb":"Bb", "rem":"Dm", "do#m":"C#m", "dom":"Cm", "SI7":"B7", "si7":"B7", "FA#":"F#m", "sol#m":"G#m", "SOL#m":"G#m",
}
USER_MAP: Dict[str,str] = {}              # Traducciones aprendidas en la sesión
CHORD_RE = re.compile(r"^[A-G][#b]?(?:m|maj7|sus[24]?|dim|aug|add9|7|9|11|13)?$")

# ───────── Helpers acordes ───────── #
def clean_chord(tok: str) -> str:
    return tok.replace('(', '').replace(')', '')

def is_known_chord(tok:str)->bool:
    t = clean_chord(tok)
    return (t in SP_EN or tok.lower() in SP_EN or CHORD_RE.match(t))

def translate(tok:str,line_no:int)->str:
    t = clean_chord(tok)
    if t in USER_MAP: return USER_MAP[t]
    if t in SP_EN:    return SP_EN[t]
    if t.lower() in SP_EN: return SP_EN[t.lower()]
    if CHORD_RE.match(t): return t

    resp=input(c(
        f"🤔  No conozco el acorde '{tok}' (línea {line_no}). "
        "¿Con qué lo sustituyo? (ENTER = dejar tal cual) ➜ ",YELL)).strip()
    USER_MAP[t]=resp or t
    return USER_MAP[t]

def is_chord_line(line:str)->bool:
    tokens=re.findall(r"\S+",line.expandtabs(8))
    if not tokens: return False
    recog=sum(1 for t in tokens if is_known_chord(t))
    return recog/len(tokens) >= 0.6

def parse_chords_line(line:str)->List[Tuple[int,str]]:
    line=line.expandtabs(8); out=[]; i=0
    while i<len(line):
        if line[i]!=" ":
            start=i; tok=[]
            while i<len(line) and line[i]!=" ": tok.append(line[i]); i+=1
            out.append((start,"".join(tok)))
        else: i+=1
    return out

def ajusta_posiciones(pos:List[Tuple[int,str]],lyrics:str)->List[Tuple[int,str]]:
    ajust,used=[],set(); L=len(lyrics)
    for col,tok in pos:
        p=col
        while p<L and lyrics[p].isspace(): p+=1
        if p>L: p=L
        while p in used and p<L: p+=1
        used.add(p); ajust.append((p,tok))
    return sorted(ajust,key=lambda x:x[0])

def inject(pos:List[Tuple[int,str]],lyrics:str,line_no:int)->str:
    res=[]; it=iter(pos); cur=next(it,None)
    for idx,ch in enumerate(lyrics):
        while cur and cur[0]==idx:
            res.append(f"[{translate(cur[1],line_no)}]"); cur=next(it,None)
        res.append(ch)
    if cur:
        end=len(lyrics)
        while cur:
            res.append(" "*max(cur[0]-end,0))
            res.append(f"[{translate(cur[1],line_no)}]"); end=cur[0]; cur=next(it,None)
    return "".join(res)

def convert_lines(lines:List[str])->str:
    out=[]; i=0; total=len(lines)
    while i<total:
        ln=lines[i]
        if ln.strip()=="":
            out.append(""); i+=1; continue
        if is_chord_line(ln):
            chords_line=ln
            j=i+1
            while j<total and is_chord_line(lines[j]): j+=1
            if j<total and lines[j].strip()!="":
                lyrics_line=lines[j]
                out.append(inject(ajusta_posiciones(parse_chords_line(chords_line),lyrics_line),lyrics_line,j+1))
                i=j+1
            else:
                tokens=[translate(t, i+1) for _,t in parse_chords_line(chords_line)]
                out.append(" ".join(f"[{t}]" for t in tokens))
                i=j
        else:
            out.append(ln); i+=1
    return "\n".join(out)

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

# ───────── Procesamiento LaTeX ───────── #
def latex_to_chordpro(content: str) -> Tuple[str, str, str, str]:
    body = content
    
    # Extraer metadatos
    transpose_match = re.search(r'\\transpose{([^}]+)}', body)
    transpose_val = transpose_match.group(1) if transpose_match else ""
    body = re.sub(r'\\transpose{.*?}\n?', '', body)

    capo_match = re.search(r'\\capo{([^}]+)}', body)
    capo_val = capo_match.group(1) if capo_match else ""
    body = re.sub(r'\\capo{.*?}\n?', '', body)

    musica_match = re.search(r'm=\{([^}]+)\}', body)
    musica_val = musica_match.group(1) if musica_match else ""

    # \ifchorded ... \else ... \fi -> solo nos quedamos con el bloque chorded
    body = re.sub(r'\\ifchorded(.*?)\\else.*?\\fi', r'\1', body, flags=re.DOTALL)
    body = re.sub(r'\\ifchorded(.*?)\\fi', r'\1', body, flags=re.DOTALL)

    # Limpieza inicial básica
    body = re.sub(r'\\beginsong{.*?}(?:\[.*?\])?\n?', '', body)
    body = re.sub(r'\\endsong\n?', '', body)
    body = re.sub(r'(?m)^%.*$', '', body) # Comentarios
    body = re.sub(r'\{\\nolyrics\s+(.*?)\}', r'\1', body)
    body = body.replace('\\lrep', '').replace('\\rrep', '').replace('\\brk', '')
    body = re.sub(r'\\replay(?:\[.*?\])?', '', body)
    body = re.sub(r'\\renewcommand\{.*?\}(?:\[\d+\])?\{.*?\}', '', body)
    body = re.sub(r'\{\^(.*?)\}', r'^\1', body)

    # Acordes múltiples y opcionales: \[G (G7)] -> [G] ([G7])
    def repl_chord(match):
        raw_chords = match.group(1).split()
        res = []
        for ch in raw_chords:
            ch_clean = clean_chord(ch)
            tr = translate(ch_clean, 0)
            if ch.startswith('(') and ch.endswith(')'): res.append(f"([{tr}])")
            else: res.append(f"[{tr}]")
        return " ".join(res)
    body = re.sub(r'\\\[(.*?)\]', repl_chord, body)
    
    # Memoria de Acordes (^)
    memorized_chords = []; mem_pointer = 0; current_memorizing = False
    new_body = []
    for line in body.splitlines():
        if '\\beginverse' in line or '\\beginchorus' in line:
            mem_pointer = 0
        if '\\memorize' in line:
            memorized_chords = []; current_memorizing = True
            line = re.sub(r'\\memorize(?:\[.*?\])?', '', line)
        if current_memorizing:
            # Extraemos lo que hay entre [ ] para guardarlo en la secuencia
            chords_in_line = re.findall(r'\[(.*?)\]', line)
            memorized_chords.extend(chords_in_line)
        if '\\endchorus' in line or '\\endverse' in line:
            current_memorizing = False
        while '^' in line:
            if mem_pointer < len(memorized_chords):
                chord = memorized_chords[mem_pointer]
                line = line.replace('^', f'[{chord}]', 1)
                mem_pointer += 1
            else: line = line.replace('^', '', 1)
        new_body.append(line)
        
    body = "\n".join(new_body)
    body = body.replace('\\beginchorus', '{soc}').replace('\\endchorus', '{eoc}')
    body = re.sub(r'\\beginverse\*?', '', body).replace('\\endverse', '')
    body = re.sub(r'\\echo\{(.*?)\}', r'(\1)', body)
    body = re.sub(r'\\rep\{(.*?)\}', r'(x\1)', body)
    
    lines = [line.strip() for line in body.splitlines()]
    clean_lines = []
    for line in lines:
        if line == "" and (not clean_lines or clean_lines[-1] == ""): continue
        clean_lines.append(line)
        
    return "\n".join(clean_lines).strip(), transpose_val, capo_val, musica_val

def procesar_archivo_latex(tex_file: Path, base: Path, processed_dir: Path):
    content = tex_file.read_text(encoding="utf-8")
    print(c(f"\n--- Procesando LaTeX: {tex_file.name} ---", MAG))
    
    titulo_match = re.search(r'\\beginsong{([^}]+)}', content)
    titulo_def = titulo_match.group(1).replace(r'\\', '-').strip() if titulo_match else ""
    artista_match = re.search(r'by=\{([^}]+)\}', content)
    artista_def = artista_match.group(1).strip() if artista_match else ""
    slug_def = tex_file.stem.lower().replace(" ", "_")
    slug_def = re.sub(r'[^a-z0-9_]', '', slug_def)
    tono_match = re.search(r'\\\[(.*?)\]', content)
    tono_def = normalize_key(tono_match.group(1)) if tono_match else ""
    
    cuerpo, transpose_val, capo_val, musica_val = latex_to_chordpro(content)
    
    titulo = ask_default("Título de la canción", titulo_def).strip()
    artista = ask_default("Artista / Autor", artista_def).strip()
    slug = ask_default("Nombre archivo", slug_def).strip()
    while not re.fullmatch(r"[a-z0-9_]+", slug):
        slug = ask("❗ solo minúsculas/números/_").strip()
    tono = normalize_key(ask_default("Tono", tono_def).strip())
    capo_in = ask_default("Cejilla", capo_val).strip()
    capo = capo_in if capo_in.isdigit() and int(capo_in)>0 else ""
    
    cat = ask("Letra de la categoría (A-Z)").upper()
    while not(len(cat)==1 and 'A'<=cat<='Z'): cat = ask("⚠️ Solo A-Z").upper()
    folder = resolve_category_folder(base, cat)
    num_in = ask("Número de la canción (blanco = auto)").strip()
    num = (num_in if num_in.isdigit() else str(next_song_number(folder))).zfill(2)
    
    header = [f"{{title: {titulo}}}"]
    if artista: header.append(f"{{artist: {artista}}}")
    if musica_val: header.append(f"{{comment: Música: {musica_val}}}")
    if tono: header.append(f"{{key: {tono}}}")
    if capo: header.append(f"{{capo: {capo}}}")
    if transpose_val: header.append(f"{{transpose: {transpose_val}}}")
    
    fname = f"{num}.{slug}.cho"; fpath = folder / fname
    fpath.write_text("\n".join(header) + "\n\n" + cuerpo, encoding="utf-8")
    ok(f"Archivo creado en ➜ {fpath}")
    
    shutil.move(str(tex_file), str(processed_dir / tex_file.name))
    ok(f"LaTeX movido a procesados 🚀")
    
    try:
        if sys.platform.startswith("darwin"): subprocess.Popen(["open",str(fpath)])
        elif os.name=="nt": os.startfile(str(fpath))
        else: subprocess.Popen(["xdg-open",str(fpath)])
    except Exception: pass

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
    base=Path(__file__).resolve().parent.parent/"songs"
    input_dir = Path(__file__).resolve().parent / "input"
    processed_dir = input_dir / "processed"
    input_dir.mkdir(parents=True, exist_ok=True); processed_dir.mkdir(parents=True, exist_ok=True)

    print(c("\n¿Qué modo quieres usar?", MAG))
    print(c(" [1] Modo clásico (pegar acordes y letra)", CYAN))
    print(c(" [2] Modo LaTeX (procesar de scripts/input/)", CYAN))
    modo = input(c("Elige una opción (1 o 2): ", YELL)).strip()
    
    if modo == "2":
        tex_files = list(input_dir.glob("*.tex"))
        if not tex_files: warn(f"No hay archivos .tex en {input_dir}"); return
        for tex_file in tex_files:
            procesar_archivo_latex(tex_file, base, processed_dir)
            if input(c("\n" + random.choice(EMO_AGAIN) + " (s/n) ", CYAN)).strip().lower() != "s": break
        ok("¡Fin del procesamiento LaTeX! 👋"); return

    while True:
        cat=ask("Letra de la categoría (A-Z)").upper()
        while not(len(cat)==1 and 'A'<=cat<='Z'): cat=ask("⚠️ Solo A-Z").upper()
        folder=resolve_category_folder(base,cat)
        num_in=ask("Número de la canción (blanco = auto)").strip()
        num=(num_in if num_in.isdigit() else str(next_song_number(folder))).zfill(2)
        slug=ask("Nombre archivo (ej: ven_a_mi)").strip()
        while not re.fullmatch(r"[a-z0-9_]+",slug): slug=ask("❗ solo minúsculas/números/_").strip()
        titulo =ask("Título").strip(); artista=ask("Artista / Autor").strip()
        tono   =normalize_key(ask("Tono").strip()); capo=ask("Cejilla").strip(); capo=capo if capo.isdigit() and int(capo)>0 else ""

        ok("¡Pega tu canción! (FIN para acabar)")
        raw=[]
        while True:
            try: l=input()
            except EOFError: break
            if l.strip()=="FIN": break
            raw.append(l)
        if not raw: continue

        cuerpo=mark_chorus(convert_lines(raw))
        header=[f"{{title: {titulo}}}"]
        if artista: header.append(f"{{artist: {artista}}}")
        if tono: header.append(f"{{key: {tono}}}")
        if capo: header.append(f"{{capo: {capo}}}")
        fname=f"{num}.{slug}.cho"; fpath=folder/fname
        fpath.write_text("\n".join(header)+"\n\n"+cuerpo,encoding="utf-8")
        ok(f"Archivo creado en ➜ {fpath}")

        try:
            if sys.platform.startswith("darwin"): subprocess.Popen(["open",str(fpath)])
            elif os.name=="nt": os.startfile(str(fpath))
            else: subprocess.Popen(["xdg-open",str(fpath)])
        except Exception: pass
        if input(c(random.choice(EMO_AGAIN)+" (s/n) ",CYAN)).strip().lower()!="s": break

if __name__=="__main__":
    try: main()
    except KeyboardInterrupt: print(); warn("Cancelado")
