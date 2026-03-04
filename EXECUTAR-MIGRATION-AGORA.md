# 🚀 EXECUTAR MIGRATION DO PRISMA - GUIA RÁPIDO

**Status**: ⚠️ AÇÃO CRÍTICA NECESSÁRIA  
**Tempo estimado**: 2-3 minutos  
**Última atualização**: 04/03/2026 às 00:52

---

## ⚡ Método 1: Via SSH (MAIS RÁPIDO) ⭐

### Passo 1: Conectar ao servidor
```bash
ssh root@192.168.100.218
```

### Passo 2: Encontrar o container da aplicação
```bash
docker ps | grep zc4gck0k4wgkksk00scgo8cc
```

Você verá algo como:
```
abc123def456  nixpacks/...  "..."  Up 10 minutes  lovely-lizard-zc4gck0k4wgkksk00scgo8cc
```

Copie o **CONTAINER ID** (primeiros caracteres, ex: `abc123def456`)

### Passo 3: Entrar no container
```bash
docker exec -it abc123def456 sh
```
*(substitua `abc123def456` pelo ID real)*

### Passo 4: Executar a migration
```bash
npx prisma db push
```

**OU** (se preferir usar migrations):
```bash
npx prisma migrate deploy
```

### Passo 5: Verificar se funcionou
Você deve ver algo como:
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema.

✔ Created the following tables:
  - contacts
  - seo_settings
  - gallery_photos
  - videos
  - settings
  - users
  - hero_banners
```

### Passo 6: Sair do container
```bash
exit
```

---

## 🌐 Método 2: Via Coolify Web UI

### Opção A: Terminal Integrado (se disponível)

1. Acesse: https://coolify.integrasac.com.br
2. Faça login
3. Vá para: **Projects** → **Site Ice Van** → **lovely-lizard**
4. Procure por **"Terminal"** ou **"Execute Command"** no menu
5. Se encontrar, execute:
   ```bash
   npx prisma db push
   ```

### Opção B: Via Logs/Console (alternativa)

Se não houver terminal integrado:

1. Acesse: https://coolify.integrasac.com.br
2. Vá para a aplicação **lovely-lizard**
3. Clique em **"Restart"** (isso pode executar o post-deployment command se configurado)
4. Verifique os logs para ver se a migration foi executada

---

## 🔍 Método 3: Verificar se já foi executada

Antes de executar, você pode verificar se a migration já foi feita:

### Via SSH:
```bash
ssh root@192.168.100.218
docker exec -it $(docker ps | grep zc4gck0k4wgkksk00scgo8cc | awk '{print $1}') sh -c "npx prisma db pull"
```

Se retornar erro "No tables found", significa que precisa executar a migration.

---

## ✅ Como Verificar se Funcionou

### Método 1: Via Prisma Studio (no container)
```bash
# Dentro do container
npx prisma studio
```

Isso abrirá uma interface web (mas pode não funcionar em ambiente de produção sem porta exposta).

### Método 2: Via MySQL Client
```bash
# No servidor
mysql -h r40gggkc8okc0o00kkgcskgs -u mysql -p default
```

Senha: `1K0536Hy40mcIyKB6Oqc2S9Bbm8v3sMiUld05VwmUWSe2k6vdFHRwOb14ItrBRuw`

Depois:
```sql
SHOW TABLES;
```

Você deve ver:
```
+-------------------+
| Tables_in_default |
+-------------------+
| _prisma_migrations|
| contacts          |
| gallery_photos    |
| hero_banners      |
| seo_settings      |
| settings          |
| users             |
| videos            |
+-------------------+
8 rows in set
```

### Método 3: Testar o site
1. Acesse: https://icevanisolamento.com.br/admin
2. Tente fazer login
3. Se funcionar, a migration foi executada com sucesso!

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"

**Solução:**
```bash
# Verifique se o MySQL está rodando
docker ps | grep r40gggkc8okc0o00kkgcskgs

# Se não estiver, inicie-o via Coolify
```

### Erro: "Command not found: npx"

**Solução:**
```bash
# Use o caminho completo
/app/node_modules/.bin/prisma db push
```

### Erro: "Access denied for user"

**Solução:**
Verifique se a variável `DATABASE_URL` está correta:
```bash
# Dentro do container
echo $DATABASE_URL
```

Deve ser:
```
mysql://mysql:1K0536Hy40mcIyKB6Oqc2S9Bbm8v3sMiUld05VwmUWSe2k6vdFHRwOb14ItrBRuw@r40gggkc8okc0o00kkgcskgs:3306/default
```

### Erro: "Unknown database 'default'"

**Solução:**
Crie o banco manualmente:
```bash
mysql -h r40gggkc8okc0o00kkgcskgs -u root -p
```

Senha root: `N5zQiumZI8b4ek2xZteuYC6ryqa59ZwM3oM52kjKTUPVMoObV4REw7Fb1xbO2G4M`

```sql
CREATE DATABASE IF NOT EXISTS `default`;
SHOW DATABASES;
exit;
```

---

## 📊 Informações Técnicas

### Container da Aplicação
- **UUID**: `zc4gck0k4wgkksk00scgo8cc`
- **Nome**: `lovely-lizard-zc4gck0k4wgkksk00scgo8cc`
- **Status**: ✅ running:unknown
- **Porta**: 3000
- **Último deploy**: 03/03/2026 às 23:31:23

### Banco de Dados MySQL
- **UUID**: `j8wk008wo8448g88kgkw0os0`
- **Host**: `j8wk008wo8448g88kgkw0os0:3306`
- **Database**: `default`
- **Usuário**: `mysql`
- **Status**: ✅ running:healthy

### Variáveis de Ambiente
- ✅ `DATABASE_URL` configurada
- ✅ `ADMIN_EMAIL` configurada
- ✅ `ADMIN_PASSWORD` configurada
- ✅ `JWT_SECRET` configurada

---

## 🎯 Comando Resumido (Copie e Cole)

Se você tem acesso SSH, copie e cole este comando único:

```bash
ssh root@192.168.100.218 "docker exec -i \$(docker ps | grep zc4gck0k4wgkksk00scgo8cc | awk '{print \$1}') sh -c 'npx prisma db push'"
```

Este comando:
1. Conecta via SSH
2. Encontra o container automaticamente
3. Executa a migration
4. Retorna o resultado

---

## ✅ Checklist Final

Após executar a migration:

- [ ] Migration executada sem erros
- [ ] 8 tabelas criadas no banco
- [ ] Site acessível: https://icevanisolamento.com.br
- [ ] Login no admin funcionando
- [ ] Executar script SQL: `scripts/atualizar-dominio.sql`

---

## 📝 Próximo Passo

Após executar a migration com sucesso, execute o script SQL para atualizar o domínio:

```sql
-- Conecte ao banco e execute:
UPDATE settings 
SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%icevans.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%icevans.com.br%';
```

---

**Criado em**: 04/03/2026 às 00:52  
**Status**: 📝 Aguardando execução  
**Prioridade**: 🔴 CRÍTICA

---

## 💡 Dica

Se você não tem acesso SSH, peça para alguém com acesso ao servidor executar o comando resumido acima. Leva menos de 1 minuto!
