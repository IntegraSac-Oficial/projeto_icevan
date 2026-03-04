# 💡 EXEMPLOS PRÁTICOS - MySQL e phpMyAdmin

**Projeto**: Ice Van  
**Complemento**: GUIA-PHPMYADMIN-MYSQL.md

---

## 📋 ÍNDICE

1. [Queries Úteis](#queries-úteis)
2. [Gerenciamento de Dados](#gerenciamento-de-dados)
3. [Backup e Restore](#backup-e-restore)
4. [Manutenção](#manutenção)
5. [Troubleshooting Específico](#troubleshooting-específico)

---

## 🔍 QUERIES ÚTEIS

### Ver Todas as Configurações do Site

```sql
-- Ver todas as settings
SELECT * FROM settings ORDER BY key;

-- Ver configurações específicas
SELECT * FROM settings WHERE key LIKE 'empresa_%';
SELECT * FROM settings WHERE key LIKE 'hero_%';
SELECT * FROM settings WHERE key LIKE 'emailjs_%';

-- Ver configuração específica
SELECT * FROM settings WHERE key = 'empresa_contatos';
```

### Ver Estrutura das Tabelas

```sql
-- Listar todas as tabelas
SHOW TABLES;

-- Ver estrutura de uma tabela
DESCRIBE settings;
DESCRIBE hero_banners;
DESCRIBE gallery_images;

-- Ver detalhes completos
SHOW CREATE TABLE settings;
```

### Verificar Dados Importantes

```sql
-- Ver banners hero ativos
SELECT id, titulo, descricao, filename, visible, sortOrder 
FROM hero_banners 
WHERE visible = 1 
ORDER BY sortOrder;

-- Ver imagens da galeria
SELECT id, filename, alt, category, visible 
FROM gallery_images 
WHERE visible = 1;

-- Ver contatos recebidos
SELECT id, nome, email, telefone, tipo_veiculo, createdAt 
FROM contacts 
ORDER BY createdAt DESC 
LIMIT 10;
```

---

## 📝 GERENCIAMENTO DE DADOS

### Adicionar/Atualizar Configurações

```sql
-- Adicionar nova configuração
INSERT INTO settings (key, value) 
VALUES ('nova_config', 'valor');

-- Atualizar configuração existente
UPDATE settings 
SET value = 'novo_valor' 
WHERE key = 'empresa_telefone';

-- Adicionar se não existir, atualizar se existir
INSERT INTO settings (key, value) 
VALUES ('empresa_telefone', '(11) 1234-5678')
ON DUPLICATE KEY UPDATE value = '(11) 1234-5678';
```

### Configurar Lista de Contatos

```sql
-- Adicionar lista de contatos JSON
INSERT INTO settings (key, value) 
VALUES ('empresa_contatos', '[
  {"label": "Comercial/Vendas", "numero": "+55 (11) 91330-8513"},
  {"label": "Financeiro", "numero": "+55 (11) 94824-2999"},
  {"label": "Assistência técnica", "numero": "+55 (11) 96592-3480"}
]')
ON DUPLICATE KEY UPDATE value = '[
  {"label": "Comercial/Vendas", "numero": "+55 (11) 91330-8513"},
  {"label": "Financeiro", "numero": "+55 (11) 94824-2999"},
  {"label": "Assistência técnica", "numero": "+55 (11) 96592-3480"}
]';
```

### Gerenciar Banners Hero

```sql
-- Adicionar novo banner
INSERT INTO hero_banners (titulo, descricao, filename, visible, sortOrder)
VALUES ('Novo Banner', 'Descrição do banner', 'banner-04.webp', 1, 4);

-- Atualizar ordem dos banners
UPDATE hero_banners SET sortOrder = 1 WHERE id = 1;
UPDATE hero_banners SET sortOrder = 2 WHERE id = 2;
UPDATE hero_banners SET sortOrder = 3 WHERE id = 3;

-- Ocultar banner
UPDATE hero_banners SET visible = 0 WHERE id = 2;

-- Deletar banner
DELETE FROM hero_banners WHERE id = 5;
```

### Gerenciar Galeria

```sql
-- Adicionar imagem à galeria
INSERT INTO gallery_images (filename, alt, category, visible, sortOrder)
VALUES ('servico-01.jpg', 'Instalação de refrigeração', 'instalacao', 1, 1);

-- Atualizar categoria
UPDATE gallery_images 
SET category = 'manutencao' 
WHERE id = 10;

-- Ver imagens por categoria
SELECT * FROM gallery_images 
WHERE category = 'instalacao' AND visible = 1 
ORDER BY sortOrder;
```

---

## 💾 BACKUP E RESTORE

### Backup Completo

**Via linha de comando:**
```bash
# Backup completo do banco
docker exec <mysql-container> mysqldump -u root -p icevan_db > backup_completo_$(date +%Y%m%d).sql

# Backup apenas estrutura (sem dados)
docker exec <mysql-container> mysqldump -u root -p --no-data icevan_db > estrutura.sql

# Backup apenas dados (sem estrutura)
docker exec <mysql-container> mysqldump -u root -p --no-create-info icevan_db > dados.sql

# Backup de tabela específica
docker exec <mysql-container> mysqldump -u root -p icevan_db settings > backup_settings.sql
```

**Via phpMyAdmin:**
1. Selecione o banco `icevan_db`
2. Clique em "Export"
3. Escolha formato: SQL
4. Opções:
   - Structure: ✅
   - Data: ✅
   - Add DROP TABLE: ✅
5. Clique em "Go"

### Restore de Backup

**Via linha de comando:**
```bash
# Restaurar backup completo
docker exec -i <mysql-container> mysql -u root -p icevan_db < backup_completo.sql

# Restaurar tabela específica
docker exec -i <mysql-container> mysql -u root -p icevan_db < backup_settings.sql
```

**Via phpMyAdmin:**
1. Selecione o banco `icevan_db`
2. Clique em "Import"
3. Escolha o arquivo `.sql`
4. Clique em "Go"

### Backup Automático (Script)

```bash
#!/bin/bash
# backup-mysql.sh

# Configurações
CONTAINER="<mysql-container>"
DATABASE="icevan_db"
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATABASE}_${DATE}.sql"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
docker exec $CONTAINER mysqldump -u root -p$MYSQL_ROOT_PASSWORD $DATABASE > $BACKUP_DIR/$FILENAME

# Comprimir
gzip $BACKUP_DIR/$FILENAME

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup concluído: $FILENAME.gz"
```

**Agendar com cron:**
```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h da manhã)
0 2 * * * /path/to/backup-mysql.sh
```

---

## 🔧 MANUTENÇÃO

### Otimizar Tabelas

```sql
-- Otimizar todas as tabelas
OPTIMIZE TABLE settings;
OPTIMIZE TABLE hero_banners;
OPTIMIZE TABLE gallery_images;
OPTIMIZE TABLE contacts;

-- Otimizar todas de uma vez
OPTIMIZE TABLE settings, hero_banners, gallery_images, contacts;
```

### Analisar Performance

```sql
-- Ver tamanho das tabelas
SELECT 
    table_name AS 'Tabela',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)'
FROM information_schema.tables
WHERE table_schema = 'icevan_db'
ORDER BY (data_length + index_length) DESC;

-- Ver número de registros por tabela
SELECT 
    table_name AS 'Tabela',
    table_rows AS 'Registros'
FROM information_schema.tables
WHERE table_schema = 'icevan_db'
ORDER BY table_rows DESC;

-- Ver índices de uma tabela
SHOW INDEX FROM settings;
```

### Limpar Dados Antigos

```sql
-- Deletar contatos antigos (mais de 6 meses)
DELETE FROM contacts 
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Ver contatos que serão deletados (antes de executar)
SELECT COUNT(*) FROM contacts 
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Verificar Integridade

```sql
-- Verificar tabelas
CHECK TABLE settings;
CHECK TABLE hero_banners;
CHECK TABLE gallery_images;

-- Reparar tabelas (se necessário)
REPAIR TABLE settings;
```

---

## 🔍 TROUBLESHOOTING ESPECÍFICO

### Problema: Configurações não aparecem no site

**Diagnóstico:**
```sql
-- Verificar se configuração existe
SELECT * FROM settings WHERE key = 'empresa_nome';

-- Verificar todas as configurações
SELECT COUNT(*) FROM settings;

-- Ver configurações vazias
SELECT * FROM settings WHERE value = '' OR value IS NULL;
```

**Solução:**
```sql
-- Executar seed novamente (via terminal)
-- npx tsx scripts/seed-empresa-config.ts

-- Ou adicionar manualmente
INSERT INTO settings (key, value) 
VALUES ('empresa_nome', 'Ice Van')
ON DUPLICATE KEY UPDATE value = 'Ice Van';
```

### Problema: Banners não aparecem

**Diagnóstico:**
```sql
-- Ver todos os banners
SELECT * FROM hero_banners;

-- Ver apenas visíveis
SELECT * FROM hero_banners WHERE visible = 1;

-- Verificar ordem
SELECT id, titulo, visible, sortOrder FROM hero_banners ORDER BY sortOrder;
```

**Solução:**
```sql
-- Tornar todos visíveis
UPDATE hero_banners SET visible = 1;

-- Corrigir ordem
UPDATE hero_banners SET sortOrder = 1 WHERE id = 1;
UPDATE hero_banners SET sortOrder = 2 WHERE id = 2;
UPDATE hero_banners SET sortOrder = 3 WHERE id = 3;
```

### Problema: Erro de conexão do Prisma

**Diagnóstico:**
```sql
-- Verificar usuário e permissões
SELECT User, Host FROM mysql.user WHERE User = 'icevan_user';

-- Ver permissões do usuário
SHOW GRANTS FOR 'icevan_user'@'%';
```

**Solução:**
```sql
-- Recriar usuário com permissões corretas
DROP USER IF EXISTS 'icevan_user'@'%';
CREATE USER 'icevan_user'@'%' IDENTIFIED BY 'senha_forte';
GRANT ALL PRIVILEGES ON icevan_db.* TO 'icevan_user'@'%';
FLUSH PRIVILEGES;
```

### Problema: Tabelas não existem

**Diagnóstico:**
```sql
-- Listar tabelas
SHOW TABLES;

-- Ver se migration foi executada
SELECT * FROM _prisma_migrations;
```

**Solução:**
```bash
# Executar migrations
npx prisma migrate deploy

# Ou resetar banco (CUIDADO: apaga dados)
npx prisma migrate reset
```

### Problema: Dados corrompidos em JSON

**Diagnóstico:**
```sql
-- Ver configurações JSON
SELECT key, value FROM settings WHERE key LIKE '%_contatos%' OR key LIKE '%_registry%';

-- Tentar parsear JSON (MySQL 8.0+)
SELECT 
    key, 
    JSON_VALID(value) AS 'JSON Válido',
    value 
FROM settings 
WHERE key IN ('empresa_contatos', 'vehicles_registry');
```

**Solução:**
```sql
-- Corrigir JSON inválido
UPDATE settings 
SET value = '[]' 
WHERE key = 'empresa_contatos' AND JSON_VALID(value) = 0;

-- Adicionar JSON válido
UPDATE settings 
SET value = '[{"label":"Comercial","numero":"+55 (11) 1234-5678"}]'
WHERE key = 'empresa_contatos';
```

---

## 📊 QUERIES DE MONITORAMENTO

### Atividade do Banco

```sql
-- Ver processos ativos
SHOW PROCESSLIST;

-- Ver conexões
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- Ver queries lentas
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

### Uso de Espaço

```sql
-- Espaço total do banco
SELECT 
    SUM(ROUND(((data_length + index_length) / 1024 / 1024), 2)) AS 'Total (MB)'
FROM information_schema.tables
WHERE table_schema = 'icevan_db';

-- Espaço por tabela
SELECT 
    table_name AS 'Tabela',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamanho (MB)',
    ROUND((data_length / 1024 / 1024), 2) AS 'Dados (MB)',
    ROUND((index_length / 1024 / 1024), 2) AS 'Índices (MB)'
FROM information_schema.tables
WHERE table_schema = 'icevan_db'
ORDER BY (data_length + index_length) DESC;
```

### Logs e Erros

```sql
-- Ver variáveis de log
SHOW VARIABLES LIKE 'log_error';
SHOW VARIABLES LIKE 'general_log%';

-- Habilitar log geral (temporariamente)
SET GLOBAL general_log = 'ON';

-- Desabilitar log geral
SET GLOBAL general_log = 'OFF';
```

---

## 🎯 CHECKLIST DE MANUTENÇÃO MENSAL

- [ ] Fazer backup completo do banco
- [ ] Verificar tamanho das tabelas
- [ ] Otimizar tabelas grandes
- [ ] Limpar dados antigos (contatos, logs)
- [ ] Verificar integridade das tabelas
- [ ] Revisar usuários e permissões
- [ ] Verificar logs de erro
- [ ] Testar restore de backup
- [ ] Atualizar documentação se necessário

---

**Última atualização**: 04/03/2026  
**Versão**: 1.0  
**Complemento de**: GUIA-PHPMYADMIN-MYSQL.md
