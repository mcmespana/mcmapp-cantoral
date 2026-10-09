#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del importador de canciones sueltas (song_import.py).

Corre sin dependencias:  python scripts/admin/test_song_import.py
(También vale con pytest:  pytest scripts/admin/test_song_import.py)

Los textos de fixtures_import/ son cuatro canciones reales de cantorales en
papel (Hacia Belén, Hoy ha nacido, Huracán, Hoy en Belén) pasadas a texto tal y
como llegarían al copiarlas: acordes en la línea de encima, estribillos sin
acordes, títulos con número, cejilla escrita a mano…
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import song_import as si  # noqa: E402
import chordpro as cp  # noqa: E402

FIX = HERE / "fixtures_import"


def load(name: str) -> si.ImportResult:
    return si.import_text((FIX / f"{name}.txt").read_text(encoding="utf-8"))


def block_after_marker(cho: str) -> list:
    """Líneas de cada estrofa marcada como deducida."""
    out, cur, on = [], [], False
    for ln in cho.splitlines():
        if ln.startswith("{" + cp.DEDUCED_DIRECTIVE):
            on, cur = True, []
            continue
        if on and (not ln.strip()):
            out.append(cur)
            on = False
        elif on:
            cur.append(ln)
    if on:
        out.append(cur)
    return out


# ── acordes ────────────────────────────────────────────────────────────────────
def test_lyric_lines_are_not_chord_lines():
    # «Si», «La», «Mi», «A» son acordes… y palabras. Una sola palabra que no sea
    # acorde basta para que la línea sea letra.
    for s in ["Si la vida te da limones", "A mi Dios le canto", "La la la la",
              "Mi Señor", "Do re mi fa sol"]:
        assert si.classify_chord_line(s) is None, s


def test_chord_lines_es_and_en():
    _, ch, _ = si.classify_chord_line("RE      LA            SOL  RE")
    assert [c for _, c in ch] == ["RE", "LA", "SOL", "RE"]
    _, ch, _ = si.classify_chord_line("sim         fa#m      mim     SOL")
    assert [si.to_english(c) for _, c in ch] == ["Bm", "F#m", "Em", "G"]
    _, ch, _ = si.classify_chord_line("G    Am     Bm7   Cadd9   C/E  Dsus4")
    assert [c for _, c in ch] == ["G", "Am", "Bm7", "Cadd9", "C/E", "Dsus4"]


def test_detached_suffix_and_dash():
    _, ch, _ = si.classify_chord_line("DO          Sol 7")
    assert [si.to_english(c) for _, c in ch] == ["C", "G7"]
    _, ch, _ = si.classify_chord_line("LA          RE-LA")
    assert [(col, si.to_english(c)) for col, c in ch] == [(0, "A"), (12, "D"), (15, "A")]


def test_chord_line_label_and_suffix():
    label, ch, suffix = si.classify_chord_line("INTRO: G D Em C (x2)")
    assert label.lower() == "intro" and [c for _, c in ch] == ["G", "D", "Em", "C"]
    assert suffix == "(x2)"


def test_to_english():
    for es, en in [("Sol7", "G7"), ("sim", "Bm"), ("fa#m", "F#m"), ("SIb", "Bb"),
                   ("FA#", "F#"), ("Do#m", "C#m"), ("em", "Em"), ("Re/Fa#", "D/F#")]:
        assert si.to_english(es) == en, (es, si.to_english(es))


# ── formato ────────────────────────────────────────────────────────────────────
def test_detect_format():
    assert si.detect_format("[G]Hola [C]que tal\n[D]Adiós") == "chordpro"
    assert si.detect_format("G     C\nHola que tal\n") == "chords_above"
    assert si.detect_format("Hola que tal\nadiós\n") == "lyrics"
    for name in ["huracan", "hoy_en_belen", "hacia_belen", "hoy_ha_nacido"]:
        assert load(name).format == "chords_above", name


# ── metadatos ──────────────────────────────────────────────────────────────────
def test_meta_title_number_and_capo():
    m = load("huracan").meta
    assert m["title"] == "Huracán" and m["capo"] == 5 and m["key"] == "G"


def test_meta_page_header_ignored():
    r = load("hoy_en_belen")
    assert r.meta["title"] == "Hoy en Belén" and r.meta["capo"] == 1
    assert "VILLANCICOS" not in r.cho


def test_meta_capo_in_title():
    assert load("hacia_belen").meta["capo"] == 2      # «HACIA BELEN C/2»
    r = load("hoy_ha_nacido")                          # «19 - Hoy ha Nacido C/O»
    assert r.meta["title"] == "Hoy ha Nacido" and r.meta["capo"] == 0
    assert "{capo" not in r.cho


# ── colocación de acordes ──────────────────────────────────────────────────────
def test_chords_land_on_syllables():
    cho = load("huracan").cho
    assert "[G]Me he hecho tantas pre[D]guntas" in cho
    assert "[Em]intentando enten[C]der," in cho


def test_centered_text_indent_is_removed():
    # La letra centrada con espacios delante: la columna del acorde se cuenta
    # desde donde empieza la letra, no desde el margen.
    cho = load("hoy_ha_nacido").cho
    assert "[D]La no[A]che ya está" in cho
    assert "\n   " not in cho


def test_chords_past_line_end_go_to_end():
    r = si.import_text("G        D            A7\nHola amigo\n")
    assert r.cho.strip().endswith("[G]Hola ami[D]go [A7]")


# ── estribillos ────────────────────────────────────────────────────────────────
def test_caps_chorus_split_from_verse():
    cho = load("hacia_belen").cho
    soc = cho.index("{soc}")
    assert cho[soc:].splitlines()[1].startswith("[G]MARÍA")
    assert "su a[C]nafre.\n\n{soc}" in cho


def test_loose_estribillo_is_written_out():
    for name in ["hacia_belen", "hoy_ha_nacido"]:
        cho = load(name).cho
        assert cho.count("{soc}") == 2, name
        assert "Estribillo" not in cho and "ESTRIBILLO" not in cho, name


def test_estribillo_label_and_repeat_count():
    txt = ("Mi canción\n\nVerso uno\nverso dos\n\nEstribillo:\nGloria gloria\nAleluya\n\n"
           "Otra estrofa\ncon letra\n\nEstribillo x2\n")
    r = si.import_text(txt)
    assert r.cho.count("{soc}") == 3
    assert r.format == "lyrics"
    assert not any("sin otra estrofa" in n.msg for n in r.notes)  # letra sola: sin ruido


def test_repeated_block_is_chorus():
    txt = "Uno dos\ntres cuatro\n\nCinco seis\nsiete ocho\n\nUno dos\ntres cuatro\n"
    assert si.import_text(txt).cho.count("{soc}") == 2


# ── deducción ──────────────────────────────────────────────────────────────────
def test_deduced_verse_is_marked_and_mapped_by_syllable():
    r = load("hoy_ha_nacido")
    blocks = block_after_marker(r.cho)
    assert blocks, "debería haber estrofas deducidas"
    # «En las alturas…» tiene la misma melodía que «La noche…»: primer acorde al
    # principio y el último en «luz» (última sílaba que lleva acorde).
    first = blocks[0][0]
    assert first.startswith("[D]En las") and first.endswith("[D]luz")


def test_identical_chorus_is_copied_not_marked():
    cho = load("huracan").cho
    # El último estribillo es el mismo texto: lleva acordes y no lleva marca.
    last = cho[cho.rindex("{soc}"):]
    assert "Y un hura[G]cán" in last
    before = cho[:cho.rindex("{soc}")].rstrip().splitlines()[-1]
    assert not before.startswith("{" + cp.DEDUCED_DIRECTIVE)
    # el «(x2)» del final no se come acordes
    assert 'fal[Em]ta?" [C] (x2)' in last or 'fal[Em]ta?"[C] (x2)' in last


def test_no_template_means_no_invention():
    r = load("hoy_en_belen")
    # «Tú ya estabas…» no tiene ninguna estrofa de su tamaño con acordes:
    # se deja sin acordes en vez de estirar el «Lele lele» de una línea.
    assert "Tú ya estabas nos lo habían anunciado," in r.cho
    assert any("Tú ya estabas" in n.msg and "sin acordes" in n.msg for n in r.notes)


def test_chorus_deduced_from_chorus():
    cho = load("hoy_en_belen").cho
    assert "junto a una [Bm]mula" in cho


def test_map_line_chords_no_collision():
    src = si.Line(kind="lyric", text="La estrella alumbra",
                  chords=[(0, "D"), (3, "A"), (10, "G"), (12, "D")])
    out = si.map_line_chords(src, "Luz")
    assert len(out) == 4
    src = si.Line(kind="lyric", text="Uno dos tres cuatro", chords=[(0, "C"), (4, "G")])
    out = si.map_line_chords(src, "Ay de mí que", )
    assert out[0][0] != out[1][0]


# ── ChordPro de entrada ───────────────────────────────────────────────────────
def test_chordpro_input_translates_spanish():
    r = si.import_text("{title: Prueba}\n{key: Re}\n[RE]Hola que [lam]tal\n[Sol7]Adiós [fa#m]amigo\n")
    assert r.format == "chordpro" and r.meta["key"] == "D"
    assert "[D]Hola que [Am]tal" in r.cho and "[G7]Adiós [F#m]amigo" in r.cho


def test_reimport_is_idempotent():
    # Importar lo ya importado no cambia nada (y conserva las marcas 👁).
    for name in ["huracan", "hoy_en_belen", "hacia_belen", "hoy_ha_nacido"]:
        r = load(name)
        assert si.import_text(r.cho).cho == r.cho, name


def test_marker_never_reaches_the_app():
    cho = load("hoy_ha_nacido").cho
    assert cp.DEDUCED_DIRECTIVE in cho
    assert cp.DEDUCED_DIRECTIVE not in cp.strip_media(cho)


def _run():
    tests = [(k, v) for k, v in globals().items() if k.startswith("test_") and callable(v)]
    failed = 0
    for name, fn in tests:
        try:
            fn()
            print(f"✓ {name}")
        except Exception as e:  # noqa: BLE001
            failed += 1
            print(f"✗ {name}: {e!r}")
    print(f"\n{len(tests) - failed}/{len(tests)} ok")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    _run()
