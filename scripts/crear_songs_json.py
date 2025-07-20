#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
import sys

# Encuentra la última versión existente de songs-v<major>[.<minor>].json
def find_latest_version(songs_dir):
    version_pattern = re.compile(r'^songs-v(\d+)(?:\.(\d+))?\.json$')
    versions = []
    # Recorre todos los archivos en la carpeta songs
    for fname in os.listdir(songs_dir):
        m = version_pattern.match(fname)
        if m:
            major = int(m.group(1))
            minor = int(m.group(2)) if m.group(2) else 0
            versions.append((major, minor))
    # Retorna el máximo (major, minor) o (0,0) si no hay versiones
    return max(versions) if versions else (0, 0)

# Incrementa el número de versión: de .0 a .1 hasta .9, luego salta a próxima major
def bump_version(major, minor):
    if minor < 9:
        return major, minor + 1
    return major + 1, 0

# Da formato al número de versión: "1" o "1.2"
def format_version(major, minor):
    return f"{major}" if minor == 0 else f"{major}.{minor}"

# Extrae metadatos clave del contenido de un archivo .cho
def parse_metadata(text):
    # Lambda para buscar {clave: valor} en el texto (ignora mayúsculas/minúsculas)
    get = lambda key: re.search(r'\{' + key + r':\s*(.*?)\}', text, re.IGNORECASE)
    meta = {}
    # Título: {title: }
    meta['title'] = get('title').group(1).strip() if get('title') else ''
    # Autor: puede estar en {artist: } o {author: }
    artist = get('artist')
    author = get('author')
    meta['author'] = (
        artist.group(1).strip() if artist
        else author.group(1).strip() if author
        else ''
    )
    # Tonalidad: {key: }
    meta['key'] = get('key').group(1).strip() if get('key') else ''
    # Cejuela: {capo: }
    capo = get('capo')
    meta['capo'] = int(capo.group(1)) if capo and capo.group(1).isdigit() else 0
    return meta

# Función principal
def main():
    # Directorio donde está este script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Asumimos ../songs desde scripts/
    songs_dir = os.path.abspath(os.path.join(script_dir, '..', 'songs'))

    # Carga el índice base
    print(f"🔍 Leyendo índice base desde: {os.path.join(songs_dir, 'indice.json')}")
    with open(os.path.join(songs_dir, 'indice.json'), encoding='utf-8') as f:
        indice = json.load(f)

    # Calcula siguiente versión
    major, minor = find_latest_version(songs_dir)
    new_major, new_minor = bump_version(major, minor)
    version_str = format_version(new_major, new_minor)
    new_fname = f"songs-v{version_str}.json"
    new_path = os.path.join(songs_dir, new_fname)
    print(f"🚀 Generando nueva versión: {new_fname}")

    result = {}  # Diccionario final que se volcará a JSON

    # Mapea carpetas como "A"->"A. Entrada"
    print(f"📂 Buscando carpetas en: {songs_dir}")
    folders = [d for d in os.listdir(songs_dir)
               if os.path.isdir(os.path.join(songs_dir, d)) and re.match(r'^[A-Z]\.', d)]
    prefix_map = {f.split('.')[0]: f for f in folders}

    # Recorre cada categoría definida en el índice
    for cat_key, cat_info in indice.items():
        title = cat_info.get('categoryTitle', '')
        prefix = title.split('.')[0].strip()  # "A" de "A. Entrada"
        folder = prefix_map.get(prefix)
        if not folder:
            print(f"⚠️ No hay carpeta para '{cat_key}' ({title}), la salto.")
            continue

        cat_path = os.path.join(songs_dir, folder)
        # Filtra solo archivos .cho
        cho_files = sorted(f for f in os.listdir(cat_path) if f.lower().endswith('.cho'))
        # Si no hay .cho, omite esta categoría
        if not cho_files:
            print(f"⚠️ Carpeta '{folder}' sin archivos .cho, omitiendo categoría '{cat_key}'.")
            continue

        print(f"🎯 Procesando '{cat_key}' en '{folder}' con {len(cho_files)} archivos")
        songs = []
        # Para cada archivo .cho,
        for fname in cho_files:
            path = os.path.join(cat_path, fname)
            text = open(path, encoding='utf-8').read()
            meta = parse_metadata(text)  # Extrae metadatos

            # Extrae código numérico inicial, ej. "01" → "01. "
            code = ''
            m = re.match(r'^(\d+)', fname)
            if m:
                code = f"{m.group(1)}. "

            # Construye la entrada de canción
            entry = {
                'title':    f"{code}{meta['title']}".strip(),  # "01. Título"
                'filename': fname,
                'author':   meta['author'],  # Autor o artista
                'key':      meta['key'],
                'capo':     meta['capo'],
                'info':     '',
                'content':  text  # Contenido completo con saltos de línea
            }
            print(f"   🎵 {fname} -> {entry['title']} (Key={entry['key']}, Capo={entry['capo']})")
            songs.append(entry)

        # Solo si hay canciones, añadimos la categoría
        result[cat_key] = {
            'categoryTitle': cat_info['categoryTitle'],
            'songs': songs
        }

    # Escribe el JSON final
    with open(new_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✅ ¡Hecho! {new_path} creado.")

# Punto de entrada
if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        # Muestra error y sale con código distinto de cero
        print(f"💥 Error: {e}", file=sys.stderr)
        sys.exit(1)
