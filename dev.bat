@echo off
REM Script para iniciar o servidor de desenvolvimento com limite de memória aumentado
REM Usando porta 3001 para evitar conflito com outros projetos
set NODE_OPTIONS=--max-old-space-size=4096
echo.
echo ========================================
echo   Iniciando servidor na porta 3001
echo ========================================
echo.
npm run dev:base
