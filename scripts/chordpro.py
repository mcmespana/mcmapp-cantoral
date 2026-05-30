#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Utilidades compartidas de ChordPro para el cantoral MCM.

Fuente ÚNICA del mapeo «campo JSON ↔ directiva .cho» y del parseo/limpieza de
las directivas multimedia/meta. La usan:
  - crear_songs_json.py             (.cho → songs-vX.json)
  - sincronizaCambiosDeFirebase.py  (ediciones de Firebase → .cho)
  - admin/server.py                 (editor local)

Si cambian las directivas o sus nombres, se toca AQUÍ y vale para los tres.
Ver docs/CAMPOS_CANCIONES.md para la documentación del contrato.
"""
import re

# Campo JSON (lo que viaja a la app) → directiva ChordPro (lo que va en el .cho)
SCALAR_FIELDS = {
    "rhythm":         "ritmo",
    "album":          "album",
    "liturgicalTime": "tiempo",
    "source":         "fuente",
    "videoEmbed":     "video",
    "comment":        "comentario",
}
LIST_FIELDS = {
    "youtubeLinks": "youtube",
    "audioLinks":   "audio",
}
# Todas las directivas multimedia/meta (las que se extraen del cuerpo al JSON).
MEDIA_DIRECTIVES = list(SCALAR_FIELDS.values()) + list(LIST_FIELDS.values())

_DIRECTIVE_TO_SCALAR = {v: k for k, v in SCALAR_FIELDS.items()}

_MEDIA_RX = re.compile(
    r"\{\s*(" + "|".join(MEDIA_DIRECTIVES) + r")\s*:\s*(.*?)\s*\}", re.IGNORECASE)
_STRIP_RX = re.compile(
    r"^[ \t]*\{\s*(?:" + "|".join(MEDIA_DIRECTIVES) + r")\s*:[^}]*\}[ \t]*\r?\n?",
    re.IGNORECASE | re.MULTILINE)


def nl(s) -> str:
    """Normaliza saltos de línea (\\r\\n,\\r → \\n) y garantiza \\n final."""
    s = str(s).replace("\r\n", "\n").replace("\r", "\n")
    return s if s.endswith("\n") else s + "\n"


def parse_label_url(value: str) -> dict:
    """'Etiqueta | https://url' → {label,url}. Sin '|' → label='' y url=value."""
    value = str(value)
    if "|" in value:
        label, _, url = value.partition("|")
        return {"label": label.strip(), "url": url.strip()}
    return {"label": "", "url": value.strip()}


def format_label_url(item):
    """{label,url} (o str) → 'Etiqueta | url' / 'url'. Devuelve None si no hay url."""
    if isinstance(item, dict):
        label = (item.get("label") or "").strip()
        url = (item.get("url") or "").strip()
        if not url:
            return None
        return f"{label} | {url}" if label else url
    s = str(item).strip()
    return s or None


def normalize_links(value) -> list:
    """Lista de enlaces (dicts o strings) → [{label,url}] (descarta los sin url)."""
    out = []
    if isinstance(value, list):
        for it in value:
            if isinstance(it, dict):
                url = (it.get("url") or "").strip()
                if url:
                    out.append({"label": (it.get("label") or "").strip(), "url": url})
            elif isinstance(it, str) and it.strip():
                out.append(parse_label_url(it.strip()))
    return out


def get_directive(text: str, name: str) -> str:
    """Valor de {name: ...} (primera aparición, case-insensitive) o ''."""
    m = re.search(r"\{\s*" + re.escape(name) + r"\s*:\s*(.*?)\s*\}", text, re.IGNORECASE)
    return m.group(1).strip() if m else ""


def parse_basic_meta(text: str) -> dict:
    """Extrae title/author/key/capo de un .cho (capo como int, 0 si no hay)."""
    capo_raw = get_directive(text, "capo")
    return {
        "title":  get_directive(text, "title"),
        "author": get_directive(text, "artist") or get_directive(text, "author"),
        "key":    get_directive(text, "key"),
        "capo":   int(capo_raw) if capo_raw.isdigit() else 0,
    }


def empty_media() -> dict:
    """Dict de multimedia vacío (escalares '' y listas [])."""
    d = {f: "" for f in SCALAR_FIELDS}
    for f in LIST_FIELDS:
        d[f] = []
    return d


def parse_media(text: str) -> dict:
    """Extrae las directivas multimedia/meta de un .cho → dict de campos JSON."""
    media = empty_media()
    for m in _MEDIA_RX.finditer(text):
        directive = m.group(1).lower()
        val = m.group(2).strip()
        if not val:
            continue
        if directive == "youtube":
            media["youtubeLinks"].append(parse_label_url(val))
        elif directive == "audio":
            media["audioLinks"].append(parse_label_url(val))
        else:
            media[_DIRECTIVE_TO_SCALAR[directive]] = val
    return media


def strip_media(text: str) -> str:
    """Quita del cuerpo las líneas de directivas multimedia/meta."""
    return _STRIP_RX.sub("", text)
