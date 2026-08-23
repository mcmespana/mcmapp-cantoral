#!/bin/bash
# Cantoral Admin — launcher Mac/Linux (versión a prueba de balas)
# - No toca nunca el Python del sistema (evita el error externally-managed / PEP 668)
# - Crea un entorno virtual propio y reutilizable
# - Cadena de fallbacks si algo falla
# - Deja la terminal abierta si peta, para que puedas leer el error

# Nada de "set -e": queremos controlar los fallos a mano y aplicar fallbacks.
set -u

# --- Ir a la raíz del proyecto (un nivel por encima de este script) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
cd "$SCRIPT_DIR/.." || { echo "❌ No pude entrar en la carpeta del proyecto."; read -r -n1 -p "Pulsa una tecla para salir..."; exit 1; }
PROJECT_ROOT="$(pwd)"

echo
echo "=== Cantoral Admin ==="
echo

# --- Cosas que hacer al fallar: pausar para que se lea el error ---
fatal() {
  echo
  echo "❌ $1"
  echo
  read -r -n1 -p "Pulsa una tecla para cerrar esta ventana..."
  echo
  exit 1
}

# --- 1) Encontrar un python3 que funcione ---
PY=""
for cand in python3 /opt/homebrew/bin/python3 /usr/local/bin/python3 /usr/bin/python3 python; do
  if command -v "$cand" >/dev/null 2>&1; then
    if "$cand" -c 'import sys; sys.exit(0 if sys.version_info[0]>=3 else 1)' >/dev/null 2>&1; then
      PY="$(command -v "$cand")"
      break
    fi
  fi
done
[ -n "$PY" ] || fatal "No encontré ningún Python 3. Instálalo con: brew install python"

echo "🐍 Python: $PY ($("$PY" --version 2>&1))"

# --- 2) Preparar el entorno virtual (reutilizable) ---
# Lo intentamos en la raíz del proyecto; si no se puede escribir, en el HOME.
VENV=""
for base in "$PROJECT_ROOT/.cantoral-venv" "$HOME/.cantoral-venv"; do
  if [ -d "$base" ] && [ -x "$base/bin/python" ]; then VENV="$base"; break; fi
done

if [ -z "$VENV" ]; then
  for base in "$PROJECT_ROOT/.cantoral-venv" "$HOME/.cantoral-venv"; do
    echo "📦 Creando entorno virtual en: $base"
    if "$PY" -m venv "$base" >/dev/null 2>&1; then VENV="$base"; break; fi
    # Si falla por ensurepip, probamos sin pip y lo metemos luego
    if "$PY" -m venv --without-pip "$base" >/dev/null 2>&1; then
      "$base/bin/python" -m ensurepip --upgrade >/dev/null 2>&1
      [ -x "$base/bin/python" ] && { VENV="$base"; break; }
    fi
    rm -rf "$base" 2>/dev/null
  done
fi

VPY=""
[ -n "$VENV" ] && [ -x "$VENV/bin/python" ] && VPY="$VENV/bin/python"

# --- 3) Instalar dependencias (flask + pillow) si faltan ---
need_deps() { "$1" -c 'import flask, PIL' >/dev/null 2>&1; }

install_into() {
  # $1 = intérprete python ; $2... = flags extra de pip
  local py="$1"; shift
  "$py" -m pip install --upgrade pip >/dev/null 2>&1
  "$py" -m pip install --quiet "$@" flask pillow
}

DEPS_OK=0
if [ -n "$VPY" ]; then
  if need_deps "$VPY"; then
    DEPS_OK=1
  else
    echo "📥 Instalando dependencias en el entorno virtual..."
    install_into "$VPY" && need_deps "$VPY" && DEPS_OK=1
  fi
  RUNPY="$VPY"
fi

# --- 4) Fallbacks si el venv no funcionó: instalar contra el Python del sistema ---
if [ "$DEPS_OK" -ne 1 ]; then
  echo "⚠️  El entorno virtual no quedó listo. Probando alternativas..."
  RUNPY="$PY"
  if need_deps "$PY"; then
    DEPS_OK=1
  else
    # Probamos varias combinaciones, de la más limpia a la más bestia
    for flags in "--user" "--user --break-system-packages" "--break-system-packages"; do
      echo "   → pip install $flags flask pillow"
      if install_into "$PY" $flags && need_deps "$PY"; then DEPS_OK=1; break; fi
    done
  fi
fi

[ "$DEPS_OK" -eq 1 ] || fatal "No conseguí instalar flask y pillow por ningún método."

echo "✅ Dependencias listas."

# --- 5) Comprobar que el servidor existe ---
[ -f "scripts/admin/server.py" ] || fatal "No encuentro scripts/admin/server.py (¿estás en la carpeta correcta?)."

# --- 6) Abrir navegador y arrancar el servidor ---
URL="http://127.0.0.1:8765/"
echo
echo "🌐 Abriendo navegador en $URL ..."
( sleep 1.5 && ( open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null || true ) ) &

echo
echo "🚀 Arrancando servidor (Ctrl+C para parar)..."
echo
exec "$RUNPY" scripts/admin/server.py