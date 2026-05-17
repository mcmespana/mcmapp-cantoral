#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Admin local del Cantoral MCM.

Servidor Flask que lee directamente el filesystem (no DB):
  - /songs/<categoría>/*.cho   → canciones del repo
  - /songs/indice.json         → orden y títulos amigables
  - Cantoral Castellón v2.0.4.docx → fuente para importar

Endpoints (ver /api/health para listado):
  GET  /api/catalog                 → estado completo (categorías, canciones, status)
  GET  /api/song?path=...           → contenido + metadata de un .cho
  PUT  /api/song?path=...           → guarda contenido (body JSON: {content})
  DELETE /api/song?path=...         → elimina archivo (con backup)
  GET  /api/docx/list               → 225 canciones del docx con estado vs repo
  GET  /api/docx/preview?id=N       → conversión sin guardar
  POST /api/docx/import             → body: {ids: [N,...]} importa con TO DO
  POST /api/reorder                 → body: {category, order: [filename,...]}
  POST /api/build-json              → ejecuta crear_songs_json.py
"""
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from flask import Flask, jsonify, request, send_from_directory, abort

# Importar el conversor docx como módulo (mismo paquete scripts/)
SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
REPO_DIR = SCRIPTS_DIR.parent
SONGS_DIR = REPO_DIR / "songs"
BACKUP_DIR = REPO_DIR / "songs-backup-edits"
INDICE_JSON = SONGS_DIR / "indice.json"

sys.path.insert(0, str(SCRIPTS_DIR))
import docx2chordpro as d2c  # noqa: E402

# Marca para canciones pendientes de revisar acordes (TO DO con espacio entre TO y DO)
TODO_COMMENT_LINE = "{comment: TO DO: PENDIENTE REVISIÓN ACORDES}"
TODO_REGEX = re.compile(r"\bTO\s+DO\b", re.IGNORECASE)

app = Flask(__name__, static_folder=str(SCRIPT_DIR / "static"), static_url_path="")


# ─────────── Utilidades ─────────── #

def safe_relpath(path_str: str) -> Path:
    """Convierte un path relativo del cliente a absoluto, validando que esté bajo /songs."""
    p = (REPO_DIR / path_str).resolve()
    try:
        p.relative_to(SONGS_DIR.resolve())
    except ValueError:
        abort(400, "Path fuera de /songs")
    return p


def parse_cho_metadata(content: str) -> Dict[str, str]:
    """Extrae metadata básica de un .cho."""
    def get(key: str) -> str:
        m = re.search(r"\{\s*" + key + r"\s*:\s*(.*?)\s*\}", content, re.IGNORECASE)
        return m.group(1).strip() if m else ""

    capo_raw = get("capo")
    return {
        "title": get("title"),
        "artist": get("artist") or get("author"),
        "key": get("key"),
        "capo": int(capo_raw) if capo_raw.isdigit() else 0,
        "has_todo": bool(TODO_REGEX.search(content)),
    }


def number_prefix(filename: str) -> Optional[int]:
    m = re.match(r"(\d+)\.", filename)
    return int(m.group(1)) if m else None


def normalize_title_for_match(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower()
    # Quitar paréntesis y su contenido (suelen ser autor)
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return s.strip()


def title_keys(s: str) -> List[str]:
    """Devuelve varias variantes del título normalizadas para matching difuso."""
    base = normalize_title_for_match(s)
    keys = {base}
    # quitar "c/N" final (info de cejilla en algunos títulos del docx)
    keys.add(re.sub(r"\s+c\s+\d+\s*$", "", base).strip())
    # primera palabra significativa eliminada (para casos como "el senor es...")
    return [k for k in keys if k]


def best_match(target_keys: List[str], index: Dict[str, "object"]) -> Optional["object"]:
    for k in target_keys:
        if k in index:
            return index[k]
    # Substring fallback
    for tk in target_keys:
        if not tk:
            continue
        for ik, v in index.items():
            if tk in ik or ik in tk:
                return v
    return None


def load_indice() -> Dict[str, dict]:
    if INDICE_JSON.exists():
        with open(INDICE_JSON, encoding="utf-8") as f:
            return json.load(f)
    return {}


def list_categories() -> List[dict]:
    """Devuelve lista de carpetas-categoría del repo, mezclando con indice.json."""
    indice = load_indice()
    # indice.json key → categoryTitle ("A. Canciones Entrada 🎉")
    by_letter: Dict[str, dict] = {}
    for key, info in indice.items():
        title = info.get("categoryTitle", "")
        m = re.match(r"\s*([A-Z](?:\+\d+)?)\.", title)
        if m:
            by_letter[m.group(1)] = {
                "key": key,
                "title": title,
                "order": info.get("order", 999),
            }
    folders = []
    for p in sorted(SONGS_DIR.iterdir()):
        if not p.is_dir():
            continue
        m = re.match(r"\s*([A-Z](?:\+\d+)?)\.", p.name)
        if not m:
            continue
        letter = m.group(1)
        info = by_letter.get(letter, {})
        folders.append({
            "letter": letter,
            "folder": p.name,
            "title": info.get("title") or p.name,
            "indice_key": info.get("key"),
            "order": info.get("order", 999),
        })
    folders.sort(key=lambda x: (x["order"], x["letter"]))
    return folders


def list_repo_songs(category_letter: Optional[str] = None) -> List[dict]:
    """Devuelve todas las canciones .cho del repo con metadata."""
    out: List[dict] = []
    for cat in list_categories():
        if category_letter and cat["letter"] != category_letter:
            continue
        folder = SONGS_DIR / cat["folder"]
        for cho in sorted(folder.glob("*.cho")):
            try:
                content = cho.read_text(encoding="utf-8")
            except Exception as e:
                content = ""
                meta_err = str(e)
            else:
                meta_err = None
            meta = parse_cho_metadata(content) if content else {}
            out.append({
                "path": str(cho.relative_to(REPO_DIR)),
                "filename": cho.name,
                "number": number_prefix(cho.name),
                "category_letter": cat["letter"],
                "category_folder": cat["folder"],
                "category_title": cat["title"],
                "title": meta.get("title", cho.stem),
                "artist": meta.get("artist", ""),
                "key": meta.get("key", ""),
                "capo": meta.get("capo", 0),
                "has_todo": meta.get("has_todo", False),
                "error": meta_err,
            })
    return out


# ─────────── Cantoral docx ─────────── #

_docx_cache: Dict[str, object] = {"songs": None, "mtime": 0}


def load_docx_songs(force: bool = False) -> List[dict]:
    """Lee y cachea las canciones del docx. Si el archivo cambia, recarga."""
    docx_path = d2c.find_docx()
    mtime = docx_path.stat().st_mtime
    if not force and _docx_cache["songs"] is not None and _docx_cache["mtime"] == mtime:
        return _docx_cache["songs"]  # type: ignore
    paras = d2c.load_paragraphs(docx_path)
    raw_songs = d2c.split_into_songs(paras)
    indexed = []
    for i, s in enumerate(raw_songs):
        indexed.append({
            "id": i,
            "title_raw": s["title_raw"],
            "section": s["section"],
            "section_letter": d2c.section_letter(s["section"]),
            "_song": s,
        })
    _docx_cache["songs"] = indexed
    _docx_cache["mtime"] = mtime
    return indexed


def docx_song_to_dict(s: dict, conv: dict, include_body: bool = False) -> dict:
    out = {
        "id": s["id"],
        "title_raw": s["title_raw"],
        "title": conv["title"],
        "section": s["section"],
        "section_letter": s["section_letter"],
        "key": conv.get("key"),
        "capo": conv.get("capo"),
        "warnings": conv.get("warnings", []),
        "slug": conv.get("slug"),
    }
    if include_body:
        out["content"] = render_cho_with_todo(conv)
    return out


def render_cho_with_todo(conv: dict) -> str:
    """Render del .cho con la línea TO DO al principio."""
    header_lines = [TODO_COMMENT_LINE, f"{{title: {conv['title']}}}"]
    if conv.get("key"):
        header_lines.append(f"{{key: {conv['key']}}}")
    if conv.get("capo"):
        header_lines.append(f"{{capo: {conv['capo']}}}")
    return "\n".join(header_lines) + "\n\n" + conv["body"] + "\n"


# ─────────── Backup ─────────── #


def backup_file(path: Path) -> Path:
    """Copia el .cho a /songs-backup-edits/<timestamp>/<rel_path>."""
    BACKUP_DIR.mkdir(exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    rel = path.relative_to(SONGS_DIR)
    dest = BACKUP_DIR / ts / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, dest)
    return dest


# ─────────── API: Catálogo ─────────── #


@app.route("/api/catalog")
def api_catalog():
    repo_songs = list_repo_songs()
    docx_songs = load_docx_songs()

    # Cachear conversiones (caras): solo para usar el title aquí
    docx_convs: Dict[int, dict] = {}
    docx_index: Dict[str, dict] = {}
    for s in docx_songs:
        conv = d2c.convert_song(s["_song"])
        docx_convs[s["id"]] = conv
        for k in title_keys(conv["title"]):
            docx_index.setdefault(k, {
                "id": s["id"],
                "title": conv["title"],
                "section_letter": s["section_letter"],
            })

    # Marcar repo_songs con si está en docx
    matched_docx_ids: set = set()
    for r in repo_songs:
        match = best_match(title_keys(r["title"]), docx_index)
        if match:
            r["in_docx"] = True
            r["docx_id"] = match["id"]
            matched_docx_ids.add(match["id"])
        else:
            r["in_docx"] = False
            r["docx_id"] = None

    # Canciones del docx que NO están en repo
    missing = []
    for s in docx_songs:
        if s["id"] in matched_docx_ids:
            continue
        conv = docx_convs[s["id"]]
        missing.append({
            "docx_id": s["id"],
            "title": conv["title"],
            "title_raw": s["title_raw"],
            "section_letter": s["section_letter"],
            "key": conv.get("key"),
            "capo": conv.get("capo"),
            "warnings": conv.get("warnings", []),
        })

    # Contadores
    todo_count = sum(1 for r in repo_songs if r["has_todo"])

    return jsonify({
        "categories": list_categories(),
        "repo_songs": repo_songs,
        "missing_from_repo": missing,
        "stats": {
            "repo_total": len(repo_songs),
            "docx_total": len(docx_songs),
            "todo_count": todo_count,
            "missing_from_repo": len(missing),
            "only_in_repo": sum(1 for r in repo_songs if not r["in_docx"]),
        },
    })


# ─────────── API: Canción individual ─────────── #


@app.route("/api/song", methods=["GET"])
def api_song_get():
    path_str = request.args.get("path", "")
    if not path_str:
        abort(400, "Falta 'path'")
    p = safe_relpath(path_str)
    if not p.exists():
        abort(404, "No existe")
    content = p.read_text(encoding="utf-8")
    meta = parse_cho_metadata(content)
    return jsonify({
        "path": str(p.relative_to(REPO_DIR)),
        "filename": p.name,
        "content": content,
        "meta": meta,
    })


@app.route("/api/song", methods=["PUT"])
def api_song_put():
    path_str = request.args.get("path", "")
    if not path_str:
        abort(400, "Falta 'path'")
    p = safe_relpath(path_str)
    if not p.exists():
        abort(404, "No existe")
    body = request.get_json(silent=True) or {}
    content = body.get("content")
    if not isinstance(content, str):
        abort(400, "Body debe ser {content: string}")
    backup_file(p)
    p.write_text(content, encoding="utf-8")
    meta = parse_cho_metadata(content)
    return jsonify({"ok": True, "path": str(p.relative_to(REPO_DIR)), "meta": meta})


@app.route("/api/song", methods=["DELETE"])
def api_song_delete():
    path_str = request.args.get("path", "")
    if not path_str:
        abort(400, "Falta 'path'")
    p = safe_relpath(path_str)
    if not p.exists():
        abort(404, "No existe")
    backup_file(p)
    p.unlink()
    return jsonify({"ok": True})


# ─────────── API: docx ─────────── #


@app.route("/api/docx/list")
def api_docx_list():
    songs = load_docx_songs()
    out = []
    for s in songs:
        conv = d2c.convert_song(s["_song"])
        out.append(docx_song_to_dict(s, conv, include_body=False))
    return jsonify(out)


@app.route("/api/docx/preview")
def api_docx_preview():
    try:
        i = int(request.args.get("id", "-1"))
    except ValueError:
        abort(400, "id inválido")
    songs = load_docx_songs()
    if not (0 <= i < len(songs)):
        abort(404, "id fuera de rango")
    s = songs[i]
    conv = d2c.convert_song(s["_song"])
    return jsonify(docx_song_to_dict(s, conv, include_body=True))


@app.route("/api/docx/import", methods=["POST"])
def api_docx_import():
    body = request.get_json(silent=True) or {}
    ids = body.get("ids") or []
    if not isinstance(ids, list):
        abort(400, "ids debe ser lista")
    songs = load_docx_songs()
    repo_songs = list_repo_songs()
    repo_titles = {normalize_title_for_match(r["title"]) for r in repo_songs}

    results = []
    for i in ids:
        try:
            i = int(i)
        except (TypeError, ValueError):
            results.append({"id": i, "ok": False, "error": "id inválido"})
            continue
        if not (0 <= i < len(songs)):
            results.append({"id": i, "ok": False, "error": "fuera de rango"})
            continue
        s = songs[i]
        conv = d2c.convert_song(s["_song"])
        if normalize_title_for_match(conv["title"]) in repo_titles:
            results.append({"id": i, "ok": False, "error": "ya existe en repo"})
            continue
        folder = d2c.resolve_target_folder(s["section"])
        if folder is None:
            results.append({"id": i, "ok": False, "error": "sin carpeta destino"})
            continue
        num = d2c.next_song_number(folder)
        fname = f"{num:02d}.{conv['slug']}.cho"
        fpath = folder / fname
        if fpath.exists():
            results.append({"id": i, "ok": False, "error": "el archivo ya existe", "path": str(fpath.relative_to(REPO_DIR))})
            continue
        fpath.write_text(render_cho_with_todo(conv), encoding="utf-8")
        repo_titles.add(normalize_title_for_match(conv["title"]))
        results.append({
            "id": i,
            "ok": True,
            "path": str(fpath.relative_to(REPO_DIR)),
            "title": conv["title"],
            "warnings": conv.get("warnings", []),
        })
    return jsonify({"results": results})


# ─────────── API: reordenar y build-json ─────────── #


@app.route("/api/reorder", methods=["POST"])
def api_reorder():
    body = request.get_json(silent=True) or {}
    letter = body.get("category", "").upper()
    order = body.get("order", [])
    if not letter or not isinstance(order, list):
        abort(400, "Falta category u order")
    cat = next((c for c in list_categories() if c["letter"] == letter), None)
    if not cat:
        abort(404, "Categoría no encontrada")
    folder = SONGS_DIR / cat["folder"]
    current = {p.name: p for p in folder.glob("*.cho")}
    # Validar que todos los filenames existen
    for fn in order:
        if fn not in current:
            abort(400, f"Archivo no existe: {fn}")
    # Hacer backup de la categoría completa
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_folder = BACKUP_DIR / ts / cat["folder"]
    backup_folder.mkdir(parents=True, exist_ok=True)
    for p in folder.glob("*.cho"):
        shutil.copy2(p, backup_folder / p.name)
    # Renombrar: paso intermedio con prefijo temporal para evitar colisiones
    tmp_prefix = f".reorder-{int(time.time())}-"
    intermediate: List[tuple[Path, str]] = []
    for fn in order:
        p = folder / fn
        # Quitar prefijo numérico viejo si existe
        base = re.sub(r"^\d+\.", "", fn)
        intermediate.append((p, base))
    # Renombrar a temporales
    temp_paths: List[tuple[Path, str]] = []
    for p, base in intermediate:
        tp = folder / (tmp_prefix + base)
        p.rename(tp)
        temp_paths.append((tp, base))
    # Renombrar a finales con números
    final_paths = []
    for idx, (tp, base) in enumerate(temp_paths, start=1):
        final_name = f"{idx:02d}.{base}"
        final = folder / final_name
        tp.rename(final)
        final_paths.append(final.name)
    return jsonify({"ok": True, "category": letter, "new_order": final_paths})


@app.route("/api/build-json", methods=["POST"])
def api_build_json():
    script = SCRIPTS_DIR / "crear_songs_json.py"
    if not script.exists():
        abort(404, "crear_songs_json.py no encontrado")
    proc = subprocess.run(
        [sys.executable, str(script)],
        capture_output=True, text=True, cwd=str(REPO_DIR),
    )
    return jsonify({
        "ok": proc.returncode == 0,
        "stdout": proc.stdout,
        "stderr": proc.stderr,
        "returncode": proc.returncode,
    })


# ─────────── Static + fallback ─────────── #


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/health")
def api_health():
    try:
        docx = d2c.find_docx()
        docx_ok = docx.exists()
    except SystemExit:
        docx_ok = False
    return jsonify({
        "ok": True,
        "songs_dir": str(SONGS_DIR),
        "docx_ok": docx_ok,
        "endpoints": [
            "GET  /api/catalog",
            "GET  /api/song?path=...",
            "PUT  /api/song?path=...",
            "DELETE /api/song?path=...",
            "GET  /api/docx/list",
            "GET  /api/docx/preview?id=N",
            "POST /api/docx/import",
            "POST /api/reorder",
            "POST /api/build-json",
        ],
    })


def main():
    port = int(os.environ.get("CANTORAL_ADMIN_PORT", "8765"))
    host = os.environ.get("CANTORAL_ADMIN_HOST", "127.0.0.1")
    print(f"\n🎵  Cantoral Admin\n   Abre  http://{host}:{port}/\n   Ctrl+C para parar\n")
    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    main()
