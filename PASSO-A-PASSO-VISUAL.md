# 🎯 Passo a Passo Visual - Configurar Rota do Tunnel

**Tempo estimado**: 5 minutos  
**Dificuldade**: Fácil

---

## 📋 SITUAÇÃO ATUAL

Você já tem:
- ✅ Tunnel criado: `integrate-Arly-Curanilahue`
- ✅ Tunnel ID: `22839b9b-3ee6-4251-9227-c44802f8b038`
- ✅ DNS configurado

**Falta apenas**: Adicionar a rota pública (Public Hostname)

---

## 🚀 PASSO 1: Acessar o Tunnel

1. Acesse: https://one.dash.cloudflare.com/
2. No menu lateral esquerdo, clique em: **Networks**
3. Clique em: **Tunnels**
4. Você verá o tunnel: **integrate-Arly-Curanilahue**
5. Clique no nome do tunnel para abrir

---

## 🔗 PASSO 2: Adicionar Rota Pública

Na tela do tunnel, você verá uma seção chamada **Public Hostname**.

### Se NÃO houver nenhuma rota:
1. Clique no botão: **Add a public hostname**

### Se JÁ houver uma rota:
1. Verifique se está configurada para `icevanisolamento.com.br`
2. Se não estiver, clique em **Edit** (ícone de lápis)
3. Ou clique em **Add a public hostname** para adicionar outra

---

## ⚙️ PASSO 3: Configurar a Rota

Preencha os campos assim:

```
┌─────────────────────────────────────────────────────────────┐
│ Public hostname                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Subdomain:  [________________]  (deixe vazio)               │
│                                                              │
│ Domain:     [icevanisolamento.com.br ▼]                     │
│                                                              │
│ Path:       [________________]  (deixe vazio)               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Service                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Type:       [HTTPS ▼]                                       │
│                                                              │
│ URL:        [https://192.168.100.218:9443]                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**IMPORTANTE**:
- Subdomain: VAZIO (não coloque nada)
- Domain: `icevanisolamento.com.br`
- Type: `HTTPS` (não HTTP)
- URL: `https://192.168.100.218:9443` (porta 9443, não 9080)

---

## 🔧 PASSO 4: Configurações Adicionais

Clique em **Additional application settings** para expandir.

Procure por: **TLS Verification**

**Marque a opção**: ☑️ **No TLS Verify**

(Isso é necessário porque o Traefik usa certificado autoassinado)

---

## 💾 PASSO 5: Salvar

Clique no botão: **Save hostname** ou **Save**

Aguarde a confirmação (deve aparecer uma mensagem de sucesso).

---

## ✅ PASSO 6: Verificar Status do Tunnel

Volte para a lista de tunnels:
1. Clique em **Tunnels** no menu lateral
2. Verifique o status do tunnel `integrate-Arly-Curanilahue`

**Status esperado**: 
- 🟢 **HEALTHY** (verde)
- ou **ACTIVE**

**Se mostrar "Inactive" ou "Down"**:
- O cloudflared não está rodando no servidor
- Veja o arquivo: `CONFIGURAR-ROTA-TUNNEL-EXISTENTE.md` (seção "Iniciar Cloudflared")

---

## 🌐 PASSO 7: Testar o Site

Aguarde 1-2 minutos para as configurações propagarem.

Depois, abra o navegador e acesse:

```
https://icevanisolamento.com.br
```

**Resultado esperado**: O site deve carregar! 🎉

---

## 🔍 SE NÃO FUNCIONAR

### Erro: "502 Bad Gateway"

**Solução 1**: Verificar se marcou "No TLS Verify"
1. Volte para a rota no Cloudflare
2. Clique em **Edit**
3. Expanda **Additional application settings**
4. Marque: ☑️ **No TLS Verify**
5. Salve

**Solução 2**: Verificar se a URL está correta
- Deve ser: `https://192.168.100.218:9443`
- Porta: `9443` (HTTPS do Traefik)

### Erro: "no available server"

**Causa**: Rota não foi salva corretamente.

**Solução**: Repita os passos 2-5.

### Erro: "ERR_TOO_MANY_REDIRECTS"

**Solução**: Configurar SSL no Cloudflare
1. Acesse: https://dash.cloudflare.com/
2. Selecione: `icevanisolamento.com.br`
3. Vá em: **SSL/TLS** → **Overview**
4. Mude para: **Full** (não Full Strict)

### Tunnel mostra "Inactive"

**Causa**: cloudflared não está rodando.

**Solução**: Veja o arquivo `CONFIGURAR-ROTA-TUNNEL-EXISTENTE.md`

---

## 📊 RESUMO VISUAL

```
ANTES (Não funciona):
Internet → Cloudflare → ❌ SEM ROTA ❌ → Servidor

DEPOIS (Funciona):
Internet → Cloudflare → Tunnel → https://192.168.100.218:9443 → Traefik → App
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] Acessei Cloudflare Zero Trust
- [ ] Abri o tunnel `integrate-Arly-Curanilahue`
- [ ] Cliquei em "Add a public hostname"
- [ ] Configurei:
  - [ ] Subdomain: (vazio)
  - [ ] Domain: `icevanisolamento.com.br`
  - [ ] Type: `HTTPS`
  - [ ] URL: `https://192.168.100.218:9443`
- [ ] Marquei: "No TLS Verify"
- [ ] Salvei
- [ ] Tunnel está HEALTHY
- [ ] Testei: https://icevanisolamento.com.br

---

## 🎯 VALORES EXATOS PARA COPIAR

**Copie e cole estes valores exatamente:**

```
Subdomain: (deixe vazio)
Domain: icevanisolamento.com.br
Path: (deixe vazio)
Type: HTTPS
URL: https://192.168.100.218:9443
```

**Configurações adicionais:**
```
TLS Verification: No TLS Verify (marcar)
```

---

## 📞 INFORMAÇÕES TÉCNICAS

### Tunnel
- **Nome**: integrate-Arly-Curanilahue
- **ID**: 22839b9b-3ee6-4251-9227-c44802f8b038
- **Status esperado**: HEALTHY

### Servidor
- **IP**: 192.168.100.218
- **Traefik HTTPS**: 9443
- **Traefik HTTP**: 9080

### Aplicação
- **Container**: zc4gck0k4wgkksk00scgo8cc-012316639698
- **Porta interna**: 3000

---

## 🚀 PRÓXIMA AÇÃO

**Acesse agora**: https://one.dash.cloudflare.com/

E siga os 7 passos acima.

**Tempo total**: 5 minutos

---

**Criado em**: 04/03/2026 às 02:40  
**Dificuldade**: ⭐ Fácil  
**Tempo**: ⏱️ 5 minutos
