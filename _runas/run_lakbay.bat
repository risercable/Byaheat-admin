@echo off
title ByaheatAdmin Dev Launcher

:: Free up backend port (change 3000 to your actual backend port) before starting
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

start "Backend" cmd /k "cd /d G:\Dev\byaheatAdmin && npm run backend"
start "Ng Serve" cmd /k "cd /d G:\Dev\byaheatAdmin && npx ng serve"
start "Terminal" cmd /k "cd /d G:\Dev\byaheatAdmin"