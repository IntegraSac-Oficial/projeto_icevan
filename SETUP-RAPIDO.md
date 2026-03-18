# Setup Rápido - Banco de Dados Local

## Pré-requisitos
- Docker Desktop instalado e rodando

## Opção 1: Script Automático (Recomendado)

```powershell
.\setup-db.ps1
```

## Opção 2: Manual

```bash
# 1. Subir containers
docker compose up db phpmyadmin -d

# 2. Aguardar MySQL iniciar (~10 segundos)
Start-Sleep -Seconds 10

# 3. Verificar se está rodando
docker exec icevans_db mysqladmin ping -u icevans -picevans123 --silent

# 4. (Opcional) Importar backup
docker exec -i icevans_db mysql -u icevans -picevans123 icevans < backup-icevans.sql
```

## Acessos

- **MySQL**: `localhost:3307`
  - Database: `icevans`
  - Usuário: `icevans`
  - Senha: `icevans123`

- **phpMyAdmin**: http://localhost:8090

## Comandos Úteis

```bash
# Ver logs
docker logs icevans_db
docker logs icevans_phpmyadmin

# Parar containers
docker compose down

# Exportar banco
docker exec icevans_db mysqldump -u icevans -picevans123 icevans > backup-icevans.sql

# Entrar no MySQL
docker exec -it icevans_db mysql -u icevans -picevans123 icevans
```
