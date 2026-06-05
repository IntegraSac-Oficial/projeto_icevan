@echo off
REM ============================================
REM   RESET COMPLETO - SOLUÇÃO DEFINITIVA
REM ============================================

echo.
echo ========================================
echo   RESET COMPLETO DO PROJETO
echo ========================================
echo.

echo [1/5] Matando todos os processos Node.js...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 >nul

echo [2/5] Limpando cache do Next.js...
if exist .next rmdir /s /q .next
timeout /t 1 >nul

echo [3/5] Limpando cache do Prisma...
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
if exist node_modules\.cache rmdir /s /q node_modules\.cache
timeout /t 1 >nul

echo [4/5] Reinstalando dependências...
call npm install
echo.

echo [5/5] Iniciando em modo RÁPIDO (produção local)...
echo.
echo ========================================
echo   BUILD EM ANDAMENTO...
echo   Aguarde 1-2 minutos
echo ========================================
echo.
call npm run build

echo.
echo ========================================
echo   SERVIDOR INICIADO!
echo   Acesse: http://localhost:3000
echo ========================================
echo.
call npm start
