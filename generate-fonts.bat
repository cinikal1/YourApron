@echo off
echo.
echo  YourApron — Google Fonts Generator
echo  ------------------------------------
set /p KEY="Paste your Google Fonts API key: "
node generate-fonts.js %KEY%
pause
