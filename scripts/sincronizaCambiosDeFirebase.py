#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sync ediciones de Firebase RTDB -> ficheros .cho locales.

Reglas:
- Si hay contentNew != contentOld -> reescribe TODO el .cho con contentNew.
- Después SIEMPRE revisa/actualiza tags {title,artist,key,capo,info} con valores *New.
- Backups en ./songs-backup-edits/<timestamp>/<Carpeta>/<archivo>.bak
- Al terminar cada edición aplicada, elimina el nodo en Firebase (si no --dry-run).
- Output bonito con Rich (si está instalado).

Reqs recomendadas: requests, python-dotenv, rich, google-auth
"""

import os, re, json, argparse
from pathlib import Path
from datetime import datetime, timezone

# ── Opcional: .env ─────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv  # pip install python-dotenv
except Exception:
    load_dotenv = None

# ── Consola bonita (fallback si no está) ───────────────────────────────────────
try:
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, BarColumn, TextColumn, TimeElapsedColumn
    from rich.markup import escape as esc
    RICH = True
    console = Console()
except Exception:
    RICH = False
    class _C:
        def print(self, *a, **k): print(*a)
    console = _C()

# ── HTTP ───────────────────────────────────────────────────────────────────────
import requests

# ── Utilidades texto/ChordPro ─────────────────────────────────────────────────
TAG_MAP = {
    "title":  "title",
    "author": "artist",
    "key":    "key",
    "capo":   "capo",
    "info":   "info",
}

def _nl(s: str) -> str:
    s = str(s).replace("\r\n","\n").replace("\r","\n")
    return s if s.endswith("\n") else s + "\n"

def replace_or_insert_tag(text: str, tag: str, value: str) -> str:
    """
    Reemplaza {tag: ...} si existe; si no, lo inserta.
    - capo/info: debajo de {key}; si no hay key, debajo de {artist}, si no, de {title}.
    - title/artist/key: al inicio (antes del contenido).
    """
    text = _nl(text)
    pat = re.compile(r"^\{\s*"+re.escape(tag)+r"\s*:\s*.*?\}\s*$", re.I | re.M)
    repl = f"{{{tag}: {value}}}"
    if pat.search(text):
        return pat.sub(repl, text, count=1)

    lines = text.split("\n")
    def find_tag(t):
        p = re.compile(r"^\{\s*"+re.escape(t)+r"\s*:\s*.*?\}\s*$", re.I)
        for i, ln in enumerate(lines):
            if p.match(ln.strip()):
                return i
        return None

    insert_after = -1
    if tag in ("capo","info"):
        for anchor in ("key","artist","title"):
            idx = find_tag(anchor)
            if idx is not None:
                insert_after = idx
                break

    lines.insert(insert_after + 1, repl)
    if lines and lines[-1] != "":
        lines.append("")
    return "\n".join(lines)

def apply_tag_updates(text: str, edition: dict) -> str:
    new_text = text
    for ed_field, cho_tag in TAG_MAP.items():
        newv = edition.get(f"{ed_field}New")
        oldv = edition.get(f"{ed_field}Old")
        if newv is not None and newv != oldv:
            new_text = replace_or_insert_tag(new_text, cho_tag, str(newv))
    return new_text

# ── Tiempo ISO ────────────────────────────────────────────────────────────────
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# ── Auth helpers (token o service account) ─────────────────────────────────────
def _get_bearer_from_service_account() -> str | None:
    """
    Intenta generar un Bearer automático desde GOOGLE_APPLICATION_CREDENTIALS.
    Devuelve 'Bearer <token>' o None si no está disponible.
    """
    try:
        sa_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if not sa_path or not os.path.exists(sa_path):
            return None
        # Import aquí para no romper si no está instalado
        from google.oauth2 import service_account  # pip install google-auth
        from google.auth.transport.requests import Request
        scopes = [
            "https://www.googleapis.com/auth/firebase.database",
            "https://www.googleapis.com/auth/userinfo.email",
        ]
        creds = service_account.Credentials.from_service_account_file(sa_path, scopes=scopes)
        creds.refresh(Request())
        return f"Bearer {creds.token}"
    except Exception:
        return None

def _auth_headers_and_params() -> tuple[dict, dict]:
    """
    Prioridad:
      1) FIREBASE_TOKEN que empieza por 'Bearer ' -> Authorization
      2) Si no hay FIREBASE_TOKEN pero hay service account -> Bearer automático
      3) FIREBASE_TOKEN normal -> ?auth=TOKEN
    Además: si el token empieza por 'AIza' (API key), avisa y no usa nada.
    """
    token = (os.environ.get("FIREBASE_TOKEN") or "").strip()
    if token.startswith("AIza"):
        console.print("❌ Has puesto una API key como FIREBASE_TOKEN. Eso NO vale. Usa idToken o Service Account.")
        token = ""

    if token.startswith("Bearer "):
        return {"Authorization": token}, {}

    if not token:
        bearer = _get_bearer_from_service_account()
        if bearer:
            return {"Authorization": bearer}, {}

    return {}, ({"auth": token} if token else {})

# ── Firebase REST ─────────────────────────────────────────────────────────────
def fb_get(base_url: str, path: str):
    headers, params = _auth_headers_and_params()
    url = f"{base_url.rstrip('/')}/{path}.json"
    r = requests.get(url, headers=headers, params=params, timeout=25)
    r.raise_for_status()
    return r.json()

def fb_delete(base_url: str, path: str):
    headers, params = _auth_headers_and_params()
    url = f"{base_url.rstrip('/')}/{path}.json"
    r = requests.delete(url, headers=headers, params=params, timeout=25)
    r.raise_for_status()
    return True

# ── Category ↔ carpeta ────────────────────────────────────────────────────────
def load_category_letter_map(indice_path: Path) -> dict:
    """
    Espera songs/indice.json con claves de categoría y {categoryTitle: "..."}.
    Devuelve dict: 'ofertorio' -> 'E' (por ejemplo).
    """
    data = json.loads(indice_path.read_text(encoding="utf-8"))
    mapping = {}
    for cat_key, obj in data.items():
        title = (obj or {}).get("categoryTitle","").strip()
        if title:
            mapping[cat_key.lower()] = title[:1].upper()
    return mapping

def find_category_folder(songs_dir: Path, letter: str) -> Path | None:
    # Busca carpeta que empiece por "E." (case-insensitive)
    target = f"{letter.lower()}."
    for p in songs_dir.iterdir():
        if p.is_dir() and p.name.lower().startswith(target):
            return p
    return None

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Sync Firebase ediciones -> .cho (con backups y borrado de nodo)")
    parser.add_argument("--dry-run", action="store_true", help="No escribe ni borra en Firebase")
    args = parser.parse_args()

    if load_dotenv: load_dotenv()

    base_url = (os.environ.get("FIREBASE_URL") or "").strip()
    if not base_url:
        console.print("❌ Falta FIREBASE_URL en .env")
        return

    repo_root = Path(__file__).resolve().parent.parent
    songs_dir = repo_root / "songs"
    indice = songs_dir / "indice.json"
    backup_root = repo_root / "songs-backup-edits"
    ts_folder = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = backup_root / ts_folder

    if not songs_dir.exists() or not indice.exists():
        console.print(f"❌ No encuentro 'songs' o 'songs/indice.json' en {repo_root}")
        return

    console.print(f"🔌 Probando conexión a Firebase… [bold]{base_url}[/]")
    try:
        ediciones = fb_get(base_url, "songs/ediciones") or {}
    except Exception as e:
        console.print(f"🚨 Error conectando/leyendo RTDB: {e}")
        return
    total = len(ediciones) if isinstance(ediciones, dict) else 0
    console.print(f"✅ Conectado. Nodos en 'songs/ediciones': [bold]{total}[/]")

    cat_letter = load_category_letter_map(indice)

    # Selecciona las ediciones que realmente tienen cambios
    to_process = []
    if isinstance(ediciones, dict):
        for ed_id, ed in ediciones.items():
            if not isinstance(ed, dict): continue
            if not ed.get("filename") or not ed.get("category"): continue
            changed = False
            if ed.get("contentNew") is not None and ed.get("contentNew") != ed.get("contentOld"):
                changed = True
            else:
                for f in ("title","author","key","capo","info"):
                    if ed.get(f"{f}New") is not None and ed.get(f"{f}New") != ed.get(f"{f}Old"):
                        changed = True; break
            if changed:
                to_process.append((ed_id, ed))

    if not to_process:
        console.print("🫡 No hay ediciones con cambios. Nada que hacer.")
        return

    # Progreso
    if RICH:
        progress = Progress(
            TextColumn("[bold blue]⏳[/]"),
            BarColumn(),
            TextColumn("{task.description}"),
            TimeElapsedColumn(),
            console=console,
        )
        task = progress.add_task("Procesando ediciones…", total=len(to_process))
        progress.start()
    else:
        progress = None

    results = []
    if not args.dry_run:
        backup_dir.mkdir(parents=True, exist_ok=True)

    for ed_id, ed in to_process:
        try:
            category_raw = str(ed.get("category","")).strip()
            filename = str(ed.get("filename","")).strip()

            letter = cat_letter.get(category_raw.lower()) or (category_raw[:1].upper() if category_raw else None)
            if not letter:
                results.append((ed_id,"⚠️",f"Categoría no mapeada: '{category_raw}'"))
                if progress: progress.advance(task); continue

            cat_folder = find_category_folder(songs_dir, letter)
            if not cat_folder:
                results.append((ed_id,"⚠️",f"No encuentro carpeta para letra '{letter}'"))
                if progress: progress.advance(task); continue

            cho_path = cat_folder / filename
            if not cho_path.exists():
                results.append((ed_id,"⚠️",f"No existe {filename} en {cat_folder.name}"))
                if progress: progress.advance(task); continue

            original = cho_path.read_text(encoding="utf-8")
            new_text = original

            # 1) contentNew manda si difiere
            if ed.get("contentNew") is not None and ed.get("contentNew") != ed.get("contentOld"):
                new_text = _nl(ed["contentNew"])

            # 2) SIEMPRE revisar tags después
            new_text = apply_tag_updates(new_text, ed)

            if new_text == original:
                results.append((ed_id,"😴",f"Sin cambios → {filename}"))
                if progress: progress.advance(task); continue

            if args.dry_run:
                results.append((ed_id,"📝",f"[dry-run] Cambiaría {filename} (backup en {backup_dir})"))
            else:
                # Backup espejo: ./songs-backup-edits/<ts>/<Carpeta>/<archivo>
                dest_folder = backup_dir / cat_folder.name
                dest_folder.mkdir(parents=True, exist_ok=True)
                (dest_folder / (filename)).write_text(original, encoding="utf-8")

                cho_path.write_text(new_text, encoding="utf-8")

                # Borrar nodo procesado
                fb_delete(base_url, f"songs/ediciones/{ed_id}")

                results.append((ed_id,"✨",f"Actualizado {filename} + nodo Firebase eliminado"))

        except Exception as e:
            results.append((ed_id,"💥",f"Error: {e}"))
        finally:
            if progress: progress.advance(task)

    if progress: progress.stop()

    # Resumen
    if RICH:
        table = Table(title="Resumen de sincronización 🎵")
        table.add_column("Edición ID", style="dim", overflow="fold")
        table.add_column("Estado")
        table.add_column("Detalle", overflow="fold")
        for ed_id, ico, det in results:
            table.add_row(esc(ed_id), ico, esc(det))
        console.print(table)
    else:
        console.print("Resumen:")
        for r in results:
            console.print(" - ", r)

    console.print("🏁 Listo. ¡Coro afinado y a volar! 🇮🇹🎶")

if __name__ == "__main__":
    main()