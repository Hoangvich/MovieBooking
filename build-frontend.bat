@echo off
echo Building frontend...
cd /d C:\Users\nguye\Documents\BackEnd\MovieBooking\frontend
call npx vite build
echo.
echo Copying to backend static...
rmdir /s /q C:\Users\nguye\Documents\BackEnd\MovieBooking\backend\src\main\resources\static 2>nul
mkdir C:\Users\nguye\Documents\BackEnd\MovieBooking\backend\src\main\resources\static
xcopy /s /e /y dist\* C:\Users\nguye\Documents\BackEnd\MovieBooking\backend\src\main\resources\static\
echo.
echo Done! Restart backend to see changes.
pause
