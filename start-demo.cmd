@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 or later is required. Open dist\handoff-demo.html for the standalone demo.
  pause
  exit /b 1
)
start "" http://127.0.0.1:8080
node server.js
pause
