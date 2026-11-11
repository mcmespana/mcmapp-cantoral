#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del importador del Word de los Villancicos Solidarios.

    python scripts/test_villancicos_docx.py      (o con pytest)

Casi todo se prueba con un Word FABRICADO aquí mismo (versos tradicionales o
inventados: nada de letras con derechos en los tests), que reproduce cada
trampa del de verdad: tabla a dos columnas, acordes a la izquierda y letra
centrada, negrita/cursiva/subrayado, notas pequeñas a la derecha, etiquetas
con acordes, [CLAP], la canción que sigue en la columna de la derecha…
Al final, unas comprobaciones sobre el Word real si está en el repo.
"""
import io
import re
import sys
import zipfile
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))

import villancicos_docx as vd  # noqa: E402

NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
CELL_W = 6180          # dxa, como el Word real
CELL_MARGIN = 100


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def run(text, b=False, i=False, u=False, sz=None, font=None):
    rpr = ""
    if font:
        rpr += f'<w:rFonts w:ascii="{font}" w:hAnsi="{font}"/>'
    if b:
        rpr += "<w:b/>"
    if i:
        rpr += "<w:i/>"
    if u:
        rpr += '<w:u w:val="single"/>'
    if sz:
        rpr += f'<w:sz w:val="{sz}"/>'
    parts = []
    for k, piece in enumerate(text.split("\n")):
        if k:
            parts.append("<w:br/>")
        parts.append(f'<w:t xml:space="preserve">{esc(piece)}</w:t>')
    return f"<w:r><w:rPr>{rpr}</w:rPr>{''.join(parts)}</w:r>"


def para(*runs, jc=None, style=None):
    ppr = ""
    if style:
        ppr += f'<w:pStyle w:val="{style}"/>'
    if jc:
        ppr += f'<w:jc w:val="{jc}"/>'
    return f"<w:p><w:pPr>{ppr}</w:pPr>{''.join(runs)}</w:p>"


def table(left, right):
    cell = lambda body: (f'<w:tc><w:tcPr><w:tcMar><w:left w:w="{CELL_MARGIN}" w:type="dxa"/>'
                         f'<w:right w:w="{CELL_MARGIN}" w:type="dxa"/></w:tcMar></w:tcPr>{body}</w:tc>')
    return (f'<w:tbl><w:tblPr><w:tblW w:w="{CELL_W * 2}" w:type="dxa"/></w:tblPr>'
            f'<w:tblGrid><w:gridCol w:w="{CELL_W}"/><w:gridCol w:w="{CELL_W}"/></w:tblGrid>'
            f"<w:tr>{cell(left)}{cell(right)}</w:tr></w:tbl>")


STYLES = f"""<?xml version="1.0" encoding="UTF-8"?>
<w:styles {NS}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri"/><w:sz w:val="24"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:jc w:val="center"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:styleId="Normal" w:default="1"><w:name w:val="normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/>
<w:pPr><w:jc w:val="center"/></w:pPr><w:rPr><w:rFonts w:ascii="Poiret One"/><w:b/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/>
<w:rPr><w:rFonts w:ascii="Poiret One"/><w:sz w:val="26"/></w:rPr></w:style>
</w:styles>"""


def build_docx(body_xml):
    doc = (f'<?xml version="1.0" encoding="UTF-8"?><w:document {NS}><w:body>{body_xml}'
           '<w:sectPr><w:pgSz w:w="11909" w:h="16834"/>'
           '<w:pgMar w:left="1440" w:right="1440" w:top="1440" w:bottom="1440"/></w:sectPr>'
           "</w:body></w:document>")
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        z.writestr("word/document.xml", doc)
        z.writestr("word/styles.xml", STYLES)
    return buf.getvalue()


def spaces_to(x_px, bold=True):
    """Espacios necesarios para que, en una línea alineada a la izquierda, el
    acorde empiece en x_px (como hacen a mano en el Word)."""
    return " " * round(x_px / vd.char_width(" ", 24, bold, False))


def centered_x(lyric, upto):
    """x (px) del carácter `upto` de una línea centrada en la celda."""
    w = sum(vd.char_width(c, 24, False, False) for c in lyric)
    avail = (CELL_W - 2 * CELL_MARGIN) * vd.PX_PER_DXA
    return (avail - w) / 2 + sum(vd.char_width(c, 24, False, False) for c in lyric[:upto])


LYRIC = "Campana sobre campana"
LEFT = "".join([
    para(run("70 - Campanas de Prueba C/2"), style="Title"),
    para(run("Grupo Inventado"), style="Subtitle"),
    # Acorde a la izquierda con espacios, puesto encima de «sobre» de la letra CENTRADA.
    para(run("DO" + spaces_to(centered_x(LYRIC, 8) - sum(vd.char_width(c, 24, True, False) for c in "DO"))
             + "SOL", b=True), jc="left"),
    para(run(LYRIC)),
    para(run("")),
    para(run("Estrofa 1", b=True, sz=16), run(": Se añade bombo y pandereta", sz=16), jc="right"),
    para(run("Una estrella se ha perdido [CLAP] y en el cielo no aparece")),
    para(run("Y la virgen "), run("le contesta", i=True)),
    para(run("Venid y adoremos", u=True)),
    para(run("")),
    para(run("TODA LA GLORIA A DIOS EN EL CIELO", b=True)),
    para(run("Y EN LA TIERRA PAZ", b=True)),
    para(run("")),
    para(run("Toda la canción:", b=True), run("   lam    FA    DO    SOL"), jc="left"),
    para(run("ESTRIBILLO", b=True)),
    para(run("")),
    para(run("71 - Notación Antigua"), style="Title"),
    para(run("la-        Sol+        SIB     SOL +7     FA(rem)", b=True), jc="left"),
    para(run("Verso inventado para probar acordes raros"), jc="left"),
    para(run("La la la la la la la laaaa"), jc="left"),
])
RIGHT = "".join([
    # Sin título arriba: sigue la canción de arriba de la izquierda (la 70).
    para(run("Esto sigue en la otra columna")),
    para(run("")),
    para(run("72 - Acordes y Letra Juntos"), style="Title"),
    para(run("DO\t\t\tFA\t\t\tSOL ", b=True), run("CANTEMOS TODOS CON ALEGRÍA AL NIÑO DIOS", b=True), jc="both"),
])


def _songs():
    path = Path(__file__).resolve().parent / "staging_villancicos" / "_test.docx"
    path.parent.mkdir(exist_ok=True)
    path.write_bytes(build_docx(table(LEFT, RIGHT)))
    try:
        songs = vd.split_songs(vd.read_paragraphs(path))
    finally:
        path.unlink()
    return {s.number: s for s in songs}


SONGS = _songs()


def cho(n):
    return vd.convert_song(SONGS[n])["cho"]


# ── acordes ─────────────────────────────────────────────────────────────────────
def test_translate_token():
    t = vd.translate_token
    assert t("DO") == ["C"] and t("lam") == ["Am"] and t("fa#m") == ["F#m"]
    assert t("la-") == ["Am"] and t("si-7") == ["Bm7"]          # «-» = menor
    assert t("Sol+") == ["G"] and t("LA+") == ["A"]              # «+» = mayor
    assert t("SIB") == ["Bb"] and t("SIm") == ["Bm"] and t("mIm") == ["Em"]
    assert t("+7", "G") == ["G7"]                                # «SOL +7» = G G7
    assert t("SOL-FA-SOL") == ["G", "F", "G"]
    assert t("(LA)") == ["(A)"]
    assert t("FA(rem)") == ["F", "(Dm)"] and t("Sib(m)") == ["Bb", "(Bbm)"]
    assert t("FA#M") == ["F#m"]
    assert t("RE/FA#") == ["D/F#"] and t("lam.") == ["Am"]
    assert t("Hola") is None and t("laaaa") is None


def test_sentence_case():
    assert vd.sentence_case("HOY HA NACIDO EL DIOS DEL AMOR") == "Hoy ha nacido el Dios del amor"
    assert vd.sentence_case("I DON'T WANT A LOT FOR CHRISTMAS") == "I don't want a lot for Christmas"


# ── el Word fabricado ───────────────────────────────────────────────────────────
def test_titulo_numero_cejilla_y_autor():
    s = SONGS[70]
    assert (s.title, s.capo, s.artist) == ("Campanas de Prueba", 2, "Grupo Inventado")
    c = cho(70)
    assert "{title: Campanas de Prueba}" in c and "{capo: 2}" in c
    assert "{artist: Grupo Inventado}" in c and "(nº 70)" in c


def test_acorde_sobre_letra_centrada():
    # El SOL se escribió a la izquierda con espacios para caer sobre «sobre»
    # en la letra centrada. Contando caracteres caería en otro sitio.
    assert "[C]Campana [G]sobre campana" in cho(70)


def test_nota_pequena_a_la_derecha():
    c = cho(70)
    assert "{c: Estrofa 1}\n{arr: Se añade bombo y pandereta}" in c


def test_clap_cursiva_subrayado():
    c = cho(70)
    assert "Una estrella se ha perdido [*CLAP] y en el cielo no aparece" in c
    assert "Y la virgen <i>le contesta</i>" in c
    assert "<u>Venid y adoremos</u>" in c


def test_estribillo_en_negrita_y_mayusculas():
    c = cho(70)
    assert "{soc}\nToda la gloria a Dios en el cielo\nY en la tierra paz\n{eoc}" in c


def test_etiqueta_con_acordes_y_estribillo_suelto():
    c = cho(70)
    assert "{c: Toda la canción}\n[Am] [F] [C] [G]" in c
    assert "{chorus}" in c


def test_sigue_en_la_columna_derecha():
    c = cho(70)
    assert "Esto sigue en la otra columna" in c
    assert any("otra columna" in w for w in vd.convert_song(SONGS[70])["warnings"])
    assert "Esto sigue" not in cho(72)


def test_notacion_antigua_y_la_la_la():
    c = cho(71)
    assert re.search(r"\[Am\].*\[G\].*\[Bb\].*\[G\].*\[G7\].*\[F\]\[\(Dm\)\]", c)
    # «La la la… laaaa» es letra, no una línea de acordes.
    assert "La la la la la la la laaaa" in c


def test_acordes_y_letra_en_el_mismo_renglon():
    c = cho(72)
    assert "{soc}" in c and "[C]" in c and "[F]" in c and "[G]" in c
    assert "Cantemos todos con alegría al niño Dios" in re.sub(r"\[[^\]]*\]", "", c)


def test_marcado_no_cruza_lineas():
    out = vd.balance_markup("<i>Una frase larga que se partió,\nen dos líneas</i>\n{c: X}")
    assert out.split("\n")[:2] == ["<i>Una frase larga que se partió,</i>", "<i>en dos líneas</i>"]


# ── el Word real (si está en el repo) ──────────────────────────────────────────
def test_word_real():
    path = vd.find_docx()
    if path is None:
        print("    (sin el Word real: se salta)")
        return
    songs = vd.load_songs(path)
    by_num = {s.number: s for s in songs if s.number is not None}
    assert len(songs) >= 50 and 19 in by_num and 66 in by_num
    hoy = vd.converted(by_num[19])["cho"]
    # Comprobado contra las posiciones del PDF exportado por Google Docs.
    assert "lle[G]gan[D]do" in hoy and "[F#m]el silencio" in hoy and "Hoy ha [D]nacido" in hoy
    # La 32 sigue arriba de la columna derecha de la misma página.
    assert "Sabes que cuando te" in vd.converted(by_num[32])["cho"]
    for s in songs:
        c = vd.converted(s)["cho"]
        for inner in re.findall(r"\[([^\]]*)\]", c):
            assert inner.startswith("*") or re.match(r"^\(?[A-G]", inner), (s.title, inner)
        assert "{soc}" not in c or c.count("{soc}") == c.count("{eoc}"), s.title


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"  ✓ {t.__name__}")
    print(f"\n✅ {len(tests)}/{len(tests)} tests OK")


if __name__ == "__main__":
    _run()
