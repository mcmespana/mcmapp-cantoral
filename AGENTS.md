# Repository Guidelines

## Project Structure & Module Organization
- `songs/`: Source ChordPro files grouped by category folders (e.g., `A. Entrada/`). Also contains `indice.json`, `tags.json` and the latest generated `songs-v<major>[.<minor>].json`. Generated JSONs are **Firebase-only**: CI uploads them without committing; only the highest version stays in the repo (numbering seed + fallback for a local `update_firebase.py`). Save a new one from the admin (*Otros > JSON de canciones*) when you want it in git.
- `scripts/`: Python utilities and OS launchers to process songs.
  - Generators/sync: `crear_songs_json.py` (also `--dry-run`), `update_firebase.py`, `sincronizaCambiosDeFirebase.py` (the first two run in CI on push to `main`; the sync runs every 2 days via `.github/workflows/sincroniza-cambios-firebase.yml`). Shared ChordPro logic: `chordpro.py`.
  - Converters: `docx2chordpro.py` (reads `scripts/Cantoral Consolación Castellón v2.0.4.docx`), `tab2chordpro.py`, `tab2chordpro_integrado.py`; `scripts/input/<categoría>/*.tex` is the LaTeX inbox read by the admin's *Importar de LaTeX*.
  - `scripts/fuente.ttf` = Calibri Regular, used to measure text widths in `docx2chordpro.py` and `tab2chordpro_integrado.py`; do not delete or move (hard-wired path).
  - `scripts/canciones_doce_acordes.json` = index of doceacordes.es used by the admin importer (`doceacordes_import.py`); do not delete.
  - `scripts/admin/`: local Flask admin (catalog, editor, importers, tags, AI review). See `scripts/admin/README.md`.
- `deploy/ugreen-nas/` + `Dockerfile`: run the admin on the NAS (gunicorn); see its README.
- `peticiones/`: history of song requests / failure reports from the app, written by the admin's *Consultar peticiones* button.
- `docs/`: `CAMPOS_CANCIONES.md` (field/directive contract with the app) and `REVISION_OIDO.md` (pending by-ear chord reviews).
- `songs-backup-edits/`: backups created by the admin and the sync before each edit. **Ignored by git** (the history already holds every `.cho`); safe to delete locally.
- `_para-borrar/`: material nothing uses, set aside for deletion; see its README. Do not read from it.
- `.github/workflows/`: `generate_and_upload.yml` (generate + upload to Firebase) and `sincroniza-cambios-firebase.yml` (Firebase edits → `.cho`). Both share the `songs-sync` concurrency group.
- Root files: `README.md`, `LICENSE`, `.env` (Firebase credentials, local only), and a local `.venv/` for Python deps.

## Build, Test, and Development Commands
- Create virtualenv: `python3 -m venv .venv && source .venv/bin/activate`.
- Install deps: `pip install -r scripts/requirements.txt`.
- Generate songs JSON: `python scripts/crear_songs_json.py` (reads `songs/indice.json`, scans `songs/*/*.cho`, writes next `songs-vX[.Y].json`, and prints a tag report flagging tags not declared in `songs/tags.json`; `--dry-run` builds and reports without writing).
- Convert tabs → ChordPro: `python scripts/tab2chordpro.py <input.txt> > <output.cho>`.
- Admin preview = the app's own renderer: `scripts/admin/static/mcm-sheet.js` is GENERATED from the `mcmapp` repo (`cd mcm-app && npm run build:sheet-bundle`, writes here when both repos are siblings). Regenerate and commit it when the app's song sheet changes; never edit it by hand. See `scripts/admin/README.md` («👁 Preview»).
- Review songs for app readability: `python scripts/revisar_cho.py [--todas|--md] [file.cho]` (read-only report: long lines, review markers, missing `{soc}`, `ESTRIBILLO` placeholders, manual numbering… Rules in `docs/CAMPOS_CANCIONES.md` §4.6). Tests: `python scripts/test_revisar_cho.py`.
- Auto-fix the mechanical part: `python scripts/arreglar_cho.py [--dry-run] [file.cho]` (`ESTRIBILLO` → `{chorus}`, drops manual verse numbers, intro comments with Spanish chords → real chord lines, joins PDF-wrapped stanzas, splits lines >70 chars by phrase). Idempotent; never changes words or chords. Tests: `python scripts/test_arreglar_cho.py`.
- Sync Firebase (receive/push changes): `python scripts/sincronizaCambiosDeFirebase.py` or `python scripts/update_firebase.py` as needed.
- macOS/Windows helpers: double-click the `*.command` or `*.bat` wrappers in `scripts/`.

## Coding Style & Naming Conventions
- Language: Python 3.11+ preferred; UTF-8 source and file I/O.
- Indentation: 4 spaces; keep functions small and single-purpose.
- File naming: snake_case for Python (`crear_songs_json.py`), kebab/space names only for user launchers.
- ChordPro files: numeric prefix when available (e.g., `01 Titulo.cho`). Metadata via `{title:}`, `{artist:}`, `{author:}`, `{key:}`, `{capo:}`.
- Song tags: `{tags: a, b, c}` in the header (free-form, comma-separated, slugified). Optional catalog in `songs/tags.json`; published to Firebase `songs/tags`. See `docs/CAMPOS_CANCIONES.md` §6 and the admin's 🏷 tab.
- Formatting/linting: run `ruff` and `black` if installed; otherwise keep PEP 8 style.

## Testing Guidelines
- Smoke-test generators: run `python scripts/crear_songs_json.py --dry-run` (writes nothing); drop the flag only if you really want a new `songs-v*.json` in the repo.
- Validate parsing: open random entries to confirm `title`, `author`, `key`, and `capo` populated.
- Shared ChordPro/sync logic has tests: `python scripts/test_sync.py` (no deps needed; also works under pytest). Extend it when touching `scripts/chordpro.py`.
- The JSON generator has tests: `python scripts/test_crear_songs_json.py` (temp dirs, writes nothing to `songs/`).
- The admin song importer has tests: `python scripts/admin/test_song_import.py` (real songs in `scripts/admin/fixtures_import/`) and `python scripts/admin/test_ai_review.py` (fake client, no API calls). Extend them when touching `song_import.py` / `ai_review.py`.
- Optional: add minimal unit tests under `scripts/` with `pytest` if present; name tests `test_*.py`.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope (e.g., `feat: generate songs JSON v3.1`). Group logical changes.
- PRs: include purpose, summary of changes, sample command output, and before/after examples. Link related issues.
- Screenshots: add when UI-facing artifacts change (e.g., JSON structure previews).

## Security & Configuration Tips
- Do not commit real credentials. `.env` and `acceso-firebase.json` should remain local or use redacted samples.
- Generated `songs-v*.json` can be large: review the diff before committing a new one saved from the admin.
