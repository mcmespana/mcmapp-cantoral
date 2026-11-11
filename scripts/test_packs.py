#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de los packs de canciones (scripts/packs.py).

    python scripts/test_packs.py      (o con pytest)
"""
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))

import packs as pk  # noqa: E402

ROWS = [
    {"filename": "19.hoy_ha_nacido.cho", "title": "Hoy ha Nacido", "category_key": "navidad",
     "path": "songs/N. Navidad/19.hoy_ha_nacido.cho", "key": "D", "capo": 0, "duration": "2:50"},
    {"filename": "34.hecho_con_tus_suenos_14.cho", "title": "Hecho con tus sueños’14",
     "category_key": "navidad", "path": "songs/N. Navidad/34.hecho_con_tus_suenos_14.cho", "key": "C"},
    {"filename": "06.hallelujah.cho", "title": "Hallelujah", "category_key": "aleluya",
     "path": "songs/D. Aleluya/06.hallelujah.cho", "key": "G"},
    {"filename": "01. Somos Consolacion.cho", "title": "Somos Consolación", "category_key": "himnos",
     "path": "songs/K. Himnos/01. Somos Consolacion.cho", "key": "C",
     "alsoIn": [{"category": "navidad", "subcategory": "otras"}]},
]
INDEX = pk.SongIndex(ROWS)


def test_song_slug_sin_numero():
    assert pk.song_slug("19.hoy_ha_nacido.cho") == "hoy_ha_nacido"
    assert pk.song_slug("01. Somos Consolacion.cho") == "somos_consolacion"
    assert pk.song_slug("05.Niño Lindo.cho") == "nino_lindo"


def test_normalize():
    p = pk.normalize({"title": "  Mañana 1 ", "targetMinutes": "45", "date": "2025-12-20",
                      "items": [{"song": "navidad/hoy_ha_nacido", "title": "Hoy ha nacido",
                                 "capo": "3", "duration": "3'10"},
                                {"type": "break", "title": "", "minutes": "5"},
                                {"song": None, "title": ""}]})
    assert p["title"] == "Mañana 1" and p["targetMinutes"] == 45
    assert p["items"][0] == {"song": "navidad/hoy_ha_nacido", "title": "Hoy ha nacido",
                             "capo": 3, "duration": "3:10"}
    assert p["items"][1] == {"type": "break", "title": "Pausa", "minutes": 5}
    assert len(p["items"]) == 2          # el vacío fuera
    for bad in ({"title": ""}, {"title": "x", "date": "20/12/2025"},
                {"title": "x", "items": [{"song": "../../etc/passwd"}]}):
        try:
            pk.normalize(bad)
        except ValueError:
            continue
        raise AssertionError(bad)


def test_resolver_y_tiempos():
    rp = pk.resolve({"title": "x", "targetMinutes": 60, "items": [
        {"song": "navidad/hoy_ha_nacido", "title": "Hoy ha nacido"},
        {"type": "break", "title": "Pausa", "minutes": 2},
        {"song": None, "title": "Hecho con tus sueños 2014"},      # parecido, en Navidad
        {"song": None, "title": "Canción que no existe"},
    ]}, INDEX)
    it = rp["items"]
    assert it[0]["status"] == "ok" and it[0]["seconds"] == 170 and it[0]["start"] == 0
    assert it[1]["start"] == 170 and it[1]["seconds"] == 120
    assert it[2]["status"] == "by_title" and it[2]["start"] == 290
    assert it[3]["status"] == "missing"
    assert rp["totalSeconds"] == 170 + 120 + pk.DEFAULT_SECONDS * 2 and rp["estimated"]


def test_por_titulo_solo_navidad():
    # «Hallelujah» existe en Aleluya, pero la del pack es la navideña: se
    # sugiere, no se enlaza sola.
    rp = pk.resolve({"title": "x", "items": [{"song": None, "title": "Hallelujah"}]}, INDEX)
    assert rp["items"][0]["status"] == "missing"
    assert rp["items"][0]["suggestion"]["category_key"] == "aleluya"
    assert pk.relink({"title": "x", "items": [{"song": None, "title": "Hallelujah"}]},
                     INDEX)["items"][0]["song"] is None
    # La de Himnos traída a Navidad ({tambien_en: navidad}) sí.
    assert pk.relink({"title": "x", "items": [{"song": None, "title": "Somos Consolación"}]},
                     INDEX)["items"][0]["song"] == "himnos/somos_consolacion"


def test_movida_de_categoria():
    row, status = INDEX.find("navidad/somos_consolacion")
    assert status == "moved" and row["ref"] == "himnos/somos_consolacion"


def test_duracion_por_defecto_del_pack():
    rp = pk.resolve({"title": "x", "defaultDuration": "2:00",
                     "items": [{"song": None, "title": "Nada"}]}, INDEX)
    assert rp["totalSeconds"] == 120


def test_exportar():
    rp = pk.resolve({"title": "Mañana 1", "event": "Villancicos 2025", "date": "2025-12-20",
                     "targetMinutes": 60, "items": [
                         {"song": "navidad/hoy_ha_nacido", "title": "Hoy ha Nacido", "key": "D",
                          "capo": 3, "notes": "🎻"},
                         {"type": "break", "title": "Hucha", "minutes": 3}]}, INDEX)
    txt = pk.export_text(rp)
    assert txt.startswith("🎄 *Mañana 1* — Villancicos 2025 (20/12)")
    assert "1. Hoy ha Nacido — D C/3 · 🎻" in txt and "⏸ Hucha (3′)" in txt
    md = pk.export_markdown(rp)
    assert "| 1 | 0′ | Hoy ha Nacido | D C/3 | 🎻 |  |" in md


def test_parse_tone():
    assert pk.parse_tone("lam C/1") == {"key": "Am", "capo": 1}
    assert pk.parse_tone("Do C/7 = SOL") == {"key": "C", "capo": 7, "notes": "= SOL"}
    assert pk.parse_tone("RE  C/") == {"key": "D"}
    assert pk.parse_tone("LA-RE C/4") == {"notes": "LA-RE C/4"}
    assert pk.parse_tone("") == {}


def test_listado_hucha():
    path = SCRIPTS / "villancicos" / "Listado canciones Edificio Hucha 2025.docx"
    if not path.exists():
        print("    (sin el listado: se salta)")
        return
    found = {p["title"]: p for p in pk.packs_from_listado(path)}
    for name in ("Repertorio", "Mañana 1", "Mañana 2", "Tarde 1", "Tarde 2", "Tarde 3", "Tarde 4"):
        assert name in found, name
    m1 = found["Mañana 1"]["items"]
    assert len(m1) == 24 and m1[0]["title"] == "Himno Edificio Hucha"
    assert m1[2] == {"song": None, "title": "Dime Niño", "key": "C", "capo": 7,
                     "notes": "= SOL", "page": "A1"}
    assert found["Tarde 4"]["notes"] == "Extra, secundario"


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"  ✓ {t.__name__}")
    print(f"\n✅ {len(tests)}/{len(tests)} tests OK")


if __name__ == "__main__":
    _run()
