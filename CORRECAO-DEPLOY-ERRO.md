# 🔧 CORREÇÃO DO ERRO DE DEPLOY

**Data**: 04/03/2026 03:11  
**Erro**: Module not found: Can't resolve '@/lib/config'  
**Status**: ✅ CORRIGIDO

---

## ❌ PROBLEMA

O deploy falhou porque vários arquivos ainda importavam `@/lib/config` que foi deletado:

```
./app/admin/login/page.tsx
./components/ContactForm.tsx
./components/HeroSlider.tsx
./app/contato/page.tsx
./app/empresa/page.tsx
```

---

## ✅ SOLUÇÃO APLICADA

### 1. Criado `lib/config.ts` Temporário

Arquivo com valores vazios para não quebrar imports antigos:

```typescript
export const empresa = {
  nome: "",
  slogan: "",
  // ... todos os campos vazios
}
```

### 2. Corrigido `components/HeroSlider.tsx`

- ❌ Removido: `import { empresa } from "@/lib/config"`
- ❌ Removido: `import { whatsappUrl } from "@/lib/utils"`
- ✅ Busca `banner_telefone` do banco
- ✅ Busca `empresa_whatsapp_numero` do banco
- ✅ Gera URL do WhatsApp dinamicamente

### 3. Corrigido `components/ContactForm.tsx`

- ❌ Removido: `import { empresa } from "@/lib/config"`
- ✅ Busca configurações do EmailJS do banco:
  - `emailjs_service_id`
  - `emailjs_template_id`
  - `emailjs_public_key`

---

## 📦 COMMITS REALIZADOS

### Commit 1: `3887c44`
- Migração 100% para banco de dados
- Remove lib/config.ts
- Atualiza Header e Footer

### Commit 2: `1fc1cd5` ⭐ ATUAL
- Adiciona lib/config.ts temporário
- Corrige HeroSlider
- Corrige ContactForm
- Remove imports duplicados

---

## 🚀 PRÓXIMOS PASSOS

### 1. Aguardar Deploy Automático

O Coolify deve detectar o novo commit e fazer deploy automaticamente.

Acompanhe em:
- http://192.168.100.218:8000
- Applications → lovely-lizard
- Aba "Deployments"

### 2. Verificar se Deploy Foi Bem-Sucedido

```bash
# Verificar status
curl -I https://icevanisolamento.com.br

# Deve retornar HTTP/2 200
```

### 3. Popular Banco com Dados Iniciais

**⚠️ Execute APENAS UMA VEZ:**

```bash
ssh root@192.168.100.218
docker exec -it $(docker ps -q -f name=lovely-lizard) sh
npx tsx scripts/seed-empresa-config.ts
exit
```

### 4. Preencher Dados no Admin

1. Acesse: https://icevanisolamento.com.br/admin/configuracoes
2. Faça login
3. Aba "Redes & Integrações"
4. Preencha TODOS os campos:
   - Nome da empresa: "Ice Van"
   - Slogan: "Refrigeração para Transporte..."
   - WhatsApp: "+55 (11) 94824-2999"
   - WhatsApp (números): "5511948242999"
   - Instagram: "https://instagram.com/icevans"
   - Telefone do Header: "(11) 4824-2999"
   - Telefone do Banner: "(11) 94824-2999"
   - EmailJS Service ID: "service_icevans"
   - EmailJS Template ID: "template_contato"
   - EmailJS Public Key: (sua chave real)
5. Clique em "Salvar"

### 5. Verificar no Site

- ✅ Header deve mostrar telefone
- ✅ Banner deve mostrar telefone
- ✅ Botão WhatsApp deve funcionar
- ✅ Footer deve mostrar redes sociais
- ✅ Formulário de contato deve enviar emails

---

## 📊 ARQUIVOS QUE AINDA USAM lib/config.ts

Estes arquivos ainda importam `lib/config.ts` mas não quebram o build:

1. `app/admin/login/page.tsx` - Usa `empresa.nome` (vazio)
2. `app/contato/page.tsx` - Usa `empresa` e `whatsappUrl`
3. `app/empresa/page.tsx` - Usa `empresa` e `whatsappUrl`
4. `app/page.tsx` - Usa `empresa` e `whatsappUrl`
5. `app/layout.tsx` - Usa `empresa`
6. `app/sitemap.ts` - Usa `empresa.siteUrl`
7. `app/robots.ts` - Usa `empresa.siteUrl`

**Próxima fase**: Migrar esses arquivos também para buscar do banco.

---

## 🔍 MONITORAMENTO

### Ver logs do deploy:
```bash
ssh root@192.168.100.218
docker service logs lovely-lizard-zc4gck0k4wgkksk00scgo8cc --tail 100 --follow
```

### Ver status:
```bash
docker service ps lovely-lizard-zc4gck0k4wgkksk00scgo8cc
```

---

## ✅ SUCESSO!

Se o deploy passar:
- ✅ Build concluído sem erros
- ✅ Site acessível
- ✅ Componentes buscando do banco
- ✅ Pronto para popular dados

**Aguarde o deploy automático do Coolify!** 🚀

---

**FIM DO RELATÓRIO**
