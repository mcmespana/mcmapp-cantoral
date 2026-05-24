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
IGNORED_FILE = SCRIPT_DIR / "import-ignored.json"

sys.path.insert(0, str(SCRIPTS_DIR))
import docx2chordpro as d2c  # noqa: E402
import latex_import as lx  # noqa: E402
import doceacordes_import as da  # noqa: E402

# Marca para canciones pendientes de revisar acordes (TO DO con espacio entre TO y DO)
TODO_COMMENT_LINE = "{comment: TO DO: PENDIENTE REVISIÓN ACORDES}"
TODO_REGEX = re.compile(r"\bTO\s+DO\b", re.IGNORECASE)

# Marca específica para revisión de acordes
CHORD_REVIEW_COMMENT_LINE = "{comment: ♩ REVISAR ACORDES}"
CHORD_REVIEW_REGEX = re.compile(r"♩\s*REVISAR\s*ACORDES", re.IGNORECASE)

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


def _parse_label_url(value: str) -> Dict[str, str]:
    if "|" in value:
        label, _, url = value.partition("|")
        return {"label": label.strip(), "url": url.strip()}
    return {"label": "", "url": value.strip()}


def parse_extra_meta(content: str) -> Dict[str, object]:
    """Extrae las custom directives multimedia/meta MCM."""
    extra: Dict[str, object] = {
        "rhythm": "", "album": "", "liturgicalTime": "", "source": "",
        "videoEmbed": "", "youtubeLinks": [], "audioLinks": [], "comment": "",
    }
    for m in re.finditer(
        r"\{\s*(ritmo|album|tiempo|fuente|video|youtube|audio|comentario)\s*:\s*(.*?)\s*\}",
        content, re.IGNORECASE,
    ):
        k = m.group(1).lower()
        v = m.group(2).strip()
        if not v:
            continue
        if k == "ritmo":         extra["rhythm"] = v
        elif k == "album":       extra["album"] = v
        elif k == "tiempo":      extra["liturgicalTime"] = v
        elif k == "fuente":      extra["source"] = v
        elif k == "video":       extra["videoEmbed"] = v
        elif k == "comentario":  extra["comment"] = v
        elif k == "youtube":     extra["youtubeLinks"].append(_parse_label_url(v))
        elif k == "audio":       extra["audioLinks"].append(_parse_label_url(v))
    return extra


def parse_cho_metadata(content: str) -> Dict[str, object]:
    """Extrae metadata básica + flags multimedia de un .cho."""
    def get(key: str) -> str:
        m = re.search(r"\{\s*" + key + r"\s*:\s*(.*?)\s*\}", content, re.IGNORECASE)
        return m.group(1).strip() if m else ""

    capo_raw = get("capo")
    extra = parse_extra_meta(content)
    return {
        "title": get("title"),
        "artist": get("artist") or get("author"),
        "key": get("key"),
        "capo": int(capo_raw) if capo_raw.isdigit() else 0,
        "has_todo": bool(TODO_REGEX.search(content)),
        "has_chord_review": bool(CHORD_REVIEW_REGEX.search(content)),
        "has_video": bool(extra["videoEmbed"]),
        "youtube_count": len(extra["youtubeLinks"]),
        "audio_count": len(extra["audioLinks"]),
        "rhythm": extra["rhythm"],
        "album": extra["album"],
        "liturgicalTime": extra["liturgicalTime"],
        "source": extra["source"],
        "videoEmbed": extra["videoEmbed"],
        "youtubeLinks": extra["youtubeLinks"],
        "audioLinks": extra["audioLinks"],
        "comment": extra["comment"],
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
                "has_chord_review": meta.get("has_chord_review", False),
                "has_video": meta.get("has_video", False),
                "youtube_count": meta.get("youtube_count", 0),
                "audio_count": meta.get("audio_count", 0),
                "rhythm": meta.get("rhythm", ""),
                "album": meta.get("album", ""),
                "error": meta_err,
            })
    return out


# ─────────── LaTeX (input/*.tex) ─────────── #

_latex_cache: Dict[str, object] = {"items": None, "snapshot": None}


def _latex_snapshot() -> str:
    """Devuelve una "huella" de los .tex (paths + mtimes) para invalidar cache."""
    if not lx.INPUT_DIR.exists():
        return ""
    parts: List[str] = []
    for cat in sorted(lx.INPUT_DIR.iterdir()):
        if not cat.is_dir() or cat.name == "processed":
            continue
        for tex in sorted(cat.glob("*.tex")):
            parts.append(f"{tex.name}:{int(tex.stat().st_mtime)}:{tex.stat().st_size}")
    return "|".join(parts)


def load_latex_items(force: bool = False) -> List[dict]:
    snap = _latex_snapshot()
    if not force and _latex_cache["items"] is not None and _latex_cache["snapshot"] == snap:
        return _latex_cache["items"]  # type: ignore
    items = lx.scan_latex_files(include_parsed=False)
    _latex_cache["items"] = items
    _latex_cache["snapshot"] = snap
    return items


def find_repo_match(title: str, repo_index: Dict[str, dict]) -> Optional[dict]:
    return best_match(title_keys(title), repo_index)


def build_repo_title_index(repo_songs: List[dict]) -> Dict[str, dict]:
    idx: Dict[str, dict] = {}
    for r in repo_songs:
        for k in title_keys(r["title"]):
            if k:
                idx.setdefault(k, r)
    return idx


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
    # Contador por sección para asignar position_in_section (1-based) — usado
    # como sugerencia de número de archivo al importar.
    pos_by_section: Dict[str, int] = {}
    for i, s in enumerate(raw_songs):
        letter = d2c.section_letter(s["section"])
        pos_by_section[letter or ""] = pos_by_section.get(letter or "", 0) + 1
        indexed.append({
            "id": i,
            "title_raw": s["title_raw"],
            "section": s["section"],
            "section_letter": letter,
            "position_in_section": pos_by_section[letter or ""],
            "_song": s,
        })
    _docx_cache["songs"] = indexed
    _docx_cache["mtime"] = mtime
    return indexed


def first_free_number(folder: Path, start: int = 1) -> int:
    """Devuelve el primer número de slot libre en la carpeta (busca huecos)."""
    used = set()
    if folder.exists():
        for f in folder.iterdir():
            m = re.match(r"(\d+)\.", f.name)
            if m:
                try:
                    used.add(int(m.group(1)))
                except ValueError:
                    pass
    n = start
    while n in used:
        n += 1
    return n


def preferred_number(folder: Path, hint: Optional[int] = None) -> int:
    """Si el número 'hint' está libre, lo usa. Si no, primer hueco libre desde 1."""
    if isinstance(hint, int) and hint > 0:
        if not folder.exists():
            return hint
        used = {int(m.group(1)) for f in folder.iterdir()
                if (m := re.match(r"(\d+)\.", f.name))}
        if hint not in used:
            return hint
    return first_free_number(folder)


def docx_song_to_dict(s: dict, conv: dict, include_body: bool = False) -> dict:
    out = {
        "id": s["id"],
        "title_raw": s["title_raw"],
        "title": conv["title"],
        "section": s["section"],
        "section_letter": s["section_letter"],
        "position_in_section": s.get("position_in_section"),
        "key": conv.get("key"),
        "capo": conv.get("capo"),
        "warnings": conv.get("warnings", []),
        "slug": conv.get("slug"),
    }
    if include_body:
        out["content"] = render_cho_with_todo(conv)
    return out


# Notas españolas que el cantoral DOCX a veces dejó en MAYÚSCULAS porque
# se confundieron con acordes. Si aparecen como palabra suelta dentro de la
# letra (NO dentro de [acordes]), las pasamos a minúsculas.
_NOTE_WORDS_RE = re.compile(r"\b(DO|RE|MI|FA|SOL|LA|SI)\b")


def _downcase_note_words_in_lyrics(body: str) -> str:
    """Para cada línea, baja a minúsculas las palabras DO/RE/MI/FA/SOL/LA/SI
    SOLO en el texto fuera de los corchetes [acorde]. Si la línea entera
    está en MAYÚSCULAS (estilo estribillo), no la toca."""
    out = []
    for ln in body.split("\n"):
        # Extraer solo la parte de letra (fuera de corchetes) para decidir
        lyric_only = re.sub(r"\[[^\]]*\]", "", ln)
        # Letras (sin números/símbolos)
        letters = [ch for ch in lyric_only if ch.isalpha()]
        if not letters:
            out.append(ln)
            continue
        # Si TODO el texto de letra es mayúsculas → no tocar (es estilo intencional)
        if all(ch == ch.upper() for ch in letters):
            out.append(ln)
            continue
        # Reemplazar palabras-nota solo en el texto fuera de [...]
        parts = re.split(r"(\[[^\]]*\])", ln)
        for i, p in enumerate(parts):
            if p.startswith("["):
                continue
            parts[i] = _NOTE_WORDS_RE.sub(lambda m: m.group(1).lower(), p)
        out.append("".join(parts))
    return "\n".join(out)


def render_cho_with_todo(conv: dict) -> str:
    """Render del .cho con la línea TO DO al principio."""
    header_lines = [TODO_COMMENT_LINE, f"{{title: {conv['title']}}}"]
    if conv.get("key"):
        header_lines.append(f"{{key: {conv['key']}}}")
    if conv.get("capo"):
        header_lines.append(f"{{capo: {conv['capo']}}}")
    body = _downcase_note_words_in_lyrics(conv["body"])
    return "\n".join(header_lines) + "\n\n" + body + "\n"


# ─────────── Ignorados (nunca importar) ─────────── #

def load_ignored() -> dict:
    """Devuelve {title_raw: {title, section, archived_at}} de las canciones archivadas."""
    if not IGNORED_FILE.exists():
        return {}
    try:
        return json.loads(IGNORED_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_ignored(ignored: dict) -> None:
    IGNORED_FILE.write_text(
        json.dumps(ignored, ensure_ascii=False, indent=2), encoding="utf-8"
    )


@app.route("/api/docx/ignore", methods=["POST"])
def api_docx_ignore():
    """Archiva una canción del docx (nunca mostrar para importar)."""
    data = request.get_json(silent=True) or {}
    docx_id = data.get("docx_id")
    if docx_id is None:
        abort(400, "Falta docx_id")
    songs = load_docx_songs()
    song = next((s for s in songs if s["id"] == int(docx_id)), None)
    if not song:
        abort(404, "Canción no encontrada en el docx")
    conv = d2c.convert_song(song["_song"])
    ignored = load_ignored()
    ignored[song["title_raw"]] = {
        "title": conv["title"],
        "section": song["section"],
        "section_letter": song["section_letter"],
        "archived_at": datetime.now().isoformat(timespec="seconds"),
    }
    save_ignored(ignored)
    return jsonify({"ok": True, "title_raw": song["title_raw"]})


@app.route("/api/docx/ignore/<path:title_raw>", methods=["DELETE"])
def api_docx_ignore_delete(title_raw: str):
    """Restaura una canción archivada (vuelve a aparecer en la lista de importar)."""
    ignored = load_ignored()
    if title_raw not in ignored:
        abort(404, "No estaba archivada")
    del ignored[title_raw]
    save_ignored(ignored)
    return jsonify({"ok": True})


@app.route("/api/docx/ignored")
def api_docx_ignored_list():
    ignored = load_ignored()
    items = [{"title_raw": k, **v} for k, v in ignored.items()]
    items.sort(key=lambda x: x.get("section_letter", "") + x.get("title", ""))
    return jsonify({"ignored": items})


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
    latex_items = load_latex_items()

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

    # Índice latex por título (para detectar duplicados desde el repo / docx)
    latex_index: Dict[str, dict] = {}
    for lt in latex_items:
        for k in title_keys(lt["title"]):
            latex_index.setdefault(k, lt)

    # Marcar repo_songs con si está en docx y/o en LaTeX
    matched_docx_ids: set = set()
    matched_latex_ids: set = set()
    matched_doce_ids: set = set()
    for r in repo_songs:
        match = best_match(title_keys(r["title"]), docx_index)
        if match:
            r["in_docx"] = True
            r["docx_id"] = match["id"]
            matched_docx_ids.add(match["id"])
        else:
            r["in_docx"] = False
            r["docx_id"] = None
        lmatch = best_match(title_keys(r["title"]), latex_index)
        if lmatch:
            r["in_latex"] = True
            r["latex_id"] = lmatch["id"]
            r["latex_title"] = lmatch["title"]
            matched_latex_ids.add(lmatch["id"])
        else:
            r["in_latex"] = False
            r["latex_id"] = None
        # doceacordes (sólo el mejor match, alto score)
        doce_id = da.find_best_id(r["title"], r.get("artist", ""))
        if doce_id:
            r["in_doce"] = True
            r["doce_id"] = doce_id
            matched_doce_ids.add(doce_id)
        else:
            r["in_doce"] = False
            r["doce_id"] = None

    # Canciones del docx que NO están en repo (excluidas las archivadas)
    ignored = load_ignored()
    missing = []
    for s in docx_songs:
        if s["id"] in matched_docx_ids:
            continue
        if s["title_raw"] in ignored:
            continue
        conv = docx_convs[s["id"]]
        # ¿Está disponible esta misma canción en LaTeX? Si sí, avisamos y damos
        # prioridad a la versión LaTeX (el usuario debería importar de LaTeX, no de docx).
        latex_alt = best_match(title_keys(conv["title"]), latex_index)
        # Candidatos doceacordes (top 3 difuso)
        doce_cands = da.find_candidates(conv["title"], top=3)
        missing.append({
            "docx_id": s["id"],
            "title": conv["title"],
            "title_raw": s["title_raw"],
            "section_letter": s["section_letter"],
            "position_in_section": s.get("position_in_section"),
            "key": conv.get("key"),
            "capo": conv.get("capo"),
            "warnings": conv.get("warnings", []),
            "latex_available": bool(latex_alt),
            "latex_id": latex_alt["id"] if latex_alt else None,
            "doce_available": bool(doce_cands),
            "doce_candidates": doce_cands,
        })

    # Contadores
    todo_count = sum(1 for r in repo_songs if r["has_todo"])
    chord_review_count = sum(1 for r in repo_songs if r["has_chord_review"])
    latex_total = len(latex_items)
    latex_only_new = sum(1 for lt in latex_items if lt["id"] not in matched_latex_ids)
    with_youtube = sum(1 for r in repo_songs if r.get("youtube_count", 0) > 0 or r.get("has_video"))
    with_audio = sum(1 for r in repo_songs if r.get("audio_count", 0) > 0)

    return jsonify({
        "categories": list_categories(),
        "repo_songs": repo_songs,
        "missing_from_repo": missing,
        "stats": {
            "repo_total": len(repo_songs),
            "docx_total": len(docx_songs),
            "todo_count": todo_count,
            "chord_review_count": chord_review_count,
            "missing_from_repo": len(missing),
            "only_in_repo": sum(1 for r in repo_songs if not r["in_docx"]),
            "latex_total": latex_total,
            "latex_new": latex_only_new,
            "latex_matches_repo": len(matched_latex_ids),
            "with_youtube": with_youtube,
            "with_audio": with_audio,
            "without_youtube": len(repo_songs) - with_youtube,
            "without_audio": len(repo_songs) - with_audio,
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


def _sanitize_directive_value(s: str) -> str:
    """Limpia caracteres que romperían el parseo del .cho.
    '}' cierra la directive; lo reemplaza por ')'.
    '\\n' la divide en varias líneas; lo aplana a espacio.
    """
    if not s:
        return ""
    return str(s).replace("}", ")").replace("\n", " ").replace("\r", " ").strip()


def _sanitize_link_label(s: str) -> str:
    """Para labels: además del cleanup base, quitar '|' que es nuestro separador."""
    return _sanitize_directive_value(s).replace("|", "/").strip()


def _render_meta_directive_lines(meta: Dict[str, object]) -> List[str]:
    """Genera las líneas de custom directives a partir de un dict de meta."""
    lines: List[str] = []
    if meta.get("rhythm"):
        lines.append(f"{{ritmo: {_sanitize_directive_value(meta['rhythm'])}}}")
    if meta.get("album"):
        lines.append(f"{{album: {_sanitize_directive_value(meta['album'])}}}")
    if meta.get("liturgicalTime"):
        lines.append(f"{{tiempo: {_sanitize_directive_value(meta['liturgicalTime'])}}}")
    if meta.get("source"):
        lines.append(f"{{fuente: {_sanitize_directive_value(meta['source'])}}}")
    if meta.get("videoEmbed"):
        lines.append(f"{{video: {_sanitize_directive_value(meta['videoEmbed'])}}}")
    for yt in (meta.get("youtubeLinks") or []):
        label = _sanitize_link_label(yt.get("label") or "")
        url = _sanitize_directive_value(yt.get("url") or "")
        if not url:
            continue
        lines.append(f"{{youtube: {label} | {url}}}" if label else f"{{youtube: {url}}}")
    for au in (meta.get("audioLinks") or []):
        label = _sanitize_link_label(au.get("label") or "")
        url = _sanitize_directive_value(au.get("url") or "")
        if not url:
            continue
        lines.append(f"{{audio: {label} | {url}}}" if label else f"{{audio: {url}}}")
    if meta.get("comment"):
        lines.append(f"{{comentario: {_sanitize_directive_value(meta['comment'])}}}")
    return lines


_META_DIRECTIVE_RE = re.compile(
    r"^[ \t]*\{\s*(ritmo|album|tiempo|fuente|video|youtube|audio|comentario)\s*:[^}]*\}[ \t]*\r?\n?",
    re.IGNORECASE | re.MULTILINE,
)


def _replace_meta_block(content: str, new_lines: List[str]) -> str:
    """Borra todas las custom-meta directives existentes e inserta las nuevas
    justo después del último directive de cabecera (title/artist/key/capo/comment)."""
    stripped = _META_DIRECTIVE_RE.sub("", content)
    if not new_lines:
        return stripped
    lines = stripped.split("\n")
    insert_at = 0
    for i, ln in enumerate(lines):
        if re.match(r"\s*\{\s*(title|artist|author|key|capo|comment)\s*:", ln, re.IGNORECASE):
            insert_at = i + 1
        elif ln.strip() == "":
            break
        else:
            break
    new = lines[:insert_at] + new_lines + lines[insert_at:]
    return "\n".join(new)


@app.route("/api/song/meta", methods=["PUT"])
def api_song_meta_put():
    """Actualiza SOLO las custom directives multimedia/meta del .cho.

    Body: {rhythm, album, liturgicalTime, source, videoEmbed,
           youtubeLinks: [{label, url}], audioLinks: [{label, url}], comment}
    """
    path_str = request.args.get("path", "")
    if not path_str:
        abort(400, "Falta 'path'")
    p = safe_relpath(path_str)
    if not p.exists():
        abort(404, "No existe")
    body = request.get_json(silent=True) or {}
    new_lines = _render_meta_directive_lines(body)
    original = p.read_text(encoding="utf-8")
    new_content = _replace_meta_block(original, new_lines)
    if new_content == original:
        return jsonify({"ok": True, "path": str(p.relative_to(REPO_DIR)),
                        "meta": parse_cho_metadata(new_content), "unchanged": True})
    backup_file(p)
    p.write_text(new_content, encoding="utf-8")
    return jsonify({"ok": True, "path": str(p.relative_to(REPO_DIR)),
                    "meta": parse_cho_metadata(new_content)})


@app.route("/api/song/meta/quick-add", methods=["POST"])
def api_song_meta_quick_add():
    """Atajo: añade UN link (youtube o audio) sin tener que mandar todo el meta.

    Body: {path, type: 'youtube'|'audio', label, url, prepend?: bool}
    """
    body = request.get_json(silent=True) or {}
    path_str = body.get("path", "")
    link_type = (body.get("type") or "").lower()
    label = (body.get("label") or "").strip()
    url = (body.get("url") or "").strip()
    if not path_str or link_type not in ("youtube", "audio") or not url:
        abort(400, "Faltan campos (path, type=youtube|audio, url)")
    p = safe_relpath(path_str)
    if not p.exists():
        abort(404, "No existe")
    content = p.read_text(encoding="utf-8")
    meta = parse_cho_metadata(content)
    key = "youtubeLinks" if link_type == "youtube" else "audioLinks"
    entry = {"label": label, "url": url}
    if body.get("prepend"):
        meta[key] = [entry] + list(meta.get(key) or [])
    else:
        meta[key] = list(meta.get(key) or []) + [entry]
    new_lines = _render_meta_directive_lines(meta)
    new_content = _replace_meta_block(content, new_lines)
    backup_file(p)
    p.write_text(new_content, encoding="utf-8")
    return jsonify({"ok": True, "meta": parse_cho_metadata(new_content)})


@app.route("/api/song/new", methods=["POST"])
def api_song_new():
    body = request.get_json(silent=True) or {}
    cat_letter = (body.get("category") or "").upper()
    title = (body.get("title") or "").strip()
    artist = (body.get("artist") or "").strip()
    key = (body.get("key") or "").strip()
    capo = body.get("capo") or 0
    mode = body.get("mode") or "blank"
    user_content = body.get("content") or ""
    if not cat_letter or not title:
        abort(400, "Falta category o title")
    cat = next((c for c in list_categories() if c["letter"] == cat_letter), None)
    if not cat:
        abort(404, "Categoría no encontrada")
    folder = SONGS_DIR / cat["folder"]
    folder.mkdir(exist_ok=True)
    num = d2c.next_song_number(folder)
    slug = d2c.slugify(d2c.pretty_title_case(title))
    fname = f"{num:02d}.{slug}.cho"
    fpath = folder / fname
    if fpath.exists():
        abort(409, "Ya existe un archivo con ese nombre")

    if mode == "chordpro" and user_content.strip():
        # Limpieza mínima: asegurar que tiene la línea TO DO al principio
        content = user_content
        if not TODO_REGEX.search(content):
            content = TODO_COMMENT_LINE + "\n" + content
        # Asegurar el title si no está
        if not re.search(r"\{\s*title", content, re.IGNORECASE):
            content = content.rstrip() + "\n"
            content = TODO_COMMENT_LINE + "\n" + f"{{title: {title}}}\n" + content.lstrip(TODO_COMMENT_LINE).lstrip("\n")
    else:
        # Modo blank
        header = [TODO_COMMENT_LINE, f"{{title: {title}}}"]
        if artist: header.append(f"{{artist: {artist}}}")
        if key: header.append(f"{{key: {key}}}")
        if capo: header.append(f"{{capo: {capo}}}")
        body_text = "" if mode == "blank" else user_content
        content = "\n".join(header) + "\n\n" + body_text

    fpath.write_text(content, encoding="utf-8")
    return jsonify({
        "ok": True,
        "path": str(fpath.relative_to(REPO_DIR)),
        "filename": fname,
    })


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
        # Sugerencia de número: posición de la canción dentro de su sección
        # en el DOCX. Si está libre se respeta; si no, primer hueco libre.
        num = preferred_number(folder, s.get("position_in_section"))
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


# ─────────── API: LaTeX (input/*.tex) ─────────── #


@app.route("/api/latex/list")
def api_latex_list():
    """Lista todos los .tex de scripts/input/ y los enriquece con la coincidencia
    en el repo (si la hay) para poder elegir entre crear nueva o sobrescribir.
    """
    force = request.args.get("force") == "1"
    latex_items = load_latex_items(force=force)
    repo_songs = list_repo_songs()
    repo_index = build_repo_title_index(repo_songs)

    out = []
    for lt in latex_items:
        match = find_repo_match(lt["title"], repo_index)
        target_letter = lt.get("category_letter")
        # Si no tenemos mapeo de carpeta pero hay match, usamos la categoría del match
        if not target_letter and match:
            target_letter = match["category_letter"]
        item = dict(lt)
        item["repo_match"] = None
        if match:
            item["repo_match"] = {
                "path": match["path"],
                "filename": match["filename"],
                "number": match["number"],
                "category_letter": match["category_letter"],
                "category_folder": match["category_folder"],
                "title": match["title"],
            }
        item["target_letter"] = target_letter
        out.append(item)
    # Categorías existentes para que el cliente sepa los nombres legibles
    cats = list_categories()
    return jsonify({"items": out, "categories": cats})


@app.route("/api/latex/preview")
def api_latex_preview():
    rel = request.args.get("id", "")
    if not rel:
        abort(400, "Falta id")
    try:
        p = lx.resolve_tex_path(rel)
    except (ValueError, FileNotFoundError) as e:
        abort(404, str(e))
    parsed = lx.parse_latex_song(p)
    raw_tex = p.read_text(encoding="utf-8")
    return jsonify({
        "id": rel,
        "filename": p.name,
        "latex_raw": raw_tex,
        "parsed": parsed,
        "content": lx.render_latex_cho(parsed),
    })


@app.route("/api/latex/import", methods=["POST"])
def api_latex_import():
    """Importa los .tex elegidos. Cada item puede ser:
      - { "id": "scripts/input/.../foo.tex", "mode": "new", "category_letter": "A", "slug": "..." }
      - { "id": "...", "mode": "overwrite", "repo_path": "songs/A. .../03.foo.cho" }
    """
    body = request.get_json(silent=True) or {}
    items = body.get("items") or []
    move_processed = body.get("move_to_processed", True)
    if not isinstance(items, list) or not items:
        abort(400, "Falta items")
    results = []
    for it in items:
        rel = it.get("id")
        mode = (it.get("mode") or "new").lower()
        try:
            tex_path = lx.resolve_tex_path(rel)
            parsed = lx.parse_latex_song(tex_path)
            content = lx.render_latex_cho(parsed)

            if mode == "overwrite":
                repo_path_str = it.get("repo_path")
                if not repo_path_str:
                    raise ValueError("Falta repo_path para overwrite")
                target = safe_relpath(repo_path_str)
                if not target.exists():
                    raise FileNotFoundError(f"No existe destino: {repo_path_str}")
                backup_file(target)
                target.write_text(content, encoding="utf-8")
                final_path = target
                action = "overwritten"
            else:
                cat_letter = (it.get("category_letter") or "").upper()
                if not cat_letter:
                    raise ValueError("Falta category_letter")
                cat = next((c for c in list_categories() if c["letter"] == cat_letter), None)
                if not cat:
                    raise ValueError(f"Categoría {cat_letter} no encontrada")
                folder = SONGS_DIR / cat["folder"]
                folder.mkdir(exist_ok=True)
                slug = it.get("slug") or parsed.get("suggested_slug") or lx.slugify(parsed["title"])
                slug = re.sub(r"[^a-z0-9_]+", "_", slug.lower()).strip("_") or "cancion"
                num = it.get("number")
                if not (isinstance(num, int) and num > 0):
                    num = d2c.next_song_number(folder)
                fname = f"{num:02d}.{slug}.cho"
                fpath = folder / fname
                if fpath.exists():
                    raise FileExistsError(f"Ya existe {fname}")
                fpath.write_text(content, encoding="utf-8")
                final_path = fpath
                action = "created"

            moved_to = None
            if move_processed:
                moved = lx.move_to_processed(tex_path)
                moved_to = str(moved.relative_to(REPO_DIR))
            results.append({
                "id": rel,
                "ok": True,
                "action": action,
                "path": str(final_path.relative_to(REPO_DIR)),
                "moved_to": moved_to,
                "warnings": parsed.get("unknown_chords", []),
            })
        except Exception as e:
            results.append({"id": rel, "ok": False, "error": str(e)})
    # Invalidar cache
    _latex_cache["snapshot"] = None
    return jsonify({"results": results})


@app.route("/api/latex/rescan", methods=["POST"])
def api_latex_rescan():
    _latex_cache["snapshot"] = None
    load_latex_items(force=True)
    return jsonify({"ok": True})


def _apply_status_to_content(content: str, status: Optional[str]) -> str:
    """Quita ambos markers de revisión e inserta el nuevo si procede."""
    lines = content.split('\n')
    # Strip ambos markers
    lines = [ln for ln in lines if not (
        re.search(r'\{\s*comment\s*:[^}]*\bTO\s+DO\b[^}]*\}', ln, re.IGNORECASE) or
        re.search(r'\{\s*comment\s*:[^}]*♩\s*REVISAR\s*ACORDES[^}]*\}', ln, re.IGNORECASE)
    )]
    if status in ("revisar", "revisar_acordes"):
        marker = TODO_COMMENT_LINE if status == "revisar" else CHORD_REVIEW_COMMENT_LINE
        # Insertar después del último metadato (title/artist/key/capo/comment al inicio)
        insert_at = 0
        for i, ln in enumerate(lines):
            if re.match(r'^\{(title|comment|artist|author|key|capo)', ln, re.IGNORECASE):
                insert_at = i + 1
            elif ln.strip() == '' and insert_at > 0:
                break
        lines.insert(insert_at, marker)
    return '\n'.join(lines)


@app.route("/api/songs/bulk-status", methods=["POST"])
def api_songs_bulk_status():
    """Establece el estado de revisión de varias canciones de golpe."""
    data = request.get_json(silent=True) or {}
    paths = data.get("paths", [])
    status = data.get("status")  # "revisar" | "revisar_acordes" | None
    if status not in ("revisar", "revisar_acordes", None):
        abort(400, "status debe ser 'revisar', 'revisar_acordes' o null")
    results = []
    for path_str in paths:
        try:
            p = safe_relpath(path_str)
            content = p.read_text(encoding="utf-8")
            new_content = _apply_status_to_content(content, status)
            if new_content != content:
                backup_file(p)
                p.write_text(new_content, encoding="utf-8")
            results.append({"path": path_str, "ok": True})
        except Exception as e:
            results.append({"path": path_str, "ok": False, "error": str(e)})
    return jsonify({"ok": True, "results": results})


# ─────────── API: doceacordes.es ─────────── #


@app.route("/api/doce/list")
def api_doce_list():
    """Lista todas las canciones del índice JSON, enriquecidas con match en repo."""
    items = da.doce_items()
    repo_songs = list_repo_songs()
    # Índice repo por título normalizado para detectar duplicados rápido
    repo_by_norm: Dict[str, dict] = {}
    for r in repo_songs:
        for k in title_keys(r["title"]):
            repo_by_norm.setdefault(k, r)

    out = []
    for entry in items:
        r = best_match(title_keys(entry["title"]), repo_by_norm)
        out.append({
            "id": entry["id"],
            "title": entry.get("title", ""),
            "artist": entry.get("artist", ""),
            "subtitle": entry.get("subtitle", ""),
            "url": entry.get("url", ""),
            "in_repo": bool(r),
            "repo_path": r["path"] if r else None,
            "repo_category": r["category_letter"] if r else None,
        })
    return jsonify({"items": out, "categories": list_categories()})


@app.route("/api/doce/preview")
def api_doce_preview():
    doce_id = request.args.get("id", "").strip()
    if not doce_id:
        abort(400, "Falta id")
    force = request.args.get("force") == "1"
    include_meta = request.args.get("meta", "1") != "0"
    try:
        content, meta = da.fetch_and_adapt(
            doce_id, use_cache=not force, include_meta=include_meta,
        )
    except Exception as e:
        abort(502, f"Error descargando doceacordes id={doce_id}: {e}")
    entry = da.get_entry(doce_id) or {}
    # Sugerir slug y número
    suggested_slug = d2c.slugify(d2c.pretty_title_case(meta.get("title") or entry.get("title", "")))
    suggested_number = None
    cat_letter = request.args.get("category", "").upper().strip()
    hint_raw = request.args.get("position_hint", "").strip()
    hint = int(hint_raw) if hint_raw.isdigit() else None
    if cat_letter:
        cat = next((c for c in list_categories() if c["letter"] == cat_letter), None)
        if cat:
            suggested_number = preferred_number(SONGS_DIR / cat["folder"], hint)
    extras = parse_extra_meta(content)
    return jsonify({
        "id": doce_id,
        "entry": entry,
        "content": content,
        "meta": meta,
        "extras": extras,
        "suggested_slug": suggested_slug,
        "suggested_number": suggested_number,
    })


@app.route("/api/doce/suggest-number")
def api_doce_suggest_number():
    """Devuelve un número sugerido (primer hueco libre, o el hint si está libre)."""
    cat_letter = request.args.get("category", "").upper().strip()
    cat = next((c for c in list_categories() if c["letter"] == cat_letter), None)
    if not cat:
        abort(404, "Categoría no encontrada")
    folder = SONGS_DIR / cat["folder"]
    hint_raw = request.args.get("position_hint", "").strip()
    hint = int(hint_raw) if hint_raw.isdigit() else None
    return jsonify({"category": cat_letter, "next_number": preferred_number(folder, hint)})


@app.route("/api/doce/import", methods=["POST"])
def api_doce_import():
    """Importa canciones desde doceacordes.es.

    Body: {items: [{doce_id, category_letter, number?, slug?, force_refresh?}]}
    """
    body = request.get_json(silent=True) or {}
    items = body.get("items") or []
    if not isinstance(items, list) or not items:
        abort(400, "Falta items")
    results = []
    for it in items:
        doce_id = str(it.get("doce_id") or "").strip()
        cat_letter = (it.get("category_letter") or "").upper().strip()
        force = bool(it.get("force_refresh"))
        try:
            if not doce_id:
                raise ValueError("Falta doce_id")
            if not cat_letter:
                raise ValueError("Falta category_letter")
            cat = next((c for c in list_categories() if c["letter"] == cat_letter), None)
            if not cat:
                raise ValueError(f"Categoría {cat_letter} no encontrada")
            folder = SONGS_DIR / cat["folder"]
            folder.mkdir(exist_ok=True)

            include_meta = it.get("include_meta", True)
            content, meta = da.fetch_and_adapt(
                doce_id, use_cache=not force, include_meta=include_meta,
            )

            title = meta.get("title") or (da.get_entry(doce_id) or {}).get("title") or f"cancion-{doce_id}"
            slug = it.get("slug") or d2c.slugify(d2c.pretty_title_case(title))
            slug = re.sub(r"[^a-z0-9_]+", "_", slug.lower()).strip("_") or "cancion"

            num = it.get("number")
            if not (isinstance(num, int) and num > 0):
                hint = it.get("position_hint")
                hint_int = hint if (isinstance(hint, int) and hint > 0) else None
                num = preferred_number(folder, hint_int)
            fname = f"{num:02d}.{slug}.cho"
            fpath = folder / fname
            if fpath.exists():
                raise FileExistsError(f"Ya existe {fname}")
            fpath.write_text(content, encoding="utf-8")
            results.append({
                "doce_id": doce_id,
                "ok": True,
                "path": str(fpath.relative_to(REPO_DIR)),
                "title": title,
            })
        except Exception as e:
            results.append({"doce_id": doce_id, "ok": False, "error": str(e)})
    return jsonify({"results": results})


# ─────────── API: reordenar y build-json ─────────── #


@app.route("/api/category/slots")
def api_category_slots():
    """Devuelve la representación 'con huecos' de una categoría: lista de
    `{number, filename}` donde filename es null en los slots vacíos."""
    letter = request.args.get("category", "").upper().strip()
    cat = next((c for c in list_categories() if c["letter"] == letter), None)
    if not cat:
        abort(404, "Categoría no encontrada")
    folder = SONGS_DIR / cat["folder"]
    by_num: Dict[int, str] = {}
    unnumbered: List[str] = []
    for p in sorted(folder.glob("*.cho")):
        m = re.match(r"(\d+)\.", p.name)
        if m:
            by_num[int(m.group(1))] = p.name
        else:
            unnumbered.append(p.name)
    slots: List[dict] = []
    if by_num:
        max_num = max(by_num)
        for n in range(1, max_num + 1):
            slots.append({"number": n, "filename": by_num.get(n)})
    # Sin numerar al final
    for fn in unnumbered:
        slots.append({"number": None, "filename": fn})
    return jsonify({"category": letter, "slots": slots})


@app.route("/api/reorder", methods=["POST"])
def api_reorder():
    """Reordena una categoría aceptando huecos.

    Body: {category: "A", order: [<filename> | null, ...]}
      - Cada índice i (1-based) es el número que tendrá esa canción.
      - `null` = slot vacío (no se asigna ningún archivo a ese número).
      - Compatible con el formato antiguo `order: [filename, ...]` (sin nulls).
    """
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
    # Validar: todos los filenames no-null deben existir y ser únicos
    seen = set()
    for item in order:
        if item is None:
            continue
        if not isinstance(item, str):
            abort(400, f"Item inválido: {item!r}")
        if item not in current:
            abort(400, f"Archivo no existe: {item}")
        if item in seen:
            abort(400, f"Archivo duplicado en order: {item}")
        seen.add(item)
    # Crítico: el order debe cubrir TODOS los .cho de la carpeta, si no
    # quedarían archivos con número duplicado tras el rename.
    missing = set(current.keys()) - seen
    if missing:
        abort(400, f"Faltan archivos en order: {sorted(missing)}")
    # Quitar trailing nulls (huecos al final no tienen sentido)
    while order and order[-1] is None:
        order.pop()
    if not order:
        abort(400, "order vacío")
    # Backup
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_folder = BACKUP_DIR / ts / cat["folder"]
    backup_folder.mkdir(parents=True, exist_ok=True)
    for p in folder.glob("*.cho"):
        shutil.copy2(p, backup_folder / p.name)
    # Paso 1: mover todo a temporales
    tmp_prefix = f".reorder-{int(time.time())}-"
    temp_pairs: List[tuple] = []  # (slot_number, tmp_path, base_name)
    for idx, fn in enumerate(order, start=1):
        if fn is None:
            continue
        p = folder / fn
        base = re.sub(r"^\d+\.", "", fn)
        tp = folder / (tmp_prefix + str(idx) + "-" + base)
        p.rename(tp)
        temp_pairs.append((idx, tp, base))
    # Paso 2: renombrar al número final
    final_names: List[Optional[str]] = [None] * len(order)
    for slot, tp, base in temp_pairs:
        final_name = f"{slot:02d}.{base}"
        (folder / final_name).exists()  # no debería existir; backup ya hecho
        tp.rename(folder / final_name)
        final_names[slot - 1] = final_name
    return jsonify({"ok": True, "category": letter, "new_order": final_names})


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


# ─────────── API: Backups ─────────── #

def _list_backup_sessions() -> list:
    """Devuelve lista de sesiones de backup ordenadas de más reciente a más antigua."""
    if not BACKUP_DIR.exists():
        return []
    sessions = []
    for session_dir in sorted(BACKUP_DIR.iterdir(), reverse=True):
        if not session_dir.is_dir():
            continue
        files = [str(f.relative_to(session_dir)) for f in session_dir.rglob("*") if f.is_file()]
        size = sum(f.stat().st_size for f in session_dir.rglob("*") if f.is_file())
        # Parsear timestamp del nombre: YYYYMMDD-HHMMSS
        ts = session_dir.name
        try:
            dt = datetime.strptime(ts, "%Y%m%d-%H%M%S")
            ts_display = dt.strftime("%d/%m/%Y %H:%M:%S")
        except ValueError:
            ts_display = ts
        sessions.append({
            "id": ts,
            "display": ts_display,
            "file_count": len(files),
            "files": sorted(files),
            "size_bytes": size,
        })
    return sessions


@app.route("/api/backups")
def api_backups_list():
    sessions = _list_backup_sessions()
    total = sum(s["size_bytes"] for s in sessions)
    return jsonify({"sessions": sessions, "total_size_bytes": total})


@app.route("/api/backups/<session_id>", methods=["DELETE"])
def api_backup_delete(session_id: str):
    # Validar que el ID solo tenga caracteres seguros
    if not re.match(r"^\d{8}-\d{6}$", session_id):
        abort(400, "ID de sesión no válido")
    target = BACKUP_DIR / session_id
    if not target.exists() or not target.is_dir():
        abort(404, "Sesión no encontrada")
    shutil.rmtree(target)
    return jsonify({"ok": True, "deleted": session_id})


@app.route("/api/backups/cleanup", methods=["POST"])
def api_backups_cleanup():
    """Elimina sesiones antiguas, conservando las N más recientes."""
    data = request.get_json(silent=True) or {}
    keep = int(data.get("keep_last", 5))
    sessions = _list_backup_sessions()  # ya vienen de más reciente a más antigua
    to_delete = sessions[keep:]
    deleted = []
    for s in to_delete:
        target = BACKUP_DIR / s["id"]
        if target.exists():
            shutil.rmtree(target)
            deleted.append(s["id"])
    return jsonify({"ok": True, "deleted": deleted, "kept": min(keep, len(sessions))})


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
