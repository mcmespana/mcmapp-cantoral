# Repository Guidelines

## Project Structure & Module Organization
- `scripts/`: Python utilities and OS launchers to process songs. Key scripts: `crear_songs_json.py`, `tab2chordpro.py`, `sincronizaCambiosDeFirebase.py`.
- `songs/`: Source ChordPro files grouped by category folders (e.g., `A. Entrada/`). Also contains `indice.json` and versioned JSON outputs `songs-v<major>[.<minor>].json`.
- `songs-backup-edits/`: Backups and intermediate edits.
- `.github/`: CI or workflow configs (if used).
- Root files: `README.md`, `LICENSE`, `.env` (Firebase credentials), and a local `.venv/` for Python deps.

## Build, Test, and Development Commands
- Create virtualenv: `python3 -m venv .venv && source .venv/bin/activate`.
- Install deps: `pip install -r scripts/requirements.txt`.
- Generate songs JSON: `python scripts/crear_songs_json.py` (reads `songs/indice.json`, scans `songs/*/*.cho`, writes next `songs-vX[.Y].json`).
- Convert tabs → ChordPro: `python scripts/tab2chordpro.py <input.txt> > <output.cho>`.
- Sync Firebase (receive/push changes): `python scripts/sincronizaCambiosDeFirebase.py` or `python scripts/update_firebase.py` as needed.
- macOS/Windows helpers: double-click the `*.command` or `*.bat` wrappers in `scripts/`.

## Coding Style & Naming Conventions
- Language: Python 3.11+ preferred; UTF-8 source and file I/O.
- Indentation: 4 spaces; keep functions small and single-purpose.
- File naming: snake_case for Python (`crear_songs_json.py`), kebab/space names only for user launchers.
- ChordPro files: numeric prefix when available (e.g., `01 Titulo.cho`). Metadata via `{title:}`, `{artist:}`, `{author:}`, `{key:}`, `{capo:}`.
- Formatting/linting: run `ruff` and `black` if installed; otherwise keep PEP 8 style.

## Testing Guidelines
- Smoke-test generators: run `python scripts/crear_songs_json.py`; ensure a new `songs-v*.json` is created and valid JSON.
- Validate parsing: open random entries to confirm `title`, `author`, `key`, and `capo` populated.
- Optional: add minimal unit tests under `scripts/` with `pytest` if present; name tests `test_*.py`.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope (e.g., `feat: generate songs JSON v3.1`). Group logical changes.
- PRs: include purpose, summary of changes, sample command output, and before/after examples. Link related issues.
- Screenshots: add when UI-facing artifacts change (e.g., JSON structure previews).

## Security & Configuration Tips
- Do not commit real credentials. `.env` and `acceso-firebase.json` should remain local or use redacted samples.
- Review diffs of generated `songs-v*.json` before pushing; these can be large.
