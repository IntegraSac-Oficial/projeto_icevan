# Correções de Cache - Migração para Banco de Dados

## ✅ Problemas Corrigidos

### 1. Erros de TypeScript no Build
- ❌ `config.phone` → ✅ `config.telefone`
- ❌ `config.address` → ✅ `config.enderecoCompleto`
- ❌ `config.site_url` → ✅ `config.siteUrl`
- ❌ `setWhatsappNumero` não declarado → ✅ Adicionado estado e função `whatsappUrl()`

### 2. Cache do Next.js
**Problema**: Site mostrava dados antigos na primeira visita, só atualizava após entrar no admin.

**Solução Implementada**:
1. Adicionado `export const dynamic = 'force-dynamic'` em:
   - `app/page.tsx`
   - `app/layout.tsx`
   - `app/empresa/page.tsx`
   - `app/contato/page.tsx`

2. Adicionado headers no `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      ],
    },
  ];
}
```

## 📊 Resultado do Build

Todas as páginas agora são **dinâmicas** (ƒ) em vez de estáticas (○):

```
Route (app)                              Size     First Load JS
┌ ƒ /                                    12 kB           137 kB
├ ƒ /empresa                             192 B           101 kB
├ ƒ /contato                             2.27 kB         113 kB
├ ƒ /aplicacoes                          192 B           101 kB
└ ƒ /aplicacoes/[slug]                   2.46 kB         104 kB
```

## 🔄 Próximos Passos

1. **Testar localmente**:
   ```bash
   npm run dev
   ```
   - Abrir http://localhost:3000
   - Verificar se dados do banco aparecem imediatamente
   - Fazer alterações no admin e verificar se refletem sem cache

2. **Deploy no Coolify**:
   ```bash
   git add -A
   git commit -m "fix: desabilitar cache para sempre buscar dados do banco"
   git push origin main
   ```

3. **Executar seed no servidor** (após deploy bem-sucedido):
   ```bash
   npx tsx scripts/seed-empresa-config.ts
   ```

4. **Preencher dados reais no admin**:
   - Acessar https://icevanisolamento.com.br/admin
   - Ir em "Configurações"
   - Preencher todos os campos da empresa
   - Salvar

## ⚠️ Observações

- O erro `GET /images/logo/logo-white.svg 404` é normal e não afeta o funcionamento
- Acontece porque o estado inicial usa `.svg` antes da API responder com `.jpeg`
- A API `/api/logo` retorna corretamente o arquivo `.jpeg` existente
- O tempo de resposta de 200ms é normal para páginas dinâmicas

## 🎯 Status Atual

- ✅ Build local passa sem erros
- ✅ TypeScript sem erros
- ✅ Cache desabilitado
- ✅ Páginas dinâmicas configuradas
- ⏳ Aguardando deploy no Coolify
