# 🔧 ATUALIZAR DATABASE_URL - Ice Van

**Data**: 04/03/2026 às 01:20  
**Status**: ⚠️ AÇÃO NECESSÁRIA - DATABASE_URL INCORRETA

---

## ⚠️ PROBLEMA IDENTIFICADO

A variável `DATABASE_URL` na aplicação está apontando para o UUID **ANTIGO** do banco de dados (que foi deletado).

### DATABASE_URL Atual (INCORRETA) ❌
```
mysql://mysql:1K0536Hy40mcIyKB6Oqc2S9Bbm8v3sMiUld05VwmUWSe2k6vdFHRwOb14ItrBRuw@r40gggkc8okc0o00kkgcskgs:3306/default
```
- UUID antigo: `r40gggkc8okc0o00kkgcskgs` ❌

### DATABASE_URL Correta (NOVA) ✅
```
mysql://mysql:J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy@j8wk008wo8448g88kgkw0os0:3306/default
```
- UUID novo: `j8wk008wo8448g88kgkw0os0` ✅

---

## 🚀 Como Atualizar no Coolify

### Passo 1: Acessar o Coolify
1. Acesse: https://coolify.integrasac.com.br
2. Faça login
3. Vá para: **Projects** → **Site Ice Van** → **lovely-lizard**

### Passo 2: Ir para Environment Variables
1. Clique na aba **"Configuration"**
2. No menu lateral, clique em **"Environment Variables"**

### Passo 3: Encontrar DATABASE_URL
1. Procure pela variável **`DATABASE_URL`**
2. Clique no ícone de **editar** (lápis)

### Passo 4: Atualizar o Valor
Cole este valor completo:

```
mysql://mysql:J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy@j8wk008wo8448g88kgkw0os0:3306/default
```

### Passo 5: Salvar e Reiniciar
1. Clique em **"Save"**
2. Clique em **"Restart"** para aplicar as mudanças

---

## 📊 Informações do Banco Correto (Ice Van)

| Campo | Valor |
|-------|-------|
| **UUID** | `j8wk008wo8448g88kgkw0os0` |
| **Nome** | `mysql-database-j8wk008wo8448g88kgkw0os0` |
| **Host** | `j8wk008wo8448g88kgkw0os0` |
| **Porta** | `3306` |
| **Database** | `default` |
| **Usuário** | `mysql` |
| **Senha** | `J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy` |
| **Root Password** | `SOl5h6wJlLlJbDwkwySCP5vgbNhGlj9voECSQh9XSvKu4qipGlp5ZVXK81GLFVg5` |
| **Status** | ✅ running:healthy |

---

## 🔍 Como Verificar se Está Correto

Após atualizar e reiniciar:

1. **Acesse o site**: http://icevanisolamento.com.br
2. **Tente fazer login no admin**: http://icevanisolamento.com.br/admin
3. **Se der erro 500**: A DATABASE_URL ainda está incorreta
4. **Se carregar normalmente**: DATABASE_URL está correta ✅

---

## 📝 Outras Variáveis (Já Corretas)

Estas variáveis estão corretas e não precisam ser alteradas:

| Variável | Valor | Status |
|----------|-------|--------|
| **ADMIN_EMAIL** | admin@icevanisolamento.com.br | ✅ OK |
| **ADMIN_PASSWORD** | icevans@admin2025 | ✅ OK |
| **JWT_SECRET** | icevans-jwt-secret-mude-em-producao-32chars | ✅ OK |

---

## ⏱️ Após Atualizar

Depois de atualizar a `DATABASE_URL` e reiniciar a aplicação:

### 1. Executar Migration
```bash
ssh root@192.168.100.218
docker exec -it $(docker ps | grep zc4gck0k4wgkksk00scgo8cc | awk '{print $1}') sh
npx prisma db push
exit
```

### 2. Verificar Tabelas no phpMyAdmin
1. Acesse: http://phpmyadmin-e4ksosoo8kkws0ock84occ48.192.168.100.218.sslip.io:9080/
2. Clique no banco `default`
3. Deve ver 8 tabelas criadas

### 3. Executar Script SQL
No phpMyAdmin, aba SQL:
```sql
UPDATE settings 
SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%icevans.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%icevans.com.br%';
```

---

## ✅ Checklist

- [ ] Acessar Coolify
- [ ] Ir para Environment Variables
- [ ] Atualizar DATABASE_URL com o valor correto
- [ ] Salvar
- [ ] Reiniciar aplicação
- [ ] Aguardar restart (1-2 minutos)
- [ ] Executar migration via SSH
- [ ] Verificar tabelas no phpMyAdmin
- [ ] Executar script SQL
- [ ] Testar site

---

## 🆘 Se der erro após atualizar

### Erro: "Can't reach database server"
- Verifique se copiou a DATABASE_URL completa
- Verifique se não tem espaços extras
- Verifique se o banco está rodando: `docker ps | grep j8wk008wo8448g88kgkw0os0`

### Erro: "Access denied"
- Verifique se a senha está correta na DATABASE_URL
- Use a senha do usuário `mysql`, não do `root`

---

**Criado em**: 04/03/2026 às 01:20  
**Prioridade**: 🔴 CRÍTICA  
**Tempo estimado**: 5 minutos

---

## 📋 Resumo

**O que fazer:**
1. Atualizar `DATABASE_URL` no Coolify
2. Reiniciar aplicação
3. Executar migration
4. Executar script SQL

**Por que fazer:**
- A aplicação está tentando conectar ao banco antigo (deletado)
- Precisa apontar para o banco novo do Ice Van
- Sem isso, o site não funciona

**Quando fazer:**
- AGORA! É crítico para o site funcionar
