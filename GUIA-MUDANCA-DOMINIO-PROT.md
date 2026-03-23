# 🔄 Guia de Mudança de Domínio

## De: `icevanisolamento.com.br` → Para: `prot.icevanisolamento.com.br`

---

## ✅ Alterações Realizadas no Código

### Arquivos Atualizados:

1. **`app/layout.tsx`**
   - `metadataBase`: `https://prot.icevanisolamento.com.br`

2. **`app/robots.ts`**
   - Fallback do `siteUrl`: `https://prot.icevanisolamento.com.br`

3. **`app/sitemap.ts`**
   - Fallback do `baseUrl`: `https://prot.icevanisolamento.com.br`

4. **`scripts/seed-empresa-config.ts`**
   - `site_url`: `https://prot.icevanisolamento.com.br`

5. **`.env.example`**
   - `APP_URL` e `NEXT_PUBLIC_SITE_URL`: `https://prot.icevanisolamento.com.br`
   - `CORS_ORIGINS`: `https://prot.icevanisolamento.com.br`

6. **`scripts/atualizar-dominio-prot.sql`** (NOVO)
   - Script SQL para atualizar banco de dados

---

## 📋 Checklist de Deploy

### 1. Atualizar Código (Local)

```bash
# Verificar alterações
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: Atualizar domínio para prot.icevanisolamento.com.br"

# Push para GitHub
git push origin main
```

### 2. Atualizar Variáveis de Ambiente (Coolify)

Acessar Coolify e atualizar:

```env
NEXT_PUBLIC_SITE_URL=https://prot.icevanisolamento.com.br
```

### 3. Atualizar Banco de Dados (Produção)

**Opção A - Via phpMyAdmin:**
1. Acessar phpMyAdmin no Coolify
2. Selecionar banco `icevan`
3. Ir em "SQL"
4. Copiar e colar o conteúdo de `scripts/atualizar-dominio-prot.sql`
5. Executar

**Opção B - Via MySQL CLI:**
```bash
mysql -u root -p icevan < scripts/atualizar-dominio-prot.sql
```

### 4. Configurar DNS/Cloudflare

**No Cloudflare:**
1. Acessar: https://dash.cloudflare.com/
2. Selecionar domínio: `icevanisolamento.com.br`
3. Ir em: **DNS** → **Records**
4. Adicionar registro:
   - **Type**: `CNAME`
   - **Name**: `prot`
   - **Target**: `icevanisolamento.com.br` (ou IP do servidor)
   - **Proxy status**: ✅ Proxied (laranja)
   - **TTL**: Auto

5. Ir em: **SSL/TLS** → **Overview**
6. Configurar: **Full** (não Full Strict)

### 5. Configurar Coolify

**No painel do Coolify:**
1. Acessar aplicação Ice Van
2. Ir em: **Domains**
3. Adicionar novo domínio: `prot.icevanisolamento.com.br`
4. Salvar e fazer redeploy

**Ou atualizar Cloudflare Tunnel:**
1. Acessar: https://one.dash.cloudflare.com/
2. Ir em: **Networks** → **Tunnels**
3. Editar tunnel existente
4. Atualizar rota:
   - **Subdomain**: `prot`
   - **Domain**: `icevanisolamento.com.br`
   - **Type**: `HTTPS`
   - **URL**: `https://192.168.100.218:9443`

### 6. Testar

```bash
# Testar DNS
nslookup prot.icevanisolamento.com.br

# Testar HTTPS
curl -I https://prot.icevanisolamento.com.br

# Acessar no navegador
https://prot.icevanisolamento.com.br
```

### 7. Verificar SEO

**Verificar robots.txt:**
```
https://prot.icevanisolamento.com.br/robots.txt
```

Deve mostrar:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://prot.icevanisolamento.com.br/sitemap.xml
Host: https://prot.icevanisolamento.com.br
```

**Verificar sitemap.xml:**
```
https://prot.icevanisolamento.com.br/sitemap.xml
```

Deve listar todas as URLs com `https://prot.icevanisolamento.com.br`

**Verificar Schema Markup:**
1. Acessar: https://prot.icevanisolamento.com.br
2. Ver código-fonte (Ctrl+U)
3. Procurar por `<script type="application/ld+json">`
4. Verificar se a URL está correta

### 8. Atualizar Google Search Console (Opcional)

Se o site já estava indexado:

1. Acessar: https://search.google.com/search-console
2. Adicionar nova propriedade: `prot.icevanisolamento.com.br`
3. Verificar propriedade
4. Enviar novo sitemap: `https://prot.icevanisolamento.com.br/sitemap.xml`

---

## 🔍 Verificações Pós-Deploy

### Checklist de Testes:

- [ ] Site carrega em `https://prot.icevanisolamento.com.br`
- [ ] SSL/HTTPS funcionando (cadeado verde)
- [ ] Home page carrega corretamente
- [ ] Admin acessível em `/admin/login`
- [ ] Imagens carregam corretamente
- [ ] Banners aparecem
- [ ] Formulário de contato funciona
- [ ] robots.txt mostra novo domínio
- [ ] sitemap.xml mostra novo domínio
- [ ] Schema Markup tem novo domínio
- [ ] Meta tags têm novo domínio

### Comandos de Verificação:

```bash
# Verificar robots.txt
curl https://prot.icevanisolamento.com.br/robots.txt

# Verificar sitemap.xml
curl https://prot.icevanisolamento.com.br/sitemap.xml

# Verificar meta tags
curl -s https://prot.icevanisolamento.com.br | grep -i "og:url"

# Verificar Schema Markup
curl -s https://prot.icevanisolamento.com.br | grep -A 20 "application/ld+json"
```

---

## 🔄 Rollback (Se Necessário)

Se algo der errado, você pode reverter:

### 1. Reverter Código:

```bash
git revert HEAD
git push origin main
```

### 2. Reverter Banco de Dados:

```sql
-- Restaurar domínio antigo
UPDATE settings 
SET value = 'https://icevanisolamento.com.br'
WHERE `key` = 'site_url';

UPDATE settings 
SET value = REPLACE(value, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE value LIKE '%https://prot.icevanisolamento.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE ogImage LIKE '%https://prot.icevanisolamento.com.br%';
```

### 3. Reverter Cloudflare:

- Remover registro DNS `prot`
- Ou atualizar tunnel para domínio antigo

---

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup do banco antes de executar o script SQL
2. **Cache**: Limpe cache do Cloudflare após mudanças
3. **DNS**: Propagação DNS pode levar até 24h (geralmente 5-10 minutos)
4. **SSL**: Certificado SSL será gerado automaticamente pelo Cloudflare
5. **SEO**: Google pode levar alguns dias para reindexar com novo domínio

---

## 🆘 Troubleshooting

### Erro: "Site não carrega"

**Solução:**
1. Verificar se DNS está propagado: `nslookup prot.icevanisolamento.com.br`
2. Verificar se Cloudflare Tunnel está ativo
3. Verificar logs do Coolify

### Erro: "SSL inválido"

**Solução:**
1. Aguardar 5-10 minutos (geração automática)
2. Verificar configuração SSL no Cloudflare (deve ser "Full")
3. Limpar cache do navegador

### Erro: "robots.txt mostra domínio antigo"

**Solução:**
1. Verificar se variável `NEXT_PUBLIC_SITE_URL` foi atualizada no Coolify
2. Fazer redeploy da aplicação
3. Limpar cache do Cloudflare

### Erro: "Banco de dados não atualizado"

**Solução:**
1. Verificar se script SQL foi executado completamente
2. Executar query de verificação:
```sql
SELECT * FROM settings WHERE `key` = 'site_url';
```
3. Deve mostrar: `https://prot.icevanisolamento.com.br`

---

## ✅ Conclusão

Após seguir todos os passos, o site estará funcionando em:

**Novo domínio:** https://prot.icevanisolamento.com.br

Todas as funcionalidades devem continuar funcionando normalmente:
- ✅ Site público
- ✅ Painel administrativo
- ✅ SEO otimizado
- ✅ Schema Markup
- ✅ Formulário de contato
- ✅ Imagens e banners

---

**Data da mudança:** 20/03/2026  
**Responsável:** [Seu nome]
