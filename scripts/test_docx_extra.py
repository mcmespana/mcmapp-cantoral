#!/usr/bin/env python3
"""Tests de docx_extra.py (Words sueltos de scripts/input/word/).

Usa el Word real «Letras con acordes guitarra.docx» del repo. Sin red.
  python scripts/test_docx_extra.py      (o con pytest)
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import docx2chordpro as d2c  # noqa: E402
import docx_extra as dx  # noqa: E402

WORD = dx.EXTRA_DIR / "Letras con acordes guitarra.docx"


@unittest.skipUnless(WORD.exists(), "falta el Word de ejemplo")
class TestLetrasConAcordes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.songs = dx.split_songs(WORD)
        cls.by_title = {s["title_raw"]: s for s in cls.songs}

    def conv(self, title):
        return dx.convert_song(self.by_title[title], WORD)

    def test_ocho_canciones_con_titulo_limpio(self):
        # Títulos con «1️.» y sin Heading2 («2️. LA CESTA VERDE») cuentan; las
        # notas en Heading2 («Opción 2ª C4…») no son canciones.
        self.assertEqual([s["title_raw"] for s in self.songs], [
            "LA FUERZA DE UN SUEÑO", "LA CESTA VERDE", "HACIENDO EL BIEN",
            "70 VECES 7", "A TU MODO", "SIN PALABRAS",
            "EL AMOR NO TIENE FRONTERAS", "LA FUERZA DEL EVANGELIO",
        ])
        self.assertTrue(all(s["section"] is None for s in self.songs))

    def test_creditos_a_artist(self):
        self.assertEqual(self.by_title["LA CESTA VERDE"]["artist"], "Marisa Arrufat")
        self.assertEqual(self.by_title["A TU MODO"]["artist"],
                         "María Teresa Collado / Alejandro Balfagó")
        body = self.conv("LA CESTA VERDE")["body"]
        self.assertNotIn("Letra y música", body)

    def test_acordes_espanoles_y_estribillo(self):
        c = self.conv("LA FUERZA DE UN SUEÑO")
        self.assertEqual(c["title"], "La Fuerza de un Sueño")
        self.assertEqual(c["key"], "C")
        # rem/fam (menores en minúscula) → Dm/Fm
        self.assertIn("[Dm]Con su beso", c["body"])
        self.assertIn("[Fm]", c["body"])
        self.assertIn("{soc}", c["body"])
        self.assertIn("[C]ANOCHE TUVE UN SUEÑO", c["body"])

    def test_linea_de_acordes_pegada_a_la_letra(self):
        # En el Word, los acordes de la 2ª frase van en el MISMO párrafo que la
        # 1ª (tras muchos espacios). No deben acabar en la 1ª línea.
        body = self.conv("LA FUERZA DE UN SUEÑO")["body"]
        first = next(l for l in body.split("\n") if "He despertado" in l)
        self.assertEqual(first.count("["), 3, first)
        self.assertIn("[C]Aún recuerdo", body)

    def test_intro_y_textos_que_no_son_acordes(self):
        body = self.conv("LA FUERZA DE UN SUEÑO")["body"]
        self.assertIn("{comment: Intro}\n[C] [F] [C] [F]", body)
        self.assertNotIn("[INTRO]", body)
        body = self.conv("A TU MODO")["body"]
        self.assertIn("(Instrumental)", body)
        self.assertNotIn("[(Instrumental)]", body)
        self.assertIn("{comment: Opción 2ª C4 MI= DOM · do#m= lam · sol#m= mi}", body)

    def test_mide_con_la_fuente_del_word(self):
        family, regular, bold = dx.embedded_fonts(WORD)
        self.assertEqual(family, "Roboto")
        self.assertTrue(regular and bold)


class TestFuenteCantoralIntacta(unittest.TestCase):
    def test_fuera_del_contexto_se_mide_con_calibri(self):
        base = d2c.text_width_px("Hola mundo", 24)
        self.assertEqual(d2c.text_width_px("Hola mundo", 24, bold=True), base)
        if WORD.exists():
            _fam, regular, bold = dx.embedded_fonts(WORD)
            with d2c.measuring_with("test:roboto", regular, bold):
                self.assertNotEqual(d2c.text_width_px("Hola mundo", 24), base)
            self.assertEqual(d2c.text_width_px("Hola mundo", 24), base)


if __name__ == "__main__":
    unittest.main()
