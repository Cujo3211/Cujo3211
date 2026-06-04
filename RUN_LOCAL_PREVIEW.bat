@echo off
setlocal
cd /d "%~dp0"
echo Halo MCC Tracker local preview
python --version >nul 2>&1
if %errorlevel% neq 0 (
  echo Python is required for this local preview. Try opening with VS Code Live Server or install Python.
  pause
  exit /b 1
)
echo Opening http://localhost:8787/
start http://localhost:8787/
python -m http.server 8787
pause
