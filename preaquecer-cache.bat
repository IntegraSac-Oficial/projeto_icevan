@echo off
REM Script para pré-aquecer o cache do Next.js acessando as páginas principais
echo.
echo ========================================
echo   Pre-aquecendo Cache do Next.js
echo ========================================
echo.
echo Aguarde alguns segundos para o servidor iniciar...
timeout /t 5 /nobreak > nul

echo.
echo Acessando páginas principais...
echo.

curl -s http://localhost:3001 > nul
echo [OK] Home carregada

curl -s http://localhost:3001/empresa > nul
echo [OK] Empresa carregada

curl -s http://localhost:3001/aplicacoes > nul
echo [OK] Aplicacoes carregada

curl -s http://localhost:3001/contato > nul
echo [OK] Contato carregada

echo.
echo ========================================
echo   Cache Pre-aquecido!
echo   Navegacao agora deve ser rapida
echo ========================================
echo.
pause
