@echo off
echo.
echo ========================================
echo   SOLUCAO FINAL - Limpeza e Reset
echo ========================================
echo.

echo [1/4] Matando processos Node...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 >nul

echo [2/4] Limpando cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
timeout /t 1 >nul

echo [3/4] Reinstalando...
call npm install
echo.

echo [4/4] Iniciando servidor (porta 3001)...
echo.
echo Acesse: http://localhost:3001
echo.
call npm run dev
