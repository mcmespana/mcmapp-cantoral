#!/bin/bash
# Cantoral Admin — launcher Mac/Linux
set -e
cd "$(dirname "$0")/.."

echo
echo "=== Cantoral Admin ==="
echo
echo "Instalando dependencias si hace falta..."
python3 -m pip install --quiet --user flask pillow || python3 -m pip install --quiet flask pillow

URL="http://127.0.0.1:8765/"
echo
echo "Abriendo navegador en $URL ..."
(sleep 1.5 && (open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null || true)) &
echo
echo "Arrancando servidor (Ctrl+C para parar)..."
exec python3 scripts/admin/server.py
