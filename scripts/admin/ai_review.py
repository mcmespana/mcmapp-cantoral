#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Revisor IA de canciones importadas: Claude SEÑALA fallos, no reescribe.

La conversión la hace song_import.py (determinista, gratis). Esto es una
segunda mirada: se le pasa a Claude el texto original y el .cho que ha salido,
y devuelve una lista de avisos concretos —«este acorde estaba sobre otra
sílaba», «esta estrofa deducida no cuadra», «falta una línea»— citando la línea
exacta del .cho. Quien decide y corrige eres tú, en el editor.

Configuración (variables de entorno del admin, p.ej. en el NAS):
  ANTHROPIC_API_KEY   la clave de la API. Sin ella el botón sale desactivado.
  CANTORAL_AI_MODEL   opcional, por defecto claude-opus-5-5. Una revisión
                      cuesta céntimos; si se quiere gastar menos, vale
                      claude-sonnet-5-5.
"""
from __future__ import annotations

import json
import os
from typing import Dict, List, Optional

DEFAULT_MODEL = "claude-opus-5-5"

ISSUE_KINDS = [
    "acorde_mal_colocado", "acorde_raro", "acorde_perdido", "acorde_deducido_dudoso",
    "estribillo", "estructura", "letra", "metadatos", "otro",
]

SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "issues": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "line": {"type": "string"},
                    "kind": {"type": "string", "enum": ISSUE_KINDS},
                    "severity": {"type": "string", "enum": ["alta", "media", "baja"]},
                    "problem": {"type": "string"},
                    "suggestion": {"type": "string"},
                },
                "required": ["line", "kind", "severity", "problem", "suggestion"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["summary", "issues"],
    "additionalProperties": False,
}

SYSTEM = """\
Revisas canciones para el cantoral de una parroquia. Un conversor automático ha \
pasado una canción pegada por alguien (texto con los acordes en la línea de \
encima, letra sola o ChordPro) a formato ChordPro. Tu trabajo es encontrar lo que \
el conversor haya hecho mal, comparando el ORIGINAL con el RESULTADO. No \
reescribas la canción: señala problemas concretos para que una persona los \
corrija en el editor.

Cómo es el resultado:
- Los acordes van entre corchetes justo delante de la sílaba donde suenan: \
"[G]Me he hecho tantas pre[D]guntas". Están siempre en notación inglesa (Do=C, \
Re=D, Mi=E, Fa=F, Sol=G, La=A, Si=B; "sim" o "Sim" = Bm).
- {soc} y {eoc} rodean un estribillo. Los estribillos se escriben enteros cada \
vez que se cantan, a propósito: no es un error que se repitan.
- {x_acordes_deducidos: …} delante de una estrofa significa que el original no \
traía acordes ahí y el conversor los ha copiado de otra estrofa, sílaba a \
sílaba. Comprueba si es verosímil (misma melodía: mismo número de versos y de \
sílabas parecido). Un estribillo repetido sin esa marca es una copia exacta de \
otro y no hace falta revisarlo.
- {comment: …} son anotaciones (Intro, Puente…). Las líneas de solo acordes \
("[G]   [D]   [Em]") son introducciones o interludios.
- En el original con acordes encima, la posición de cada acorde es la columna \
sobre la letra. Si el original estaba centrado o en fuente proporcional, las \
columnas pueden no cuadrar: en caso de duda, piensa dónde caería musicalmente \
(normalmente en una sílaba acentuada o al principio del verso).

Qué buscar, de más a menos importante:
1. Acordes perdidos, de más o cambiados respecto al original (acorde_perdido, acorde_raro).
2. Acordes claramente en otra sílaba que en el original (acorde_mal_colocado).
3. Estrofas deducidas que no cuadran (acorde_deducido_dudoso).
4. Estribillos sin marcar, o marcados sin serlo (estribillo).
5. Versos que faltan, sobran, partidos o unidos de más (estructura, letra).
6. Título, autor, tono o cejilla mal sacados (metadatos).
Ignora diferencias de espacios, mayúsculas y puntuación que no cambian nada.

Para cada problema: "line" es la línea del RESULTADO copiada tal cual (o "" si \
el problema es de la canción entera o de algo que falta); "problem" dice qué \
está mal en una frase; "suggestion" dice cómo quedaría bien, escribiendo la \
línea corregida si se puede. Sé concreto y breve, en español. Si todo está \
bien, devuelve la lista vacía: no te inventes problemas. "summary" es una frase \
con tu impresión general."""


class ReviewError(RuntimeError):
    pass


def model_name() -> str:
    return (os.environ.get("CANTORAL_AI_MODEL") or DEFAULT_MODEL).strip()


def is_configured() -> bool:
    return bool((os.environ.get("ANTHROPIC_API_KEY") or "").strip())


def _client():
    try:
        import anthropic  # importado aquí: el admin funciona sin el paquete
    except ImportError as e:  # pragma: no cover
        raise ReviewError("Falta el paquete «anthropic» (pip install anthropic).") from e
    return anthropic.Anthropic()


def build_user_message(original: str, cho: str, notes: Optional[List[str]] = None) -> str:
    parts = ["<original>\n" + original.strip() + "\n</original>",
             "<resultado>\n" + cho.strip() + "\n</resultado>"]
    if notes:
        parts.append("<avisos_del_conversor>\n" + "\n".join(f"- {n}" for n in notes)
                     + "\n</avisos_del_conversor>")
    parts.append("Revisa el resultado frente al original.")
    return "\n\n".join(parts)


def review(original: str, cho: str, notes: Optional[List[str]] = None, client=None) -> Dict[str, object]:
    """Pide la revisión. Devuelve {summary, issues, model}."""
    if not cho.strip():
        raise ReviewError("No hay nada que revisar.")
    client = client or _client()
    model = model_name()
    try:
        resp = client.beta.messages.create(
            model=model,
            max_tokens=16000,
            system=SYSTEM,
            messages=[{"role": "user", "content": build_user_message(original, cho, notes)}],
            output_config={
                "effort": "high",
                "format": {"type": "json_schema", "schema": SCHEMA},
            },
            # Si un clasificador de seguridad rechazara la petición (no debería:
            # es una canción), el servidor la reintenta con el modelo que toque.
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
    except Exception as e:  # errores de red/API: se enseñan tal cual en el modal
        raise ReviewError(f"La API ha fallado: {getattr(e, 'message', None) or e}") from e

    if getattr(resp, "stop_reason", None) == "refusal":
        raise ReviewError("El modelo ha rechazado la revisión. Prueba otra vez o revísala a mano.")
    if getattr(resp, "stop_reason", None) == "max_tokens":
        raise ReviewError("La respuesta se ha cortado (demasiado larga).")
    text = next((b.text for b in resp.content if getattr(b, "type", "") == "text"), "")
    try:
        data = json.loads(text)
    except (TypeError, ValueError) as e:
        raise ReviewError("La respuesta no se ha podido leer.") from e
    issues = [i for i in data.get("issues", []) if isinstance(i, dict)]
    order = {"alta": 0, "media": 1, "baja": 2}
    issues.sort(key=lambda i: order.get(i.get("severity"), 3))
    return {"summary": data.get("summary", ""), "issues": issues, "model": getattr(resp, "model", model)}
