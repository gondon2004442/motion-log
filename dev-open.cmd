@echo off
chcp 65001 >nul
cd /d "%~dp0"
where npm >nul 2>&1
if errorlevel 1 (
  echo npm not found. Install Node.js from https://nodejs.org and reopen the terminal.
  pause
  exit /b 1
)
echo Opening http://localhost:3000 in 5s after server starts ^(refresh if needed^)...
start "" /MIN cmd /c "timeout /t 5 /nob >nul && start "" http://localhost:3000"
call npm run dev:lan
pause
