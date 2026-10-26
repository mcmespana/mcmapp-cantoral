#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de «traer una canción desde un enlace» (web_import.py). Sin red.

Corre sin dependencias:  python scripts/admin/test_web_import.py

Las páginas son inventadas pero con la misma estructura que las de verdad
(el JSON «js-store» de Ultimate Guitar, el <pre id=t_body> de LaCuerda…).
"""
import html
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import song_import as si  # noqa: E402
import web_import as wi  # noqa: E402


def page(body: str, ct: str = "text/html", url: str = "https://ejemplo.org/c", charset="utf-8"):
    data = body.encode(charset) if isinstance(body, str) else body
    return lambda u: {"url": url, "content_type": ct, "charset": charset, "data": data}


def raises(fn, needle=""):
    try:
        fn()
    except wi.FetchError as e:
        assert needle in str(e), str(e)
        return
    raise AssertionError("debería fallar")


UG_CONTENT = ("[Intro]\r\n[ch]G[/ch] [ch]C[/ch]\r\n\r\n[Verse 1]\r\n"
              "[tab][ch]G[/ch]" + " " * 17 + "[ch]C[/ch]\r\nPor el camino del valle[/tab]\r\n"
              "[tab]        [ch]D[/ch]          [ch]G[/ch]\r\nvamos todos a cantar[/tab]\r\n\r\n"
              "[Chorus]\r\n[tab][ch]C[/ch]" + " " * 8 + "[ch]G[/ch]\r\nAleluya, aleluya[/tab]\r\n"
              "[tab][ch]D[/ch]          [ch]G[/ch]\r\nya llegó la Navidad[/tab]\r\n")
UG_STORE = {"store": {"page": {"data": {
    "tab": {"song_name": "Camino del Valle", "artist_name": "Coro Parroquial", "tonality_name": ""},
    "tab_view": {"meta": {"capo": 2, "tonality": "G"}, "wiki_tab": {"content": UG_CONTENT}}}}}}
UG_PAGE = ('<html><body><div class="js-store" data-content="'
           + html.escape(json.dumps(UG_STORE), quote=True) + '"></div></body></html>')

LC_PAGE = """<html><head><TITLE>CAMINO DEL VALLE, Coro: Acordes</TITLE></head><body>
<h1><a class=r href='camino'>Camino del Valle</a> <span id='tH1span'></span></h1>
<h2><a href=./>Coro Parroquial</a></h2>
<div id=t_body><PRE><div></div>==== Introducción: <A>DO</A>   <A>SOL</A> ===
============== Primera Parte =============
<div></div><A>DO</A>                <A>SOL</A>
Por el camino del valle
<div></div><A>FA</A> -                 <A>REm</A>
     Va can-tando el pas-tor
============== Estribillo ==============
<div></div><A>DO</A>       <A>SOL</A>
Aleluya, aleluya
</PRE></div></body></html>"""


def test_ultimate_guitar():
    r = wi.from_url("https://tabs.ultimate-guitar.com/tab/x/y-chords-1", fetcher=page(UG_PAGE))
    assert r["kind"] == "text" and r["source"] == "Ultimate Guitar"
    res = si.import_text(r["text"])
    assert res.meta["title"] == "Camino del Valle" and res.meta["artist"] == "Coro Parroquial"
    assert res.meta["capo"] == 2 and res.meta["key"] == "G"
    assert "{comment: Intro}\n[G][C]" in res.cho
    assert "[G]Por el camino del [C]valle" in res.cho
    assert "{soc}\n[C]Aleluya, [G]aleluya" in res.cho


def test_lacuerda_headers_and_hyphens():
    r = wi.from_url("https://acordes.lacuerda.net/coro/camino.shtml", fetcher=page(LC_PAGE))
    assert r["source"] == "LaCuerda"
    assert "Intro: DO   SOL" in r["text"] and "Primera Parte" not in r["text"]
    res = si.import_text(r["text"])
    assert res.meta["title"] == "Camino del Valle" and res.meta["artist"] == "Coro Parroquial"
    assert "[C]Por el camino del [G]valle" in res.cho
    # «can-tando», «pas-tor»: guiones fuera y el REm sigue sobre su sílaba.
    assert "[F]Va cantando el [Dm]pastor" in res.cho
    assert "{soc}\n[C]Aleluya, [G]aleluya" in res.cho


def test_dehyphenate():
    ch, ly = wi.dehyphenate("FA -" + " " * 17 + "REm", "     Va can-tando el pas-tor")
    assert ly == "     Va cantando el pastor"
    assert ch.index("REm") == ly.index("pastor")  # el acorde sigue sobre «pas»
    assert wi.dehyphenate("DO", "Uohh - oohh") == ("DO", "Uohh - oohh")  # guion con espacios: se queda


def test_generic_pre_and_title():
    body = ("<html><head><title>Camino del Valle - Coro - Cifras</title></head><body>"
            "<pre>Menú sin acordes</pre>"
            "<pre><b>G</b>" + " " * 17 + "<b>C</b>\nPor el camino del valle\n"
            "        <b>D</b>          <b>G</b>\nvamos todos a cantar</pre></body></html>")
    r = wi.from_url("https://cifras.example/camino", fetcher=page(body))
    assert r["kind"] == "text"
    res = si.import_text(r["text"])
    assert res.meta["title"] == "Camino del Valle"
    assert "[G]Por el camino del [C]valle" in res.cho


def test_unknown_page_goes_to_ai_without_menus():
    body = ("<html><head><title>Mi blog</title><style>p{}</style></head><body><nav>Inicio Blog</nav>"
            "<h1>Camino del valle</h1><p>Por el camino del valle<br>vamos todos a cantar</p>"
            "<script>var x=1</script><footer>© 2026</footer></body></html>")
    r = wi.from_url("https://blog.example/camino", fetcher=page(body))
    assert r["kind"] == "page" and r["title"] == "Camino del valle"
    assert "Por el camino del valle\nvamos todos a cantar" in r["text"]
    assert "Inicio" not in r["text"] and "var x" not in r["text"] and "©" not in r["text"]


def test_media_text_and_doce():
    assert wi.from_url("https://x.org/a.jpg", fetcher=page(b"\xff\xd8\xff", "image/jpeg"))["kind"] == "media"
    assert wi.from_url("https://x.org/a", fetcher=page(b"%PDF-1.4 ...", "application/octet-stream"))["kind"] == "media"
    r = wi.from_url("https://x.org/a.txt", fetcher=page("﻿Título\n\nG\nHola", "text/plain"))
    assert r["kind"] == "text" and r["text"].startswith("Título")
    r = wi.from_url("https://doceacordes.es/cancion/1234/algo", fetcher=None)
    assert r == {"kind": "doce", "id": "1234", "url": "https://doceacordes.es/cancion/1234/algo"}
    raises(lambda: wi.from_url("hola qué tal"), "enlace")
    raises(lambda: wi.from_url("https://x.org/a.zip", fetcher=page(b"PK\x03\x04", "application/zip")), "zip")


def test_rewrite_share_links():
    assert wi.rewrite("https://drive.google.com/file/d/1AbCdEfGhIjK_lm/view?usp=sharing") == \
        "https://drive.google.com/uc?export=download&id=1AbCdEfGhIjK_lm"
    assert wi.rewrite("https://drive.google.com/open?id=1AbCdEfGhIjK_lm") == \
        "https://drive.google.com/uc?export=download&id=1AbCdEfGhIjK_lm"
    assert wi.rewrite("https://docs.google.com/document/d/1AbCdEfGhIjK_lm/edit") == \
        "https://docs.google.com/document/d/1AbCdEfGhIjK_lm/export?format=txt"
    assert wi.rewrite("https://www.dropbox.com/s/abc/cancion.pdf?dl=0").endswith("cancion.pdf?dl=1")
    # Drive que devuelve una página en vez del archivo: no es público.
    raises(lambda: wi.from_url("https://drive.google.com/file/d/1AbCdEfGhIjK_lm/view",
                               fetcher=page("<html><body>Inicia sesión</body></html>",
                                            url="https://accounts.google.com/x")), "Cualquier persona")


def test_internal_addresses_refused():
    for url in ("http://127.0.0.1:8765/api/song", "http://localhost/", "http://192.168.1.10/",
                "http://[::1]/", "ftp://example.org/x", "file:///etc/passwd"):
        raises(lambda u=url: wi.check_url(u))


def test_latin1_page_decoded():
    body = "<html><head><meta charset='iso-8859-1'></head><body><p>Canción de Belén</p></body></html>"
    r = wi.from_url("https://x.org/", fetcher=page(body.encode("latin-1"), charset=None))
    assert "Canción de Belén" in r["text"]


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
