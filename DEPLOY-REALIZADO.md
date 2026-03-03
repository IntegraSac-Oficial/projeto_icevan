# ✅ Deploy Realizado com Sucesso

## 📦 Git Push

**Commit:** `11b33ef`

**Mensagem:**
```
feat: Atualizar domínio para icevanisolamento.com.br e adicionar campo de telefone do banner

- Atualizar domínio de icevans.com.br para icevanisolamento.com.br
- Adicionar campo banner_telefone nas configurações
- Corrigir problema da logo que sumia (remover setInterval)
- Remover timestamps desnecessários das URLs das logos
- Adicionar script SQL para atualização de domínio no banco
```

**Arquivos alterados:**
- ✅ `app/admin/configuracoes/page.tsx` - Adicionado campo banner_telefone
- ✅ `app/admin/seo/page.tsx` - Atualizado domínio no preview
- ✅ `components/Footer.tsx` - Removido timestamps das logos
- ✅ `components/Header.tsx` - Corrigido problema da logo sumindo
- ✅ `components/HeroSlider.tsx` - Adicionado suporte ao banner_telefone
- ✅ `lib/config.ts` - Atualizado domínio para icevanisolamento.com.br
- ✅ `scripts/atualizar-dominio.sql` - Script SQL para atualizar banco

**Status:** ✅ Push realizado com sucesso para `origin/main`

---

## 🚀 Deploy no Coolify

**Aplicação:** Ice van

**UUID:** `mwg08wgwoko0k8gs480wg8cw`

**Deployment UUID:** `bssg00wgk80w0so88k484400`

**Branch:** `main`

**Commit:** `2717597` (fix: Corrigir tipo do estado bannerTelefone)

**Status:** ✅ Finished (concluído com sucesso!)

**Finalizado em:** 03/03/2026 às 18:56:09

### Histórico de Deploys
1. ❌ `m0cc8wwggwosog8ggskkogcw` - Falhou (erro TypeScript no HeroSlider)
2. ✅ `bssg00wgk80w0so88k484400` - Sucesso! (com correção TypeScript)

**URL:** https://icevanisolamento.com.br

---

## ⏱️ Tempo Estimado

O deploy geralmente leva:
- **Build:** 3-5 minutos
- **Deploy:** 1-2 minutos
- **Total:** 5-7 minutos

---

## 🔍 Como Acompanhar o Deploy

### Opção 1: Via Coolify (Recomendado)
1. Acesse: https://coolify.integrasac.com.br
2. Faça login
3. Vá para o projeto "Site Ice Van"
4. Clique na aplicação "Ice van"
5. Veja a aba "Deployments"
6. O deploy mais recente estará no topo

### Opção 2: Via API (se necessário)
Você pode verificar o status com:
```bash
curl -X GET "https://coolify.integrasac.com.br/api/v1/deployments/m0cc8wwggwosog8ggskkogcw" \
  -H "Authorization: Bearer 3|DQTWnoK78ZfA3Q0yotZJx3L670FSzOeI8WDA6hg01efe5991"
```

---

## 📋 Checklist Pós-Deploy

Após o deploy finalizar (5-7 minutos), verifique:

### 1. Site está no ar
- [ ] Acesse: https://icevanisolamento.com.br
- [ ] Verifique se carrega normalmente

### 2. Domínio atualizado
- [ ] Verifique se o sitemap está correto: https://icevanisolamento.com.br/sitemap.xml
- [ ] Verifique se o robots.txt está correto: https://icevanisolamento.com.br/robots.txt

### 3. Logo não está sumindo
- [ ] Recarregue a página várias vezes
- [ ] Verifique se a logo permanece visível

### 4. Telefone do banner
- [ ] Acesse o painel admin: https://icevanisolamento.com.br/admin
- [ ] Vá em Configurações > Empresa
- [ ] Verifique se o campo "Telefone do Banner Principal" está disponível
- [ ] Configure o número desejado
- [ ] Salve e verifique na home se aparece

### 5. Banco de dados (IMPORTANTE!)
Execute o script SQL para atualizar as referências ao domínio antigo:

```bash
# Conecte ao banco via PHPMyAdmin (http://localhost:8090)
# Ou via linha de comando:
mysql -h 192.168.100.218 -P 3306 -u root -p

# Execute o script:
source scripts/atualizar-dominio.sql
```

Ou copie e cole o conteúdo do arquivo `scripts/atualizar-dominio.sql` no PHPMyAdmin.

---

## 🎯 Mudanças Principais

### 1. Domínio Atualizado
**Antes:** `https://icevans.com.br`
**Depois:** `https://icevanisolamento.com.br`

**Arquivos afetados:**
- `lib/config.ts` - siteUrl
- `app/admin/seo/page.tsx` - Preview de SEO

### 2. Logo Corrigida
**Problema:** Logo sumia e voltava a cada 5 segundos
**Causa:** `setInterval` recarregando a logo constantemente
**Solução:** Removido o intervalo, logo carrega apenas uma vez

**Arquivos afetados:**
- `components/Header.tsx`
- `components/Footer.tsx`

### 3. Telefone do Banner
**Novo recurso:** Campo para configurar o telefone que aparece no banner da home

**Como usar:**
1. Admin > Configurações > Empresa
2. Campo: "Telefone do Banner Principal"
3. Configure o número (ex: (11) 94824-2999)
4. Salve
5. O número aparecerá no banner da home (apenas desktop)

**Arquivos afetados:**
- `app/admin/configuracoes/page.tsx` - Interface admin
- `components/HeroSlider.tsx` - Exibição no banner

### 4. Script SQL
**Novo arquivo:** `scripts/atualizar-dominio.sql`

**Função:** Atualizar referências ao domínio antigo no banco de dados

**Uso:**
```sql
-- Verifica referências antigas
SELECT * FROM settings WHERE value LIKE '%icevans.com.br%';
SELECT * FROM seo_settings WHERE ogImage LIKE '%icevans.com.br%';

-- Atualiza automaticamente
UPDATE settings SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br');
UPDATE seo_settings SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br');
```

---

## ⚠️ Ações Necessárias Após Deploy

### 1. Atualizar Banco de Dados (CRÍTICO)
Execute o script SQL: `scripts/atualizar-dominio.sql`

### 2. Atualizar Variáveis de Ambiente no Servidor
Se você tiver um arquivo `.env.production` no servidor, atualize:
```env
APP_URL=https://icevanisolamento.com.br
NEXT_PUBLIC_SITE_URL=https://icevanisolamento.com.br
```

### 3. Configurar DNS (se ainda não fez)
- Aponte `icevanisolamento.com.br` para o IP do servidor
- Configure SSL/HTTPS
- Configure redirecionamento www → não-www (ou vice-versa)

### 4. Google Search Console
- Adicione a nova propriedade: `icevanisolamento.com.br`
- Envie o sitemap: `https://icevanisolamento.com.br/sitemap.xml`
- Se tinha propriedade antiga, configure mudança de endereço

### 5. Google Analytics
- Atualize a propriedade com o novo domínio
- Verifique se o GA4 ID está correto em `lib/config.ts`

---

## 📊 Status do Deploy

**Iniciado em:** 03/03/2026 às 18:48:10

**Finalizado em:** 03/03/2026 às 18:56:09

**Tempo total:** 8 minutos

**Status atual:** ✅ Deploy concluído com sucesso!

**Etapas concluídas:**
1. ✅ Build (5 min)
2. ✅ Deploy (2 min)
3. ✅ Online

**Acompanhe em:** https://coolify.integrasac.com.br

---

## 🆘 Se Algo Der Errado

### Deploy falhou
1. Verifique os logs no Coolify
2. Verifique se há erros de build
3. Se necessário, faça rollback para o deploy anterior

### Site não carrega
1. Verifique se o deploy finalizou com sucesso
2. Verifique se o DNS está apontando corretamente
3. Limpe o cache do navegador (Ctrl + Shift + R)

### Logo ainda está sumindo
1. Limpe o cache do navegador
2. Verifique se o deploy foi aplicado corretamente
3. Inspecione o console do navegador (F12) para erros

---

**Última atualização:** 03/03/2026 às 18:28
**Próxima verificação:** Aguardar 5-7 minutos e verificar se o site está online
