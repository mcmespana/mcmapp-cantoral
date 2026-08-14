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
import json
import re
import unicodedata
from pathlib import Path

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
# Etiquetas: una sola directiva {tags: a, b, c} → lista de slugs.
# Es su propia familia porque no es ni escalar ni «label | url»: es una lista
# separada por comas que además se normaliza a slug.
TAG_FIELDS = {
    "tags": "tags",
}
# Todas las directivas multimedia/meta (las que se extraen del cuerpo al JSON).
MEDIA_DIRECTIVES = (list(SCALAR_FIELDS.values()) + list(LIST_FIELDS.values())
                    + list(TAG_FIELDS.values()))

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


# ─────────── YouTube: guardamos siempre en formato embed ─────────── #

# Cualquier forma de enlazar un vídeo de YouTube → el id de 11 caracteres.
_YT_ID_RX = re.compile(
    r"(?:youtube\.com/(?:watch\?(?:.*&)?v=|embed/|v/|shorts/|live/)"
    r"|youtu\.be/)"
    r"([A-Za-z0-9_-]{11})",
    re.IGNORECASE,
)
# Segundo de inicio, tanto ?t=90 / ?t=1m30s como ?start=90
_YT_START_RX = re.compile(r"[?&](?:start|t)=(\d+h)?(\d+m)?(\d+)s?(?:&|$)", re.IGNORECASE)


def youtube_id(url) -> str:
    """Devuelve el id del vídeo, o '' si la URL no es de YouTube."""
    m = _YT_ID_RX.search(str(url or ""))
    return m.group(1) if m else ""


def _youtube_start_seconds(url: str) -> int:
    m = _YT_START_RX.search(url)
    if not m:
        return 0
    h, mi, s = m.group(1), m.group(2), m.group(3)
    total = int(s or 0)
    if mi:
        total += int(mi[:-1]) * 60
    if h:
        total += int(h[:-1]) * 3600
    # '?t=90' cae en el grupo de segundos, que es lo que queremos.
    return total


def to_youtube_embed(url) -> str:
    """Normaliza cualquier URL de YouTube a la forma embed.

    La app móvil reproduce el vídeo embebido, así que en el .cho guardamos
    siempre `https://www.youtube.com/embed/<id>`. Lo que NO es de YouTube
    (Vimeo, un mp3, un Drive…) se devuelve tal cual: aquí no se inventa nada.
    """
    url = str(url or "").strip()
    vid = youtube_id(url)
    if not vid:
        return url
    out = f"https://www.youtube.com/embed/{vid}"
    start = _youtube_start_seconds(url)
    return f"{out}?start={start}" if start else out


def to_youtube_watch(url) -> str:
    """Inversa de `to_youtube_embed`: la forma normal para abrir y compartir."""
    url = str(url or "").strip()
    vid = youtube_id(url)
    if not vid:
        return url
    out = f"https://www.youtube.com/watch?v={vid}"
    start = _youtube_start_seconds(url)
    return f"{out}&t={start}" if start else out


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
    for f in TAG_FIELDS:
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
        elif directive == "tags":
            # Repetible por comodidad: dos {tags:} se acumulan sin duplicar.
            media["tags"] = normalize_tags(media["tags"] + [val])
        else:
            media[_DIRECTIVE_TO_SCALAR[directive]] = val
    return media


def strip_media(text: str) -> str:
    """Quita del cuerpo las líneas de directivas multimedia/meta."""
    return _STRIP_RX.sub("", text)


# ─────────── Etiquetas del cantoral: {tags: a, b, c} ─────────── #
#
# Las etiquetas son LIBRES: se inventan sobre la marcha en el .cho y no hace
# falta declararlas en ningún sitio. El catálogo (`songs/tags.json`) es solo
# metadato bonito y OPCIONAL — una etiqueta sin declarar funciona igual, se
# muestra con el slug capitalizado.
#
# El identificador estable es el SLUG; el label solo es presentación, así que
# renombrar una etiqueta es cambiar su label, sin tocar un solo .cho.

TAG_CATALOG_FILENAME = "tags.json"


def slugify_tag(raw) -> str:
    """'Domingo de Ramos' → 'domingo-de-ramos'. Sin acentos, minúsculas."""
    text = unicodedata.normalize("NFD", str(raw or ""))
    text = "".join(c for c in text if unicodedata.category(c) != "Mn").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def pretty_tag_label(slug: str) -> str:
    """Label de emergencia para una etiqueta que no está en el catálogo."""
    words = str(slug or "").replace("-", " ").strip()
    return words[:1].upper() + words[1:] if words else ""


def normalize_tags(value, aliases: dict = None) -> list:
    """Cualquier cosa (lista, string con comas, mezcla) → lista de slugs únicos.

    `aliases` colapsa los duplicados inevitables del vocabulario libre
    (`viejuna` → `viejunas`) sin tener que reescribir los .cho.
    """
    aliases = aliases or {}
    items = []
    if isinstance(value, str):
        items = value.split(",")
    elif isinstance(value, (list, tuple)):
        for it in value:
            if isinstance(it, str):
                items.extend(it.split(","))
    out = []
    for item in items:
        slug = slugify_tag(item)
        if not slug:
            continue
        # Alias con tope antibucles.
        for _ in range(5):
            nxt = aliases.get(slug)
            if not nxt or nxt == slug:
                break
            slug = nxt
        if slug not in out:
            out.append(slug)
    return out


def format_tags(tags) -> str:
    """['viejunas','envio'] → 'viejunas, envio' (vacío si no hay ninguna)."""
    return ", ".join(normalize_tags(tags))


# ─────────── Catálogo de etiquetas (songs/tags.json) ─────────── #

def tag_catalog_path(songs_dir) -> Path:
    return Path(songs_dir) / TAG_CATALOG_FILENAME


def load_tag_catalog(songs_dir) -> dict:
    """Lee `songs/tags.json`. Si no existe o está roto, devuelve {}.

    Un catálogo ausente es un estado PERFECTAMENTE VÁLIDO: las etiquetas son
    libres y el catálogo solo añade label/emoji/alias.
    """
    path = tag_catalog_path(songs_dir)
    if not path.exists():
        return {}
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return {}
    if not isinstance(raw, dict):
        return {}
    # Tolera el mapa envuelto {"tags": {...}}, igual que la app.
    if isinstance(raw.get("tags"), dict):
        raw = raw["tags"]

    catalog = {}
    for key, value in raw.items():
        slug = slugify_tag(key)
        if not slug:
            continue
        if isinstance(value, str):
            catalog[slug] = {"label": value.strip() or pretty_tag_label(slug)}
            continue
        if not isinstance(value, dict):
            continue
        entry = {}
        label = str(value.get("label") or "").strip()
        emoji = str(value.get("emoji") or "").strip()
        if label:
            entry["label"] = label
        if emoji:
            entry["emoji"] = emoji
        if isinstance(value.get("orden"), int):
            entry["orden"] = value["orden"]
        if value.get("destacada") is True:
            entry["destacada"] = True
        alias = [a for a in normalize_tags(value.get("alias") or []) if a != slug]
        if alias:
            entry["alias"] = alias
        catalog[slug] = entry
    return catalog


def save_tag_catalog(songs_dir, catalog: dict) -> Path:
    """Escribe `songs/tags.json` ordenado por slug (diffs legibles en git)."""
    path = tag_catalog_path(songs_dir)
    clean = {}
    for slug in sorted(catalog):
        entry = {k: v for k, v in (catalog[slug] or {}).items()
                 if v not in (None, "", [], False)}
        clean[slug] = entry
    path.write_text(json.dumps(clean, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")
    return path


def catalog_aliases(catalog: dict) -> dict:
    """{alias: slug canónico}. Una etiqueta declarada nunca es alias de otra."""
    aliases = {}
    for slug, entry in (catalog or {}).items():
        for alias in (entry or {}).get("alias", []):
            if alias != slug:
                aliases[alias] = slug
    return {a: s for a, s in aliases.items() if a not in (catalog or {})}


def resolve_tag_catalog(songs_json: dict, catalog: dict) -> dict:
    """Catálogo RESUELTO que se publica en Firebase (`songs/tags`).

    Junta las etiquetas declaradas con las descubiertas en las canciones y les
    pone su recuento. Solo salen las que tienen al menos una canción: una
    etiqueta declarada pero sin usar no es descubrimiento, es ruido.
    """
    aliases = catalog_aliases(catalog)
    counts = {}
    for category in (songs_json or {}).values():
        for song in (category or {}).get("songs", []) or []:
            for slug in normalize_tags(song.get("tags") or [], aliases):
                counts[slug] = counts.get(slug, 0) + 1

    resolved = {}
    for slug, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
        entry = dict(catalog.get(slug) or {})
        entry["label"] = entry.get("label") or pretty_tag_label(slug)
        entry["count"] = count
        resolved[slug] = entry
    return resolved
