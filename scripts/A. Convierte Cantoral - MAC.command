#!/usr/bin/env bash
# Cambia al directorio del script
cd "$(dirname "$0")"
# Ejecuta el script
python3 tab2chordpro_integrado.py
# Mantén la ventana abierta hasta que pulses Enter
echo
echo "🔒 Presiona ENTER para cerrar..."
read