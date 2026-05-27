@echo off
echo.
echo  Google Fonts Generator
echo  ----------------------
echo  You need a free Google Fonts API key to run this.
echo  Get one at: https://console.cloud.google.com/apis/credentials
echo.
set /p KEY="Paste your API key here and press Enter: "
node generate-fonts.js %KEY%
pause
