#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Traer una canción desde un enlace para «✨ Añadir canción».

Qué se hace con cada enlace (`from_url`):

  - doceacordes.es/cancion/N → a la pestaña 🎸 de doceacordes, que ya tiene su
    importador.
  - Una imagen o un PDF (también compartidos en Google Drive o Dropbox) → los
    lee la IA, igual que una foto subida (song_reader.py).
  - Un documento de Google Docs compartido → su texto, como si se pegara.
  - Ultimate Guitar y LaCuerda → la canción sale del HTML tal cual (acordes
    encima de la letra, en letra de ancho fijo) y va a la caja: el conversor
    de siempre (song_import.py) la pasa a ChordPro. Sin IA y sin coste.
  - Cualquier otra web con la canción en un <pre> (Cifra Club, blogs…) → igual.
  - Otra web cualquiera → su texto a la IA para que encuentre la canción; sin
    IA, el texto a la caja para recortarlo a mano.

Solo se traen direcciones públicas de http(s): nada de la red de casa ni del
propio NAS, aunque el enlace (o una redirección) apunte ahí.
"""
from __future__ import annotations

import html as htmllib
import ipaddress
import json
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import song_import as si  # noqa: E402

USER_AGENT = "mcmapp-cantoral admin/1.0"
TIMEOUT = 25
MAX_BYTES = 25 * 1024 * 1024
MAX_PAGE_TEXT = 40000

DOCE_RX = re.compile(r"doceacordes\.es/cancion/(\d+)", re.I)
URL_RX = re.compile(r"^https?://\S+$", re.I)


class FetchError(ValueError):
    """El enlace no se ha podido traer: el mensaje se enseña tal cual."""


# ─────────────────────────── Descarga ─────────────────────────── #

def _check_public(host: str) -> None:
    try:
        infos = socket.getaddrinfo(host, None)
    except socket.gaierror as e:
        raise FetchError(f"No encuentro «{host}». ¿Está bien escrito el enlace?") from e
    for info in infos:
        ip = ipaddress.ip_address(info[4][0].split("%")[0])
        if not ip.is_global:
            raise FetchError("Ese enlace apunta a una dirección interna: no lo traigo.")


def check_url(url: str) -> None:
    p = urllib.parse.urlsplit(url)
    if p.scheme not in ("http", "https") or not p.hostname:
        raise FetchError("Solo se pueden traer enlaces que empiecen por http:// o https://.")
    _check_public(p.hostname)


class _SafeRedirect(urllib.request.HTTPRedirectHandler):
    """Una redirección también tiene que ir a una dirección pública."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url: str) -> Dict[str, object]:
    """Descarga → {url, content_type, charset, data}. Errores como FetchError."""
    check_url(url)
    opener = urllib.request.build_opener(_SafeRedirect)
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT, "Accept-Language": "es,en;q=0.8"})
    try:
        with opener.open(req, timeout=TIMEOUT) as resp:
            data = resp.read(MAX_BYTES + 1)
            ct = resp.headers.get_content_type()
            charset = resp.headers.get_content_charset()
            final = resp.geturl()
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            raise FetchError(f"La web no deja que el servidor traiga la página ({e.code}). "
                             "Copia la canción y pégala, o hazle una captura.") from e
        if e.code == 404:
            raise FetchError("Esa página no existe (404). ¿Está bien el enlace?") from e
        raise FetchError(f"La web ha contestado con un error ({e.code}).") from e
    except (urllib.error.URLError, OSError) as e:
        reason = getattr(e, "reason", e)
        raise FetchError(f"No se ha podido abrir el enlace: {reason}") from e
    if len(data) > MAX_BYTES:
        raise FetchError("Lo que hay en el enlace pesa demasiado (más de 25 MB).")
    return {"url": final, "content_type": ct, "charset": charset, "data": data}


def rewrite(url: str) -> str:
    """Enlaces de «compartir» → el archivo en sí (Drive, Docs, Dropbox)."""
    m = (re.search(r"drive\.google\.com/file/d/([\w-]{10,})", url)
         or re.search(r"drive\.google\.com/(?:open|uc)\?(?:[^#]*&)?id=([\w-]{10,})", url))
    if m:
        return f"https://drive.google.com/uc?export=download&id={m.group(1)}"
    m = re.search(r"docs\.google\.com/document/d/([\w-]{10,})", url)
    if m:
        return f"https://docs.google.com/document/d/{m.group(1)}/export?format=txt"
    if re.search(r"(?:^|\.)dropbox\.com/", urllib.parse.urlsplit(url).netloc + "/"):
        p = urllib.parse.urlsplit(url)
        q = [(k, v) for k, v in urllib.parse.parse_qsl(p.query) if k != "dl"] + [("dl", "1")]
        return urllib.parse.urlunsplit(p._replace(query=urllib.parse.urlencode(q)))
    return url


def _decode(data: bytes, charset: Optional[str]) -> str:
    if not charset:
        m = re.search(rb"<meta[^>]+charset=[\"']?([\w-]+)", data[:4096], re.I)
        charset = m.group(1).decode("ascii", "ignore") if m else "utf-8"
    try:
        text = data.decode(charset)
    except (LookupError, UnicodeDecodeError):
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            text = data.decode("latin-1")
    return text.lstrip("﻿")


# ─────────────────────────── HTML ─────────────────────────── #

def strip_tags(fragment: str) -> str:
    s = re.sub(r"<br\s*/?>", "\n", fragment, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    return htmllib.unescape(s).replace("\xa0", " ").replace("\r\n", "\n").replace("\r", "\n")


def _tag_text(page: str, tag: str) -> str:
    m = re.search(rf"<{tag}\b[^>]*>(.*?)</{tag}>", page, re.S | re.I)
    return re.sub(r"\s+", " ", strip_tags(m.group(1))).strip() if m else ""


def page_title(page: str) -> str:
    t = _tag_text(page, "h1")
    if not t:
        m = re.search(r"<meta[^>]+property=[\"']og:title[\"'][^>]+content=[\"']([^\"']+)", page, re.I)
        t = htmllib.unescape(m.group(1)) if m else _tag_text(page, "title")
        t = re.split(r"\s+[-–|·:]\s+", t)[0]
    return t.strip()[:120]


_SKIP_TAGS = {"script", "style", "noscript", "svg", "head", "nav", "footer", "header", "aside",
              "form", "button", "select", "iframe", "template"}
_BLOCK_TAGS = {"p", "div", "br", "li", "ul", "ol", "tr", "table", "section", "article", "main",
               "h1", "h2", "h3", "h4", "h5", "h6", "pre", "blockquote", "dd", "dt"}


class _TextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out: List[str] = []
        self.skip = 0
        self.pre = 0

    def handle_starttag(self, tag, attrs):
        if tag in _SKIP_TAGS:
            self.skip += 1
        elif tag in _BLOCK_TAGS:
            self.out.append("\n")
        if tag == "pre":
            self.pre += 1

    def handle_endtag(self, tag):
        if tag in _SKIP_TAGS and self.skip:
            self.skip -= 1
        elif tag in _BLOCK_TAGS:
            self.out.append("\n")
        if tag == "pre" and self.pre:
            self.pre -= 1

    def handle_data(self, data):
        if self.skip:
            return
        self.out.append(data if self.pre else re.sub(r"[ \t\r\n]+", " ", data))


def visible_text(page: str) -> str:
    """El texto que se ve de una página (sin menús, scripts ni estilos)."""
    p = _TextParser()
    try:
        p.feed(page)
        p.close()
    except Exception:  # HTML roto: con lo que haya
        pass
    lines = [ln.rstrip().replace("\xa0", " ") for ln in "".join(p.out).split("\n")]
    text = re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()
    return text[:MAX_PAGE_TEXT]


def _chord_lines(text: str) -> int:
    return sum(1 for ln in text.split("\n") if ln.strip() and si.classify_chord_line(ln))


def with_meta(body: str, meta: Dict[str, object]) -> str:
    """Título, autor, tono y cejilla delante, como los entiende song_import."""
    body = body.strip("\n")
    head: List[str] = []
    title = str(meta.get("title") or "").strip()
    first = next((ln.strip() for ln in body.split("\n") if ln.strip()), "")
    if title and si._norm(title) != si._norm(first):
        head += [title, ""]
    extra = []
    if meta.get("artist"):
        extra.append(f"Autor: {meta['artist']}")
    if meta.get("key"):
        extra.append(f"Tono: {meta['key']}")
    try:
        capo = int(meta.get("capo") or 0)
    except (TypeError, ValueError):
        capo = 0
    if capo > 0:
        extra.append(f"Cejilla {capo}")
    if extra:
        head += extra + [""]
    return "\n".join(head + [body]) + "\n"


# ─────────────────────────── Webs conocidas ─────────────────────────── #

# Cabeceras de sección de Ultimate Guitar → lo que entiende song_import.
_UG_SECTIONS = [
    (r"pre-?chorus", "Precoro"), (r"chorus|refrain|hook|estribillo|coro", "Estribillo"),
    (r"bridge|puente", "Puente"), (r"intro", "Intro"), (r"outro|final|ending", "Final"),
    (r"instrumental", "Instrumental"), (r"interlude|interludio", "Interludio"), (r"solo", "Solo"),
]


def _section_label(name: str) -> str:
    n = name.strip().lower()
    for rx, label in _UG_SECTIONS:
        if re.match(rf"(?:{rx})\b", n):
            return label
    return ""  # «Verse 1», «Primera parte»…: solo separa estrofas


def ultimate_guitar(page: str) -> Optional[Tuple[str, Dict[str, object]]]:
    """La canción de una página de Ultimate Guitar (va en un JSON dentro del HTML)."""
    m = re.search(r'class="js-store"\s+data-content="([^"]+)"', page)
    if not m:
        return None
    try:
        data = json.loads(htmllib.unescape(m.group(1)))["store"]["page"]["data"]
        content = data["tab_view"]["wiki_tab"]["content"]
    except (ValueError, KeyError, TypeError):
        return None
    tab = data.get("tab") or {}
    tv_meta = (data.get("tab_view") or {}).get("meta") or {}
    meta = {
        "title": tab.get("song_name") or "",
        "artist": tab.get("artist_name") or "",
        "key": tv_meta.get("tonality") or tab.get("tonality_name") or "",
        "capo": tv_meta.get("capo") or 0,
    }
    text = content.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\[/?tab\]", "", text)
    text = re.sub(r"\[ch\](.*?)\[/ch\]", r"\1", text)
    out: List[str] = []
    for ln in text.split("\n"):
        sm = re.match(r"^\s*\[([^\]]+)\]\s*$", ln)
        if sm:
            label = _section_label(re.sub(r"\d+", "", sm.group(1)))
            out += ["", label] if label else [""]
            continue
        out.append(ln.rstrip())
    return "\n".join(out), meta


_LC_BODY_RX = re.compile(r"id=['\"]?t_body['\"]?[^>]*>\s*<pre[^>]*>(.*?)</pre>", re.S | re.I)
_LC_HEADER_RX = re.compile(r"^\s*=+\s*(.*?)\s*=*\s*$")
# Guion que LaCuerda mete dentro de una palabra para cuadrar un acorde («ma-druga»).
_SYL_HYPHEN_RX = re.compile(r"(?<=[^\W\d_])-(?=[^\W\d_])")


def _lc_header(line: str) -> Optional[str]:
    """«=== Introducción: DO SOL ===» → «Intro: DO SOL»; «== Estribillo 1 ==» → «Estribillo»."""
    if not line.lstrip().startswith("=="):
        return None
    m = _LC_HEADER_RX.match(line)
    label = m.group(1) if m else ""
    if ":" in label:
        name, rest = label.split(":", 1)
        if rest.strip() and si.classify_chord_line(rest.strip()):
            return f"{_section_label(re.sub(r'introducci[oó]n', 'intro', name, flags=re.I)) or 'Intro'}: {rest.strip()}"
        label = name
    return _section_label(re.sub(r"introducci[oó]n", "intro", label, flags=re.I))


def dehyphenate(chord_line: str, lyric: str) -> Tuple[str, str]:
    """Quita los guiones de sílaba de la letra y corre los acordes que caían detrás."""
    cuts = [m.start() for m in _SYL_HYPHEN_RX.finditer(lyric)]
    if not cuts:
        return chord_line, lyric
    out = ""
    for m in re.finditer(r"\S+", chord_line):
        col = m.start() - sum(1 for c in cuts if c < m.start())
        col = max(col, len(out) + (1 if out else 0))
        out = out.ljust(col) + m.group(0)
    return out, _SYL_HYPHEN_RX.sub("", lyric)


def lacuerda(page: str) -> Optional[Tuple[str, Dict[str, object]]]:
    m = _LC_BODY_RX.search(page)
    if not m:
        return None
    lines = strip_tags(m.group(1)).split("\n")
    out: List[str] = []
    i = 0
    while i < len(lines):
        ln = lines[i].rstrip()
        hdr = _lc_header(ln)
        if hdr is not None:
            out += ["", hdr] if hdr else [""]
            i += 1
            continue
        if si.classify_chord_line(ln) and i + 1 < len(lines) and lines[i + 1].strip() \
                and not si.classify_chord_line(lines[i + 1]) and _lc_header(lines[i + 1]) is None:
            ch, ly = dehyphenate(ln, lines[i + 1].rstrip())
            out += [ch, ly]
            i += 2
            continue
        out.append(ln)
        i += 1
    meta = {"title": _tag_text(page, "h1"), "artist": _tag_text(page, "h2")}
    return "\n".join(out), meta


def best_pre(page: str) -> Optional[str]:
    """El <pre> con más líneas de acordes (Cifra Club, blogs…), si tiene al menos dos."""
    best, score = None, 1
    for m in re.finditer(r"<pre\b[^>]*>(.*?)</pre>", page, re.S | re.I):
        txt = strip_tags(m.group(1))
        n = _chord_lines(txt)
        if n > score:
            best, score = txt, n
    return best


# ─────────────────────────── Entrada ─────────────────────────── #

def from_url(url: str, fetcher=None) -> Dict[str, object]:
    """Enlace → qué hacer con él. Devuelve un dict con `kind`:

      - doce:  {id}                    → abrir en la pestaña de doceacordes
      - media: {data, content_type}    → foto/PDF: lo lee la IA
      - text:  {text, source}          → a la caja, como si se pegara
      - page:  {text, title}           → texto de una web cualquiera: para la IA
    Todos llevan `url` (la final, tras redirecciones).
    """
    url = (url or "").strip()
    if not URL_RX.match(url):
        raise FetchError("Eso no parece un enlace (tiene que empezar por http:// o https://).")
    m = DOCE_RX.search(url)
    if m:
        return {"kind": "doce", "id": m.group(1), "url": url}
    target = rewrite(url)
    got = (fetcher or fetch)(target)
    data: bytes = got["data"]
    ct = str(got.get("content_type") or "").lower()
    final = str(got.get("url") or target)
    host = urllib.parse.urlsplit(final).netloc.lower()
    if data.startswith(b"%PDF") or ct == "application/pdf" or ct.startswith("image/"):
        return {"kind": "media", "data": data, "content_type": ct, "url": final}
    text = _decode(data, got.get("charset"))
    if ct == "text/plain":
        if not text.strip():
            raise FetchError("El enlace no tiene texto.")
        return {"kind": "text", "text": text.strip() + "\n", "source": host, "url": final}
    if "html" not in ct and not re.search(r"<html|<body|<div", text[:2000], re.I):
        raise FetchError(f"No sé qué hacer con ese enlace (es un «{ct or 'archivo'}»).")
    if "google.com" in host and ("export=download" in target or "/export?" in target):
        raise FetchError("Google no ha dado el archivo: compártelo como «Cualquier persona con "
                         "el enlace» y vuelve a probar.")
    for name, extractor in (("Ultimate Guitar", ultimate_guitar), ("LaCuerda", lacuerda)):
        got_song = extractor(text)
        if got_song and got_song[0].strip():
            body, meta = got_song
            return {"kind": "text", "text": with_meta(body, meta), "source": name, "url": final}
    pre = best_pre(text)
    if pre:
        return {"kind": "text", "text": with_meta(pre, {"title": page_title(text)}),
                "source": host, "url": final}
    vis = visible_text(text)
    if not vis:
        raise FetchError("La página no tiene texto (quizá se carga con JavaScript). "
                         "Copia la canción y pégala, o hazle una captura.")
    return {"kind": "page", "text": vis, "title": page_title(text), "url": final}
