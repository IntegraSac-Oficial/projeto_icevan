# 🗄️ GUIA COMPLETO - phpMyAdmin e MySQL no Coolify

**Projeto**: Ice Van  
**Data**: 04/03/2026  
**Ambiente**: Coolify + Cloudflare Tunnel

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura Atual](#arquitetura-atual)
3. [Configuração do MySQL](#configuração-do-mysql)
4. [Configuração do phpMyAdmin](#configuração-do-phpmyadmin)
5. [Cloudflare Tunnel](#cloudflare-tunnel)
6. [Acesso e Segurança](#acesso-e-segurança)
7. [Troubleshooting](#troubleshooting)
8. [Comandos Úteis](#comandos-úteis)

---

## 🎯 VISÃO GERAL

### O que é phpMyAdmin?
Interface web para gerenciar bancos de dados MySQL/MariaDB de forma visual.

### Por que usar?
- Gerenciar tabelas, dados e estrutura do banco
- Executar queries SQL diretamente
- Importar/exportar dados
- Gerenciar usuários e permissões
- Visualizar logs e performance

### Arquitetura
```
Internet
    ↓
Cloudflare Tunnel (phpmyadmin.icevanisolamento.com.br)
    ↓
Coolify (Servidor)
    ↓
phpMyAdmin Container (porta interna)
    ↓
MySQL Container (porta interna)
    ↓
Banco de Dados (icevan_db)
```

---

## 🏗️ ARQUITETURA ATUAL

### Componentes

**1. MySQL Container**
- Imagem: `mysql:8.0`
- Porta interna: `3306`
- Banco de dados: `icevan_db`
- Usuário: `icevan_user`
- Rede: `coolify` (rede interna do Docker)

**2. phpMyAdmin Container**
- Imagem: `phpmyadmin/phpmyadmin:latest`
- Porta interna: `80`
- Conecta ao MySQL via rede interna
- Interface web para gerenciar o banco

**3. Cloudflare Tunnel**
- Domínio: `phpmyadmin.icevanisolamento.com.br`
- Protocolo: HTTP
- Porta: Porta do phpMyAdmin no Coolify
- Segurança: Acesso via Cloudflare

---

## 🔧 CONFIGURAÇÃO DO MYSQL

### 1. Criar MySQL no Coolify

**Passo a passo:**

1. Acesse o Coolify
2. Vá em "Databases" → "New Database"
3. Selecione "MySQL"
4. Configure:
   - **Name**: `icevan-mysql`
   - **Database Name**: `icevan_db`
   - **Username**: `icevan_user`
   - **Password**: (gerar senha forte)
   - **Root Password**: (gerar senha forte)
   - **Version**: `8.0`
   - **Port**: Deixe o Coolify escolher automaticamente

5. Clique em "Create"

### 2. Configurações Importantes

**Variáveis de Ambiente:**
```env
MYSQL_ROOT_PASSWORD=<senha_root_forte>
MYSQL_DATABASE=icevan_db
MYSQL_USER=icevan_user
MYSQL_PASSWORD=<senha_usuario_forte>
```

**Rede:**
- O MySQL deve estar na rede `coolify` (padrão)
- Não expor porta 3306 publicamente (segurança)
- Acesso apenas via rede interna do Docker

**Volumes:**
- Dados persistentes em: `/var/lib/mysql`
- Coolify gerencia automaticamente

### 3. Obter Informações de Conexão

**Hostname interno:**
```
<nome-do-container-mysql>
```

Exemplo: `icevan-mysql-1` ou similar

**Para descobrir:**
```bash
docker ps | grep mysql
```

**Connection String:**
```
mysql://icevan_user:<senha>@<hostname>:3306/icevan_db
```

---

## 🖥️ CONFIGURAÇÃO DO PHPMYADMIN

### 1. Criar phpMyAdmin no Coolify

**Opção A: Via Docker Compose (Recomendado)**

1. No Coolify, vá em "Services" → "New Service"
2. Selecione "Docker Compose"
3. Cole o seguinte `docker-compose.yml`:

```yaml
version: '3.8'

services:
  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: phpmyadmin-icevan
    environment:
      PMA_HOST: <hostname-do-mysql>
      PMA_PORT: 3306
      PMA_USER: icevan_user
      PMA_PASSWORD: <senha-do-usuario>
      MYSQL_ROOT_PASSWORD: <senha-root>
      UPLOAD_LIMIT: 300M
      MEMORY_LIMIT: 512M
      MAX_EXECUTION_TIME: 600
    ports:
      - "8080:80"
    networks:
      - coolify
    restart: unless-stopped

networks:
  coolify:
    external: true
```

4. Substitua:
   - `<hostname-do-mysql>`: Nome do container MySQL
   - `<senha-do-usuario>`: Senha do `icevan_user`
   - `<senha-root>`: Senha do root

5. Deploy

**Opção B: Via Interface do Coolify**

1. Vá em "Services" → "New Service"
2. Selecione "phpMyAdmin"
3. Configure:
   - **MySQL Host**: `<hostname-do-mysql>`
   - **MySQL Port**: `3306`
   - **MySQL User**: `icevan_user`
   - **MySQL Password**: `<senha>`
   - **Root Password**: `<senha-root>`

4. Deploy

### 2. Variáveis de Ambiente Importantes

```env
# Conexão com MySQL
PMA_HOST=<hostname-mysql>
PMA_PORT=3306

# Credenciais (opcional - pode logar manualmente)
PMA_USER=icevan_user
PMA_PASSWORD=<senha>

# Limites de Upload e Execução
UPLOAD_LIMIT=300M
MEMORY_LIMIT=512M
MAX_EXECUTION_TIME=600

# Segurança
PMA_ABSOLUTE_URI=https://phpmyadmin.icevanisolamento.com.br
```

### 3. Configurações de Segurança

**Arquivo de configuração customizado (opcional):**

Criar `config.user.inc.php`:

```php
<?php
// Desabilitar login sem senha
$cfg['Servers'][$i]['AllowNoPassword'] = false;

// Timeout de sessão (30 minutos)
$cfg['LoginCookieValidity'] = 1800;

// Limitar tentativas de login
$cfg['LoginCookieRecall'] = false;

// Ocultar banco de dados do sistema
$cfg['Servers'][$i]['hide_db'] = '^(information_schema|performance_schema|mysql|sys)$';

// Forçar HTTPS
$cfg['ForceSSL'] = true;
?>
```

---

## ☁️ CLOUDFLARE TUNNEL

### 1. Criar Tunnel para phpMyAdmin

**Passo a passo:**

1. Acesse Cloudflare Zero Trust
2. Vá em "Networks" → "Tunnels"
3. Selecione seu tunnel existente ou crie novo
4. Adicione rota pública:
   - **Subdomain**: `phpmyadmin`
   - **Domain**: `icevanisolamento.com.br`
   - **Type**: HTTP
   - **URL**: `localhost:<porta-phpmyadmin>`

**Exemplo:**
```
Subdomain: phpmyadmin
Domain: icevanisolamento.com.br
Service: HTTP
URL: localhost:8080
```

### 2. Configurar DNS

O Cloudflare cria automaticamente o registro CNAME:

```
phpmyadmin.icevanisolamento.com.br → <tunnel-id>.cfargotunnel.com
```

### 3. Configurações de Segurança

**Adicionar Access Policy (Recomendado):**

1. Vá em "Access" → "Applications"
2. Crie nova aplicação:
   - **Name**: phpMyAdmin Ice Van
   - **Domain**: `phpmyadmin.icevanisolamento.com.br`
   - **Type**: Self-hosted

3. Configure política de acesso:
   - **Allow**: Emails específicos
   - **Allow**: IPs específicos
   - **Require**: Autenticação via email

**Exemplo de política:**
```
Rule: Allow
Include: Emails ending in @icevans.com.br
Include: IP ranges: <seu-ip>/32
```

---

## 🔐 ACESSO E SEGURANÇA

### 1. Acessar phpMyAdmin

**URL:**
```
https://phpmyadmin.icevanisolamento.com.br
```

**Credenciais:**
- **Usuário**: `icevan_user` (ou `root` para acesso total)
- **Senha**: A senha configurada no MySQL
- **Servidor**: Deixe em branco (já configurado)

### 2. Boas Práticas de Segurança

**✅ FAZER:**
- Usar senhas fortes (mínimo 16 caracteres)
- Habilitar Cloudflare Access Policy
- Limitar acesso por IP quando possível
- Usar usuário não-root para operações diárias
- Fazer backup regular do banco
- Monitorar logs de acesso

**❌ NÃO FAZER:**
- Expor porta 3306 do MySQL publicamente
- Usar senha fraca ou padrão
- Permitir login sem senha
- Deixar phpMyAdmin sem proteção
- Usar root para tudo
- Compartilhar credenciais

### 3. Criar Usuário Adicional (Recomendado)

**Via phpMyAdmin:**

1. Login como root
2. Vá em "User accounts" → "Add user account"
3. Configure:
   - **User name**: `admin_icevan`
   - **Host name**: `%` (qualquer host)
   - **Password**: (senha forte)
   - **Global privileges**: Marque necessários

**Via SQL:**
```sql
CREATE USER 'admin_icevan'@'%' IDENTIFIED BY 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON icevan_db.* TO 'admin_icevan'@'%';
FLUSH PRIVILEGES;
```

---

## 🔍 TROUBLESHOOTING

### Problema 1: phpMyAdmin não conecta ao MySQL

**Sintomas:**
- Erro: "Cannot connect to MySQL server"
- Erro: "Access denied for user"

**Soluções:**

1. **Verificar hostname do MySQL:**
```bash
docker ps | grep mysql
# Use o nome do container como hostname
```

2. **Verificar rede Docker:**
```bash
docker network inspect coolify
# Ambos containers devem estar na mesma rede
```

3. **Verificar credenciais:**
```bash
# Testar conexão manualmente
docker exec -it <mysql-container> mysql -u icevan_user -p
```

4. **Verificar variáveis de ambiente:**
```bash
docker exec <phpmyadmin-container> env | grep PMA
```

### Problema 2: Erro de Upload/Import

**Sintomas:**
- Erro: "File size exceeds upload_max_filesize"
- Timeout durante import

**Soluções:**

1. **Aumentar limites no phpMyAdmin:**
```yaml
environment:
  UPLOAD_LIMIT: 500M
  MEMORY_LIMIT: 1024M
  MAX_EXECUTION_TIME: 1200
```

2. **Importar via linha de comando:**
```bash
docker exec -i <mysql-container> mysql -u root -p icevan_db < backup.sql
```

### Problema 3: Acesso negado via Cloudflare

**Sintomas:**
- Erro 403 Forbidden
- Página de autenticação do Cloudflare

**Soluções:**

1. **Verificar Access Policy:**
   - Confirme que seu email/IP está na lista de permissões

2. **Desabilitar temporariamente:**
   - Remova Access Policy para testar
   - Reative após confirmar funcionamento

3. **Verificar configuração do Tunnel:**
   - Confirme porta correta
   - Confirme protocolo HTTP (não HTTPS)

### Problema 4: Sessão expira rapidamente

**Solução:**

Aumentar timeout de sessão:

```php
// config.user.inc.php
$cfg['LoginCookieValidity'] = 3600; // 1 hora
$cfg['LoginCookieRecall'] = true;
```

---

## 💻 COMANDOS ÚTEIS

### Docker

**Listar containers:**
```bash
docker ps
docker ps -a  # Incluir parados
```

**Ver logs:**
```bash
docker logs <container-name>
docker logs -f <container-name>  # Follow
docker logs --tail 100 <container-name>  # Últimas 100 linhas
```

**Acessar container:**
```bash
docker exec -it <container-name> bash
docker exec -it <container-name> sh  # Se bash não disponível
```

**Reiniciar container:**
```bash
docker restart <container-name>
```

**Ver uso de recursos:**
```bash
docker stats
```

### MySQL

**Conectar ao MySQL:**
```bash
docker exec -it <mysql-container> mysql -u root -p
```

**Backup do banco:**
```bash
docker exec <mysql-container> mysqldump -u root -p icevan_db > backup.sql
```

**Restaurar backup:**
```bash
docker exec -i <mysql-container> mysql -u root -p icevan_db < backup.sql
```

**Verificar bancos de dados:**
```sql
SHOW DATABASES;
USE icevan_db;
SHOW TABLES;
```

**Verificar usuários:**
```sql
SELECT User, Host FROM mysql.user;
```

**Ver tamanho do banco:**
```sql
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'icevan_db'
GROUP BY table_schema;
```

### Rede Docker

**Listar redes:**
```bash
docker network ls
```

**Inspecionar rede:**
```bash
docker network inspect coolify
```

**Conectar container a rede:**
```bash
docker network connect coolify <container-name>
```

---

## 📊 CHECKLIST DE CONFIGURAÇÃO

### MySQL
- [ ] Container MySQL criado no Coolify
- [ ] Banco `icevan_db` criado
- [ ] Usuário `icevan_user` criado
- [ ] Senhas fortes configuradas
- [ ] Porta 3306 NÃO exposta publicamente
- [ ] Container na rede `coolify`
- [ ] Volumes persistentes configurados
- [ ] Backup automático configurado (opcional)

### phpMyAdmin
- [ ] Container phpMyAdmin criado
- [ ] Variável `PMA_HOST` configurada corretamente
- [ ] Limites de upload configurados
- [ ] Container na rede `coolify`
- [ ] Porta interna acessível
- [ ] Login funcionando

### Cloudflare Tunnel
- [ ] Tunnel criado/configurado
- [ ] Rota pública adicionada
- [ ] DNS configurado (CNAME)
- [ ] HTTPS funcionando
- [ ] Access Policy configurada (recomendado)
- [ ] Acesso testado

### Segurança
- [ ] Senhas fortes em uso
- [ ] Acesso restrito por IP/email
- [ ] Login sem senha desabilitado
- [ ] Timeout de sessão configurado
- [ ] Logs monitorados
- [ ] Backup regular configurado

---

## 🎯 RESULTADO ESPERADO

Após seguir este guia:

1. ✅ MySQL rodando no Coolify
2. ✅ phpMyAdmin acessível via `https://phpmyadmin.icevanisolamento.com.br`
3. ✅ Conexão segura via Cloudflare Tunnel
4. ✅ Acesso protegido por autenticação
5. ✅ Gerenciamento completo do banco de dados
6. ✅ Backups e manutenção facilitados

---

## 📚 RECURSOS ADICIONAIS

**Documentação Oficial:**
- [phpMyAdmin Docs](https://docs.phpmyadmin.net/)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Docker Compose](https://docs.docker.com/compose/)

**Tutoriais:**
- [Securing phpMyAdmin](https://www.phpmyadmin.net/docs/security/)
- [MySQL Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html)
- [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/)

---

**Última atualização**: 04/03/2026  
**Versão**: 1.0  
**Autor**: Documentação Ice Van
