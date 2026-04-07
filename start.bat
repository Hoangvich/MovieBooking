@echo off
echo ========================================
echo   MovieBooking - Khoi dong he thong
echo ========================================

echo.
echo [1/4] Tat process cu tren port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo [2/4] Khoi dong MySQL + Redis (Docker)...
cd /d C:\Users\nguye\Documents\BackEnd\MovieBooking\backend
docker-compose up mysql redis -d

echo.
echo Doi 15 giay cho MySQL san sang...
timeout /t 15 /nobreak >nul

echo.
echo [3/4] Khoi dong Backend (Spring Boot)...
start "MovieBooking-Backend" cmd /k "cd /d C:\Users\nguye\Documents\BackEnd\MovieBooking\backend && .\mvnw.cmd spring-boot:run"

echo.
echo Doi 40 giay cho Backend san sang...
timeout /t 40 /nobreak >nul

echo.
echo [4/4] Mo trinh duyet...
start http://localhost:8080

echo.
echo ========================================
echo   DONE! Frontend + Backend deu chay
echo   tai http://localhost:8080
echo ========================================
pause
