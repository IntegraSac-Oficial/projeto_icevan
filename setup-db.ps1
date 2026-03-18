# Script para configurar o banco de dados local do Projeto Ice Van

Write-Host "=== Setup do Banco de Dados Local - Projeto Ice Van ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Docker está rodando
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "   ✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Docker não está rodando. Inicie o Docker Desktop e tente novamente." -ForegroundColor Red
    exit 1
}

# Parar containers existentes (se houver)
Write-Host ""
Write-Host "2. Parando containers existentes..." -ForegroundColor Yellow
docker compose down 2>$null

# Subir apenas o banco de dados e phpMyAdmin
Write-Host ""
Write-Host "3. Subindo containers (MySQL + phpMyAdmin)..." -ForegroundColor Yellow
docker compose up db phpmyadmin -d

# Aguardar MySQL iniciar
Write-Host ""
Write-Host "4. Aguardando MySQL iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$maxAttempts = 30
$attempt = 0
$mysqlReady = $false

while ($attempt -lt $maxAttempts -and -not $mysqlReady) {
    $attempt++
    Write-Host "   Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
    
    $result = docker exec icevans_db mysqladmin ping -u icevans -picevans123 --silent 2>$null
    if ($LASTEXITCODE -eq 0) {
        $mysqlReady = $true
        Write-Host "   ✓ MySQL está pronto!" -ForegroundColor Green
    } else {
        Start-Sleep -Seconds 2
    }
}

if (-not $mysqlReady) {
    Write-Host "   ✗ MySQL não iniciou a tempo. Verifique os logs: docker logs icevans_db" -ForegroundColor Red
    exit 1
}

# Verificar se precisa importar backup
Write-Host ""
Write-Host "5. Verificando backup..." -ForegroundColor Yellow
if (Test-Path "backup-icevans.sql") {
    Write-Host "   Backup encontrado! Importando..." -ForegroundColor Cyan
    Get-Content "backup-icevans.sql" | docker exec -i icevans_db mysql -u icevans -picevans123 icevans
    Write-Host "   ✓ Backup importado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "   Nenhum backup encontrado (backup-icevans.sql)" -ForegroundColor Gray
    Write-Host "   O banco será criado vazio." -ForegroundColor Gray
}

# Resumo
Write-Host ""
Write-Host "=== Setup Concluído! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Informações de acesso:" -ForegroundColor Cyan
Write-Host "  • MySQL Host: localhost:3307" -ForegroundColor White
Write-Host "  • Database: icevans" -ForegroundColor White
Write-Host "  • Usuário: icevans" -ForegroundColor White
Write-Host "  • Senha: icevans123" -ForegroundColor White
Write-Host ""
Write-Host "  • phpMyAdmin: http://localhost:8090" -ForegroundColor White
Write-Host ""
Write-Host "Comandos úteis:" -ForegroundColor Cyan
Write-Host "  • Ver logs MySQL: docker logs icevans_db" -ForegroundColor Gray
Write-Host "  • Ver logs phpMyAdmin: docker logs icevans_phpmyadmin" -ForegroundColor Gray
Write-Host "  • Parar containers: docker compose down" -ForegroundColor Gray
Write-Host "  • Exportar banco: docker exec icevans_db mysqldump -u icevans -picevans123 icevans > backup-icevans.sql" -ForegroundColor Gray
Write-Host ""
