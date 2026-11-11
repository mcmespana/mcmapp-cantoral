#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""API de la sección 🎄 Villancicos Solidarios del admin.

Se engancha al Flask de server.py con `register(app, srv)` (srv = el propio
módulo server, para reutilizar sus utilidades: listado del repo, backups,
cabecera de metadatos…). Va aparte para no engordar más server.py.

  GET  /api/villancicos/overview          canciones de Navidad (propias y
                                          prestadas) por subcategoría
  POST /api/villancicos/subcategory       {paths, subcategory}
  POST /api/song/also-in                  {path, category, subcategory?, remove?}
  GET  /api/villancicos/word/list         canciones del Word y si ya están
  GET  /api/villancicos/word/preview?id=  conversión + vista «como en el papel»
  POST /api/villancicos/word/import       {id, number, subcategory, content?}
  POST /api/villancicos/word/refresh      {url}: baja el Google Doc como .docx
  GET  /api/villancicos/pdf/index         cantoral de 2008: canciones por página
  GET  /api/villancicos/pdf/page/<n>      una página suelta del PDF
  POST /api/villancicos/mark              {path, source, subcategory}
  GET  /api/packs                         packs resueltos
  PUT  /api/packs/<slug>                  guarda (y renombra con {oldSlug})
  DELETE /api/packs/<slug>
  GET  /api/packs/<slug>/songs            .cho de cada canción (para imprimir)
  GET  /api/packs/<slug>/export?format=txt|md
"""
from __future__ import annotations

import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List

from flask import abort, jsonify, request

import chordpro as cp
import packs as pk
import villancicos_docx as vd

NAVIDAD = "navidad"


def register(app, srv) -> None:  # noqa: C901 — un sitio para todas las rutas

    # ─────────── Utilidades ─────────── #

    def categories() -> List[dict]:
        return srv.list_categories()

    def cat_by_key(key: str) -> dict:
        for c in categories():
            if c.get("indice_key") == key:
                return c
        abort(404, f"No existe la categoría «{key}»")

    def rows_with_keys() -> List[dict]:
        keys = {c["letter"]: c.get("indice_key") or "" for c in categories()}
        rows = srv.list_repo_songs()
        for r in rows:
            r["category_key"] = keys.get(r["category_letter"], "")
        return rows

    def write_meta(path: Path, **changes) -> bool:
        """Cambia campos meta de un .cho (con backup). True si cambió algo."""
        content = path.read_text(encoding="utf-8")
        meta = srv.parse_cho_metadata(content)
        meta.update(changes)
        new = srv._replace_meta_block(content, srv._render_meta_directive_lines(meta))
        if new == content:
            return False
        srv.backup_file(path)
        path.write_text(new, encoding="utf-8")
        return True

    def song_view(r: dict, home: bool) -> dict:
        also = next((a for a in r.get("alsoIn") or [] if a["category"] == NAVIDAD), None)
        return {
            "path": r["path"], "filename": r["filename"], "number": r["number"],
            "title": r["title"], "artist": r.get("artist", ""), "key": r.get("key", ""),
            "capo": r.get("capo", 0), "duration": r.get("duration", ""),
            "has_todo": r.get("has_todo", False), "has_chord_review": r.get("has_chord_review", False),
            "category_letter": r["category_letter"], "category_title": r["category_title"],
            "category_key": r.get("category_key", ""),
            "home": home,
            "subcategory": (r.get("subcategory") if home else (also or {}).get("subcategory")) or "",
            "alsoIn": r.get("alsoIn") or [],
        }

    # ─────────── Resumen ─────────── #

    @app.route("/api/villancicos/overview")
    def vill_overview():
        nav = cat_by_key(NAVIDAD)
        subs = nav.get("subcategories") or {}
        songs = []
        for r in rows_with_keys():
            if r["category_key"] == NAVIDAD:
                songs.append(song_view(r, True))
            elif any(a["category"] == NAVIDAD for a in r.get("alsoIn") or []):
                songs.append(song_view(r, False))
        counts: Dict[str, int] = {}
        for s in songs:
            k = s["subcategory"] if s["subcategory"] in subs else ""
            counts[k] = counts.get(k, 0) + 1
        return jsonify({
            "category": {"letter": nav["letter"], "title": nav["title"], "folder": nav["folder"]},
            "subcategories": [dict(v, slug=k) for k, v in sorted(subs.items(), key=lambda kv: kv[1]["order"])],
            "songs": songs,
            "counts": counts,
        })

    @app.route("/api/villancicos/subcategory", methods=["POST"])
    def vill_subcategory():
        """Pone la subcategoría. A las de Navidad, {subcategoria:}; a las que
        vienen de otra categoría, la de su {tambien_en: navidad/…}."""
        body = request.get_json(silent=True) or {}
        sub = cp.slugify_tag(body.get("subcategory") or "")
        nav_folder = cat_by_key(NAVIDAD)["folder"]
        changed = 0
        for path_str in body.get("paths") or []:
            p = srv.safe_relpath(path_str)
            if not p.exists():
                continue
            if p.parent.name == nav_folder:
                changed += write_meta(p, subcategory=sub)
            else:
                meta = srv.parse_cho_metadata(p.read_text(encoding="utf-8"))
                also = [a for a in meta.get("alsoIn") or [] if a["category"] != NAVIDAD]
                also.append({"category": NAVIDAD, **({"subcategory": sub} if sub else {})})
                changed += write_meta(p, alsoIn=also)
        return jsonify({"ok": True, "changed": changed})

    @app.route("/api/song/also-in", methods=["POST"])
    def song_also_in():
        """«También en»: añade o quita una categoría prestada. Sirve para traer
        una canción del cantoral normal a Navidad y para llevar una de Navidad
        a otra categoría, sin mover ni duplicar el .cho."""
        body = request.get_json(silent=True) or {}
        p = srv.safe_relpath(body.get("path") or "")
        if not p.exists():
            abort(404, "No existe")
        cat = cp.slugify_tag(body.get("category") or "")
        if not cat:
            abort(400, "Falta la categoría")
        target = cat_by_key(cat)
        if p.parent.name == target["folder"]:
            abort(400, "La canción ya es de esa categoría.")
        sub = cp.slugify_tag(body.get("subcategory") or "")
        meta = srv.parse_cho_metadata(p.read_text(encoding="utf-8"))
        also = [a for a in meta.get("alsoIn") or [] if a["category"] != cat]
        if not body.get("remove"):
            also.append({"category": cat, **({"subcategory": sub} if sub else {})})
        changed = write_meta(p, alsoIn=also)
        return jsonify({"ok": True, "changed": changed,
                        "meta": srv.parse_cho_metadata(p.read_text(encoding="utf-8"))})

    # ─────────── El Word de canciones nuevas ─────────── #

    def word_songs() -> List[vd.Song]:
        return vd.load_songs()

    def word_status(songs: List[vd.Song]) -> Dict[int, dict]:
        """Cada canción del Word: ¿ya está en el repo? Las de Navidad se
        reconocen por su {fuente: … (nº 19)} (aunque se cambie el título al
        revisarlas); el resto, por el título."""
        rows = rows_with_keys()
        by_num: Dict[int, dict] = {}
        for r in rows:
            if r["category_key"] != NAVIDAD:
                continue
            src = srv.parse_cho_metadata(Path(srv.REPO_DIR / r["path"]).read_text(encoding="utf-8")).get("source") or ""
            m = re.search(r"Villancicos Solidarios.*\(nº\s*(\d+)\)", src)
            if m:
                by_num[int(m.group(1))] = r
        index = pk.SongIndex(rows)
        out = {}
        for s in songs:
            r = by_num.get(s.number) if s.number is not None else None
            how = "fuente" if r else ""
            if r is None:
                cand, st = index.find(None, s.title)
                if cand is not None and st == "by_title":
                    r, how = cand, "titulo"
            if r is None:
                out[s.id] = {"status": "pending"}
            elif r["category_key"] == NAVIDAD:
                out[s.id] = {"status": "imported", "path": r["path"], "how": how}
            else:
                linked = any(a["category"] == NAVIDAD for a in r.get("alsoIn") or [])
                out[s.id] = {"status": "linked" if linked else "elsewhere", "path": r["path"],
                             "category_title": r["category_title"], "how": how}
        return out

    def suggest_number(s: vd.Song, pending_nums: set) -> int:
        folder = srv.SONGS_DIR / cat_by_key(NAVIDAD)["folder"]
        used = srv.used_numbers(folder)
        if s.number is not None and s.number not in used:
            return s.number
        # Sin número: detrás de todo, sin pisar las del Word que faltan ni las
        # del cantoral de 2008 (1-18 en el papel).
        reserved = set(range(1, 19)) | pending_nums
        n = 1
        while n in used or n in reserved:
            n += 1
        return n

    @app.route("/api/villancicos/word/list")
    def word_list():
        path = vd.find_docx()
        if path is None:
            return jsonify({"available": False, "songs": []})
        songs = word_songs()
        status = word_status(songs)
        pending_nums = {s.number for s in songs if s.number is not None and status[s.id]["status"] == "pending"}
        out = []
        for s in songs:
            conv = vd.converted(s)
            st = status[s.id]
            out.append({
                "id": s.id, "number": s.number, "title": s.title, "artist": s.artist,
                "key": conv["key"], "capo": conv["capo"], "warnings": conv["warnings"],
                **st,
                "suggested_number": suggest_number(s, pending_nums - {s.number}) if st["status"] == "pending" else None,
            })
        out.sort(key=lambda x: (x["number"] is None, x["number"] or 0, x["title"]))
        return jsonify({
            "available": True,
            "file": path.name,
            "modified": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="minutes"),
            "songs": out,
        })

    @app.route("/api/villancicos/word/preview")
    def word_preview():
        try:
            sid = int(request.args.get("id", ""))
        except ValueError:
            abort(400, "id")
        songs = {s.id: s for s in word_songs()}
        if sid not in songs:
            abort(404, "No está en el Word")
        s = songs[sid]
        conv = vd.converted(s)
        return jsonify(dict(conv, layout=vd.layout_text(s)))

    @app.route("/api/villancicos/word/import", methods=["POST"])
    def word_import():
        body = request.get_json(silent=True) or {}
        songs = {s.id: s for s in word_songs()}
        sid = body.get("id")
        if sid not in songs:
            abort(404, "No está en el Word")
        s = songs[sid]
        content = body.get("content") or vd.converted(s)["cho"]
        sub = cp.slugify_tag(body.get("subcategory") or "")
        try:
            num = int(body.get("number"))
        except (TypeError, ValueError):
            abort(400, "Falta el número")
        if not 0 <= num <= 999:
            abort(400, "Número fuera de rango")
        cat = cat_by_key(NAVIDAD)
        folder = srv.SONGS_DIR / cat["folder"]
        folder.mkdir(exist_ok=True)
        title = cp.get_directive(content, "title") or s.title
        fname = f"{num:02d}.{vd.d2c.slugify(title)}.cho"
        used = srv.used_numbers(folder)
        if num in used:
            abort(409, f"El {num:02d} ya lo tiene {used[num]}. Elige otro número.")
        meta = srv.parse_cho_metadata(content)
        meta["subcategory"] = sub
        content = srv._replace_meta_block(content, srv._render_meta_directive_lines(meta))
        if not srv.TODO_REGEX.search(content):
            content = srv.TODO_COMMENT_LINE + "\n" + content
        fpath = folder / fname
        fpath.write_text(content if content.endswith("\n") else content + "\n", encoding="utf-8")
        return jsonify({"ok": True, "path": str(fpath.relative_to(srv.REPO_DIR)), "filename": fname,
                        "layout": vd.layout_text(s)})

    @app.route("/api/villancicos/word/refresh", methods=["POST"])
    def word_refresh():
        """Baja la última versión del Google Doc (compartido «cualquiera con el
        enlace») como .docx y sustituye la del repo (la vieja va a backup)."""
        import web_import as wi
        url = (request.get_json(silent=True) or {}).get("url") or ""
        m = re.search(r"docs\.google\.com/document/d/([\w-]{10,})", url)
        if not m:
            abort(400, "Pega el enlace del Google Doc (docs.google.com/document/d/…).")
        try:
            got = wi.fetch(f"https://docs.google.com/document/d/{m.group(1)}/export?format=docx")
        except wi.FetchError as e:
            abort(502, str(e))
        data = got["data"]
        if not data.startswith(b"PK"):
            abort(502, "Google no ha devuelto un .docx: ¿está compartido como «cualquier persona con el enlace»?")
        current = vd.find_docx()
        target = current or (vd.VILLANCICOS_DIR / "Cantoral Villancicos Solidarios - Canciones Nuevas.docx")
        if current is not None and current.read_bytes() == data:
            return jsonify({"ok": True, "unchanged": True})
        if current is not None:
            bdir = srv.BACKUP_DIR / datetime.now().strftime("%Y%m%d-%H%M%S") / "villancicos"
            bdir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(current, bdir / current.name)
        target.parent.mkdir(exist_ok=True)
        target.write_bytes(data)
        return jsonify({"ok": True, "songs": len(vd.load_songs())})

    # ─────────── El cantoral de 2008 (PDF escaneado) ─────────── #
    #
    # No se convierte solo: cada página se lee con Claude en ✨ Añadir canción.
    # Aquí está el índice (scripts/villancicos/cantoral-2008.json, hecho a mano)
    # con el estado de cada canción, y cada página como un PDF suelto para
    # mandarla al lector sin las otras 27.

    PDF_INDEX = vd.VILLANCICOS_DIR / "cantoral-2008.json"
    pdf_cache: Dict[int, bytes] = {}

    def pdf_path() -> Path:
        import json
        data = json.loads(PDF_INDEX.read_text(encoding="utf-8"))
        return vd.VILLANCICOS_DIR / data["file"]

    @app.route("/api/villancicos/pdf/index")
    def pdf_index():
        import json
        if not PDF_INDEX.exists():
            return jsonify({"available": False, "pages": []})
        data = json.loads(PDF_INDEX.read_text(encoding="utf-8"))
        rows = rows_with_keys()
        index = pk.SongIndex(rows)
        by_page: Dict[int, List[dict]] = {}
        for r in rows:
            if r["category_key"] != NAVIDAD:
                continue
            src = srv.parse_cho_metadata((srv.REPO_DIR / r["path"]).read_text(encoding="utf-8")).get("source") or ""
            m = re.search(r"2008.*\(p\.\s*(\d+)\)", src)
            if m:
                by_page.setdefault(int(m.group(1)), []).append(r)
        pages = []
        for pg in data["pages"]:
            songs = []
            for song in pg["songs"]:
                out = dict(song)
                cand = next((r for r in by_page.get(pg["page"], [])
                             if pk.title_key(r["title"]) == pk.title_key(song["title"])), None)
                status = "imported" if cand else ""
                if cand is None:
                    cand, st = index.find(None, song["title"])
                    if cand is not None:
                        status = ("imported" if cand["category_key"] == NAVIDAD else
                                  "linked" if st == "by_title" else "elsewhere")
                out["status"] = status or "pending"
                if cand is not None:
                    out.update(path=cand["path"], category_title=cand["category_title"])
                songs.append(out)
            pages.append(dict(pg, songs=songs))
        return jsonify({"available": pdf_path().exists(), "file": data["file"], "pages": pages})

    @app.route("/api/villancicos/pdf/page/<int:n>")
    def pdf_page(n):
        from flask import Response
        if n not in pdf_cache:
            try:
                from pypdf import PdfReader, PdfWriter
            except ImportError:
                abort(500, "Falta el paquete «pypdf» en el servidor (requirements.txt del admin): "
                           "pip install pypdf, o reconstruir la imagen de Docker.")
            reader = PdfReader(str(pdf_path()))
            if not 1 <= n <= len(reader.pages):
                abort(404, "Esa página no existe")
            w = PdfWriter()
            w.add_page(reader.pages[n - 1])
            import io
            buf = io.BytesIO()
            w.write(buf)
            pdf_cache[n] = buf.getvalue()
        return Response(pdf_cache[n], mimetype="application/pdf",
                        headers={"Content-Disposition": f'inline; filename="cantoral-2008-p{n}.pdf"'})

    @app.route("/api/villancicos/mark", methods=["POST"])
    def vill_mark():
        """Tras crear con ✨ una canción del cantoral de 2008: su fuente (con la
        página, para saber que ya está) y su subcategoría."""
        body = request.get_json(silent=True) or {}
        p = srv.safe_relpath(body.get("path") or "")
        if not p.exists():
            abort(404, "No existe")
        changes = {}
        if body.get("source"):
            changes["source"] = srv._sanitize_directive_value(body["source"])
        if "subcategory" in body:
            changes["subcategory"] = cp.slugify_tag(body.get("subcategory") or "")
        return jsonify({"ok": True, "changed": write_meta(p, **changes) if changes else False})

    # ─────────── Packs ─────────── #

    def pack_index() -> pk.SongIndex:
        return pk.SongIndex(rows_with_keys())

    @app.route("/api/packs")
    def packs_list():
        index = pack_index()
        out = []
        for slug in pk.list_slugs():
            try:
                rp = pk.resolve(pk.load(slug), index)
            except (ValueError, OSError) as e:
                out.append({"slug": slug, "title": slug, "error": str(e), "items": []})
                continue
            out.append(dict(rp, slug=slug))
        return jsonify({"packs": out, "defaultSeconds": pk.DEFAULT_SECONDS})

    @app.route("/api/packs/<slug>", methods=["PUT"])
    def packs_put(slug):
        body = request.get_json(silent=True) or {}
        old = body.pop("oldSlug", None)
        try:
            pack = pk.relink(pk.normalize(body), pack_index())
            slug = cp.slugify_tag(slug)[:60]
            if old and old != slug and (pk.PACKS_DIR / f"{slug}.json").exists():
                abort(409, "Ya hay un pack con ese nombre.")
            saved = pk.save(slug, pack)
            if old and old != slug:
                pk.delete(old)
        except ValueError as e:
            abort(400, str(e))
        return jsonify({"ok": True, "slug": slug, "pack": dict(pk.resolve(saved, pack_index()), slug=slug)})

    @app.route("/api/packs/<slug>", methods=["DELETE"])
    def packs_delete(slug):
        try:
            pk.delete(slug)
        except ValueError as e:
            abort(400, str(e))
        return jsonify({"ok": True})

    @app.route("/api/packs/<slug>/songs")
    def packs_songs(slug):
        """Las canciones del pack con su .cho, para imprimir el cancionero."""
        try:
            rp = pk.resolve(pk.load(slug), pack_index())
        except FileNotFoundError:
            abort(404, "No existe ese pack")
        out = []
        for it in rp["items"]:
            if it.get("path"):
                it = dict(it, content=(srv.REPO_DIR / it["path"]).read_text(encoding="utf-8"))
            out.append(it)
        return jsonify(dict(rp, slug=slug, items=out))

    @app.route("/api/packs/<slug>/export")
    def packs_export(slug):
        try:
            rp = pk.resolve(pk.load(slug), pack_index())
        except FileNotFoundError:
            abort(404, "No existe ese pack")
        fmt = request.args.get("format", "txt")
        text = pk.export_markdown(rp) if fmt == "md" else pk.export_text(rp)
        return jsonify({"text": text, "filename": f"{slug}.{'md' if fmt == 'md' else 'txt'}"})
