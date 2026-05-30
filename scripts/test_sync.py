#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de la lógica de sincronización y del módulo común ChordPro.

Corre sin dependencias:  python scripts/test_sync.py
(También vale con pytest:  pytest scripts/test_sync.py)
"""
import importlib.util
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

import chordpro as cp  # noqa: E402

# El nombre del fichero no es importable directamente: lo cargamos a mano.
_spec = importlib.util.spec_from_file_location(
    "sync_mod", SCRIPTS_DIR / "sincronizaCambiosDeFirebase.py")
sync = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(sync)


# ── chordpro: enlaces ───────────────────────────────────────────────────────────
def test_parse_label_url():
    assert cp.parse_label_url("Oficial | https://x") == {"label": "Oficial", "url": "https://x"}
    assert cp.parse_label_url("https://x") == {"label": "", "url": "https://x"}
    # solo se parte por el primer '|'
    assert cp.parse_label_url("a | b | c")["url"] == "b | c"

def test_format_label_url():
    assert cp.format_label_url({"label": "A", "url": "u"}) == "A | u"
    assert cp.format_label_url({"label": "", "url": "u"}) == "u"
    assert cp.format_label_url({"label": "A", "url": ""}) is None  # sin url -> None

def test_normalize_links():
    assert cp.normalize_links([{"label": "A", "url": "u"}, {"url": ""}]) == [{"label": "A", "url": "u"}]
    assert cp.normalize_links(["X | u", "v"]) == [{"label": "X", "url": "u"}, {"label": "", "url": "v"}]
    assert cp.normalize_links(None) == []


# ── chordpro: metadatos y multimedia ────────────────────────────────────────────
CHO = (
    "{title: Ven a Celebrar}\n"
    "{artist: Alborada}\n"
    "{key: G}\n"
    "{capo: 2}\n"
    "{ritmo: 4x4}\n"
    "{tiempo: Entrada}\n"
    "{youtube: Oficial | https://yt/abc}\n"
    "{audio: https://a/x.mp3}\n"
    "\n"
    "{soc}\n"
    "[G]Ven a cele[D]brar\n"
    "{eoc}\n"
)

def test_parse_basic_meta():
    meta = cp.parse_basic_meta(CHO)
    assert meta == {"title": "Ven a Celebrar", "author": "Alborada", "key": "G", "capo": 2}

def test_parse_basic_meta_author_fallback():
    assert cp.parse_basic_meta("{author: Pepe}")["author"] == "Pepe"
    assert cp.parse_basic_meta("{capo: x}")["capo"] == 0  # capo no numérico -> 0

def test_parse_media():
    m = cp.parse_media(CHO)
    assert m["rhythm"] == "4x4"
    assert m["liturgicalTime"] == "Entrada"
    assert m["youtubeLinks"] == [{"label": "Oficial", "url": "https://yt/abc"}]
    assert m["audioLinks"] == [{"label": "", "url": "https://a/x.mp3"}]
    assert m["album"] == "" and m["videoEmbed"] == ""

def test_strip_media_keeps_body():
    stripped = cp.strip_media(CHO)
    assert "{ritmo:" not in stripped and "{youtube:" not in stripped and "{audio:" not in stripped
    # No toca title/artist/key/capo ni el cuerpo
    assert "{title: Ven a Celebrar}" in stripped
    assert "{soc}" in stripped and "[G]Ven a cele[D]brar" in stripped


# ── sync: merge multimedia ──────────────────────────────────────────────────────
def test_resolve_media_override_preserve_clear():
    ed = {
        "rhythmNew": "parón",                                   # override
        "audioLinksNew": [{"label": "Guía", "url": "https://g"}],# override lista
        "youtubeLinksNew": [],                                   # borra (lista vacía)
    }
    media = sync.resolve_media(ed, CHO)
    assert media["rhythm"] == "parón"        # override
    assert media["liturgicalTime"] == "Entrada"  # preservado (no venía en la edición)
    assert media["youtubeLinks"] == []       # borrado
    assert media["audioLinks"] == [{"label": "Guía", "url": "https://g"}]

def test_build_media_lines_order():
    media = {"rhythm": "4x4", "album": "X", "liturgicalTime": "T", "source": "S",
             "videoEmbed": "V", "youtubeLinks": [{"label": "A", "url": "u1"}],
             "audioLinks": [{"label": "", "url": "a1"}], "comment": "c"}
    lines = sync.build_media_lines(media)
    assert lines == ["{ritmo: 4x4}", "{album: X}", "{tiempo: T}", "{fuente: S}",
                     "{video: V}", "{youtube: A | u1}", "{audio: a1}", "{comentario: c}"]

def test_inject_strip_roundtrip_is_lossless_for_body():
    body = cp.strip_media(CHO)
    media = cp.parse_media(CHO)
    rebuilt = sync.inject_media(body, media)
    # El cuerpo (sin multimedia) debe ser idéntico tras quitar otra vez la multimedia
    assert cp.strip_media(rebuilt).strip() == body.strip()
    # Y la multimedia vuelve a estar
    assert cp.parse_media(rebuilt)["rhythm"] == "4x4"

def test_media_changed():
    assert sync.media_changed({"rhythmNew": "x", "rhythmOld": "y"}) is True
    assert sync.media_changed({"rhythmNew": "x", "rhythmOld": "x"}) is False
    assert sync.media_changed({}) is False


# ── sync: tags de cabecera ──────────────────────────────────────────────────────
def test_apply_tag_updates():
    ed = {"keyNew": "A", "keyOld": "G", "capoNew": 0, "capoOld": 2}
    out = sync.apply_tag_updates(CHO, ed)
    assert "{key: A}" in out and "{key: G}" not in out
    assert "{capo: 0}" in out and "{capo: 2}" not in out

def test_apply_tag_updates_insert_when_missing():
    out = sync.apply_tag_updates("{title: X}\n[C]hola\n", {"keyNew": "D", "keyOld": ""})
    assert "{key: D}" in out


# ── sync: detección de conflicto ────────────────────────────────────────────────
def test_conflict_none_when_no_old():
    assert sync.content_conflict({"contentNew": "x"}, CHO) is False

def test_conflict_false_when_matches():
    # contentOld == cuerpo actual (sin multimedia, salvo espacios) -> sin conflicto
    old = cp.strip_media(CHO)
    assert sync.content_conflict({"contentOld": old, "contentNew": "otra cosa"}, CHO) is False

def test_conflict_true_when_repo_diverged():
    # La app vio un cuerpo distinto al que hay ahora en el repo -> conflicto
    old = "{title: Ven a Celebrar}\n{soc}\n[G]Letra VIEJA\n{eoc}\n"
    assert sync.content_conflict({"contentOld": old, "contentNew": "x"}, CHO) is True

def test_conflict_ignores_only_whitespace_and_media():
    # Diferencias solo en espacios finales o en directivas multimedia NO son conflicto
    old = (
        "{title: Ven a Celebrar}   \n"   # espacios finales
        "{artist: Alborada}\n{key: G}\n{capo: 2}\n"
        "{album: Otro}\n"                # multimedia distinta (se ignora al comparar)
        "\n"                              # misma línea en blanco que CHO
        "{soc}\n[G]Ven a cele[D]brar\n{eoc}\n"
    )
    assert sync.content_conflict({"contentOld": old, "contentNew": "x"}, CHO) is False


# ── runner sin pytest ───────────────────────────────────────────────────────────
def _run():
    tests = [v for k, v in sorted(globals().items())
             if k.startswith("test_") and callable(v)]
    passed = 0
    for t in tests:
        t()
        print(f"  ✓ {t.__name__}")
        passed += 1
    print(f"\n✅ {passed}/{len(tests)} tests OK")

if __name__ == "__main__":
    _run()
