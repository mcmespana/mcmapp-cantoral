#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Packs de canciones (playlists): bloques de ~1 hora para los Villancicos
Solidarios, o cualquier otra lista ordenada que haga falta.

Viven en el repo, un JSON por pack en `packs/<slug>.json` (fuera de `songs/`,
para no disparar el CI que regenera el cantoral cada vez que se toca uno):

    {
      "title": "Mañana 1",
      "event": "Villancicos Solidarios 2025 · Edificio Hucha",
      "date": "2025-12-20",
      "targetMinutes": 60,
      "notes": "",
      "items": [
        {"song": "navidad/hoy_ha_nacido", "title": "Hoy ha Nacido",
         "key": "D", "capo": 3, "notes": "🎻🎺", "page": "B15"},
        {"type": "break", "title": "Presentación de la hucha", "minutes": 3}
      ]
    }

- `song` es `categoría/slug`: la clave de la categoría en indice.json y el
  nombre del .cho sin el número ni la extensión. Renumerar no lo rompe; si la
  canción se cambia de categoría se encuentra igual (por el slug) y al guardar
  se corrige. `null` = todavía no está en el cantoral (se busca por título).
- `key`/`capo`/`notes` son de ESE día (tono y cejilla con que se toca en el
  pack, instrumentos…); no tocan la canción.
- `duration` (m:ss) en un ítem manda sobre la de la canción ({duracion:}); si
  no hay ninguna se cuenta la `defaultDuration` del pack (o DEFAULT_SECONDS) y
  el total sale con «≈».

Ver docs/VILLANCICOS_SOLIDARIOS.md.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import chordpro as cp

REPO_DIR = Path(__file__).resolve().parent.parent
PACKS_DIR = REPO_DIR / "packs"
DEFAULT_SECONDS = 150          # 2:30 si ni la canción ni el pack dicen otra cosa
                               # (en los Villancicos Solidarios caben ~24 por hora)
DEFAULT_TARGET = 60
_SLUG_RX = re.compile(r"^[a-z0-9][a-z0-9-]{0,60}$")


# ─────────────────────────── Identificadores ─────────────────────────── #

def pack_slug(title: str) -> str:
    return cp.slugify_tag(title)[:60] or "pack"


def song_slug(filename: str) -> str:
    """«19.hoy_ha_nacido.cho» / «01. Somos Consolacion.cho» → «hoy_ha_nacido» /
    «somos_consolacion». El número no forma parte: renumerar no lo cambia."""
    stem = re.sub(r"\.cho$", "", filename, flags=re.IGNORECASE)
    stem = re.sub(r"^\d+\s*\.\s*", "", stem)
    s = unicodedata.normalize("NFKD", stem)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")


def title_key(title: str) -> str:
    s = unicodedata.normalize("NFKD", title or "")
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"\([^)]*\)|[¿?¡!]", " ", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


# ─────────────────────────── Leer / guardar ─────────────────────────── #

def _path(slug: str) -> Path:
    if not _SLUG_RX.match(slug or ""):
        raise ValueError(f"Nombre de pack no válido: «{slug}»")
    return PACKS_DIR / f"{slug}.json"


def normalize(data: dict) -> dict:
    """Pack tal y como llega (del admin o de un fichero) → forma canónica."""
    if not isinstance(data, dict):
        raise ValueError("El pack tiene que ser un objeto JSON.")
    title = re.sub(r"\s+", " ", str(data.get("title") or "")).strip()
    if not title:
        raise ValueError("El pack necesita un título.")
    out: Dict[str, object] = {"title": title}
    for k in ("event", "notes"):
        v = str(data.get(k) or "").strip()
        if v:
            out[k] = v
    date = str(data.get("date") or "").strip()
    if date:
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            raise ValueError("La fecha va como AAAA-MM-DD.")
        out["date"] = date
    try:
        target = int(data.get("targetMinutes") or DEFAULT_TARGET)
    except (TypeError, ValueError):
        target = DEFAULT_TARGET
    out["targetMinutes"] = max(1, min(target, 600))
    dd = cp.format_duration(cp.parse_duration(data.get("defaultDuration") or ""))
    if dd:
        out["defaultDuration"] = dd
    items = []
    for raw in data.get("items") or []:
        if not isinstance(raw, dict):
            continue
        if raw.get("type") == "break":
            it = {"type": "break", "title": str(raw.get("title") or "Pausa").strip() or "Pausa"}
            try:
                it["minutes"] = max(0, min(int(raw.get("minutes") or 0), 240))
            except (TypeError, ValueError):
                it["minutes"] = 0
            items.append(it)
            continue
        song = str(raw.get("song") or "").strip().strip("/") or None
        if song and not re.fullmatch(r"[a-z0-9-]+/[a-z0-9_]+", song):
            raise ValueError(f"Referencia de canción rara: «{song}»")
        it = {"song": song, "title": str(raw.get("title") or "").strip()}
        if not it["title"] and not song:
            continue
        key = str(raw.get("key") or "").strip()
        if key:
            it["key"] = key
        capo = raw.get("capo")
        if isinstance(capo, str) and capo.strip().isdigit():
            capo = int(capo)
        if isinstance(capo, int) and 0 <= capo <= 12 and raw.get("capo") not in (None, ""):
            it["capo"] = capo
        dur = cp.format_duration(cp.parse_duration(raw.get("duration") or ""))
        if dur:
            it["duration"] = dur
        for k in ("notes", "page"):
            v = str(raw.get(k) or "").strip()
            if v:
                it[k] = v
        items.append(it)
    out["items"] = items
    return out


def list_slugs() -> List[str]:
    if not PACKS_DIR.exists():
        return []
    return sorted(p.stem for p in PACKS_DIR.glob("*.json") if _SLUG_RX.match(p.stem))


def load(slug: str) -> dict:
    path = _path(slug)
    if not path.exists():
        raise FileNotFoundError(slug)
    return normalize(json.loads(path.read_text(encoding="utf-8")))


def save(slug: str, data: dict) -> dict:
    pack = normalize(data)
    PACKS_DIR.mkdir(exist_ok=True)
    _path(slug).write_text(json.dumps(pack, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return pack


def delete(slug: str) -> None:
    _path(slug).unlink(missing_ok=True)


# ─────────────────────────── Resolver canciones ─────────────────────────── #

def in_navidad(row: dict) -> bool:
    return row.get("category_key") == "navidad" or any(
        a.get("category") == "navidad" for a in row.get("alsoIn") or [])


class SongIndex:
    """Índice de las canciones del repo para resolver los `song` de un pack.

    `rows` son filas como las de admin/server.list_repo_songs (path, filename,
    title, key, capo, duration, category_key…).
    """

    def __init__(self, rows: List[dict]):
        self.by_ref: Dict[str, dict] = {}
        self.by_slug: Dict[str, List[dict]] = {}
        self.by_title: Dict[str, List[dict]] = {}
        for r in rows:
            slug = song_slug(r["filename"])
            r = dict(r, ref=f"{r.get('category_key') or ''}/{slug}")
            self.by_ref[r["ref"]] = r
            self.by_slug.setdefault(slug, []).append(r)
            self.by_title.setdefault(title_key(r.get("title") or ""), []).append(r)

    def _fuzzy(self, title: str) -> List[dict]:
        """«Hecho con tus sueños 2014» ↔ «Hecho con tus sueños'14», «Ande la
        Marimorena» ↔ «Ande ande la Marimorena»: parecido de verdad (≥ 0,82)."""
        import difflib
        key = title_key(title)
        best, score = [], 0.0
        for k, rows in self.by_title.items():
            if not k:
                continue
            r = difflib.SequenceMatcher(None, key, k).ratio()
            if r > score:
                best, score = rows, r
        return best if score >= 0.82 else []

    def find(self, ref: Optional[str], title: str = "") -> Tuple[Optional[dict], str]:
        """→ (fila, estado). Estado: ok | moved | by_title | elsewhere | missing.
        Con «elsewhere» la fila es solo una sugerencia: no se enlaza."""
        if ref:
            if ref in self.by_ref:
                return self.by_ref[ref], "ok"
            slug = ref.split("/", 1)[-1]
            cands = self.by_slug.get(slug, [])
            if len(cands) == 1:
                return cands[0], "moved"
        cands = self.by_title.get(title_key(title), []) if title else []
        if not cands and title:
            cands = self._fuzzy(title)
        # Por el título solo se enlaza sola una canción de Navidad (propia o
        # traída con {tambien_en: navidad}): «Hallelujah» del pack es la versión
        # navideña, no la de Aleluya. Si solo hay una parecida en otra categoría,
        # se sugiere («elsewhere») pero no se enlaza.
        nav = [r for r in cands if in_navidad(r)]
        if nav:
            nav.sort(key=lambda r: r.get("category_key") != "navidad")
            return nav[0], "by_title"
        if cands:
            return cands[0], "elsewhere"
        return None, "missing"


def resolve(pack: dict, index: SongIndex) -> dict:
    """Pack + canciones del repo → lo que pinta el admin: cada ítem con su
    canción (si la hay), duración que cuenta y minuto en que empieza."""
    t = 0
    estimated = False
    items = []
    default = cp.parse_duration(pack.get("defaultDuration") or "") or DEFAULT_SECONDS
    for it in pack.get("items", []):
        it = dict(it)
        if it.get("type") == "break":
            secs = int(it.get("minutes") or 0) * 60
            it.update(start=t, seconds=secs)
            t += secs
            items.append(it)
            continue
        row, status = index.find(it.get("song"), it.get("title", ""))
        if status == "elsewhere":
            it["suggestion"] = {"path": row["path"], "title": row.get("title") or "",
                                "category_key": row.get("category_key") or ""}
            row, status = None, "missing"
        it["status"] = status
        if row:
            it["ref"] = row["ref"]
            it["path"] = row["path"]
            it["songTitle"] = row.get("title") or ""
            it["songKey"] = row.get("key") or ""
            it["songCapo"] = row.get("capo") or 0
            it["songDuration"] = row.get("duration") or ""
            it["artist"] = row.get("artist") or ""
            it["subcategory"] = row.get("subcategory") or ""
            it["hasTodo"] = bool(row.get("has_todo"))
            if not it.get("title"):
                it["title"] = row.get("title") or ""
        secs = cp.parse_duration(it.get("duration") or it.get("songDuration") or "")
        if not secs:
            secs = default
            estimated = True
        it.update(start=t, seconds=secs, estimated=not (it.get("duration") or it.get("songDuration")))
        t += secs
        items.append(it)
    return dict(pack, items=items, totalSeconds=t, estimated=estimated)


def relink(pack: dict, index: SongIndex) -> dict:
    """Fija en el pack las canciones encontradas por título o movidas, para que
    la próxima vez no haya que adivinar."""
    out = dict(pack, items=[])
    for it in pack.get("items", []):
        it = dict(it)
        if it.get("type") != "break":
            row, status = index.find(it.get("song"), it.get("title", ""))
            if row and status in ("moved", "by_title"):
                it["song"] = row["ref"]
        out["items"].append(it)
    return out


# ─────────────────────────── Exportar ─────────────────────────── #

def clock(secs: int) -> str:
    secs = int(secs or 0)
    h, m = divmod(secs // 60, 60)
    return f"{h}:{m:02d}" if h else f"{m}′"


def _tone(it: dict) -> str:
    key = it.get("key") or it.get("songKey") or ""
    capo = it["capo"] if "capo" in it else it.get("songCapo") or 0
    parts = [key] if key else []
    if capo:
        parts.append(f"C/{capo}")
    return " ".join(parts)


def export_text(rp: dict) -> str:
    """Para mandar por WhatsApp: una línea por canción."""
    head = f"🎄 *{rp['title']}*"
    if rp.get("event"):
        head += f" — {rp['event']}"
    if rp.get("date"):
        y, m, d = rp["date"].split("-")
        head += f" ({d}/{m})"
    lines = [head, f"⏱ {'≈ ' if rp.get('estimated') else ''}{clock(rp['totalSeconds'])} "
                   f"(objetivo {rp['targetMinutes']}′)", ""]
    n = 0
    for it in rp["items"]:
        if it.get("type") == "break":
            lines.append(f"   ⏸ {it['title']}" + (f" ({it['minutes']}′)" if it.get("minutes") else ""))
            continue
        n += 1
        extra = " · ".join(x for x in (_tone(it), it.get("notes", "")) if x)
        lines.append(f"{n}. {it.get('title') or it.get('songTitle')}" + (f" — {extra}" if extra else ""))
    if rp.get("notes"):
        lines += ["", rp["notes"]]
    return "\n".join(lines) + "\n"


def export_markdown(rp: dict) -> str:
    """Tabla para pegar en un documento o en un issue."""
    out = [f"# {rp['title']}", ""]
    meta = [x for x in (rp.get("event"), rp.get("date")) if x]
    if meta:
        out += [" · ".join(meta), ""]
    out += [f"Duración: {'≈ ' if rp.get('estimated') else ''}{clock(rp['totalSeconds'])} "
            f"(objetivo {rp['targetMinutes']}′)", "",
            "| # | Empieza | Canción | Tono | Notas | Pág. |", "|---|---|---|---|---|---|"]
    n = 0
    for it in rp["items"]:
        if it.get("type") == "break":
            out.append(f"|  | {clock(it['start'])} | ⏸ *{it['title']}* ({it.get('minutes', 0)}′) |  |  |  |")
            continue
        n += 1
        title = (it.get("title") or it.get("songTitle") or "").replace("|", "/")
        out.append(f"| {n} | {clock(it['start'])} | {title} | {_tone(it)} | "
                   f"{(it.get('notes') or '').replace('|', '/')} | {it.get('page', '')} |")
    if rp.get("notes"):
        out += ["", rp["notes"]]
    return "\n".join(out) + "\n"


# ─────────────────────────── Listado del Edificio Hucha ─────────────────────────── #

def parse_tone(raw: str) -> Dict[str, object]:
    """«Do C/7 = SOL» → {key: C, capo: 7, notes: '= SOL'}. Lo que no se entiende
    se queda en notes, tal cual."""
    import villancicos_docx as vd
    raw = re.sub(r"\s+", " ", raw or "").strip()
    out: Dict[str, object] = {}
    if not raw:
        return out
    m = re.match(r"^(\S+)\s*(?:[Cc]\s*/\s*(\d*))?\s*(.*)$", raw)
    rest = raw
    if m:
        tr = vd.translate_token(m.group(1))
        if tr and len(tr) == 1:
            out["key"] = tr[0]
            rest = ""
            if m.group(2):
                out["capo"] = int(m.group(2))
            if m.group(3):
                rest = m.group(3)
        elif tr:
            rest = raw
    if rest:
        out["notes"] = rest
    return out


def packs_from_listado(docx_path: Path) -> List[dict]:
    """Los «PACK DE CANCIONES …» del Word del listado (tablas de dos en dos:
    nombre del pack en una fila y sus canciones debajo) → packs sin canciones
    enlazadas todavía (se enlazan por título según se vayan importando). El
    listado general (N. / Canción / Tono / Pág / Cosas) sale como el pack
    «Repertorio», con los instrumentos de cada una en las notas."""
    import zipfile
    from xml.etree import ElementTree as ET
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

    def txt(el):
        return re.sub(r"\s+", " ", "".join(t.text or "" for t in el.iter(W + "t"))).strip()

    with zipfile.ZipFile(docx_path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    rows = [[txt(tc) for tc in tr.findall(W + "tc")] for tr in root.iter(W + "tr")]

    packs: List[dict] = []
    repertorio: List[dict] = []
    current: List[Optional[dict]] = [None, None]
    for cells in rows:
        joined = " ".join(cells)
        if "PACK DE CANCIONES" in joined.upper():
            names = [c for c in cells if c.upper().startswith("PACK DE CANCIONES")]
            current = []
            for name in names:
                title = re.sub(r"(?i)^pack de canciones\s*", "", name).strip()
                if not title:
                    title = f"Pack antiguo {sum(1 for p in packs if p['title'].startswith('Pack antiguo')) + 1}"
                pack = {"title": title, "items": []}
                if title.startswith("Pack antiguo"):
                    pack["notes"] = "De otra edición: las páginas (A7, B13…) son de otro cantoral en papel."
                if re.search(r"(?i)extra|secundario", title):
                    pack["notes"] = "Extra, secundario"
                    pack["title"] = re.sub(r"\s*\[.*\]\s*", "", title).strip()
                if pack["title"].isupper():
                    pack["title"] = pack["title"].capitalize()
                packs.append(pack)
                current.append(pack)
            continue
        if cells and cells[0] == "Orden" and len(current) == 2 and all(current) \
                and any(c["items"] for c in current):
            # Otra tabla «Orden | N | NOMBRE» bajo la misma cabecera: otros dos packs.
            current = []
            for _ in range(2):
                pack = {"title": f"Pack antiguo {sum(1 for p in packs if p['title'].startswith('Pack antiguo')) + 1}",
                        "notes": "De otra edición: las páginas (A7, B13…) son de otro cantoral en papel.",
                        "items": []}
                packs.append(pack)
                current.append(pack)
            continue
        if cells and cells[0] in ("#", "Orden", "N."):
            continue
        # Listado general: N. | Canción | Tono | Pág | Cosas | (vacío) | N. | Canción | Tono | Pág | Veces
        if len(cells) >= 11 and not current[0]:
            for n, title, tone, page, notes in ((cells[0], cells[1], cells[2], cells[3], cells[4]),
                                                (cells[6], cells[7], cells[8], cells[9], cells[10])):
                if title:
                    it = {"song": None, "title": title.strip("¿? ")}
                    it.update(parse_tone(tone))
                    if page:
                        it["page"] = page
                    if notes:
                        it["notes"] = (it.get("notes", "") + " " + notes).strip()
                    repertorio.append(it)
            continue
        # Filas de los packs con nombre: # | Canción | Tono | Pág | (vacío) | # | Canción | Tono | Pág
        if len(cells) >= 9 and len(current) == 2 and all(current):
            for pack, (title, tone, page) in zip(current, ((cells[1], cells[2], cells[3]),
                                                           (cells[6], cells[7], cells[8]))):
                if title:
                    it = {"song": None, "title": title.strip("¿? ")}
                    it.update(parse_tone(tone))
                    if page:
                        it["page"] = page
                    pack["items"].append(it)
            continue
        # Los «PACK DE CANCIONES» viejos: Orden | N | NOMBRE | (vacío) | Orden | N | NOMBRE
        if len(cells) >= 7 and len(current) == 2 and all(current):
            for pack, (page, title) in zip(current, ((cells[1], cells[2]), (cells[5], cells[6]))):
                if title:
                    t = title.capitalize() if title.isupper() else title
                    pack["items"].append({"song": None, "title": t, "page": page})
    if repertorio:
        packs.insert(0, {"title": "Repertorio", "notes": "Todas las del listado, con tono, página "
                         "del cantoral en papel e instrumentos.", "items": repertorio})
    return [p for p in packs if p["items"]]


# ─────────────────────────── Sin el admin ─────────────────────────── #

def repo_rows(songs_dir: Path = REPO_DIR / "songs") -> List[dict]:
    """Las canciones del repo leídas directamente (para usar esto sin el admin)."""
    indice = json.loads((songs_dir / "indice.json").read_text(encoding="utf-8"))
    by_letter = {}
    for key, info in indice.items():
        m = re.match(r"\s*([A-Z])\.", info.get("categoryTitle", ""))
        if m:
            by_letter[m.group(1)] = key
    rows = []
    for folder in sorted(p for p in songs_dir.iterdir() if p.is_dir()):
        m = re.match(r"([A-Z])\.", folder.name)
        if not m:
            continue
        for cho in sorted(folder.glob("*.cho")):
            text = cho.read_text(encoding="utf-8")
            meta, extra = cp.parse_basic_meta(text), cp.parse_media(text)
            rows.append({
                "path": str(cho.relative_to(songs_dir.parent)), "filename": cho.name,
                "category_key": by_letter.get(m.group(1), ""), "title": meta["title"],
                "artist": meta["author"], "key": meta["key"], "capo": meta["capo"],
                "duration": extra["duration"], "subcategory": extra["subcategory"],
                "alsoIn": extra["alsoIn"],
                "has_todo": bool(re.search(r"\bTO\s+DO\b", text)),
            })
    return rows


def main(argv=None) -> int:
    import argparse
    ap = argparse.ArgumentParser(description="Packs de canciones (playlists) del repo.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list", help="los packs y su duración")
    ex = sub.add_parser("export", help="un pack en texto (WhatsApp) o Markdown")
    ex.add_argument("slug")
    ex.add_argument("--md", action="store_true")
    im = sub.add_parser("importar-listado", help="crea packs desde un Word de listado")
    im.add_argument("docx", type=Path)
    im.add_argument("--evento", default="")
    im.add_argument("--prefijo", default="")
    args = ap.parse_args(argv)
    index = SongIndex(repo_rows())
    if args.cmd == "list":
        for slug in list_slugs():
            rp = resolve(load(slug), index)
            faltan = sum(1 for it in rp["items"] if it.get("status") == "missing")
            print(f"{slug:<32} {rp['title']:<24} {clock(rp['totalSeconds']):>6} / "
                  f"{rp['targetMinutes']}′  {len(rp['items'])} ítems"
                  + (f"  ({faltan} sin canción)" if faltan else ""))
        return 0
    if args.cmd == "export":
        rp = resolve(load(args.slug), index)
        print(export_markdown(rp) if args.md else export_text(rp), end="")
        return 0
    for pack in packs_from_listado(args.docx):
        if args.evento:
            pack["event"] = args.evento
        slug = pack_slug(f"{args.prefijo} {pack['title']}")
        if (PACKS_DIR / f"{slug}.json").exists():
            print(f"= {slug} ya existe, no lo toco")
            continue
        save(slug, pack)
        print(f"+ packs/{slug}.json ({len(pack['items'])})")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
