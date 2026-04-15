# Instalação do Google Tag Manager (GTM)

## 📋 Resumo da Migração

Este documento descreve a **migração limpa** da implementação manual do Google Ads para o Google Tag Manager (GTM).

### ✅ O que foi REMOVIDO (implementação manual antiga):
- Scripts do Google Ads (`gtag.js` com ID `AW-18056785768`)
- Scripts do Google Analytics 4 (GA4) manual
- Função helper `trackWhatsAppClick()` em `lib/utils.ts`
- Tipagem `window.gtag` em `lib/utils.ts`
- Todas as chamadas de conversão manual nos componentes
- Imports de `trackWhatsAppClick` em 5 componentes
- Documentação obsoleta (`INSTALACAO-GOOGLE-ADS-TAG.md`, `RASTREAMENTO-CONVERSAO-WHATSAPP.md`)

### ✅ O que foi INSTALADO (nova implementação GTM):
- Google Tag Manager com Container ID: **GTM-5T4N72JG**
- Script do GTM no `<head>` global
- Noscript do GTM no `<body>` global
- Código limpo, sem duplicidade, pronto para gestão centralizada de tags

---

## 🎯 Container GTM

**Container ID:** `GTM-5T4N72JG`

---

## 📂 Arquivos Modificados

### 1. `app/layout.tsx`
**Alterações:**
- ❌ Removidos scripts do Google Analytics 4 (GA4) manual
- ❌ Removidos scripts do Google Ads (`AW-18056785768`)
- ✅ Adicionado script do GTM no `<head>` (apenas site público)
- ✅ Adicionado noscript do GTM no `<body>` (apenas site público)

**Localização:**
- Script GTM: dentro do `<head>`, após Schema.org
- Noscript GTM: logo após abertura do `<body>`

**Condição:**
- Ambos só carregam quando `!isAdmin` (não carrega no painel admin)

---

### 2. `lib/utils.ts`
**Alterações:**
- ❌ Removida tipagem global `window.gtag`
- ❌ Removida tipagem global `window.dataLayer`
- ❌ Removida função `trackWhatsAppClick()`

**Mantido:**
- ✅ Função `cn()` (utilitário Tailwind)
- ✅ Função `whatsappUrl()` (geração de URL do WhatsApp)

---

### 3. `components/WhatsAppButton.tsx`
**Alterações:**
- ❌ Removido import de `trackWhatsAppClick`
- ❌ Removida função `handleClick()`
- ❌ Removido `onClick={handleClick}` do link

**Resultado:**
- ✅ Botão WhatsApp funciona normalmente
- ✅ Sem rastreamento manual (será gerenciado pelo GTM)

---

### 4. `components/Header.tsx`
**Alterações:**
- ❌ Removido import de `trackWhatsAppClick`
- ❌ Removidas 3 chamadas de `trackWhatsAppClick()`:
  1. Link WhatsApp na top bar (desktop)
  2. Botão "Orçamento" no nav desktop
  3. Botão "Solicitar Orçamento" no menu mobile

**Resultado:**
- ✅ Todos os links WhatsApp funcionam normalmente
- ✅ Sem rastreamento manual (será gerenciado pelo GTM)

---

### 5. `components/Footer.tsx`
**Alterações:**
- ❌ Removido import de `trackWhatsAppClick`
- ❌ Removida chamada de `trackWhatsAppClick()` no ícone WhatsApp das redes sociais

**Resultado:**
- ✅ Ícone WhatsApp funciona normalmente
- ✅ Sem rastreamento manual (será gerenciado pelo GTM)

---

### 6. `components/HeroSlider.tsx`
**Alterações:**
- ❌ Removido import de `trackWhatsAppClick`
- ❌ Removida chamada de `trackWhatsAppClick()` no botão CTA "Solicite um Orçamento"

**Resultado:**
- ✅ Botão CTA funciona normalmente
- ✅ Sem rastreamento manual (será gerenciado pelo GTM)

---

## 🔍 Validação de Remoção Completa

### Verificação de Vestígios
Execute estas buscas no projeto para confirmar que não restou nada da implementação antiga:

```bash
# Buscar por gtag (deve retornar 0 resultados em código)
grep -r "gtag" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules

# Buscar por AW-18056785768 (deve retornar 0 resultados)
grep -r "AW-18056785768" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules

# Buscar por trackWhatsAppClick (deve retornar 0 resultados)
grep -r "trackWhatsAppClick" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules

# Buscar por window.gtag (deve retornar 0 resultados)
grep -r "window.gtag" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
```

### ✅ Confirmação
- ✅ Nenhum uso de `gtag` manual
- ✅ Nenhum uso de `AW-18056785768`
- ✅ Nenhum uso de `trackWhatsAppClick`
- ✅ Nenhum uso de `window.gtag`
- ✅ Nenhuma tipagem de `gtag` no código

---

## 🧪 Como Validar no Navegador

### 1. Verificar se o GTM está carregando

1. Abra o site em modo público (não admin)
2. Abra o DevTools (F12)
3. Vá na aba **Network**
4. Filtre por `gtm.js`
5. Recarregue a página
6. **Deve aparecer:** requisição para `https://www.googletagmanager.com/gtm.js?id=GTM-5T4N72JG`

### 2. Verificar o dataLayer

1. No DevTools, vá na aba **Console**
2. Digite: `window.dataLayer`
3. **Deve retornar:** um array com objetos (eventos do GTM)
4. Digite: `window.google_tag_manager`
5. **Deve retornar:** objeto com informações do GTM

### 3. Usar a extensão Google Tag Assistant

1. Instale a extensão [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Abra o site
3. Clique no ícone da extensão
4. Clique em "Enable" e recarregue a página
5. **Deve aparecer:** Google Tag Manager com ID `GTM-5T4N72JG`

### 4. Verificar que NÃO há implementação antiga

1. No DevTools, aba **Network**
2. Filtre por `gtag/js?id=AW-18056785768`
3. **NÃO deve aparecer** nenhuma requisição
4. No Console, digite: `window.gtag`
5. **Deve retornar:** `undefined` (não existe mais)

---

## 🎯 Próximos Passos (Configuração no Painel do GTM)

Agora que o GTM está instalado, você pode configurar tags, triggers e variáveis diretamente no painel do Google Tag Manager:

### 1. Acessar o GTM
- URL: https://tagmanager.google.com/
- Container: `GTM-5T4N72JG`

### 2. Configurar Google Ads
- Criar tag do tipo "Google Ads Conversion Tracking"
- Conversion ID: `AW-18056785768`
- Conversion Label: `CnPnCPiTqpgcEOjekqJD`

### 3. Configurar Google Analytics 4
- Criar tag do tipo "Google Analytics: GA4 Configuration"
- Measurement ID: (buscar no banco de dados, campo `ga4_id`)

### 4. Criar Triggers para WhatsApp
- Trigger: Click - All Elements
- Condição: Click URL contains `wa.me`
- Associar à tag de conversão do Google Ads

### 5. Testar no Preview Mode
- Ativar modo Preview no GTM
- Testar cliques nos botões WhatsApp
- Verificar se os eventos estão disparando corretamente

---

## 📊 Benefícios da Migração para GTM

### ✅ Vantagens
1. **Gestão Centralizada:** Todas as tags em um único lugar
2. **Sem Deploy:** Mudanças de tags sem precisar alterar código
3. **Versionamento:** Histórico de mudanças no GTM
4. **Preview Mode:** Testar tags antes de publicar
5. **Múltiplas Tags:** Fácil adicionar Facebook Pixel, LinkedIn Insight, etc.
6. **Debugging:** Ferramentas nativas de debug do GTM
7. **Performance:** Carregamento assíncrono otimizado
8. **Colaboração:** Múltiplos usuários podem gerenciar tags

### ✅ Código Mais Limpo
- Sem funções helper de rastreamento
- Sem tipagens específicas de tags
- Sem imports desnecessários
- Sem lógica de conversão espalhada nos componentes
- Separação clara: código faz UI, GTM faz rastreamento

---

## 🚨 Importante

### ⚠️ Botões WhatsApp Continuam Funcionando
- Todos os botões e links de WhatsApp continuam funcionando normalmente
- A remoção do rastreamento manual NÃO afeta a funcionalidade
- O rastreamento será reconfigurado no painel do GTM

### ⚠️ Não Há Duplicidade
- A implementação antiga foi COMPLETAMENTE removida
- Não há conflito entre GTM e tags manuais
- Apenas o GTM está ativo no site

### ⚠️ Admin Não Carrega GTM
- O GTM só carrega no site público (`!isAdmin`)
- O painel admin não tem rastreamento (por design)

---

## 📝 Checklist de Conclusão

- [x] Scripts do Google Ads removidos
- [x] Scripts do GA4 manual removidos
- [x] Função `trackWhatsAppClick()` removida
- [x] Tipagem `window.gtag` removida
- [x] Imports de `trackWhatsAppClick` removidos de todos os componentes
- [x] Chamadas de `trackWhatsAppClick()` removidas de todos os botões
- [x] GTM instalado no `<head>` global
- [x] GTM noscript instalado no `<body>` global
- [x] Documentação obsoleta deletada
- [x] Nova documentação criada
- [x] Botões WhatsApp funcionando normalmente
- [x] Código limpo, sem vestígios da implementação antiga

---

## 🎉 Migração Concluída

A migração do Google Ads manual para o Google Tag Manager foi concluída com sucesso!

**Status:** ✅ Pronto para configuração de tags no painel do GTM

**Próximo passo:** Acessar o painel do GTM e configurar as tags de conversão e analytics.
