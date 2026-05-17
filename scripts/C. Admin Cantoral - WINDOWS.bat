@echo off
chcp 65001 > nul
title Cantoral Admin
cd /d "%~dp0\.."
echo.
echo === Cantoral Admin ===
echo.
echo Instalando dependencias si hace falta...
python -m pip install --quiet flask pillow
if errorlevel 1 (
    echo ERROR instalando dependencias. Asegurate de tener Python 3.10+ en el PATH.
    pause
    exit /b 1
)
echo.
echo Abriendo navegador en http://127.0.0.1:8765/ ...
start "" http://127.0.0.1:8765/
echo.
echo Arrancando servidor (Ctrl+C para parar)...
python scripts\admin\server.py
pause
