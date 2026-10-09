#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del arreglador de .cho (`arreglar_cho.py`).

Corre sin dependencias:  python scripts/test_arreglar_cho.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from arreglar_cho import arreglar, es_chord_to_en, split_long  # noqa: E402


def test_estribillo_como_letra_pasa_a_chorus():
    new, done = arreglar("[G]Estrofa\n\n{soc}\nESTRIBILLO\n{eoc}\n")
    assert "{chorus}" in new and "{soc}" not in new and "ESTRIBILLO" not in new
    assert done["estribillo_texto"] == 1


def test_numeracion_a_mano_fuera_y_el_acorde_se_queda():
    new, _ = arreglar("[C]1. Hay muchas [G]formas\n\n2. Porque [C]juntas")
    assert new == "[C]Hay muchas [G]formas\n\nPorque [C]juntas"


def test_intro_en_comentario_a_linea_de_acordes():
    new, _ = arreglar("{comment: Intro: lam | SOL | DO | SOL  x2}")
    assert new == "{c: Intro}\n[Am] [G] [C] [G] x2"
    assert es_chord_to_en("FA#m") == "F#m" and es_chord_to_en("Do") == "C"
    assert es_chord_to_en("SOL7") == "G7" and es_chord_to_en("hola") is None


def test_linea_larga_se_parte_por_frases_sin_perder_acordes():
    raw = "Esta [A]paz que hoy nos das, viva [D]siempre estará, en [F#m]la tierra como en el [E]cielo."
    assert split_long(raw) == [
        "Esta [A]paz que hoy nos das, viva [D]siempre estará,",
        "en [F#m]la tierra como en el [E]cielo.",
    ]


def test_acorde_en_el_corte_pasa_a_la_linea_nueva():
    raw = "Se[D]ñor, he oído tu [Em]fama,[A] tu obra me ha impresio[D]nado y otra cosa más larga."
    parts = split_long(raw)
    assert parts[0].endswith("fama,") and parts[1].startswith("[A]tu obra")


def test_estrofa_de_pdf_se_une_y_se_parte_por_frases():
    src = ("El [G]amor, ha de [C]traducirse en [D]hechos, es mu[G]cho más que pa[Em]labras, mucho [Bm]más que\n"
           "sentimientos, o[C]bras son [D]amores.")
    new, done = arreglar(src)
    assert done["linea_partida"] == 1
    assert "mucho [Bm]más que sentimientos," in new


def test_versos_cortos_no_se_tocan():
    src = "[C]Siempre imaginé la fe[F]licidad\nligada al [C]poder"
    assert arreglar(src)[0] == src


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"  ✓ {t.__name__}")
    print(f"\n✅ {len(tests)}/{len(tests)} tests OK")


if __name__ == "__main__":
    _run()
