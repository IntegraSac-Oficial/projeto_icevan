# 🔧 Configurar Rota do Tunnel Existente

**Data**: 04/03/2026  
**Situação**: Tunnel já existe no Cloudflare, mas falta configurar a rota pública  
**Tunnel ID**: `22839b9b-3ee6-4251-9227-c44802f8b038`

---

## ✅ O QUE JÁ ESTÁ CONFIGURADO

1. ✅ Tunnel criado no Cloudflare Zero Trust
2. ✅ Tunnel ID: `22839b9b-3ee6-4251-9227-c44802f8b038`
3. ✅ DNS CNAME configurado: `22839b9b-3ee6-4251-9227-c44802f8b038.cfargotunnel.com`
4. ✅ Cloudflared instalado no Docker Swarm com Wireguard

---

## ❌ O QUE FALTA

### Configurar a Rota Pública (Public Hostname)

Você precisa adicionar uma rota no tunnel para que ele saiba para onde encaminhar o tráfego de `icevanisolamento.com.br`.

---

## 🚀 SOLUÇÃO: Adicionar Rota Pública

### Passo 1: Acessar o Tunnel no Cloudflare

1. Acesse: https://one.dash.cloudflare.com/
2. Faça login
3. No menu lateral, vá em: **Networks** → **Tunnels**
4. Você verá o tunnel: `integrate-Arly-Curanilahue` (ID: 22839b9b...)
5. Clique no tunnel para abrir

### Passo 2: Verificar se Há Rotas Configuradas

Na tela do tunnel, procure pela seção **Public Hostname**.

**Se NÃO houver nenhuma rota** ou se a rota existente estiver incorreta:

1. Clique em **Add a public hostname** (ou **Edit** se já existir)

### Passo 3: Configurar a Rota

Configure assim:

| Campo | Valor |
|-------|-------|
| **Subdomain** | (deixe vazio) |
| **Domain** | `icevanisolamento.com.br` |
| **Path** | (deixe vazio) |
| **Type** | `HTTPS` |
| **URL** | `https://192.168.100.218:9443` |

### Passo 4: Configurações Adicionais

Clique em **Additional application settings** para expandir.

**Configure:**
- **TLS Verification**: ❌ Desmarque "No TLS Verify" (ou marque se a opção for "Verify TLS")
  - Se der erro 502, volte e marque "No TLS Verify"
- **HTTP Host Header**: (deixe vazio)
- **Origin Server Name**: (deixe vazio)

### Passo 5: Salvar

Clique em **Save hostname** ou **Save**

---

## 🔍 VERIFICAR SE O TUNNEL ESTÁ ATIVO

### No Cloudflare Zero Trust

1. Vá em: **Networks** → **Tunnels**
2. Verifique o status do tunnel `integrate-Arly-Curanilahue`
3. Deve mostrar: **HEALTHY** (verde) ou **ACTIVE**

**Se mostrar "Inactive" ou "Down":**
- O cloudflared não está rodando no servidor
- Precisa iniciar o cloudflared

---

## 🖥️ INICIAR CLOUDFLARED NO SERVIDOR

Se o tunnel mostrar como "Inactive", você precisa iniciar o cloudflared.

### Opção 1: Via Docker Swarm (Recomendado)

Se você já tem o cloudflared no Docker Swarm:

```bash
ssh root@192.168.100.218

# Verificar se o serviço existe
docker service ls | grep cloudflared

# Se existir, verificar status
docker service ps <nome-do-servico>

# Se não estiver rodando, iniciar
docker service scale <nome-do-servico>=1
```

### Opção 2: Via Systemd

Se você instalou como serviço do sistema:

```bash
ssh root@192.168.100.218

# Verificar se existe
systemctl list-units | grep cloudflared

# Iniciar
systemctl start cloudflared
systemctl enable cloudflared

# Verificar status
systemctl status cloudflared
```

### Opção 3: Instalar Cloudflared (Se Não Existir)

Se o cloudflared não estiver instalado:

```bash
ssh root@192.168.100.218

# Baixar
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instalar
dpkg -i cloudflared.deb

# Autenticar com o tunnel existente
cloudflared tunnel login

# Executar o tunnel
cloudflared tunnel run --token <SEU_TOKEN>
```

**Para pegar o token:**
1. No painel do Cloudflare, vá no tunnel
2. Clique em **Configure**
3. Copie o token que aparece

---

## ✅ TESTAR

### Passo 1: Aguardar 1-2 minutos

Aguarde a propagação das configurações.

### Passo 2: Verificar Status do Tunnel

No Cloudflare Zero Trust:
1. Vá em: **Networks** → **Tunnels**
2. O tunnel deve mostrar: **HEALTHY** (verde)

### Passo 3: Acessar o Site

Abra o navegador e acesse:

```
https://icevanisolamento.com.br
```

**Resultado esperado**: O site deve carregar! 🎉

---

## 🔍 TROUBLESHOOTING

### Problema 1: Tunnel mostra "Inactive"

**Causa**: cloudflared não está rodando no servidor.

**Solução**:
```bash
ssh root@192.168.100.218

# Verificar serviços Docker
docker service ls | grep cloudflared

# Verificar containers
docker ps | grep cloudflared

# Verificar systemd
systemctl status cloudflared
```

### Problema 2: "502 Bad Gateway"

**Causa**: Tunnel não consegue conectar ao Traefik.

**Solução 1**: Verificar se a URL está correta
- Deve ser: `https://192.168.100.218:9443`
- NÃO: `http://192.168.100.218:9080`

**Solução 2**: Desabilitar verificação TLS
1. Edite a rota no Cloudflare
2. Marque: **No TLS Verify**
3. Salve

**Solução 3**: Verificar se Traefik está rodando
```bash
ssh root@192.168.100.218
docker ps | grep traefik
```

### Problema 3: "no available server"

**Causa**: Rota pública não está configurada.

**Solução**: Volte ao Passo 3 e configure a rota pública.

### Problema 4: "ERR_TOO_MANY_REDIRECTS"

**Causa**: Configuração SSL incorreta no Cloudflare.

**Solução**:
1. Vá em: https://dash.cloudflare.com/
2. Selecione: `icevanisolamento.com.br`
3. Vá em: **SSL/TLS** → **Overview**
4. Mude para: **Full** (não Full Strict)

---

## 📊 CONFIGURAÇÃO ESPERADA

### No Cloudflare Zero Trust

**Tunnel:**
- Nome: `integrate-Arly-Curanilahue`
- ID: `22839b9b-3ee6-4251-9227-c44802f8b038`
- Status: ✅ HEALTHY

**Public Hostname:**
- Subdomain: (vazio)
- Domain: `icevanisolamento.com.br`
- Type: HTTPS
- URL: `https://192.168.100.218:9443`
- TLS Verification: No TLS Verify

### No Cloudflare DNS

**Registro CNAME:**
- Type: CNAME
- Name: `@` ou `icevanisolamento.com.br`
- Target: `22839b9b-3ee6-4251-9227-c44802f8b038.cfargotunnel.com`
- Proxy: ✅ Proxied (nuvem laranja)

### No Servidor

**Cloudflared:**
- Status: Running
- Conectado ao tunnel: `22839b9b-3ee6-4251-9227-c44802f8b038`

---

## 🎯 RESUMO DOS PASSOS

1. ✅ Tunnel já existe (não precisa criar)
2. ✅ DNS já está configurado (não precisa alterar)
3. ❌ **FALTA**: Adicionar rota pública no tunnel
4. ❌ **FALTA**: Verificar se cloudflared está rodando

**Tempo estimado**: 5 minutos

---

## 📝 CHECKLIST

- [ ] Acessar Cloudflare Zero Trust
- [ ] Abrir o tunnel `integrate-Arly-Curanilahue`
- [ ] Adicionar/editar Public Hostname
- [ ] Configurar: `icevanisolamento.com.br` → `https://192.168.100.218:9443`
- [ ] Marcar: No TLS Verify
- [ ] Salvar
- [ ] Verificar se tunnel está HEALTHY
- [ ] Testar: https://icevanisolamento.com.br

---

## 🚀 PRÓXIMA AÇÃO

**Acesse agora**: https://one.dash.cloudflare.com/

E siga os passos acima para adicionar a rota pública.

---

**Criado em**: 04/03/2026 às 02:35  
**Prioridade**: 🔴 ALTA  
**Tempo estimado**: 5 minutos
