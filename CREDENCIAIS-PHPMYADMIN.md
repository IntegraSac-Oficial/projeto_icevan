# 🔐 Credenciais phpMyAdmin - Ice Van

**Data**: 04/03/2026 às 01:02  
**Status**: ✅ INFORMAÇÕES ATUALIZADAS

---

## 🌐 Acesso ao phpMyAdmin

**URL**: http://phpmyadmin-e4ksosoo8kkws0ock84occ48.192.168.100.218.sslip.io:9080/

---

## 🗄️ Credenciais do Banco MySQL

### Opção 1: Usuário MySQL (RECOMENDADO)

**Servidor:** `j8wk008wo8448g88kgkw0os0`

**Usuário:** `mysql`

**Senha:** `J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy`

---

### Opção 2: Usuário Root (Permissões Totais)

**Servidor:** `j8wk008wo8448g88kgkw0os0`

**Usuário:** `root`

**Senha:** `SOl5h6wJlLlJbDwkwySCP5vgbNhGlj9voECSQh9XSvKu4qipGlp5ZVXK81GLFVg5`

---

## 📊 Informações do Banco

| Campo | Valor |
|-------|-------|
| **UUID** | j8wk008wo8448g88kgkw0os0 |
| **Nome** | mysql-database-j8wk008wo8448g88kgkw0os0 |
| **Imagem** | mysql:8 |
| **Database** | default |
| **Porta** | 3306 |
| **Status** | ✅ running:healthy |

---

## 🔗 Connection String (para aplicação)

```
mysql://mysql:J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy@j8wk008wo8448g88kgkw0os0:3306/default
```

---

## ✅ Após Fazer Login no phpMyAdmin

1. **Selecione o banco `default`** no menu lateral esquerdo

2. **Verifique se há tabelas criadas**:
   - Se houver tabelas → Migration já foi executada ✅
   - Se não houver tabelas → Precisa executar migration ⚠️

3. **Tabelas esperadas** (após migration):
   - `_prisma_migrations`
   - `contacts`
   - `gallery_photos`
   - `hero_banners`
   - `seo_settings`
   - `settings`
   - `users`
   - `videos`

---

## 🚀 Se Não Houver Tabelas

Você precisa executar a migration do Prisma via SSH:

```bash
# 1. Conectar ao servidor
ssh root@192.168.100.218

# 2. Encontrar o container da aplicação
docker ps | grep zc4gck0k4wgkksk00scgo8cc

# 3. Entrar no container (substitua CONTAINER_ID)
docker exec -it CONTAINER_ID sh

# 4. Executar migration
npx prisma db push

# 5. Sair
exit
```

---

## 📝 Executar Script SQL (Após Migration)

Após a migration criar as tabelas, execute este script no phpMyAdmin:

1. Selecione o banco `default`
2. Clique na aba **SQL**
3. Cole o script abaixo:

```sql
-- Atualizar referências ao domínio antigo
UPDATE settings 
SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%icevans.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%icevans.com.br%';

-- Verificar se funcionou
SELECT * FROM settings WHERE value LIKE '%icevanisolamento.com.br%';
SELECT * FROM seo_settings WHERE ogImage LIKE '%icevanisolamento.com.br%';
```

4. Clique em **Executar**

---

## 🔍 Informações Técnicas

### phpMyAdmin Service
- **UUID**: `e4ksosoo8kkws0ock84occ48`
- **Status**: ✅ Running (healthy)

### Aplicação Next.js
- **UUID**: `zc4gck0k4wgkksk00scgo8cc`
- **Nome**: `lovely-lizard-zc4gck0k4wgkksk00scgo8cc`
- **Domínio**: http://icevanisolamento.com.br
- **Status**: ✅ Running

### Servidor
- **IP**: 192.168.100.218
- **Porta SSH**: 22
- **Usuário**: root

---

## ⚠️ IMPORTANTE

- ✅ Banco de dados do "Universo Comercial" foi deletado (sem conflitos)
- ✅ Credenciais atualizadas e verificadas
- ✅ phpMyAdmin acessível e funcionando
- ⚠️ Migration do Prisma precisa ser executada via SSH
- ⚠️ Script SQL precisa ser executado após migration

---

**Criado em**: 04/03/2026 às 01:02  
**Última verificação**: 04/03/2026 às 01:02  
**Status**: ✅ CREDENCIAIS CORRETAS E VERIFICADAS
