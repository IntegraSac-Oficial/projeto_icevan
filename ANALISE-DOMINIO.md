# Análise de Inconsistências - Mudança de Domínio

## Domínio Oficial
**Novo domínio:** `https://icevanisolamento.com.br`

---

## ✅ Correções Aplicadas no Código

### 1. lib/config.ts
- **Antes:** `siteUrl: "https://icevans.com.br"`
- **Depois:** `siteUrl: "https://icevanisolamento.com.br"`
- **Status:** ✅ CORRIGIDO

### 2. app/admin/seo/page.tsx
- **Antes:** `icevans.com.br{page.slug}`
- **Depois:** `icevanisolamento.com.br{page.slug}`
- **Status:** ✅ CORRIGIDO

---

## ⚠️ Arquivos que NÃO Precisam de Alteração

### Arquivos que usam variáveis dinâmicas:
- `app/robots.ts` - Usa `empresa.siteUrl` ✅
- `app/sitemap.ts` - Usa `empresa.siteUrl` ✅
- `app/layout.tsx` - Usa `empresa.siteUrl` ✅

### Arquivos de exemplo/placeholder:
- `app/styleguide/components/card/page.tsx` - Apenas exemplo visual
- `app/styleguide/components/social-icons/page.tsx` - Apenas exemplo visual
- `app/admin/textos/contato/page.tsx` - Valor padrão (pode ser editado no admin)
- `app/admin/configuracoes/page.tsx` - Valor padrão (pode ser editado no admin)

---

## 📋 Checklist de Configuração em Produção

### 1. Variáveis de Ambiente (.env.production)
Certifique-se de que o arquivo `.env.production` no servidor contém:

```env
# URL do site
APP_URL=https://icevanisolamento.com.br
NEXT_PUBLIC_SITE_URL=https://icevanisolamento.com.br

# Banco de dados (use as credenciais do Hostinger)
DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/SEU_BANCO"

# Email SMTP (use o domínio correto)
SMTP_FROM=noreply@icevanisolamento.com.br
MAIL_FROM_ADDRESS=noreply@icevanisolamento.com.br

# Credenciais Admin (altere para valores seguros)
ADMIN_EMAIL="admin@icevanisolamento.com.br"
ADMIN_PASSWORD="sua-senha-segura-aqui"
JWT_SECRET="gere-uma-chave-aleatoria-com-openssl-rand-base64-32"

# CORS
CORS_ORIGINS=https://icevanisolamento.com.br,https://www.icevanisolamento.com.br
```

### 2. Configurações no Painel Admin
Após fazer deploy, acesse o painel admin e verifique:

#### Admin > Configurações > Empresa
- ✅ Email da empresa
- ✅ Telefones (Header e Banner)
- ✅ Endereço completo
- ✅ Horário de atendimento

#### Admin > Configurações > SMTP
- ✅ Host: smtp.hostinger.com
- ✅ Porta: 587
- ✅ Usuário: noreply@icevanisolamento.com.br
- ✅ Senha: (senha do email)
- ✅ Email Remetente: noreply@icevanisolamento.com.br
- ✅ Nome do Remetente: Ice Van

#### Admin > SEO
Verifique e atualize os metadados de cada página:
- ✅ Página inicial (/)
- ✅ /empresa
- ✅ /aplicacoes
- ✅ /contato
- ✅ /fotos-servicos
- ✅ Páginas de aplicações individuais

### 3. Banco de Dados
Verifique se há URLs antigas armazenadas no banco:

```sql
-- Verificar configurações
SELECT * FROM settings WHERE value LIKE '%icevans.com.br%';

-- Verificar SEO
SELECT * FROM seo_settings WHERE ogImage LIKE '%icevans.com.br%';

-- Se encontrar, atualize:
UPDATE settings SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br');
UPDATE seo_settings SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br');
```

### 4. DNS e SSL
- ✅ Configurar DNS apontando para o servidor Hostinger
- ✅ Ativar SSL/HTTPS no painel do Hostinger
- ✅ Forçar redirecionamento HTTP → HTTPS
- ✅ Configurar www → não-www (ou vice-versa)

### 5. Google Analytics
Se estiver usando Google Analytics:
- ✅ Atualizar a propriedade com o novo domínio
- ✅ Atualizar o GA4 ID em `lib/config.ts` (linha 54)

### 6. Redes Sociais
Atualizar links em `lib/config.ts`:
- ✅ Instagram
- ✅ Facebook
- ✅ YouTube
- ✅ LinkedIn
- ✅ TikTok

### 7. Google Search Console
- ✅ Adicionar nova propriedade para icevanisolamento.com.br
- ✅ Verificar propriedade
- ✅ Enviar sitemap: https://icevanisolamento.com.br/sitemap.xml
- ✅ Se havia propriedade antiga, configurar mudança de endereço

### 8. Testes Pós-Deploy
- ✅ Testar formulário de contato
- ✅ Verificar se emails estão sendo enviados
- ✅ Testar login no painel admin
- ✅ Verificar se todas as imagens carregam
- ✅ Testar links do WhatsApp
- ✅ Verificar meta tags (usar https://metatags.io/)
- ✅ Testar sitemap: https://icevanisolamento.com.br/sitemap.xml
- ✅ Testar robots.txt: https://icevanisolamento.com.br/robots.txt

---

## 🔍 Comandos Úteis

### Verificar referências ao domínio antigo:
```bash
# No terminal do projeto
grep -r "icevans.com.br" --exclude-dir=node_modules --exclude-dir=.next
```

### Gerar chave JWT segura:
```bash
openssl rand -base64 32
```

### Rebuild do projeto após mudanças:
```bash
npm run build
```

---

## 📝 Notas Importantes

1. **Email:** O email `vendas@icevans.com.br` ainda está configurado em vários lugares. Se você quiser mudar para `vendas@icevanisolamento.com.br`, atualize em:
   - `lib/config.ts` (linha 18)
   - Painel Admin > Configurações > Empresa

2. **Instagram:** O handle `@icevans` está configurado. Se mudou, atualize em `lib/config.ts` (linha 33)

3. **Cache:** Após fazer mudanças, limpe o cache do navegador (Ctrl+Shift+R) e do servidor se aplicável

4. **Redirects:** Se o site antigo ainda recebe tráfego, configure redirects 301 de icevans.com.br → icevanisolamento.com.br

---

## ✅ Status Final

- Código fonte: **ATUALIZADO**
- Variáveis de ambiente: **REQUER CONFIGURAÇÃO NO SERVIDOR**
- Banco de dados: **REQUER VERIFICAÇÃO**
- DNS/SSL: **REQUER CONFIGURAÇÃO NO HOSTINGER**
- SEO: **REQUER ATUALIZAÇÃO NO PAINEL ADMIN**
