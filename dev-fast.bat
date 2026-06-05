@echo off
REM Script RÁPIDO - Usa modo produção localmente (SEM compilação sob demanda)
echo.
echo ========================================
echo   MODO RÁPIDO - Sem compilação sob demanda
echo ========================================
echo.
echo Fazendo build otimizado...
call npm run build
echo.
echo Iniciando servidor em modo produção (porta 3000)...
echo Acesse: http://localhost:3000
echo.
call npm start
