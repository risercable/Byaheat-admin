@echo off
title ByaheatAdmin Dev Launcher

:: Free up backend port (adjust 3000 to your actual backend port)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Free up ng serve port (default 4200 — adjust if you customized it)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4200 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)