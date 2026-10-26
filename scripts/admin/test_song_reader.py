#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del lector de fotos/PDF (song_reader.py) con un cliente falso: no llama a la API.

Corre sin dependencias:  python scripts/admin/test_song_reader.py
(Las pruebas de imágenes necesitan pillow; sin él se saltan.)

fixtures_read/hacia_belen.json es lo que Claude devuelve al leer
fixtures_read/hacia_belen.jpg (una página real de cantoral): sirve para probar
toda la tubería foto → transcripción → .cho. Los demás casos usan letras
inventadas.
"""
import io
import json
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import ai_review  # noqa: E402
import song_import as si  # noqa: E402
import song_reader as sr  # noqa: E402
import chordpro as cp  # noqa: E402

ai_review.SETTINGS_PATH = Path(tempfile.mkdtemp()) / "settings.json"
sr.UPLOADS_DIR = Path(tempfile.mkdtemp()) / ".uploads"
FIX = HERE / "fixtures_read"

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    Image = None


class FakeStream:
    def __init__(self, resp):
        self._resp = resp

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def get_final_message(self):
        return self._resp


class FakeClient:
    """Responde con `payload` por streaming, como el cliente de verdad."""

    def __init__(self, payload, stop_reason="end_turn"):
        self.calls = []
        self._resp = SimpleNamespace(stop_reason=stop_reason, model="claude-opus-5-5",
                                     content=[SimpleNamespace(type="text", text=json.dumps(payload))])
        self.beta = SimpleNamespace(messages=SimpleNamespace(stream=self._stream, create=self._create))

    def _stream(self, **kw):
        self.calls.append(kw)
        return FakeStream(self._resp)

    def _create(self, **kw):  # pragma: no cover - el lector siempre va en streaming
        raise AssertionError("el lector debe ir en streaming")


def song(sections, **kw):
    s = {"title": "Canción de prueba", "artist": "", "key": "", "capo": -1, "category": "",
         "sections": sections, "doubts": []}
    s.update(kw)
    return s


def sec(kind, lines, label=""):
    return {"kind": kind, "label": label, "lines": lines}


# ── la foto real ───────────────────────────────────────────────────────────────
def test_hacia_belen_photo_end_to_end():
    data = json.loads((FIX / "hacia_belen.json").read_text(encoding="utf-8"))
    c = FakeClient(data)
    res = sr.read_files([((FIX / "hacia_belen.jpg").read_bytes(), "image/jpeg")],
                        categories=["N. Navidad"], client=c, save=False)
    assert res["ignored"] and "portal" in res["ignored"][0]
    s = res["songs"][0]
    assert s["title"] == "Hacia Belen" and s["category"] == "N"
    # La transcripción: acordes como en la hoja, «Sol 7» junto, cejilla del «c/2».
    assert "{capo: 2}" in s["text"] and "[Sol7]yo me remendaba" in s["text"]
    assert "Sol 7" not in s["text"]
    # «Estribillo» suelto → escrito entero.
    assert s["text"].count("{soc}") == 2 and any("entero" in n for n in s["notes"])
    # Y por el conversor de siempre: acordes en inglés, estrofa sin acordes deducida 👁.
    r = si.import_text(s["text"])
    assert r.format == "chordpro" and r.meta["capo"] == 2 and r.meta["key"] == "C"
    assert "[G]María, [C]María, ven [G]acá co[C]rriendo," in r.cho
    assert "cargada de chocola[C]te." in r.cho
    assert r.cho.count("{" + cp.DEDUCED_DIRECTIVE) == 1
    assert "[C]En el portal de Belén" in r.cho
    # La petición: la imagen en base64, en streaming, con salida JSON y las categorías.
    kw = c.calls[0]
    content = kw["messages"][0]["content"]
    assert content[0]["type"] == "image" and content[0]["source"]["media_type"] == "image/jpeg"
    assert "N. Navidad" in content[-1]["text"]
    assert kw["output_config"]["format"]["type"] == "json_schema"
    assert kw["max_tokens"] >= 32000


# ── limpieza de versos ─────────────────────────────────────────────────────────
def test_clean_line():
    assert sr.clean_line("[Sol 7]Ven, Se[La m]ñor")[0] == "[Sol7]Ven, Se[Lam]ñor"
    assert sr.clean_line("[C] [-] [A]el canto")[0] == "[C] [A]el canto"
    assert sr.clean_line("y al final del día. (2)")[0] == "y al final del día. (x2)"
    line, dropped = sr.clean_line("[G]Luz [solista]de la mañana")
    assert line == "[G]Luz de la mañana" and dropped == ["solista"]
    assert sr.clean_line("canto [x2]")[0] == "canto (x2)"
    assert sr.clean_line("{soc} no es una directiva")[0] == "(soc) no es una directiva"


def test_sections_render_labels_notes_and_numbers():
    text, notes, ok = sr.render_song(song([
        sec("intro", ["[C][Em][Dm][G7]"]),
        sec("note", [], "Se repite dos veces"),
        sec("verse", ["1. [C]Camino de la [G]sierra", "va el pastor con su cayado"]),
        sec("bridge", ["[Am]Y la luna lo mira"]),
        sec("chorus_ref", []),
    ], title="12. EL PASTOR", key="Do", capo=0))
    assert ok
    assert text.startswith("{title: El Pastor}\n{key: Do}\n")
    assert "{capo:" not in text  # cejilla 0 = sin cejilla
    assert "{c: Intro}\n[C][Em][Dm][G7]" in text
    assert "{c: Se repite dos veces}\n[C]Camino de la [G]sierra" in text  # sin el «1.»
    assert "{c: Puente}\n[Am]Y la luna lo mira" in text
    # Un «Estribillo» suelto sin estribillo escrito: se deja la etiqueta y se avisa.
    assert "{c: Estribillo}" in text and any("no se ha visto" in n for n in notes)


def test_chorus_ref_uses_later_chorus_and_long_lines_split():
    text, _, _ = sr.render_song(song([
        sec("chorus_ref", []),
        sec("verse", ["[D]Cuando la tarde se apaga despacio sobre el campo, los niños vuelven a casa cantando"]),
        sec("chorus", ["[G]Canta, canta", "[D]todo el valle"]),
    ]))
    assert text.count("{soc}\n[G]Canta, canta\n[D]todo el valle\n{eoc}") == 2
    # Más de 70 caracteres: se parte por la coma (arreglar_cho).
    assert "[D]Cuando la tarde se apaga despacio sobre el campo,\nlos niños vuelven a casa cantando" in text


def test_lyrics_only_photo_is_still_chordpro():
    text, _, _ = sr.render_song(song([sec("verse", ["Una estrofa sin acordes", "que sigue aquí"]),
                                      sec("chorus", ["Y el estribillo", "también sin ellos"])]))
    r = si.import_text(text)
    assert r.format == "chordpro" and r.meta["title"] == "Canción de Prueba"
    assert "{soc}\nY el estribillo" in r.cho and "{title" not in r.cho.split("\n", 1)[1]


def test_postprocess_skips_empty_and_cleans():
    res = sr.postprocess({"songs": [song([sec("verse", ["[-]"])]),
                                    song([sec("verse", ["[G]Hola"])], category="n", doubts=["  acorde   dudoso "])],
                          "ignored": ["", "otra canción cortada"]})
    assert len(res["songs"]) == 1
    s = res["songs"][0]
    assert s["category"] == "N" and s["doubts"] == ["acorde dudoso"]
    assert res["ignored"] == ["otra canción cortada"]


def test_refusal_is_review_error():
    try:
        sr.read_files([(b"x", "image/jpeg")], client=FakeClient({}, stop_reason="refusal"), save=False)
    except ai_review.ReviewError as e:
        assert "la lectura" in str(e)
        return
    raise AssertionError("debería fallar")


def test_read_page_sends_text_and_url():
    c = FakeClient({"songs": [song([sec("verse", ["[G]Hola"])])], "ignored": []})
    res = sr.read_page("Menú\nCanción\nG\nHola", "https://ejemplo.org/x", client=c)
    msg = c.calls[0]["messages"][0]["content"][0]["text"]
    assert '<pagina url="https://ejemplo.org/x">' in msg and "Hola" in msg
    assert res["songs"][0]["text"].endswith("[G]Hola\n") and res["uploads"] == []


# ── archivos ───────────────────────────────────────────────────────────────────
def _jpeg(w, h, mode="RGB", fmt="JPEG", exif_rotate=False):
    im = Image.new(mode, (w, h), (255, 255, 255) if mode == "RGB" else None)
    buf = io.BytesIO()
    kw = {}
    if exif_rotate:
        ex = Image.Exif()
        ex[0x0112] = 6  # girar 90°: como las fotos del móvil
        kw["exif"] = ex.tobytes()
    im.save(buf, fmt, **kw)
    return buf.getvalue()


def test_prepare_image_resizes_rotates_and_flattens():
    if Image is None:
        print("  (sin pillow: se salta)")
        return
    data, mt = sr.prepare_upload(_jpeg(6000, 4000), "image/jpeg", "foto.jpg")
    im = Image.open(io.BytesIO(data))
    assert mt == "image/jpeg" and max(im.size) <= sr.MAX_SIDE and im.size[0] * im.size[1] <= sr.MAX_PIXELS
    data, _ = sr.prepare_upload(_jpeg(400, 200, exif_rotate=True), "image/jpeg")
    assert Image.open(io.BytesIO(data)).size == (200, 400)
    png = io.BytesIO()
    Image.new("RGBA", (10, 10), (0, 0, 0, 0)).save(png, "PNG")
    data, _ = sr.prepare_upload(png.getvalue(), "image/png", "captura.png")
    assert Image.open(io.BytesIO(data)).convert("RGB").getpixel((5, 5))[0] > 200  # blanco, no negro
    try:
        sr.prepare_upload(b"no es una imagen", "image/heic", "IMG_0001.HEIC")
    except sr.ReadError as e:
        assert "HEIC" in str(e)
    else:
        raise AssertionError("debería fallar")


def test_prepare_pdf_and_page_limit():
    one = b"%PDF-1.4\n1 0 obj << /Type /Pages >> endobj 2 0 obj << /Type /Page >> endobj"
    assert sr.prepare_upload(one, "application/pdf", "x.pdf") == (one, "application/pdf")
    many = b"%PDF-1.4\n" + b"<< /Type /Page >>\n" * 30
    try:
        sr.prepare_upload(many, "", "cantoral.pdf")
    except sr.ReadError as e:
        assert "30 páginas" in str(e)
    else:
        raise AssertionError("debería fallar")


def test_uploads_saved_and_validated():
    data = b"%PDF-1.4 hola"
    uid = sr.save_upload(data, "application/pdf")
    assert uid.endswith(".pdf") and sr.upload_path(uid).read_bytes() == data
    assert sr.save_upload(data, "application/pdf") == uid  # mismo archivo, mismo id
    for bad in ("../server.py", "x.jpg", uid.replace(".pdf", ".exe"), ""):
        assert sr.upload_path(bad) is None


def test_too_many_files():
    try:
        sr.read_files([(b"x", "image/jpeg")] * (sr.MAX_FILES + 1), client=FakeClient({}), save=False)
    except sr.ReadError:
        return
    raise AssertionError("debería fallar")


if __name__ == "__main__":
    failed = 0
    tests = [(k, v) for k, v in dict(globals()).items() if k.startswith("test_")]
    for name, fn in tests:
        try:
            fn()
            print(f"✓ {name}")
        except Exception as e:  # noqa: BLE001
            failed += 1
            print(f"✗ {name}: {e!r}")
    print(f"\n{len(tests) - failed}/{len(tests)} ok")
    sys.exit(1 if failed else 0)
