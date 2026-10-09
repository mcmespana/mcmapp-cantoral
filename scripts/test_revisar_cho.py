#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del revisor de .cho (`revisar_cho.py`).

Corre sin dependencias:  python scripts/test_revisar_cho.py
(También vale con pytest:  pytest scripts/test_revisar_cho.py)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from revisar_cho import revisar  # noqa: E402

LIMPIA = """{title: Limpia}
{key: G}

[G]Seas quien seas
y como [D]seas

{soc}
[C]Esta es tu [G]casa
{eoc}

[G]Otra estrofa

{chorus}
"""


def test_cancion_limpia_no_da_avisos():
    assert revisar(LIMPIA) == {}


def test_marca_de_revision():
    assert revisar("{comment: ♩ REVISAR ACORDES}\n" + LIMPIA)["revision"] == 1


def test_sin_estribillo():
    coro = "[G]Este es el coro\nque se repite\n"
    assert revisar(coro + "\nUna estrofa\ncon dos líneas\n\n" + coro)["sin_estribillo"] == 1
    # Sin nada que se repita (himno de estrofas, oración, canon) no hay
    # estribillo que marcar.
    assert "sin_estribillo" not in revisar("[G]Solo una estrofa\ncon dos líneas")
    # {c: Estribillo} cuenta como estribillo marcado
    assert "sin_estribillo" not in revisar("{c: Estribillo}\n[G]Coro")


def test_estribillo_escrito_como_letra():
    found = revisar(LIMPIA + "\n{soc}\nESTRIBILLO\n{eoc}\n")
    assert found["estribillo_texto"] == 1
    # una línea que habla del estribillo pero tiene más texto no cuenta
    assert "estribillo_texto" not in revisar(LIMPIA + "\nEstribillo de la vida\n")


def test_linea_larga():
    larga = "[G]Esta paz que hoy nos das, viva [D]siempre estará, en la tierra como en el [E]cielo."
    assert revisar(LIMPIA + "\n" + larga)["linea_larga"] == 1


def test_numeracion_a_mano():
    assert revisar(LIMPIA + "\n1. Hay muchas [C]formas")["numeracion"] == 1


def test_intro_en_comentario():
    assert revisar(LIMPIA + "\n{comment: Intro: lam | SOL | DO x2}")["intro_comentario"] == 1
    # un comentario normal no es una intro
    assert "intro_comentario" not in revisar(LIMPIA + "\n{comment: Suave}")


def test_muro_de_texto():
    muro = "\n".join(f"[G]línea {i}" for i in range(15))
    assert revisar(LIMPIA + "\n" + muro)["muro"] == 1


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
