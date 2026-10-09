#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del corrector IA (ai_review.py) con un cliente falso: no llama a la API.

Corre sin dependencias:  python scripts/admin/test_ai_review.py
"""
import json
import os
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ai_review  # noqa: E402

# Los ajustes van a un fichero temporal: los tests no pisan los de verdad.
ai_review.SETTINGS_PATH = Path(tempfile.mkdtemp()) / "settings.json"

CHO = """{title: Prueba}

[G]Y me han dado res[D]puestas
pero no sé qué hacer,

{x_acordes_deducidos: de «Algo»}
[C]Otra estrofa

{soc}
[G]Estribillo uno
{eoc}

{soc}
[G]Estribillo uno
{eoc}
"""


class FakeClient:
    def __init__(self, payload=None, stop_reason="end_turn", text=None, models=None, fail_first=None):
        self.calls = []
        body = text if text is not None else json.dumps(
            payload or {"summary": "", "edits": [], "meta": _meta()})
        self._resp = SimpleNamespace(stop_reason=stop_reason, model="claude-opus-5-5",
                                     content=[SimpleNamespace(type="text", text=body)])
        self._fail_first = fail_first
        self.beta = SimpleNamespace(messages=SimpleNamespace(create=self._create))
        self.models = SimpleNamespace(list=lambda: iter(models or []))

    def _create(self, **kw):
        self.calls.append(kw)
        if self._fail_first and len(self.calls) == 1:
            raise self._fail_first
        return self._resp


def _meta(**kw):
    m = {"title": "", "artist": "", "key": "", "capo": -1, "category": ""}
    m.update(kw)
    return m


def test_request_shape():
    c = FakeClient()
    ai_review.correct("G\nHola", "[G]Hola", ["aviso"], ["A. Entrada"], client=c)
    kw = c.calls[0]
    assert kw["model"] == ai_review.model_name()
    assert kw["output_config"]["format"]["type"] == "json_schema"
    assert kw["output_config"]["effort"] == "high"
    assert kw["fallbacks"] == "default" and "server-side-fallback-2026-07-01" in kw["betas"]
    msg = kw["messages"][0]["content"]
    assert "<original>" in msg and "<resultado>" in msg and "- aviso" in msg and "A. Entrada" in msg


def test_edits_validated():
    edits = [
        {"find": "[G]Y me han dado res[D]puestas", "replace": "[G]Y me han [D]dado respuestas", "why": "D en «dado»"},
        {"find": "una línea que no existe", "replace": "x", "why": "inventada"},
        {"find": "{x_acordes_deducidos: de «Algo»}", "replace": "", "why": "quitar marca"},
        {"find": "[G]Estribillo uno", "replace": "[G]Estribillo [C]uno", "why": "falta C"},
        {"find": "pero no sé qué hacer,", "replace": "pero no sé qué hacer,", "why": "igual"},
    ]
    out = ai_review.validate_edits(CHO, edits)
    assert [e["why"] for e in out] == ["D en «dado»", "falta C"]
    assert out[1]["matches"] == 2  # el estribillo repetido: las dos copias


def test_apply_edits_all_copies_delete_and_insert():
    edits = ai_review.validate_edits(CHO, [
        {"find": "[G]Estribillo uno", "replace": "[G]Estribillo [C]uno", "why": "a"},
        {"find": "pero no sé qué hacer,", "replace": "pero no sé qué hacer,\nverso que faltaba", "why": "b"},
        {"find": "[C]Otra estrofa", "replace": "", "why": "c"},
    ])
    out = ai_review.apply_edits(CHO, edits)
    assert out.count("[G]Estribillo [C]uno") == 2
    assert "pero no sé qué hacer,\nverso que faltaba" in out
    assert "[C]Otra estrofa" not in out
    assert "{x_acordes_deducidos" in out


def test_meta_cleaned():
    payload = {"summary": "ok", "edits": [], "meta": _meta(key="D", capo=2, category="i")}
    out = ai_review.correct("t", "[G]x", client=FakeClient(payload))
    assert out["meta"]["key"] == "D" and out["meta"]["capo"] == 2 and out["meta"]["category"] == "I"
    out = ai_review.correct("t", "[G]x", client=FakeClient({"summary": "", "edits": [], "meta": _meta()}))
    assert out["meta"]["capo"] is None and out["meta"]["title"] == ""


def test_refusal_and_bad_json_raise():
    for c in (FakeClient(stop_reason="refusal"), FakeClient(text="no es json")):
        try:
            ai_review.correct("t", "[G]x", client=c)
        except ai_review.ReviewError:
            continue
        raise AssertionError("debería fallar")


def test_retry_without_extras_on_400():
    err = Exception("effort not supported")
    err.status_code = 400
    c = FakeClient(fail_first=err)
    ai_review.correct("t", "[G]x", client=c)
    assert len(c.calls) == 2
    assert "effort" not in c.calls[1]["output_config"] and "fallbacks" not in c.calls[1]


def test_settings_roundtrip_and_priority():
    old = dict(os.environ)
    try:
        os.environ["CANTORAL_AI_MODEL"] = "claude-sonnet-5-5"
        ai_review.save_settings({"model": ""})
        assert ai_review.model_name() == "claude-sonnet-5-5"       # entorno
        ai_review.save_settings({"model": "claude-haiku-5-5", "effort": "low", "auto": False})
        assert ai_review.model_name() == "claude-haiku-5-5"        # ajustes > entorno
        assert ai_review.effort() == "low" and ai_review.auto_enabled() is False
        for bad in ({"model": "gpt-5"}, {"effort": "turbo"}):
            try:
                ai_review.save_settings(bad)
            except ValueError:
                continue
            raise AssertionError(f"debería rechazar {bad}")
        os.environ.pop("ANTHROPIC_API_KEY", None)
        assert not ai_review.is_configured()
        os.environ["ANTHROPIC_API_KEY"] = "sk-x"
        assert ai_review.is_configured()
    finally:
        os.environ.clear()
        os.environ.update(old)
        ai_review.SETTINGS_PATH.unlink(missing_ok=True)


def test_list_models_sorted_with_capabilities():
    from datetime import datetime
    caps_ok = {"structured_outputs": {"supported": True},
               "effort": {"supported": True, "low": {"supported": True}, "medium": {"supported": False},
                          "high": {"supported": True}, "xhigh": {"supported": False}, "max": {"supported": True}}}
    models = [
        SimpleNamespace(id="claude-old", display_name="Viejo", created_at=datetime(2025, 1, 1),
                        capabilities={"structured_outputs": {"supported": False}, "effort": {"supported": False}}),
        SimpleNamespace(id="claude-new", display_name="Nuevo", created_at=datetime(2026, 9, 1), capabilities=caps_ok),
    ]
    out = ai_review.list_models(client=FakeClient(models=models), force=True)
    assert [m["id"] for m in out] == ["claude-new", "claude-old"]
    assert out[0]["structured"] and out[0]["efforts"] == ["low", "high", "max"]
    assert out[1]["structured"] is False and out[1]["efforts"] == []
    # Con la lista cargada, un esfuerzo que el modelo no admite no se manda.
    ai_review.save_settings({"model": "claude-new", "effort": "medium"})
    c = FakeClient()
    ai_review.correct("t", "[G]x", client=c)
    assert "effort" not in c.calls[0]["output_config"] and "fallbacks" not in c.calls[0]
    ai_review.SETTINGS_PATH.unlink(missing_ok=True)


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
