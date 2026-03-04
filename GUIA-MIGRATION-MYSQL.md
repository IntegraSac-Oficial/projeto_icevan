# 🗄️ Guia de Migration do Banco de Dados MySQL

## 📋 Informações do Banco de Dados

### Banco MySQL no Coolify

**UUID:** `j8wk008wo8448g88kgkw0os0`
**Nome:** `mysql-database-j8wk008wo8448g88kgkw0os0`
**Status:** ✅ running:healthy
**Imagem:** MySQL 8
**Database:** `default`

### Credenciais

**Usuário MySQL:**
- Usuário: `mysql`
- Senha: `JattQFqrmCdDm3sJGt9GY2eBQGxBwNjkjHDqc3YPyXWV...` (veja no Coolify)

**Root:**
- Usuário: `root`
- Senha: `SQh6nwJLl1bDwkwySCl9kgbNhGjbwEcSQHdXSvkwJq...` (veja no Coolify)

### Connection String

```
mysql://mysql:[SENHA]@j8wk008wo8448g88kgkw0os0:3306/default
```

---

## ✅ Variáveis de Ambiente Configuradas

As seguintes variáveis foram adicionadas à aplicação no Coolify:

| Variável | Valor | Status |
|----------|-------|--------|
| DATABASE_URL | mysql://mysql:***@r40gggkc8okc0o00kkgcskgs:3306/default | ✅ |
| ADMIN_EMAIL | admin@icevanisolamento.com.br | ✅ |
| ADMIN_PASSWORD | icevans@admin2025 | ✅ |
| JWT_SECRET | icevans-jwt-secret-mude-em-producao-32chars | ✅ |

---

## 🚀 Como Executar a Migration

### Passo 1: Aguardar o Deploy Finalizar

Antes de executar a migration, aguarde o deploy atual finalizar:

**Deployment UUID:** `qw8gok0488ws8gc40csoo88o`

Você pode verificar o status em:
https://coolify.integrasac.com.br

---

### Passo 2: Executar a Migration

Existem 3 formas de executar a migration:

#### Opção 1: Via Terminal do Coolify (Mais Fácil) ⭐

1. Acesse: https://coolify.integrasac.com.br
2. Faça login
3. Vá para o projeto "Site Ice Van"
4. Clique na aplicação "lovely-lizard-zc4gck0k4wgkksk00scgo8cc"
5. Procure por "Terminal" ou "Execute Command"
6. Execute o comando:

```bash
npx prisma migrate deploy
```

#### Opção 2: Via SSH no Servidor

1. Conecte ao servidor via SSH:
```bash
ssh root@192.168.100.218
```

2. Liste os containers em execução:
```bash
docker ps | grep zc4gck0k4wgkksk00scgo8cc
```

3. Entre no container da aplicação:
```bash
docker exec -it <CONTAINER_ID> sh
```

4. Execute a migration:
```bash
npx prisma migrate deploy
```

#### Opção 3: Push do Schema (Alternativa)

Se você não tiver migrations criadas ou preferir fazer push direto do schema:

```bash
npx prisma db push
```

**Diferença:**
- `migrate deploy`: Aplica migrations existentes (recomendado para produção)
- `db push`: Sincroniza o schema diretamente (mais rápido, mas não cria histórico)

---

### Passo 3: Verificar se as Tabelas Foram Criadas

Após executar a migration, verifique se as tabelas foram criadas corretamente.

#### Via Prisma Studio

```bash
npx prisma studio
```

Isso abrirá uma interface web para visualizar o banco de dados.

#### Via MySQL Client

```bash
mysql -h r40gggkc8okc0o00kkgcskgs -u mysql -p default
```

Senha: `1K0536Hy40mcIyKB6Oqc2S9Bbm8v3sMiUld05VwmUWSe2k6vdFHRwOb14ItrBRuw`

Depois execute:
```sql
SHOW TABLES;
```

#### Tabelas Esperadas

Você deve ver as seguintes tabelas:

1. ✅ `contacts` - Contatos recebidos pelo formulário
2. ✅ `seo_settings` - Configurações de SEO por página
3. ✅ `gallery_photos` - Fotos da galeria de serviços
4. ✅ `videos` - Vídeos do YouTube
5. ✅ `settings` - Configurações gerais do sistema
6. ✅ `users` - Usuários do painel administrativo
7. ✅ `hero_banners` - Banners do Hero Slider
8. ✅ `_prisma_migrations` - Histórico de migrations (se usar migrate deploy)

---

## 📊 Schema do Banco de Dados

### Tabela: contacts
```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  telefone VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  tipoVeiculo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  comoConheceu VARCHAR(255),
  lido BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: seo_settings
```sql
CREATE TABLE seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pageSlug VARCHAR(255) UNIQUE NOT NULL,
  metaTitulo VARCHAR(255) NOT NULL,
  metaDescricao TEXT NOT NULL,
  ogImage VARCHAR(255),
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: gallery_photos
```sql
CREATE TABLE gallery_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  sortOrder INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: videos
```sql
CREATE TABLE videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  youtubeId VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  sortOrder INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: settings
```sql
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL
);
```

### Tabela: users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Admin',
  role VARCHAR(255) DEFAULT 'admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: hero_banners
```sql
CREATE TABLE hero_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  titulo VARCHAR(255) DEFAULT '',
  descricao TEXT NOT NULL,
  sortOrder INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 Troubleshooting

### Erro: "Can't reach database server"

**Causa:** A aplicação não consegue conectar ao banco de dados.

**Solução:**
1. Verifique se o banco está rodando:
```bash
docker ps | grep r40gggkc8okc0o00kkgcskgs
```

2. Verifique se a variável DATABASE_URL está correta
3. Verifique se a aplicação e o banco estão na mesma rede Docker

### Erro: "Access denied for user"

**Causa:** Credenciais incorretas.

**Solução:**
1. Verifique se a senha está correta na variável DATABASE_URL
2. Tente usar o usuário root se necessário

### Erro: "Unknown database 'default'"

**Causa:** O banco de dados não existe.

**Solução:**
1. Conecte como root:
```bash
mysql -h r40gggkc8okc0o00kkgcskgs -u root -p
```

2. Crie o banco:
```sql
CREATE DATABASE IF NOT EXISTS `default`;
```

### Erro: "Migration failed"

**Causa:** Pode haver migrations pendentes ou conflitos.

**Solução:**
1. Use `npx prisma db push` em vez de `migrate deploy`
2. Ou force a migration:
```bash
npx prisma migrate deploy --force
```

---

## 📝 Após a Migration

### 1. Criar Usuário Admin

Após a migration, você precisa criar o primeiro usuário admin.

Acesse: https://icevanisolamento.com.br/admin/login

Se não houver usuário, o sistema deve criar automaticamente com as credenciais do `.env`:
- Email: `admin@icevanisolamento.com.br`
- Senha: `icevans@admin2025`

### 2. Executar Script de Atualização de Domínio

Execute o script SQL para atualizar referências ao domínio antigo:

```sql
-- Atualizar settings
UPDATE settings 
SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%icevans.com.br%';

-- Atualizar seo_settings
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%icevans.com.br%';

-- Verificar
SELECT * FROM settings WHERE value LIKE '%icevanisolamento.com.br%';
SELECT * FROM seo_settings WHERE ogImage LIKE '%icevanisolamento.com.br%';
```

### 3. Configurar Telefone do Banner

1. Acesse: https://icevanisolamento.com.br/admin
2. Vá em: Configurações > Empresa
3. Configure o "Telefone do Banner Principal"
4. Salve

---

## ✅ Checklist Final

Após executar a migration, verifique:

- [ ] Deploy finalizado com sucesso
- [ ] Migration executada sem erros
- [ ] Todas as 7 tabelas foram criadas
- [ ] Consegue fazer login no admin
- [ ] Script de atualização de domínio executado
- [ ] Telefone do banner configurado
- [ ] Site funcionando normalmente

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs do deploy no Coolify
2. Verifique os logs do banco de dados:
```bash
docker logs r40gggkc8okc0o00kkgcskgs
```

3. Verifique os logs da aplicação:
```bash
docker logs zc4gck0k4wgkksk00scgo8cc
```

---

**Criado em:** 03/03/2026 às 23:30
**Status:** 📝 Aguardando execução da migration
