#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Corrector IA de canciones: Claude arregla lo que el conversor hizo mal.

La conversión la hace song_import.py (determinista, gratis). Esto es la segunda
pasada: se le pasa a Claude el texto original y el .cho que ha salido y devuelve
CAMBIOS CONCRETOS, línea a línea —«esta línea → esta otra, porque…»—, más
sugerencias de título, tono, cejilla y categoría. No reescribe la canción
entera: así cada cambio se puede ver y deshacer de uno en uno.

Un cambio es {find, replace, why}:
  - find:    una línea del .cho copiada tal cual.
  - replace: lo que va en su lugar ("" la borra; con saltos de línea, añade).
  - why:     el motivo en pocas palabras, para el resumen.
Se aplica a TODAS las líneas iguales (un estribillo repetido se arregla en
todas sus copias). Un cambio cuyo `find` no existe se descarta: es la red de
seguridad contra lo que la IA se invente.

Configuración, de más a menos prioridad:
  1. ⚙️ Ajustes del admin (modelo, esfuerzo, automático) → .admin-settings.json
  2. Variables de entorno CANTORAL_AI_MODEL / CANTORAL_AI_EFFORT
  3. Por defecto: claude-opus-5-5, esfuerzo high, automático sí.
La clave va SIEMPRE en la variable de entorno ANTHROPIC_API_KEY (nunca en el
repo ni en los ajustes).
"""
from __future__ import annotations

import json
import os
import threading
import time
from pathlib import Path
from typing import Dict, List, Optional

SCRIPT_DIR = Path(__file__).resolve().parent
# Fuera de git (.gitignore): el commit del admin hace `git add -A`.
SETTINGS_PATH = SCRIPT_DIR / ".admin-settings.json"

DEFAULT_MODEL = "claude-opus-5-5"
DEFAULT_EFFORT = "high"
EFFORTS = ["low", "medium", "high", "xhigh", "max"]
# Modelos que aceptan el reintento automático del servidor ante un rechazo de
# los filtros de seguridad (fallbacks: "default"). Con otros no se manda.
_FALLBACK_MODELS = {"claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-fable-5",
                    "claude-sonnet-5-5"}
MAX_EDITS = 40

DEDUCED_PREFIX = "{x_acordes_deducidos"

SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "edits": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "find": {"type": "string"},
                    "replace": {"type": "string"},
                    "why": {"type": "string"},
                },
                "required": ["find", "replace", "why"],
                "additionalProperties": False,
            },
        },
        "meta": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "artist": {"type": "string"},
                "key": {"type": "string"},
                "capo": {"type": "integer"},
                "category": {"type": "string"},
            },
            "required": ["title", "artist", "key", "capo", "category"],
            "additionalProperties": False,
        },
    },
    "required": ["summary", "edits", "meta"],
    "additionalProperties": False,
}

SYSTEM = """\
Corriges canciones para el cantoral de una parroquia. Un conversor automático \
ha pasado una canción (pegada con los acordes en la línea de encima, letra sola \
o ChordPro) a formato ChordPro. Tu trabajo es ARREGLAR lo que el conversor haya \
hecho mal, con cambios pequeños y concretos, comparando el ORIGINAL con el \
RESULTADO. Tus cambios se aplican solos, así que solo propones lo que estés \
seguro de que mejora la canción; ante la duda, no lo toques.

Cómo es el resultado:
- Los acordes van entre corchetes justo delante de la sílaba donde suenan: \
"[G]Me he hecho tantas pre[D]guntas". Siempre en notación inglesa (Do=C, Re=D, \
Mi=E, Fa=F, Sol=G, La=A, Si=B; "sim" = Bm).
- {soc} y {eoc} rodean un estribillo. Los estribillos van escritos enteros cada \
vez que se cantan, a propósito: que se repitan NO es un error.
- {x_acordes_deducidos: …} delante de una estrofa = el original no traía acordes \
ahí y el conversor los copió de otra estrofa sílaba a sílaba. Puedes recolocar \
o quitar esos acordes si no son verosímiles, pero NUNCA toques ni borres la \
línea {x_acordes_deducidos…}: es la marca para que una persona lo revise.
- {comment: …} son anotaciones (Intro, Puente…). Las líneas de solo acordes \
("[G][D][Em][C]") son introducciones o interludios.
- En el original con acordes encima, el acorde va en la columna de la letra que \
tiene debajo. Si el original estaba centrado o en letra proporcional las \
columnas no cuadran: piensa dónde cae musicalmente (sílaba acentuada, inicio de \
verso).

Qué arreglar, de más a menos importante:
1. Acordes perdidos, de más o mal traducidos respecto al original.
2. Acordes claramente en otra sílaba que en el original.
3. Acordes deducidos inverosímiles.
4. Estribillos sin marcar o marcados sin serlo ({soc}/{eoc}).
5. Versos que faltan, sobran, o partidos/unidos de más.
6. Faltas evidentes de la letra (tildes, erratas), solo si son claras.
NO cambies estilo, mayúsculas, puntuación ni el orden de la canción.

Formato de cada cambio:
- "find": una línea ENTERA del RESULTADO, copiada exactamente igual. Si esa \
línea se repite (un estribillo), el cambio se aplica a todas sus copias.
- "replace": cómo queda. "" para borrarla. Para añadir versos que faltan, pon la \
línea de antes en "find" y en "replace" esa misma línea seguida de "\\n" y los \
versos nuevos.
- "why": el motivo en 2-6 palabras ("D estaba en «dado»", "faltaba un verso").
Si todo está bien, "edits" va vacía. "summary": una frase de menos de 12 \
palabras con lo que has hecho ("Recolocados 2 acordes y marcado el estribillo" \
o "Todo correcto").

"meta": corrige el título, autor, tono o cejilla solo si están mal o faltan y el \
original lo dice; si no, deja "" (y -1 en capo). "category": si te dan una lista \
de categorías, la letra de la que mejor encaje por el momento de la misa o el \
tiempo litúrgico, o "" si no está claro."""


class ReviewError(RuntimeError):
    pass


# ─────────── Ajustes ─────────── #

_settings_lock = threading.Lock()


def load_settings() -> Dict[str, object]:
    try:
        data = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def save_settings(changes: Dict[str, object]) -> Dict[str, object]:
    """Guarda los ajustes de IA que vengan (model, effort, auto)."""
    with _settings_lock:
        data = load_settings()
        if "model" in changes:
            m = str(changes["model"] or "").strip()
            if m and not m.startswith("claude-"):
                raise ValueError("El modelo debe ser un id de Claude (claude-…)")
            data["ai_model"] = m  # "" = volver al de por defecto
        if "effort" in changes:
            e = str(changes["effort"] or "").strip()
            if e and e not in EFFORTS:
                raise ValueError("Esfuerzo no válido")
            data["ai_effort"] = e
        if "auto" in changes:
            data["ai_auto"] = bool(changes["auto"])
        SETTINGS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        return data


def model_name() -> str:
    return (str(load_settings().get("ai_model") or "") or os.environ.get("CANTORAL_AI_MODEL")
            or DEFAULT_MODEL).strip()


def effort() -> str:
    e = (str(load_settings().get("ai_effort") or "") or os.environ.get("CANTORAL_AI_EFFORT")
         or DEFAULT_EFFORT).strip()
    return e if e in EFFORTS else DEFAULT_EFFORT


def auto_enabled() -> bool:
    v = load_settings().get("ai_auto")
    return True if v is None else bool(v)


def is_configured() -> bool:
    return bool((os.environ.get("ANTHROPIC_API_KEY") or "").strip())


def status() -> Dict[str, object]:
    return {"enabled": is_configured(), "model": model_name(), "effort": effort(),
            "auto": auto_enabled(), "default_model": DEFAULT_MODEL, "efforts": EFFORTS}


def _client():
    try:
        import anthropic  # aquí dentro: el admin funciona sin el paquete
    except ImportError as e:  # pragma: no cover
        raise ReviewError("Falta el paquete «anthropic» (pip install anthropic).") from e
    return anthropic.Anthropic()


# ─────────── Modelos disponibles (Models API) ─────────── #

_models_cache: Dict[str, object] = {"at": 0.0, "items": None}


def list_models(client=None, force: bool = False) -> List[Dict[str, object]]:
    """Modelos de Claude que tiene la cuenta, más nuevos primero.

    Se marcan los que sirven para corregir (salida JSON estructurada) y qué
    niveles de esfuerzo admiten. Cacheado 10 minutos.
    """
    now = time.time()
    if not force and _models_cache["items"] is not None and now - float(_models_cache["at"]) < 600:
        return _models_cache["items"]  # type: ignore[return-value]
    client = client or _client()
    out = []
    try:
        for m in client.models.list():
            caps = getattr(m, "capabilities", None) or {}
            if hasattr(caps, "model_dump"):  # la SDK lo da como modelo pydantic
                caps = caps.model_dump()

            def sup(*path):
                node = caps
                for p in path:
                    if not isinstance(node, dict) or p not in node:
                        return None
                    node = node[p]
                return node.get("supported") if isinstance(node, dict) else None

            efforts = [e for e in EFFORTS if sup("effort", e)] if sup("effort") else []
            created = getattr(m, "created_at", None)
            out.append({
                "id": m.id,
                "name": getattr(m, "display_name", "") or m.id,
                "created_at": created.isoformat() if hasattr(created, "isoformat") else str(created or ""),
                "structured": sup("structured_outputs") is not False,
                "efforts": efforts,
            })
    except Exception as e:
        raise ReviewError(f"No se ha podido pedir la lista de modelos: {getattr(e, 'message', None) or e}") from e
    out.sort(key=lambda x: x["created_at"], reverse=True)
    _models_cache.update(at=now, items=out)
    return out


def _model_efforts(model: str) -> Optional[List[str]]:
    items = _models_cache.get("items") or []
    for m in items:  # type: ignore[union-attr]
        if m["id"] == model:
            return m["efforts"]
    return None  # no lo sabemos: se manda y, si falla, se reintenta sin él


# ─────────── Cambios ─────────── #

def _norm_line(s: str) -> str:
    return s.rstrip()


def validate_edits(cho: str, edits: List[dict]) -> List[dict]:
    """Se queda con los cambios aplicables y les pone cuántas líneas tocan."""
    lines = [_norm_line(ln) for ln in cho.split("\n")]
    out: List[dict] = []
    seen = set()
    for e in edits[:MAX_EDITS]:
        if not isinstance(e, dict):
            continue
        find = _norm_line(str(e.get("find", "")))
        replace = str(e.get("replace", "")).replace("\r", "")
        why = str(e.get("why", "")).strip()
        if not find.strip() or find == _norm_line(replace) or (find, replace) in seen:
            continue
        # La marca 👁 es de la persona que revisa: la IA no la toca.
        if find.lstrip().startswith(DEDUCED_PREFIX):
            continue
        n = lines.count(find)
        if not n:
            continue  # se ha inventado la línea
        seen.add((find, replace))
        out.append({"find": find, "replace": replace, "why": why or "corrección", "matches": n})
    return out


def apply_edits(cho: str, edits: List[dict]) -> str:
    """Misma regla que el admin (static/app.js applyAiEdits): línea entera, todas las copias."""
    lines = cho.split("\n")
    for e in edits:
        find = _norm_line(e["find"])
        rep = e["replace"]
        new: List[str] = []
        for ln in lines:
            if _norm_line(ln) == find:
                if rep != "":
                    new.extend(rep.split("\n"))
            else:
                new.append(ln)
        lines = new
    return "\n".join(lines)


def build_user_message(original: str, cho: str, notes: Optional[List[str]] = None,
                       categories: Optional[List[str]] = None) -> str:
    parts = []
    if original.strip():
        parts.append("<original>\n" + original.strip() + "\n</original>")
    else:
        parts.append("<original>(no hay: la canción ya estaba en el cantoral. Corrige solo "
                     "errores evidentes del propio ChordPro: acordes que no existen, "
                     "estribillos mal marcados, acordes deducidos inverosímiles.)</original>")
    parts.append("<resultado>\n" + cho.strip() + "\n</resultado>")
    if notes:
        parts.append("<avisos_del_conversor>\n" + "\n".join(f"- {n}" for n in notes)
                     + "\n</avisos_del_conversor>")
    if categories:
        parts.append("<categorias>\n" + "\n".join(categories) + "\n</categorias>")
    parts.append("Corrige el resultado.")
    return "\n\n".join(parts)


def _call(client, model: str, user_msg: str):
    kwargs = dict(
        model=model,
        max_tokens=16000,
        system=SYSTEM,
        messages=[{"role": "user", "content": user_msg}],
        output_config={"format": {"type": "json_schema", "schema": SCHEMA}},
    )
    eff = effort()
    supported = _model_efforts(model)
    if supported is None or eff in supported:
        kwargs["output_config"]["effort"] = eff
    if model in _FALLBACK_MODELS:
        # Si un filtro de seguridad rechazara la petición (no debería: es una
        # canción), el servidor la reintenta con el modelo que corresponda.
        kwargs["betas"] = ["server-side-fallback-2026-07-01"]
        kwargs["fallbacks"] = "default"
    try:
        return client.beta.messages.create(**kwargs)
    except Exception as e:
        # Un modelo elegido en Ajustes puede no admitir el esfuerzo o el
        # reintento: se prueba una vez más sin esos extras.
        if getattr(e, "status_code", None) == 400 and ("effort" in kwargs["output_config"] or "fallbacks" in kwargs):
            kwargs["output_config"].pop("effort", None)
            kwargs.pop("fallbacks", None)
            kwargs.pop("betas", None)
            return client.beta.messages.create(**kwargs)
        raise


def correct(original: str, cho: str, notes: Optional[List[str]] = None,
            categories: Optional[List[str]] = None, client=None) -> Dict[str, object]:
    """Pide la corrección. Devuelve {summary, edits, meta, model, dropped}."""
    if not cho.strip():
        raise ReviewError("No hay nada que corregir.")
    client = client or _client()
    model = model_name()
    try:
        resp = _call(client, model, build_user_message(original, cho, notes, categories))
    except ReviewError:
        raise
    except Exception as e:  # errores de red/API: se enseñan tal cual
        raise ReviewError(f"La API ha fallado: {getattr(e, 'message', None) or e}") from e

    if getattr(resp, "stop_reason", None) == "refusal":
        raise ReviewError("El modelo ha rechazado la corrección. Prueba otra vez o revísala a mano.")
    if getattr(resp, "stop_reason", None) == "max_tokens":
        raise ReviewError("La respuesta se ha cortado (demasiado larga).")
    text = next((b.text for b in resp.content if getattr(b, "type", "") == "text"), "")
    try:
        data = json.loads(text)
    except (TypeError, ValueError) as e:
        raise ReviewError("La respuesta no se ha podido leer.") from e
    raw = data.get("edits") or []
    edits = validate_edits(cho, raw)
    meta = data.get("meta") or {}
    clean_meta = {
        "title": str(meta.get("title") or "").strip(),
        "artist": str(meta.get("artist") or "").strip(),
        "key": str(meta.get("key") or "").strip(),
        "capo": meta.get("capo") if isinstance(meta.get("capo"), int) and meta.get("capo") >= 0 else None,
        "category": str(meta.get("category") or "").strip().upper()[:3],
    }
    return {
        "summary": str(data.get("summary") or "").strip(),
        "edits": edits,
        "meta": clean_meta,
        "dropped": max(0, len(raw) - len(edits)),
        "model": getattr(resp, "model", model) or model,
    }
