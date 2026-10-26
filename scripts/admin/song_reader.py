#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lector de canciones con IA: foto, escaneo o PDF (o una web rara) → texto.

Lo que sale NO es el .cho final: es la TRANSCRIPCIÓN de lo que pone el papel,
en ChordPro, con cada acorde entre corchetes delante de su sílaba y escrito
como venía («[Sol]Feliz Navi[Do]dad»). Ese texto va a la caja de «✨ Añadir
canción» y de ahí al mismo conversor que lo pegado a mano (song_import.py),
que traduce los acordes, rellena las estrofas que vienen sin ellos (con la
marca 👁) y avisa de lo raro. Así una foto y un texto pegado acaban igual, y
lo leído se puede retocar en la caja antes de crear.

Por qué acordes anclados a la sílaba y no «por columnas»: en una foto (letra
proporcional, texto centrado, dos columnas) las columnas no cuadran al
carácter. Claude mira dónde cae cada acorde y lo pega a su sílaba.

Claude no escribe el ChordPro a pelo: devuelve un JSON con secciones y versos
y aquí se monta el texto. Así se puede comprobar cada acorde (lo que no lo es
se quita), escribir entero el estribillo cuando la hoja solo dice
«Estribillo» y dejar las líneas como pide docs/CAMPOS_CANCIONES.md §4.6
(arreglar_cho.py).

Las fotos y PDF se guardan en `.uploads/` (fuera de git, 60 días) para verlos
en la pestaña 📄 Original del editor mientras se revisa la canción.
"""
from __future__ import annotations

import base64
import hashlib
import io
import re
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = SCRIPT_DIR.parent
for _p in (str(SCRIPT_DIR), str(SCRIPTS_DIR)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import ai_review  # noqa: E402
import song_import as si  # noqa: E402
from arreglar_cho import arreglar  # noqa: E402
from docx2chordpro import pretty_title_case  # noqa: E402

# Fuera de git (.gitignore): el commit del admin hace `git add -A`.
UPLOADS_DIR = SCRIPT_DIR / ".uploads"
UPLOAD_DAYS = 60
UPLOAD_ID_RX = re.compile(r"^[0-9a-f]{24}\.(?:jpg|pdf)$")

MAX_FILES = 6
MAX_IMAGE_BYTES = 25 * 1024 * 1024
MAX_PDF_BYTES = 20 * 1024 * 1024
MAX_PDF_PAGES = 12
# Lo más grande que miran los modelos actuales: 2576 px de lado y ~3,75 MP.
# Más no se aprovecha y solo pesa; menos pierde la letra pequeña de una página.
MAX_SIDE = 2576
MAX_PIXELS = 3_700_000
MAX_PAGE_TEXT = 40000

SECTION_KINDS = ["verse", "chorus", "chorus_ref", "intro", "instrumental", "bridge", "note"]

SCHEMA = {
    "type": "object",
    "properties": {
        "songs": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "artist": {"type": "string"},
                    "key": {"type": "string"},
                    "capo": {"type": "integer"},
                    "category": {"type": "string"},
                    "sections": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "kind": {"type": "string", "enum": SECTION_KINDS},
                                "label": {"type": "string"},
                                "lines": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": ["kind", "label", "lines"],
                            "additionalProperties": False,
                        },
                    },
                    "doubts": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["title", "artist", "key", "capo", "category", "sections", "doubts"],
                "additionalProperties": False,
            },
        },
        "ignored": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["songs", "ignored"],
    "additionalProperties": False,
}

SYSTEM = """\
Pasas canciones al cantoral de una parroquia. Te llega la foto, el escaneo o el \
PDF de una página de cancionero (o el texto de una página web) y tienes que \
TRANSCRIBIR cada canción tal y como está escrita, con los acordes en su sitio, \
en el JSON que se te pide. Un programa la convierte después: tú no inventas \
nada, copias bien.

Qué canciones:
- Transcribe cada canción que esté entera o que empiece aquí y siga en las \
páginas siguientes que te den. Si te dan varias imágenes, son páginas seguidas \
y en orden: una canción puede continuar de una a otra.
- Una canción cortada por el borde (solo asoma su título abajo, o empieza a \
medias arriba) NO se transcribe: pon en "ignored" su título o su primer verso y \
por qué, en pocas palabras.
- Fuera cabeceras y pies de página, números de página, sellos y anotaciones a \
mano que no sean de la canción.
- Si no hay ninguna canción legible, "songs" va vacía y "ignored" dice por qué.

Cómo leer la página:
- A dos columnas: primero la columna izquierda entera, de arriba abajo, y luego \
la derecha. Lo de la derecha sigue la misma canción si no empieza otra con su \
título.
- Los acordes van en la línea de encima de la letra. Mete cada acorde dentro \
del verso, entre corchetes, justo delante de la sílaba sobre la que está \
escrito: "[Sol]Feliz Navi[Do]dad". Si está encima del hueco entre dos \
palabras, delante de la palabra siguiente. Si queda más allá del final del \
verso, al final del verso.
- En letra de imprenta las columnas no cuadran carácter a carácter: fíjate en \
la posición real del acorde en la página y en la sílaba que tiene justo debajo. \
Si dudas entre dos sílabas, la acentuada.
- Copia los acordes como estén escritos (Sol, Do, Re7, Sim, Fa#m, C, Em, G7…), \
sin traducirlos; ya se traducen solos. Solo quita los espacios de dentro: \
"Sol 7" → "Sol7", "La m" → "Lam". Guiones, barras o signos sueltos entre \
acordes ("-", "|", "%") no son acordes: no los pongas.
- Una línea de solo acordes (introducción, interludio) va como una línea \
"[C][Em][Dm][G7]" en una sección "intro" o "instrumental". "INTRO: C Em Dm G7" \
escrito en el texto es eso mismo.

La letra:
- Las palabras exactas. Solo se arreglan las tildes que falten por estar en \
mayúsculas ("VEN ACA" → "ven acá") y erratas clarísimas.
- Lo que esté en MAYÚSCULAS (el estribillo suele estarlo) va en minúsculas \
normales: mayúscula al empezar frase y en Dios, Señor, Jesús, María, Padre, \
Reino, Espíritu…
- Una línea por verso o frase musical. Si un verso se partió solo porque no \
cabía en el ancho de la columna (la línea siguiente continúa la frase, casi \
siempre en minúscula), júntalo en una línea con sus acordes en su sitio. Al \
revés no: lo que en el papel va en líneas distintas por la melodía se queda \
así. Ningún verso de más de unos 60 caracteres: pártelo por la coma o el punto \
más cercano a la mitad.
- Sin numeración a mano ("1.", "2."): fuera.
- Las marcas de repetición al final de un verso o de una estrofa ("(2)", \
"(bis)", "x2") se quedan al final de esa línea, escritas "(x2)", "(x3)"…
- Las notas que no se cantan ("se repite dos veces", "solista", "todos") van \
como sección "note" con el texto en "label", no como letra.

Secciones, en el orden de la hoja:
- "verse": estrofa. "chorus": estribillo, cada vez que aparece escrito (lo \
delata la palabra ESTRIBILLO o CORO, la negrita, las mayúsculas o que se \
repite igual). "chorus_ref": la hoja solo dice "Estribillo" o "Coro" para \
indicar que ahí se canta; va sin líneas y el programa lo escribe entero. \
"intro", "instrumental", "bridge" (puente), con su etiqueta en "label" si la \
lleva. "note": ver arriba.
- Las estrofas que vuelven a aparecer escritas sin acordes se copian SIN \
acordes, tal cual: no copies acordes de otra estrofa ni te los inventes. El \
programa los deduce después y los marca para que una persona los revise.

Datos:
- "title": el título impreso, sin el número de delante ("60. PRINGADOS" → \
"Pringados"), no en mayúsculas y con sus tildes ("HACIA BELEN" → "Hacia \
Belén").
- "artist": solo si viene escrito (Autor:, Letra y música:, un nombre bajo el \
título); si no, "".
- "key": el tono, solo si viene escrito; si no, "".
- "capo": la cejilla si viene ("Cejilla 6º traste" → 6). En estos cantorales \
"c/2" o "C/2" escrito a mano junto al título es cejilla 2 ("c/0" es 0). Si no \
dice nada, -1.
- "category": si te dan una lista de categorías, la letra de la que mejor \
encaje por el momento de la misa o el tiempo litúrgico; si no está claro, "".
- "doubts": lo que no hayas podido leer bien o hayas decidido sin estar \
seguro, en frases cortas que digan dónde ("acorde ilegible sobre «grabado»", \
"no sé si el Re va en «año» o en «próspero»"). Vacía si todo está claro."""


class ReadError(ValueError):
    """Lo que ha llegado no se puede leer (formato, tamaño…): error de la persona."""


# ─────────────────────────── Archivos ─────────────────────────── #

def prepare_image(data: bytes) -> Tuple[bytes, str]:
    """Imagen cualquiera → JPEG derecho y del tamaño que el modelo aprovecha."""
    if len(data) > MAX_IMAGE_BYTES:
        raise ReadError("La imagen pesa demasiado (más de 25 MB).")
    try:
        from PIL import Image, ImageOps
    except ImportError as e:  # pragma: no cover - pillow va en requirements.txt
        raise ReadError("Falta el paquete «pillow» en el servidor.") from e
    try:
        im = Image.open(io.BytesIO(data))
        im.load()
    except Exception as e:
        raise ReadError("No se ha podido abrir la imagen. Si es una foto del iPhone (HEIC), "
                        "haz una captura de pantalla o compártela como JPG.") from e
    im = ImageOps.exif_transpose(im)  # las fotos del móvil vienen giradas por EXIF
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])  # transparente → blanco, no negro
        im = bg
    elif im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    w, h = im.size
    scale = min(1.0, MAX_SIDE / max(w, h), (MAX_PIXELS / float(w * h)) ** 0.5)
    if scale < 1:
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=88, optimize=True)
    return buf.getvalue(), "image/jpeg"


def pdf_pages(data: bytes) -> int:
    """Páginas de un PDF, por encima (0 si no se sabe: objetos comprimidos)."""
    return len(re.findall(rb"/Type\s*/Page(?![A-Za-z])", data))


def prepare_pdf(data: bytes) -> Tuple[bytes, str]:
    if not data.startswith(b"%PDF"):
        raise ReadError("El archivo no es un PDF válido.")
    if len(data) > MAX_PDF_BYTES:
        raise ReadError("El PDF pesa demasiado (más de 20 MB): guarda solo las páginas de la canción.")
    n = pdf_pages(data)
    if n > MAX_PDF_PAGES:
        raise ReadError(f"El PDF tiene {n} páginas: guarda solo las de la canción (hasta {MAX_PDF_PAGES}).")
    return data, "application/pdf"


def prepare_upload(data: bytes, content_type: str = "", filename: str = "") -> Tuple[bytes, str]:
    """Foto o PDF tal y como llega → (bytes, media_type) listo para Claude."""
    if not data:
        raise ReadError("El archivo está vacío.")
    ct = (content_type or "").split(";")[0].strip().lower()
    if data.startswith(b"%PDF") or ct == "application/pdf" or filename.lower().endswith(".pdf"):
        return prepare_pdf(data)
    return prepare_image(data)


def save_upload(data: bytes, media_type: str) -> str:
    """Guarda el original (para la pestaña 📄 Original) y devuelve su id."""
    UPLOADS_DIR.mkdir(exist_ok=True)
    uid = hashlib.sha256(data).hexdigest()[:24] + (".pdf" if media_type == "application/pdf" else ".jpg")
    path = UPLOADS_DIR / uid
    if not path.exists():
        path.write_bytes(data)
    else:
        path.touch()  # se ha vuelto a usar: que no caduque
    prune_uploads()
    return uid


def upload_path(uid: str) -> Optional[Path]:
    if not UPLOAD_ID_RX.match(uid or ""):
        return None
    p = UPLOADS_DIR / uid
    return p if p.is_file() else None


def prune_uploads() -> None:
    limit = time.time() - UPLOAD_DAYS * 86400
    try:
        for p in UPLOADS_DIR.iterdir():
            if UPLOAD_ID_RX.match(p.name) and p.stat().st_mtime < limit:
                p.unlink(missing_ok=True)
    except OSError:
        pass


# ─────────────────────────── Transcripción ─────────────────────────── #

_BRACKET_RX = re.compile(r"\[([^\]\n]*)\]")
_REPEAT_RX = re.compile(r"^\(?\s*(?:x\s?(\d)|(\d)\s?x|(bis))\s*\)?$", re.I)
_TAIL_PAREN_NUM_RX = re.compile(r"\(\s*(\d)\s*\)\s*$")
_NUMBER_RX = re.compile(r"^((?:\[[^\]]*\])*)\s*\d{1,2}\s*[.)º]\s+")
_SYMBOLS = {"-", "–", "—", "|", "||", "/", "%", ".", "..", "...", "…", ":", "*"}


def _repeat(tok: str) -> str:
    m = _REPEAT_RX.match(tok.strip())
    if not m:
        return ""
    n = m.group(1) or m.group(2) or "2"
    return f"(x{n})"


def clean_line(line: str) -> Tuple[str, List[str]]:
    """Un verso como lo devuelve Claude → verso limpio + lo que se ha quitado.

    - «[Sol 7]» → «[Sol7]»; lo que va entre corchetes y no es un acorde, fuera
      (los signos sueltos sin avisar; una palabra, avisando).
    - «(2)» al final → «(x2)», como en el resto del cantoral.
    - Llaves fuera: en ChordPro abrirían una directiva.
    """
    dropped: List[str] = []

    def fix(m: re.Match) -> str:
        raw = m.group(1).strip()
        tok = re.sub(r"\s+", "", raw)
        if not tok or tok in _SYMBOLS:
            return ""
        if si.is_lenient_chord(tok):
            return f"[{tok}]"
        rep = _repeat(raw)
        if rep:
            return f" {rep} "
        dropped.append(raw)
        return ""

    s = _BRACKET_RX.sub(fix, line.replace("{", "(").replace("}", ")"))
    s = _TAIL_PAREN_NUM_RX.sub(lambda m: f"(x{m.group(1)})", s)
    s = re.sub(r"[ \t]+", " ", s).strip()
    return s, dropped


def _chorus_lines(sections: List[dict], i: int) -> Optional[List[str]]:
    """El estribillo que toca repetir en la sección i: el de antes, o si no el de después."""
    for rng in (range(i - 1, -1, -1), range(i + 1, len(sections))):
        for k in rng:
            if sections[k]["kind"] == "chorus" and sections[k]["lines"]:
                return sections[k]["lines"]
    return None


def clean_title(title: str) -> str:
    """«60. PRINGADOS» → «Pringados»: sin número y en el estilo del cantoral."""
    title = re.sub(r"^\s*\d{1,3}\s*[.\-–)]\s*", "", str(title or "")).strip()
    return pretty_title_case(title).strip(" .") if title else ""


def render_song(song: dict) -> Tuple[str, List[str], bool]:
    """Canción del JSON → (transcripción en ChordPro, avisos, ¿trae letra o acordes?)."""
    notes: List[str] = []
    dropped: List[str] = []
    sections: List[dict] = []
    for sec in song.get("sections") or []:
        kind = sec.get("kind") if sec.get("kind") in SECTION_KINDS else "verse"
        label = re.sub(r"\s+", " ", str(sec.get("label") or "")).strip(" :.").replace("{", "(").replace("}", ")")
        lines = []
        for k, raw in enumerate(sec.get("lines") or []):
            ln, bad = clean_line(str(raw))
            dropped += bad
            if k == 0:
                # «1. Hay muchas…»: la app numera sola (§4.6).
                ln = _NUMBER_RX.sub(lambda m: m.group(1), ln)
            if ln:
                lines.append(ln)
        sections.append({"kind": kind, "label": label, "lines": lines})

    out: List[str] = []
    title = clean_title(song.get("title"))
    if title:
        out.append(f"{{title: {title}}}")
    artist = str(song.get("artist") or "").strip()
    if artist:
        out.append(f"{{artist: {artist}}}")
    key = re.sub(r"\s+", "", str(song.get("key") or ""))
    if key and si.is_lenient_chord(key):
        out.append(f"{{key: {key}}}")
    capo = song.get("capo")
    if isinstance(capo, int) and 0 < capo < 13:
        out.append(f"{{capo: {capo}}}")

    pending: List[str] = []   # notas («{c: …}») que van delante de la sección siguiente
    expanded = False
    for i, sec in enumerate(sections):
        kind, label, lines = sec["kind"], sec["label"], sec["lines"]
        if kind == "note":
            if label:
                pending.append(f"{{c: {label}}}")
            continue
        block: List[str] = list(pending)
        pending = []
        if kind == "chorus_ref":
            src = _chorus_lines(sections, i)
            if src is None:
                notes.append("La hoja dice «Estribillo» pero no se ha visto cuál es: se deja la etiqueta.")
                block.append("{c: Estribillo}")
            else:
                block += ["{soc}"] + src + ["{eoc}"]
                expanded = True
        elif not lines:
            if not block:
                continue
        else:
            default = {"intro": "Intro", "instrumental": "Instrumental", "bridge": "Puente"}.get(kind, "")
            if kind != "chorus" and (label or default):
                block.append(f"{{c: {label or default}}}")
            if kind == "chorus":
                block += ["{soc}"] + lines + ["{eoc}"]
            else:
                block += lines
        out += [""] + block
    if pending:
        out += [""] + pending

    if expanded:
        notes.append("Donde la hoja solo dice «Estribillo» se ha escrito el estribillo entero.")
    if dropped:
        uniq = list(dict.fromkeys(dropped))[:5]
        notes.append("Quitado de entre los acordes porque no lo son: " + ", ".join(f"«{d}»" for d in uniq) + ".")
    text, _ = arreglar("\n".join(out).strip("\n") + "\n")
    return text, notes, any(sec["lines"] for sec in sections)


def postprocess(data: dict) -> Dict[str, object]:
    """JSON de Claude → {songs: [{title, text, category, doubts, notes}], ignored}."""
    songs = []
    for s in (data.get("songs") or [])[:8]:
        if not isinstance(s, dict):
            continue
        text, notes, has_body = render_song(s)
        if not has_body:
            continue  # ni letra ni acordes: nada que añadir
        doubts = [re.sub(r"\s+", " ", str(d)).strip()[:240] for d in (s.get("doubts") or [])]
        songs.append({
            "title": clean_title(s.get("title")),
            "text": text,
            "category": str(s.get("category") or "").strip().upper()[:3],
            "doubts": [d for d in doubts if d][:8],
            "notes": notes,
        })
    ignored = [re.sub(r"\s+", " ", str(x)).strip()[:240] for x in (data.get("ignored") or [])]
    return {"songs": songs, "ignored": [x for x in ignored if x][:8]}


# ─────────────────────────── Peticiones ─────────────────────────── #

def _ask(content: list, client=None) -> Dict[str, object]:
    data, model = ai_review.ask_json(content, system=SYSTEM, schema=SCHEMA, what="la lectura",
                                     client=client, stream=True, max_tokens=32000)
    res = postprocess(data)
    res["model"] = model
    return res


def _tail(categories: Optional[List[str]]) -> List[str]:
    out = []
    if categories:
        out.append("<categorias>\n" + "\n".join(categories) + "\n</categorias>")
    return out


def read_files(files: List[Tuple[bytes, str]], categories: Optional[List[str]] = None,
               client=None, save: bool = True) -> Dict[str, object]:
    """Fotos / PDF (ya preparados con prepare_upload) → canciones leídas.

    Devuelve {songs: [{title, text, capo, category, doubts, notes}], ignored,
    uploads: [ids], model}.
    """
    if not files:
        raise ReadError("No ha llegado ninguna foto.")
    if len(files) > MAX_FILES:
        raise ReadError(f"Como mucho {MAX_FILES} fotos o PDF a la vez.")
    content: list = []
    for data, mt in files:
        b64 = base64.standard_b64encode(data).decode("ascii")
        kind = "document" if mt == "application/pdf" else "image"
        content.append({"type": kind, "source": {"type": "base64", "media_type": mt, "data": b64}})
    parts = []
    if len(files) > 1:
        parts.append(f"Son {len(files)} páginas seguidas, en este orden.")
    parts += _tail(categories)
    parts.append("Transcribe la canción.")
    content.append({"type": "text", "text": "\n\n".join(parts)})
    res = _ask(content, client)
    res["uploads"] = [save_upload(d, mt) for d, mt in files] if save else []
    return res


def read_page(text: str, url: str = "", categories: Optional[List[str]] = None,
              client=None) -> Dict[str, object]:
    """Texto de una página web sin formato conocido → canciones leídas."""
    text = (text or "").strip()
    if not text:
        raise ReadError("La página no tiene texto.")
    page = text[:MAX_PAGE_TEXT]
    parts = [f'<pagina url="{url}">\n{page}\n</pagina>',
             "Es el texto de una página web, ya sin el formato. Busca la canción (letra y "
             "acordes) e ignora menús, anuncios, comentarios y enlaces a otras canciones. Si los "
             "acordes van en la línea de encima, aquí el texto es de ancho fijo: cada acorde va "
             "sobre el carácter que tiene justo debajo."]
    parts += _tail(categories)
    parts.append("Transcribe la canción.")
    res = _ask([{"type": "text", "text": "\n\n".join(parts)}], client)
    res["uploads"] = []
    return res
