@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 이상을 설치한 뒤 다시 실행해 주세요.
  echo 설치된 Node.js가 있다면 새 명령 창에서 실행해 주세요.
  pause
  exit /b 1
)
if not exist "dist\handoff-demo.html" (
  node tools\bundle.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
node tools\serve-demo.cjs
if errorlevel 1 pause
endlocal
