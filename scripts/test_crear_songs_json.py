#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del generador del songs-vX.json (build_songs / write_next_version).

Corre sin dependencias:  python scripts/test_crear_songs_json.py
(También vale con pytest:  pytest scripts/test_crear_songs_json.py)
Usa carpetas temporales: no escribe nada en songs/.
"""
import json
import sys
import tempfile
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

import crear_songs_json as csj  # noqa: E402


def _make_songs_dir(tmp: Path) -> Path:
    songs = tmp / "songs"
    (songs / "A. Entrada").mkdir(parents=True)
    (songs / "indice.json").write_text(
        json.dumps({"entrada": {"categoryTitle": "A. Entrada", "songs": []}}),
        encoding="utf-8")
    (songs / "A. Entrada" / "01.hola.cho").write_text(
        "{title: Hola}\n{artist: Ana}\n{key: C}\n\n[C]Hola\n", encoding="utf-8")
    # Solo se recogen los .cho: esto debe ignorarse
    (songs / "A. Entrada" / "02.otra.chordpro").write_text(
        "{title: Otra}\n", encoding="utf-8")
    return songs


def test_build_songs_solo_recoge_cho_y_no_escribe():
    with tempfile.TemporaryDirectory() as t:
        songs = _make_songs_dir(Path(t))
        lines = []
        result, _counts, _catalog = csj.build_songs(str(songs), log=lines.append)
        entries = result["entrada"]["songs"]
        assert [e["filename"] for e in entries] == ["01.hola.cho"]
        assert entries[0]["title"] == "01. Hola"
        assert entries[0]["author"] == "Ana"
        assert lines, "log debe recibir el progreso"
        assert not list(songs.glob("songs-v*.json")), "build_songs no escribe"


def test_write_next_version_numeracion():
    with tempfile.TemporaryDirectory() as t:
        songs = _make_songs_dir(Path(t))
        result, _c, _k = csj.build_songs(str(songs), log=lambda *_: None)
        names = []
        for _ in range(3):
            fname, path = csj.write_next_version(str(songs), result)
            names.append(fname)
            assert json.loads(Path(path).read_text(encoding="utf-8")) == result
        assert names == ["songs-v0.1.json", "songs-v0.2.json", "songs-v0.3.json"]


def test_bump_version_salta_de_major_tras_el_9():
    assert csj.bump_version(0, 9) == (1, 0)
    assert csj.format_version(1, 0) == "1"
    with tempfile.TemporaryDirectory() as t:
        songs = Path(t)
        (songs / "songs-v0.9.json").write_text("{}", encoding="utf-8")
        assert csj.find_latest_version(str(songs)) == (0, 9)


# ── runner sin pytest ───────────────────────────────────────────────────────────
def _run():
    tests = [v for k, v in sorted(globals().items())
             if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"  ✓ {t.__name__}")
    print(f"\n✅ {len(tests)}/{len(tests)} tests OK")


if __name__ == "__main__":
    _run()
