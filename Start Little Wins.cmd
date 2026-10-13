@echo off
title Little Wins - local preview
cd /d "%~dp0"
echo Starting Little Wins at http://127.0.0.1:5173/
echo Keep this window open while using the app.
echo If the address is already in use, an existing preview may be running.
echo.
call npm run dev -- --port 5173 --strictPort
echo.
echo The preview has stopped. Any error is shown above.
pause
