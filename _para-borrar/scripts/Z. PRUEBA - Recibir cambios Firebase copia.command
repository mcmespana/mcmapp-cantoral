#!/bin/zsh
set -e

# Ubicaciones
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "📦 Preparando entorno en: $REPO_ROOT"

# 1) Python 3 presente
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ No encuentro python3. Instálalo con Homebrew: brew install python"
  read -r "?🔒 Presiona ENTER para cerrar..."
  exit 1
fi

# 2) venv
if [ ! -d ".venv" ]; then
  echo "🐍 Creando entorno virtual (.venv)…"
  python3 -m venv .venv
fi
source .venv/bin/activate

# 3) Pip y dependencias
echo "⬆️  Actualizando pip…"
python -m pip install --upgrade pip >/dev/null

REQ_FILE="scripts/requirements.txt"
if [ -f "$REQ_FILE" ]; then
  echo "📚 Instalando dependencias desde $REQ_FILE…"
  python -m pip install -r "$REQ_FILE"
else
  echo "📚 Instalando dependencias mínimas (requests, python-dotenv, rich, google-auth)…"
  python -m pip install requests python-dotenv rich google-auth
fi

# 4) Ejecutar el script de sincronización
PY_SCRIPT="scripts/sincronizaCambiosDeFirebase.py"
[ ! -f "$PY_SCRIPT" ] && PY_SCRIPT="scripts/sincronizaCambiosDeFirebase.py --dry-run"

if [ ! -f "$PY_SCRIPT" ]; then
  echo "❌ No encuentro el script a ejecutar. Busca: $PY_SCRIPT"
  read -r "?🔒 Presiona ENTER para cerrar..."
  exit 1
fi

echo "🚀 Ejecutando: $PY_SCRIPT $@"
python "$PY_SCRIPT" "$@"

echo "✅ Hecho. ¡Tutto bene!"
read -r "?🔒 Presiona ENTER para cerrar..."