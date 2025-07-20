@echo off
:: Cambia al directorio del script .bat
cd /d "%~dp0"
:: Ejecuta el script Python
python crear_songs_json.py
:: Espera a que pulses una tecla
echo.
pause