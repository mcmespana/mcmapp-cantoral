@echo off
:: Cambia al directorio del script .bat
cd /d "%~dp0"
:: Ejecuta el script Python
python tab2chordpro.py
:: Espera a que pulses una tecla
echo.
pause