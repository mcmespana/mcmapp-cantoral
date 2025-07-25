@echo off
cd /d "%~dp0"
powershell -NoExit -ExecutionPolicy Bypass ^
  -Command "py -3 tab2chordpro.py; Write-Host ''; Pause"