#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tests de la API para la app (/api/app/*) de server.py.

Corre con:  python scripts/admin/test_app_api.py   (también vale con pytest)

No toca la red ni el repo de verdad: cada test monta un `songs/` temporal,
cambia el verificador de tokens de Firebase por uno falso y `git` por uno que
solo apunta lo que se le pide. Un único test usa git de verdad (en un repo
temporal, sin remoto) para comprobar que el commit se lleva solo ese archivo.
Las letras son inventadas.
"""
import base64
import io
import json
import shutil
import subprocess
import sys
import tempfile
from contextlib import contextmanager
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import server  # noqa: E402
import chordpro as cp  # noqa: E402

CHO = (
    "{title: Ven a Celebrar}\n"
    "{artist: Alborada}\n"
    "{key: G}\n"
    "{capo: 2}\n"
    "{ritmo: 4x4}\n"
    "\n"
    "{soc}\n"
    "[G]Ven a cele[D]brar\n"
    "{eoc}\n"
)
SONG = "01.ven_a_celebrar.cho"
SONG_REL = f"songs/E. Ofertorio/{SONG}"
INDICE = {
    "entrada": {"categoryTitle": "A. Canciones Entrada 🎉", "order": 1},
    "ofertorio": {"categoryTitle": "E. Ofertorio 🤲", "order": 5},
}
USER = {"uid": "uid123", "email": "ana@example.org", "name": "Ana"}
BASIC = {"Authorization": "Basic " + base64.b64encode(b"ana:secreto").decode("ascii")}
PDF = b"%PDF-1.4\n1 0 obj << /Type /Pages >> endobj 2 0 obj << /Type /Page >> endobj"


# ── andamiaje ──────────────────────────────────────────────────────────────────
class FakeGit:
    """Sustituto de server._run_git: apunta las llamadas y contesta lo guionizado.

    `script` = {subcomando: [(returncode, stdout, stderr), …]}: cada llamada a
    ese subcomando consume una respuesta; cuando se acaban, todo va bien.
    """

    def __init__(self, script=None):
        self.calls = []
        self.script = {k: list(v) for k, v in (script or {}).items()}

    def __call__(self, args, timeout=30):
        args = list(args)
        self.calls.append(args)
        queue = self.script.get(args[0])
        if queue:
            rc, out, err = queue.pop(0)
        elif args[:2] == ["rev-parse", "--abbrev-ref"] and args[-1] == "HEAD":
            rc, out, err = 0, "main\n", ""
        elif args[0] == "status":
            rc, out, err = 0, f" M {args[-1]}\n", ""
        else:
            rc, out, err = 0, "", ""
        return subprocess.CompletedProcess(["git", *args], rc, out, err)

    def named(self, name):
        return [c for c in self.calls if c[0] == name]


@contextmanager
def patched(obj, **attrs):
    old = {k: getattr(obj, k) for k in attrs}
    for k, v in attrs.items():
        setattr(obj, k, v)
    try:
        yield
    finally:
        for k, v in old.items():
            setattr(obj, k, v)


@contextmanager
def sandbox(verifier=None, git=None, users=None):
    """Un repo de mentira + verificador y git falsos. Devuelve (client, repo, git)."""
    repo = Path(tempfile.mkdtemp(prefix="cantoral-app-api-"))
    songs = repo / "songs"
    (songs / "A. Entrada").mkdir(parents=True)
    (songs / "E. Ofertorio").mkdir()
    (songs / "E. Ofertorio" / SONG).write_text(CHO, encoding="utf-8")
    (songs / "indice.json").write_text(json.dumps(INDICE, ensure_ascii=False), encoding="utf-8")
    git = git or FakeGit()
    server._app_token_cache.clear()
    with patched(server, REPO_DIR=repo, SONGS_DIR=songs, BACKUP_DIR=repo / "songs-backup-edits",
                 INDICE_JSON=songs / "indice.json", _ADMIN_USERS=users or {},
                 verify_app_admin=verifier or (lambda token: dict(USER)),
                 _run_git=git, _GIT_LOCK_WAIT=0,
                 # El Word del cantoral no pinta nada aquí (y tarda en leerse).
                 reserved_numbers_for=lambda letter: {}):
        try:
            yield server.app.test_client(), repo, git
        finally:
            shutil.rmtree(repo, ignore_errors=True)


def bearer(token="token-de-ana"):
    return {"Authorization": f"Bearer {token}"}


def jwt(claims):
    payload = base64.urlsafe_b64encode(json.dumps(claims).encode("utf-8")).decode("ascii")
    return "cabecera." + payload.rstrip("=") + ".firma"


def edition(**kw):
    ed = {"filename": SONG, "category": "ofertorio"}
    ed.update(kw)
    return ed


def content_edition(**kw):
    """Una edición de la app: cambia el título y un verso."""
    old = cp.content_for_app(CHO)
    ed = edition(titleOld="Ven a Celebrar", titleNew="Ven a Cantar", contentOld=old,
                 contentNew=old.replace("[G]Ven a cele[D]brar", "[G]Ven a can[D]tar"))
    ed.update(kw)
    return ed


def read_song(repo):
    return (repo / SONG_REL).read_text(encoding="utf-8")


# ── quién entra ────────────────────────────────────────────────────────────────
def test_sin_token_401():
    with sandbox() as (client, _, _):
        for headers in ({}, {"Authorization": "Bearer "}, BASIC):
            r = client.get("/api/app/status", headers=headers)
            assert r.status_code == 401, headers
            assert "sesión" in r.get_json()["error"]
            # los errores también llevan CORS, o la web no puede leer el mensaje
            assert r.headers["Access-Control-Allow-Origin"] == "*"


def test_no_admin_403():
    def no_admin(token):
        raise server.AppAuthError(403, "Tu cuenta no es administradora del cantoral")

    with sandbox(verifier=no_admin) as (client, repo, git):
        r = client.get("/api/app/status", headers=bearer())
        assert r.status_code == 403
        assert r.get_json() == {"error": "Tu cuenta no es administradora del cantoral"}
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        assert r.status_code == 403
        assert read_song(repo) == CHO and git.calls == []


def test_basic_auth_solo_en_el_admin():
    with sandbox(users={"ana": "secreto"}) as (client, _, _):
        # un endpoint del admin sigue pidiendo usuario y contraseña…
        r = client.get("/api/ai/status")
        assert r.status_code == 401 and "Basic" in r.headers["WWW-Authenticate"]
        assert client.get("/api/ai/status", headers=bearer()).status_code == 401
        assert client.get("/api/ai/status", headers=BASIC).status_code == 200
        assert "Access-Control-Allow-Origin" not in client.get("/api/ai/status", headers=BASIC).headers
        # …y la API de la app no: le basta el token
        assert client.get("/api/app/status", headers=bearer()).status_code == 200
        # pero la contraseña del admin no vale como token
        assert client.get("/api/app/status", headers=BASIC).status_code == 401


def test_preflight_options():
    with sandbox(users={"ana": "secreto"}) as (client, _, _):
        r = client.open("/api/app/song/save", method="OPTIONS", headers={
            "Origin": "https://app.example", "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type"})
        assert r.status_code == 204 and r.data == b""
        assert r.headers["Access-Control-Allow-Origin"] == "*"
        assert r.headers["Access-Control-Allow-Headers"] == "Authorization, Content-Type"
        assert r.headers["Access-Control-Allow-Methods"] == "GET, POST, OPTIONS"
        assert int(r.headers["Access-Control-Max-Age"]) > 0


def test_respuesta_positiva_en_cache():
    seen = []

    def verifier(token):
        seen.append(token)
        return dict(USER)

    with sandbox(verifier=verifier) as (client, _, _):
        for _ in range(3):
            assert client.get("/api/app/status", headers=bearer("t1")).status_code == 200
        assert seen == ["t1"]
        assert client.get("/api/app/status", headers=bearer("t2")).status_code == 200
        assert seen == ["t1", "t2"]
        # se guarda el hash, no el token
        assert all("t1" not in k and len(k) == 64 for k in server._app_token_cache)


def test_un_no_no_se_guarda_en_cache():
    calls = []

    def verifier(token):
        calls.append(token)
        raise server.AppAuthError(401, "Sesión no válida")

    with sandbox(verifier=verifier) as (client, _, _):
        assert client.get("/api/app/status", headers=bearer()).status_code == 401
        assert client.get("/api/app/status", headers=bearer()).status_code == 401
        assert len(calls) == 2 and not server._app_token_cache


# ── el verificador de verdad, con un Firebase falso ────────────────────────────
def _verify(claims, reply=(200, b"true"), env_url="https://cantoral.example"):
    """verify_app_admin con _http_get falso. Devuelve (resultado, urls pedidas)."""
    urls = []

    def http_get(url, timeout):
        urls.append(url)
        if isinstance(reply, Exception):
            raise reply
        return reply

    env = dict(server.os.environ)
    env.pop("FIREBASE_URL", None)
    if env_url:
        env["FIREBASE_URL"] = env_url
    # _ENV_LOADED: que no vaya a leer el .env de verdad del repo.
    with patched(server, _http_get=http_get, _ENV_LOADED=True), patched(server.os, environ=env):
        try:
            return server.verify_app_admin(jwt(claims)), urls
        except server.AppAuthError as e:
            return e, urls


def test_verificador_admin():
    claims = {"user_id": "uid_A-1", "email": "ana@example.org", "name": "Ana\nPérez", "exp": 99}
    user, urls = _verify(claims)
    assert user == {"uid": "uid_A-1", "email": "ana@example.org", "name": "Ana Pérez", "exp": 99}
    token = jwt(claims)
    assert urls == [f"https://cantoral.example/users/uid_A-1/isAdmin.json?auth={token}"]
    # sin user_id vale `sub`
    user, _ = _verify({"sub": "uidSub"})
    assert user["uid"] == "uidSub" and user["email"] == ""


def test_verificador_rechazos():
    cases = [
        (dict(reply=(200, b"false")), 403),
        (dict(reply=(200, b"null")), 403),
        (dict(reply=(200, b'"true"')), 403),          # la cadena "true" no es true
        (dict(reply=(401, b'{"error":"Auth token is expired"}')), 401),
        (dict(reply=(403, b"{}")), 401),
        (dict(reply=(500, b"")), 502),
        (dict(reply=OSError("sin red")), 502),
        (dict(env_url=""), 503),
    ]
    for kw, code in cases:
        err, _ = _verify({"user_id": "uid1"}, **kw)
        assert isinstance(err, server.AppAuthError) and err.code == code, (kw, err)
    err, _ = _verify({"user_id": "uid1"}, env_url="")
    assert "FIREBASE_URL" in err.message


def test_verificador_no_pregunta_por_uids_raros():
    for claims in ({}, {"user_id": "../admins"}, {"user_id": "a/b"}, {"user_id": "x" * 129},
                   {"sub": "uid con espacios"}):
        err, urls = _verify(claims)
        assert isinstance(err, server.AppAuthError) and err.code == 401 and urls == [], claims
    with patched(server, _http_get=lambda url, timeout: (200, b"true")):
        for token in ("no-es-un-jwt", "a.b", "a.%%%.c", "a." + "e30" + ".c.d"):
            try:
                server.verify_app_admin(token)
            except server.AppAuthError as e:
                assert e.code == 401
            else:
                raise AssertionError(token)


def test_token_real_de_extremo_a_extremo():
    """Sin verificador falso: token → Firebase (falso) → 200, y el fallo de red no filtra el token."""
    token = jwt({"user_id": "uid1", "email": "ana@example.org"})
    env = dict(server.os.environ, FIREBASE_URL="https://cantoral.example/")
    with sandbox() as (client, _, _):
        with patched(server, verify_app_admin=VERIFY_REAL, _ENV_LOADED=True,
                     _http_get=lambda url, timeout: (200, b"true")), \
                patched(server.os, environ=env):
            r = client.get("/api/app/status", headers=bearer(token))
            assert r.status_code == 200 and r.get_json()["user"]["email"] == "ana@example.org"

        def boom(url, timeout):
            raise OSError(f"no llego a {url}")

        server._app_token_cache.clear()
        with patched(server, verify_app_admin=VERIFY_REAL, _ENV_LOADED=True, _http_get=boom), \
                patched(server.os, environ=env):
            r = client.get("/api/app/status", headers=bearer(token))
            assert r.status_code == 502 and token not in r.get_data(as_text=True)


VERIFY_REAL = server.verify_app_admin


# ── status ─────────────────────────────────────────────────────────────────────
def test_status():
    with sandbox() as (client, _, _):
        with patched(server.ai_review, is_configured=lambda: False):
            data = client.get("/api/app/status", headers=bearer()).get_json()
        assert data["ok"] is True and data["ai"] is False
        assert data["user"] == {"email": "ana@example.org", "name": "Ana"}
        assert data["categories"] == [
            {"letter": "A", "title": "A. Canciones Entrada 🎉", "key": "entrada"},
            {"letter": "E", "title": "E. Ofertorio 🤲", "key": "ofertorio"},
        ]
        with patched(server.ai_review, is_configured=lambda: True):
            assert client.get("/api/app/status", headers=bearer()).get_json()["ai"] is True


# ── reordenar ──────────────────────────────────────────────────────────────────
def test_reorder_renumera_y_commitea_la_carpeta():
    with sandbox() as (client, repo, git):
        folder = repo / "songs" / "E. Ofertorio"
        (folder / "02.otra.cho").write_text("{title: Otra}\n", encoding="utf-8")
        r = client.post("/api/app/category/reorder", headers=bearer(),
                        json={"category": "ofertorio", "order": ["02.otra.cho", SONG]})
        assert r.status_code == 200, r.get_data(as_text=True)
        data = r.get_json()
        assert data["new_order"][0] == "01.otra.cho" and data["pushed"] is True
        assert sorted(p.name for p in folder.glob("*.cho")) == sorted(data["new_order"])
        assert git.named("add") == [["add", "--", "songs/E. Ofertorio"]]
        # faltan canciones → 400; categoría que no existe → 404
        assert client.post("/api/app/category/reorder", headers=bearer(),
                           json={"category": "E", "order": ["01.otra.cho"]}).status_code == 400
        assert client.post("/api/app/category/reorder", headers=bearer(),
                           json={"category": "nope", "order": ["x.cho"]}).status_code == 404


# ── guardar ────────────────────────────────────────────────────────────────────
def test_save_aplica_y_commitea_solo_ese_archivo():
    with sandbox() as (client, repo, git):
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        assert r.status_code == 200, r.get_data(as_text=True)
        assert r.get_json() == {"ok": True, "path": SONG_REL, "filename": SONG,
                                "unchanged": False, "committed": True, "pushed": True}
        text = read_song(repo)
        assert "{title: Ven a Cantar}" in text and "[G]Ven a can[D]tar" in text
        assert "{ritmo: 4x4}" in text          # la multimedia que no se toca, se queda
        # copia del original, con el backup del admin
        backups = list((repo / "songs-backup-edits").glob(f"*/E. Ofertorio/{SONG}"))
        assert len(backups) == 1 and backups[0].read_text(encoding="utf-8") == CHO
        # git: solo esa ruta, nunca «add -A»
        assert git.named("add") == [["add", "--", SONG_REL]]
        assert git.named("commit") == [
            ["commit", "-m", "app: edita «Ven a Cantar» (ana@example.org)", "--", SONG_REL]]
        assert git.named("push") == [["push"]]
        assert not git.named("pull")


def test_save_igual_que_el_sync():
    """El .cho queda byte a byte como lo dejaría sincronizaCambiosDeFirebase.py."""
    ed = content_edition(rhythmOld="4x4", rhythmNew="3x4", capoOld=2, capoNew=0,
                         youtubeLinksNew=[{"label": "Oficial", "url": "https://yt/abc"}])
    with sandbox() as (client, repo, _):
        expected = server.sync.apply_edition(
            ed, repo / "songs", {"ofertorio": "E"}, dry_run=True).new_text
        assert client.post("/api/app/song/save", json=ed, headers=bearer()).status_code == 200
        assert read_song(repo) == expected and "{ritmo: 3x4}" in expected


def test_save_solo_metadatos_por_letra():
    with sandbox() as (client, repo, git):
        r = client.post("/api/app/song/save", headers=bearer(),
                        json=edition(category="E", keyOld="G", keyNew="A"))
        assert r.status_code == 200 and r.get_json()["committed"] is True
        assert "{key: A}" in read_song(repo)
        assert git.named("commit")[0][2] == "app: edita «Ven a Celebrar» (ana@example.org)"


def test_save_conflicto_409_y_force():
    stale = content_edition(contentOld="{title: Ven a Celebrar}\n[G]Lo que vio la app\n")
    with sandbox() as (client, repo, git):
        r = client.post("/api/app/song/save", json=stale, headers=bearer())
        assert r.status_code == 409
        body = r.get_json()
        assert body["conflict"] is True and body["error"]
        assert read_song(repo) == CHO and git.calls == []
        assert not (repo / "songs-backup-edits").exists()
        # con force se queda la versión de la app
        r = client.post("/api/app/song/save", json=dict(stale, force=True), headers=bearer())
        assert r.status_code == 200 and r.get_json()["committed"] is True
        assert "[G]Ven a can[D]tar" in read_song(repo)
        # «force» tiene que ser true de verdad, no cualquier cosa
    with sandbox() as (client, repo, _):
        r = client.post("/api/app/song/save", json=dict(stale, force="no"), headers=bearer())
        assert r.status_code == 409 and read_song(repo) == CHO


def test_save_reintento_no_es_conflicto():
    """La misma edición dos veces (se perdió la respuesta): la segunda no molesta."""
    with sandbox() as (client, repo, git):
        assert client.post("/api/app/song/save", json=content_edition(), headers=bearer()).status_code == 200
        saved = read_song(repo)
        git.script["status"] = [(0, "", "")]      # ya está commiteado
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        assert r.status_code == 200, r.get_data(as_text=True)
        data = r.get_json()
        assert data["unchanged"] is True and data["committed"] is False and data["pushed"] is False
        assert "warning" not in data and read_song(repo) == saved
        assert len(git.named("commit")) == 1


def test_save_push_falla_no_es_error():
    git = FakeGit({"push": [(128, "", "fatal: unable to access 'https://github.com/x': "
                                       "Could not resolve host: github.com")]})
    with sandbox(git=git) as (client, repo, _):
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        assert r.status_code == 200
        data = r.get_json()
        assert data["ok"] is True and data["committed"] is True and data["pushed"] is False
        assert "Could not resolve host" in data["warning"] and "Subir" in data["warning"]
        assert "[G]Ven a can[D]tar" in read_song(repo)      # guardada igualmente
        assert not git.named("pull")                        # no era un rechazo: no se rebasa


def test_save_push_rechazado_rebasa_y_reintenta():
    git = FakeGit({"push": [(1, "", " ! [rejected] main -> main (fetch first)")]})
    with sandbox(git=git) as (client, _, _):
        data = client.post("/api/app/song/save", json=content_edition(), headers=bearer()).get_json()
        assert data["committed"] is True and data["pushed"] is True and "warning" not in data
        assert git.named("pull") == [["pull", "--rebase", "--autostash"]]
        assert len(git.named("push")) == 2


def test_save_rebase_imposible_avisa_y_deshace():
    git = FakeGit({"push": [(1, "", " ! [rejected] main -> main (fetch first)")],
                   "pull": [(1, "", "CONFLICT (content): Merge conflict")]})
    with sandbox(git=git) as (client, _, _):
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        data = r.get_json()
        assert r.status_code == 200 and data["committed"] is True and data["pushed"] is False
        assert "choca" in data["warning"]
        assert ["rebase", "--abort"] in git.calls


def test_save_index_lock_reintenta_una_vez():
    lock = (128, "", "fatal: Unable to create '/app/.git/index.lock': File exists.")
    git = FakeGit({"add": [lock], "commit": [lock]})
    with sandbox(git=git) as (client, _, _):
        data = client.post("/api/app/song/save", json=content_edition(), headers=bearer()).get_json()
        assert data["committed"] is True and data["pushed"] is True
        assert len(git.named("add")) == 2 and len(git.named("commit")) == 2
    # si sigue cogido, se avisa y no se insiste
    git = FakeGit({"add": [lock, lock]})
    with sandbox(git=git) as (client, repo, _):
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        data = r.get_json()
        assert r.status_code == 200 and data["ok"] is True
        assert data["committed"] is False and data["pushed"] is False and "index.lock" in data["warning"]
        assert "[G]Ven a can[D]tar" in read_song(repo)
        assert len(git.named("add")) == 2 and not git.named("commit")


def test_save_git_revienta_no_es_error():
    def broken(args, timeout=30):
        raise subprocess.TimeoutExpired(["git", *args], timeout)

    with sandbox(git=broken) as (client, repo, _):
        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        data = r.get_json()
        assert r.status_code == 200 and data["committed"] is False and data["warning"]
        assert "[G]Ven a can[D]tar" in read_song(repo)


def test_save_no_encontrada_404():
    with sandbox() as (client, _, git):
        for ed in (edition(filename="99.no_existe.cho", keyNew="A"),
                   edition(category="quinielas", keyNew="A")):
            r = client.post("/api/app/song/save", json=ed, headers=bearer())
            assert r.status_code == 404 and r.get_json()["error"], ed
        assert git.calls == []


def test_save_peticiones_mal_formadas():
    with sandbox() as (client, repo, git):
        outside = repo / "fuera.cho"
        outside.write_text(CHO, encoding="utf-8")
        bad = [
            {"category": "ofertorio", "keyNew": "A"},                       # sin filename
            {"filename": SONG, "keyNew": "A"},                              # sin category
            edition(filename="../../fuera.cho", keyNew="A"),                # ruta, no nombre
            edition(filename="..\\..\\fuera.cho", keyNew="A"),
            edition(filename="indice.json", keyNew="A"),                    # no es un .cho
            edition(contentNew=["no", "es", "texto"]),
            edition(youtubeLinksNew=[{"url": 3}]),                          # revienta al aplicarla
        ]
        for ed in bad:
            r = client.post("/api/app/song/save", json=ed, headers=bearer())
            assert r.status_code == 400, (ed, r.status_code)
        r = client.post("/api/app/song/save", data="[1, 2]", headers=bearer(),
                        content_type="application/json")
        assert r.status_code == 400
        assert outside.read_text(encoding="utf-8") == CHO and read_song(repo) == CHO
        assert git.calls == []


def test_tope_de_tamano_413():
    with sandbox() as (client, repo, _):
        r = client.post("/api/app/song/save", headers=bearer(),
                        json=content_edition(contentNew="la " * 50000))
        assert r.status_code == 413 and read_song(repo) == CHO
        r = client.post("/api/app/song/convert", json={"text": "la " * 25000}, headers=bearer())
        assert r.status_code == 413
        r = client.post("/api/app/song/new", headers=bearer(),
                        json={"category": "E", "title": "Larga", "content": "la " * 50000})
        assert r.status_code == 413
        with patched(server, _APP_MAX_JSON_BYTES=100):
            r = client.post("/api/app/song/convert", json={"text": "la " * 100}, headers=bearer())
            assert r.status_code == 413 and r.get_json()["error"]


# ── convertir ──────────────────────────────────────────────────────────────────
PASTED = (
    "Camino del monte\n"
    "\n"
    "SOL            RE\n"
    "Subo despacio al monte\n"
    "DO             SOL\n"
    "con la mochila al sol\n"
)


def test_convert():
    with sandbox() as (client, _, _):
        r = client.post("/api/app/song/convert", json={"text": PASTED}, headers=bearer())
        assert r.status_code == 200
        data = r.get_json()
        expected = server.si.import_text(PASTED).to_dict()
        assert data["cho"] == expected["cho"] and data["meta"] == expected["meta"]
        assert data["format"] == "chords_above" and data["meta"]["title"] == "Camino del monte"
        assert "[G]Subo" in data["cho"] and data["duplicate"] is None
        assert "doce" not in data and isinstance(data["notes"], list)
        # formato forzado, y formato que no existe
        r = client.post("/api/app/song/convert", headers=bearer(),
                        json={"text": PASTED, "format": "lyrics"})
        assert r.get_json()["format"] == "lyrics"
        r = client.post("/api/app/song/convert", headers=bearer(),
                        json={"text": PASTED, "format": "pdf"})
        assert r.status_code == 400


def test_convert_avisa_si_ya_existe():
    with sandbox() as (client, _, _):
        text = PASTED.replace("Camino del monte", "Ven a celebrar")
        data = client.post("/api/app/song/convert", json={"text": text}, headers=bearer()).get_json()
        assert data["duplicate"] == {"path": SONG_REL, "title": "Ven a Celebrar",
                                     "category_letter": "E"}


# ── canción nueva ──────────────────────────────────────────────────────────────
NEW_CHO = "{title: Borrador}\n{artist: Coro del Valle}\n{key: G}\n\n[G]Subo despacio al [D]monte\n"


def test_new_por_clave_y_por_letra():
    with sandbox() as (client, repo, git):
        # por la clave de Firebase: el 01 está cogido → le toca el 02
        r = client.post("/api/app/song/new", headers=bearer(), json={
            "category": "ofertorio", "title": "Camino del monte", "artist": "Coro del Valle",
            "key": "G", "capo": 2, "content": NEW_CHO})
        assert r.status_code == 200, r.get_data(as_text=True)
        data = r.get_json()
        rel = "songs/E. Ofertorio/02.camino_del_monte.cho"
        assert data == {"ok": True, "path": rel, "filename": "02.camino_del_monte.cho",
                        "committed": True, "pushed": True}
        text = (repo / rel).read_text(encoding="utf-8")
        assert text.splitlines()[:5] == [server.TODO_COMMENT_LINE, "{title: Camino del monte}",
                                         "{artist: Coro del Valle}", "{key: G}", "{capo: 2}"]
        assert "[G]Subo despacio al [D]monte" in text and "Borrador" not in text
        assert git.named("add") == [["add", "--", rel]]
        assert git.named("commit") == [
            ["commit", "-m", "app: nueva «Camino del monte» (ana@example.org)", "--", rel]]

        # por la letra, en una categoría vacía: el 01
        r = client.post("/api/app/song/new", headers=bearer(), json={
            "category": "a", "title": "Otra del camino", "content": "[C]La la la\n"})
        assert r.status_code == 200
        assert r.get_json()["path"] == "songs/A. Entrada/01.otra_del_camino.cho"


def test_new_cabecera_del_chordpro_si_no_viene_en_el_formulario():
    with sandbox() as (client, repo, _):
        r = client.post("/api/app/song/new", headers=bearer(),
                        json={"category": "entrada", "content": NEW_CHO})
        assert r.status_code == 200
        text = (repo / r.get_json()["path"]).read_text(encoding="utf-8")
        assert "{title: Borrador}" in text and "{artist: Coro del Valle}" in text and "{key: G}" in text
        # un título no puede colar otra directiva
        r = client.post("/api/app/song/new", headers=bearer(), json={
            "category": "entrada", "title": "Hola}\n{tags: x", "content": "[C]La\n"})
        text = (repo / r.get_json()["path"]).read_text(encoding="utf-8")
        assert "{tags:" not in text.replace("{title: Hola) {tags: x}", "")


def test_new_409_si_el_archivo_ya_existe():
    with sandbox() as (client, repo, git):
        body = {"category": "E", "title": "Ven a celebrar", "number": 1, "content": "[C]La\n"}
        r = client.post("/api/app/song/new", json=body, headers=bearer())
        assert r.status_code == 409 and "Ya existe" in r.get_json()["error"]
        assert read_song(repo) == CHO and git.calls == []
        # con otro número (o sin él) entra
        r = client.post("/api/app/song/new", json=dict(body, number=7), headers=bearer())
        assert r.status_code == 200 and r.get_json()["filename"] == "07.ven_a_celebrar.cho"


def test_new_peticiones_mal_formadas():
    with sandbox() as (client, repo, git):
        cases = [
            ({"category": "E", "title": "Sin letra"}, 400),
            ({"category": "E", "title": "Sin letra", "content": "   "}, 400),
            ({"title": "Sin categoría", "content": "[C]La\n"}, 400),
            ({"category": "E", "content": "[C]Sin título\n"}, 400),
            ({"category": "quinielas", "title": "X", "content": "[C]La\n"}, 404),
        ]
        for body, code in cases:
            r = client.post("/api/app/song/new", json=body, headers=bearer())
            assert r.status_code == code, (body, r.status_code)
        assert sorted(p.name for p in (repo / "songs").rglob("*.cho")) == [SONG]
        assert git.calls == []


def test_new_push_falla_no_es_error():
    git = FakeGit({"push": [(128, "", "fatal: Could not resolve host: github.com")]})
    with sandbox(git=git) as (client, repo, _):
        r = client.post("/api/app/song/new", headers=bearer(),
                        json={"category": "E", "title": "Camino del monte", "content": NEW_CHO})
        data = r.get_json()
        assert r.status_code == 200 and data["ok"] is True
        assert data["committed"] is True and data["pushed"] is False and data["warning"]
        assert (repo / data["path"]).exists()


# ── leer fotos / PDF ───────────────────────────────────────────────────────────
# Como lo deja song_reader.render_song: ChordPro con los acordes tal y como venían.
READ_TEXT = ("{title: Camino del monte}\n\n"
             "[Sol]Subo despacio al [Re]monte\n[Do]con la mochila al [Sol]sol\n")


def test_read_con_lector_falso():
    seen = {}

    def fake_read_files(payload, categories=None, **kw):
        seen["payload"], seen["categories"] = payload, categories
        return {"songs": [{"title": "Camino del monte", "text": READ_TEXT, "category": "E",
                           "doubts": ["¿Re o Re7 en el primer verso?"], "notes": []}],
                "ignored": [], "uploads": ["0123456789abcdef01234567.pdf"], "model": "falso"}

    with sandbox() as (client, _, _):
        with patched(server.ai_review, is_configured=lambda: True), \
                patched(server.sr, read_files=fake_read_files):
            r = client.post("/api/app/song/read", headers=bearer(),
                            data={"files": (io.BytesIO(PDF), "pagina.pdf")},
                            content_type="multipart/form-data")
        assert r.status_code == 200, r.get_data(as_text=True)
        data = r.get_json()
        assert seen["payload"] == [(PDF, "application/pdf")]
        assert seen["categories"] == ["A. Canciones Entrada 🎉", "E. Ofertorio 🤲"]
        song = data["songs"][0]
        expected = server.si.import_text(READ_TEXT).to_dict()
        # lo de siempre de /api/song/read…
        assert song["text"] == READ_TEXT and song["doubts"] and data["model"] == "falso"
        # …más el ChordPro ya hecho, listo para el editor
        assert song["cho"] == expected["cho"] and "[G]Subo despacio al [D]monte" in song["cho"]
        assert song["meta"] == expected["meta"] and song["meta"]["title"] == "Camino del monte"
        assert song["warnings"] == expected["notes"]


def test_read_sin_ia_503():
    with sandbox() as (client, _, _):
        with patched(server.ai_review, is_configured=lambda: False,
                     not_configured_message=lambda: "La IA no está configurada"):
            r = client.post("/api/app/song/read", headers=bearer(),
                            data={"files": (io.BytesIO(PDF), "pagina.pdf")},
                            content_type="multipart/form-data")
        assert r.status_code == 503 and r.get_json() == {"error": "La IA no está configurada"}


def test_read_sin_archivos_400():
    with sandbox() as (client, _, _):
        with patched(server.ai_review, is_configured=lambda: True):
            r = client.post("/api/app/song/read", headers=bearer(), data={},
                            content_type="multipart/form-data")
        assert r.status_code == 400 and r.get_json()["error"]


# ── lo que se ha movido de sitio sigue igual ───────────────────────────────────
def test_admin_git_commit_sigue_igual():
    """«☁️ Subir» del admin comparte el push con la app: misma respuesta que antes."""
    with sandbox(users={"ana": "secreto"}) as (client, _, git):
        r = client.post("/api/git/commit", json={"message": "cambios"}, headers=BASIC)
        data = r.get_json()
        assert r.status_code == 200 and data["ok"] is True and data["branch"] == "main"
        assert [s["step"] for s in data["steps"]] == ["add", "commit", "push"]
        assert "merged" not in data
        assert git.named("add") == [["add", "-A"]] and git.named("commit") == [["commit", "-m", "cambios"]]

    git = FakeGit({"push": [(1, "", "! [rejected] main -> main (fetch first)")],
                   "rev-parse": [(0, "main\n", ""), (0, "origin/main\n", ""),
                                 (0, "aaa\n", ""), (0, "bbb\n", "")],
                   "diff": [(0, "songs/x.cho\nscripts/admin/server.py\n", "")]})
    with sandbox(git=git) as (client, _, _):
        data = client.post("/api/git/commit", json={"message": "cambios"}).get_json()
        assert data["ok"] is True and data["merged"] is True
        assert data["pulled_count"] == 2 and data["needs_restart"] is True
        assert [s["step"] for s in data["steps"]] == ["add", "commit", "push", "pull", "push2"]

    git = FakeGit({"push": [(128, "", "fatal: Could not resolve host: github.com")]})
    with sandbox(git=git) as (client, _, _):
        r = client.post("/api/git/commit", json={"message": "cambios"})
        assert r.status_code == 500
        assert r.get_json()["error"] == "Fallo en git push: fatal: Could not resolve host: github.com"

    git = FakeGit({"push": [(1, "", "! [rejected]")], "pull": [(1, "", "CONFLICT")]})
    with sandbox(git=git) as (client, _, _):
        r = client.post("/api/git/commit", json={"message": "cambios"})
        assert r.status_code == 500 and "avisa a David" in r.get_json()["error"]
        assert ["rebase", "--abort"] in git.calls


def test_admin_song_new_y_preview_siguen_igual():
    with sandbox() as (client, repo, git):
        r = client.post("/api/song/new", json={"category": "E", "title": "Camino del monte"})
        assert r.get_json() == {"ok": True, "path": "songs/E. Ofertorio/02.camino_del_monte.cho",
                                "filename": "02.camino_del_monte.cho"}
        assert git.calls == []      # el admin no commitea al crear
        with patched(server.da, find_candidates=lambda *a, **k: []):
            data = client.post("/api/song/import/preview", json={"text": PASTED}).get_json()
        assert data["doce"] == [] and data["duplicate"]["path"].endswith("02.camino_del_monte.cho")
        assert data["cho"] == server.si.import_text(PASTED).cho


# ── con git de verdad ──────────────────────────────────────────────────────────
def test_commit_real_solo_lleva_ese_archivo():
    if not shutil.which("git"):
        print("  (sin git: se salta)")
        return
    with sandbox(git=REAL_GIT) as (client, repo, _):
        def git(*args):
            return subprocess.run(["git", *args], cwd=repo, capture_output=True, text=True)

        git("init", "-q", "-b", "main")
        git("config", "user.email", "tests@example.org")
        git("config", "user.name", "Tests")
        git("config", "commit.gpgsign", "false")
        git("add", "-A")
        git("commit", "-q", "-m", "inicio")
        # trabajo a medias de otra persona en el admin: uno preparado y otro sin preparar
        other = repo / "songs" / "A. Entrada" / "01.otra.cho"
        other.write_text("{title: Otra}\n", encoding="utf-8")
        git("add", "--", "songs/A. Entrada/01.otra.cho")
        (repo / "songs" / "indice.json").write_text(
            json.dumps(INDICE, ensure_ascii=False, indent=1), encoding="utf-8")

        r = client.post("/api/app/song/save", json=content_edition(), headers=bearer())
        data = r.get_json()
        # sin remoto no hay push: guardado y commiteado, con aviso
        assert r.status_code == 200 and data["committed"] is True and data["pushed"] is False
        assert data["warning"]
        assert git("log", "-1", "--format=%s").stdout.strip() == \
            "app: edita «Ven a Cantar» (ana@example.org)"
        changed = git("show", "--name-only", "--format=", "HEAD").stdout.split("\n")
        assert [f for f in changed if f] == [SONG_REL]
        # lo de la otra persona sigue ahí, sin commitear
        status = git("status", "--porcelain").stdout.replace('"', "")
        assert "A  songs/A. Entrada/01.otra.cho" in status and " M songs/indice.json" in status

        # una canción nueva (archivo sin trackear) también entra sola
        r = client.post("/api/app/song/new", headers=bearer(),
                        json={"category": "E", "title": "Camino del monte", "content": NEW_CHO})
        assert r.get_json()["committed"] is True
        changed = git("show", "--name-only", "--format=", "HEAD").stdout.split("\n")
        assert [f for f in changed if f] == ["songs/E. Ofertorio/02.camino_del_monte.cho"]
        # guardar otra vez lo mismo no deja un commit vacío
        before = git("rev-parse", "HEAD").stdout
        data = client.post("/api/app/song/save", json=content_edition(), headers=bearer()).get_json()
        assert data["unchanged"] is True and data["committed"] is False
        assert git("rev-parse", "HEAD").stdout == before


REAL_GIT = server._run_git


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
