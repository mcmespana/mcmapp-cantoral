#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests del revisor IA (ai_review.py) con un cliente falso: no llama a la API.

Corre sin dependencias:  python scripts/admin/test_ai_review.py
"""
import json
import os
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ai_review  # noqa: E402


class FakeClient:
    def __init__(self, payload=None, stop_reason="end_turn", text=None):
        self.calls = []
        body = text if text is not None else json.dumps(payload or {"summary": "", "issues": []})
        resp = SimpleNamespace(stop_reason=stop_reason, model="claude-opus-5-5",
                               content=[SimpleNamespace(type="text", text=body)])
        self.beta = SimpleNamespace(messages=SimpleNamespace(create=self._create))
        self._resp = resp

    def _create(self, **kw):
        self.calls.append(kw)
        return self._resp


def test_request_shape():
    c = FakeClient()
    ai_review.review("G\nHola", "[G]Hola", ["aviso"], client=c)
    kw = c.calls[0]
    assert kw["model"] == ai_review.model_name()
    assert kw["output_config"]["format"]["type"] == "json_schema"
    assert kw["fallbacks"] == "default" and "server-side-fallback-2026-07-01" in kw["betas"]
    msg = kw["messages"][0]["content"]
    assert "<original>" in msg and "<resultado>" in msg and "- aviso" in msg


def test_issues_sorted_by_severity():
    payload = {"summary": "ok", "issues": [
        {"line": "", "kind": "otro", "severity": "baja", "problem": "b", "suggestion": ""},
        {"line": "x", "kind": "acorde_perdido", "severity": "alta", "problem": "a", "suggestion": ""},
    ]}
    out = ai_review.review("t", "[G]x", client=FakeClient(payload))
    assert [i["severity"] for i in out["issues"]] == ["alta", "baja"]


def test_refusal_and_bad_json_raise():
    for c in (FakeClient(stop_reason="refusal"), FakeClient(text="no es json")):
        try:
            ai_review.review("t", "[G]x", client=c)
        except ai_review.ReviewError:
            continue
        raise AssertionError("debería fallar")


def test_model_env_and_configured():
    old = dict(os.environ)
    try:
        os.environ.pop("ANTHROPIC_API_KEY", None)
        assert not ai_review.is_configured()
        os.environ["ANTHROPIC_API_KEY"] = "sk-x"
        assert ai_review.is_configured()
        os.environ["CANTORAL_AI_MODEL"] = "claude-sonnet-5-5"
        assert ai_review.model_name() == "claude-sonnet-5-5"
    finally:
        os.environ.clear()
        os.environ.update(old)


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
