# Instalação da Google Ads Tag (gtag.js)

## ✅ INSTALAÇÃO CONCLUÍDA

### 📍 Arquivo Modificado

**Arquivo:** `app/layout.tsx` (linhas 267-280)

**Localização:** Layout raiz do Next.js — carrega em todas as páginas do site

---

## 📋 O Que Foi Instalado

```tsx
{/* Google Ads (gtag.js) — apenas no site público */}
{!isAdmin && (
  <>
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=AW-18056785768"
      strategy="afterInteractive"
    />
    <Script id="google-ads-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-18056785768');
      `}
    </Script>
  </>
)}
```

---

## 🎯 Características da Instalação

### ✅ Implementação Correta

1. **Global:** Instalado no layout raiz (`app/layout.tsx`)
2. **Automático:** Carrega em todas as páginas públicas automaticamente
3. **Otimizado:** Usa `strategy="afterInteractive"` do Next.js para não bloquear o carregamento
4. **Seguro:** Usa componente `<Script>` do Next.js (melhor que `<script>` HTML)
5. **Condicional:** Só carrega no site público, não no painel admin (`!isAdmin`)
6. **Sem duplicação:** Não foi copiado em páginas individuais

### 🔧 Integração com Google Analytics

- A tag do Google Ads foi instalada **logo após** o Google Analytics 4
- Ambos compartilham o mesmo `dataLayer`
- Não há conflito entre as tags
- Não há duplicação de código

---

## 🧪 Como Validar se Está Funcionando

### Método 1: Inspecionar o Código-Fonte (Mais Simples)

1. Acesse qualquer página pública do site (ex: homepage)
2. Clique com botão direito → **"Ver código-fonte da página"** (ou `Ctrl+U`)
3. Procure por `AW-18056785768` (use `Ctrl+F`)
4. Você deve encontrar:
   ```html
   <script src="https://www.googletagmanager.com/gtag/js?id=AW-18056785768" ...>
   ```

### Método 2: DevTools Console (Mais Técnico)

1. Abra o site em qualquer página pública
2. Pressione `F12` para abrir o DevTools
3. Vá na aba **Console**
4. Digite e execute:
   ```javascript
   dataLayer
   ```
5. Você deve ver um array com eventos, incluindo configurações do Google Ads

### Método 3: Network Tab (Mais Detalhado)

1. Abra o site em qualquer página pública
2. Pressione `F12` → aba **Network**
3. Recarregue a página (`F5`)
4. Procure por requisições para:
   - `googletagmanager.com/gtag/js?id=AW-18056785768`
   - `google-analytics.com/g/collect` (com parâmetro `tid=AW-18056785768`)
5. Se aparecerem, a tag está carregando corretamente

### Método 4: Google Tag Assistant (Recomendado)

1. Instale a extensão **Google Tag Assistant** no Chrome
2. Acesse o site
3. Clique no ícone da extensão
4. Você deve ver:
   - ✅ Google Ads Conversion Tracking (AW-18056785768)
   - Status: **Working**

### Método 5: Google Ads (Verificação Oficial)

1. Acesse sua conta do **Google Ads**
2. Vá em **Ferramentas e Configurações** → **Medição** → **Conversões**
3. Clique na tag de conversão
4. Verifique o status da tag:
   - 🟢 **"Tag detectada"** = Funcionando
   - 🔴 **"Tag não detectada"** = Problema

---

## ⚠️ Verificações Importantes

### ✅ O Que Verificar

- [ ] Tag carrega em **todas as páginas públicas** (home, empresa, contato, aplicações, etc.)
- [ ] Tag **NÃO carrega** no painel admin (`/admin/*`)
- [ ] Não há erros no console do navegador
- [ ] Requisições para `googletagmanager.com` aparecem no Network
- [ ] `dataLayer` está definido no console

### ❌ O Que NÃO Deve Acontecer

- ❌ Tag duplicada (aparece 2x no código-fonte)
- ❌ Tag carrega no painel admin
- ❌ Erros de JavaScript no console
- ❌ Tag bloqueia o carregamento da página

---

## 📊 Próximos Passos (Futuro)

Após validar que a tag base está funcionando, você pode:

1. **Configurar conversões** no Google Ads
2. **Criar eventos personalizados** (ex: clique no WhatsApp, envio de formulário)
3. **Configurar remarketing**
4. **Adicionar parâmetros de conversão**

**Mas por enquanto, apenas a tag base está instalada conforme solicitado.**

---

## 🔍 Troubleshooting

### Problema: Tag não aparece no código-fonte

**Solução:**
1. Limpe o cache do navegador (`Ctrl+Shift+Delete`)
2. Reinicie o servidor Next.js local
3. Verifique se está acessando uma página pública (não `/admin`)

### Problema: Erro no console

**Solução:**
1. Verifique se há bloqueadores de anúncios ativos
2. Teste em modo anônimo do navegador
3. Verifique se o ID `AW-18056785768` está correto

### Problema: Tag não detectada no Google Ads

**Solução:**
1. Aguarde até 24 horas após o deploy
2. Verifique se o site está acessível publicamente
3. Teste com o Google Tag Assistant

---

## 📝 Resumo Técnico

| Item | Valor |
|------|-------|
| **Arquivo modificado** | `app/layout.tsx` |
| **Linhas adicionadas** | 267-280 |
| **ID do Google Ads** | AW-18056785768 |
| **Estratégia de carregamento** | `afterInteractive` |
| **Escopo** | Todas as páginas públicas |
| **Exclusões** | Painel admin (`/admin/*`) |
| **Integração** | Compartilha `dataLayer` com GA4 |
| **Duplicação** | Nenhuma |

---

## ✅ Checklist de Validação

Antes de considerar concluído, verifique:

- [x] Tag instalada no arquivo correto (`app/layout.tsx`)
- [x] Tag carrega apenas no site público (não no admin)
- [x] Usa componente `<Script>` do Next.js
- [x] Usa `strategy="afterInteractive"`
- [x] ID correto: `AW-18056785768`
- [x] Não há duplicação de código
- [ ] **Testado localmente** (você precisa testar)
- [ ] **Testado em produção** (após deploy)
- [ ] **Validado no Google Ads** (após 24h do deploy)

---

## 🚀 Deploy

Após validar localmente:

1. Faça commit: `git add app/layout.tsx`
2. Commit: `git commit -m "feat: adicionar Google Ads tag (AW-18056785768)"`
3. Push: `git push origin main`
4. Aguarde o deploy no Coolify
5. Valide em produção usando os métodos acima

---

**Data de instalação:** 2026-03-23  
**Instalado por:** Kiro AI  
**Status:** ✅ Pronto para teste e deploy
