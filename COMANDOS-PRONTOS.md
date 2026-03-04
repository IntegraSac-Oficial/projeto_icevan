# 🚀 Comandos Prontos - Configurar Cloudflare Tunnel

**Copie e cole estes comandos na ordem**

---

## 📋 PARTE 1: No Cloudflare (Manual)

1. Acesse: https://one.dash.cloudflare.com/
2. Vá em: **Networks** → **Tunnels**
3. Clique em: **Create a tunnel**
4. Escolha: **Cloudflared**
5. Nome: `icevan-production`
6. Clique em: **Save tunnel**
7. **COPIE O COMANDO** que aparece (algo como `sudo cloudflared service install eyJ...`)
8. **NÃO FECHE A ABA** ainda!

---

## 🖥️ PARTE 2: No Servidor (SSH)

### Passo 1: Conectar ao Servidor
```bash
ssh root@192.168.100.218
```

### Passo 2: Baixar e Instalar cloudflared
```bash
# Baixar
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instalar
dpkg -i cloudflared.deb

# Verificar
cloudflared --version
```

### Passo 3: Instalar o Tunnel
**IMPORTANTE**: Use o comando que você copiou do Cloudflare no Passo 1!

```bash
# Cole aqui o comando do Cloudflare (exemplo):
sudo cloudflared service install eyJhIjoiYWJjMTIzLi4uIn0=
```

### Passo 4: Iniciar e Verificar
```bash
# Iniciar serviço
systemctl start cloudflared
systemctl enable cloudflared

# Verificar status
systemctl status cloudflared

# Ver logs (Ctrl+C para sair)
journalctl -u cloudflared -f
```

**Resultado esperado**: Deve mostrar `active (running)` em verde

---

## 🔗 PARTE 3: Configurar Rota no Cloudflare (Manual)

Volte para a aba do Cloudflare que você deixou aberta.

1. Clique em: **Next**
2. Configure a rota:
   - **Subdomain**: (deixe vazio)
   - **Domain**: `icevanisolamento.com.br`
   - **Type**: `HTTPS`
   - **URL**: `https://192.168.100.218:9443`
3. Clique em: **Additional application settings**
4. **TLS Verification**: Marque **No TLS Verify**
5. Clique em: **Save tunnel**

---

## 🌐 PARTE 4: Verificar DNS no Cloudflare (Manual)

1. Acesse: https://dash.cloudflare.com/
2. Selecione: `icevanisolamento.com.br`
3. Vá em: **DNS** → **Records**
4. Verifique se existe um registro CNAME:
   - **Type**: CNAME
   - **Name**: `@`
   - **Target**: `<tunnel-id>.cfargotunnel.com`
   - **Proxy**: ✅ Proxied (nuvem laranja)

**Se não existir**, adicione:
1. Clique em: **Add record**
2. **Type**: CNAME
3. **Name**: `@`
4. **Target**: (pegue do painel do tunnel)
5. **Proxy**: ✅ Proxied
6. Clique em: **Save**

---

## ✅ PARTE 5: Testar

### Aguardar 1-2 minutos, depois:

```bash
# Teste 1: Verificar DNS
nslookup icevanisolamento.com.br

# Teste 2: Verificar tunnel no servidor
ssh root@192.168.100.218
systemctl status cloudflared
```

### No navegador:
```
https://icevanisolamento.com.br
```

**Deve carregar o site!** 🎉

---

## 🔍 COMANDOS DE DIAGNÓSTICO

### Se algo der errado, use estes comandos:

```bash
# Conectar ao servidor
ssh root@192.168.100.218

# Verificar se cloudflared está rodando
systemctl status cloudflared

# Ver logs do cloudflared
journalctl -u cloudflared -n 50

# Reiniciar cloudflared
systemctl restart cloudflared

# Verificar se aplicação está rodando
docker ps | grep zc4gck0k4wgkksk00scgo8cc

# Verificar se Traefik está rodando
docker ps | grep traefik

# Testar aplicação localmente
curl -H "Host: icevanisolamento.com.br" http://localhost:9080

# Ver logs da aplicação
docker logs zc4gck0k4wgkksk00scgo8cc-012316639698 --tail 50
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Problema: "no available server"
```bash
ssh root@192.168.100.218
systemctl restart cloudflared
journalctl -u cloudflared -f
```

### Problema: "502 Bad Gateway"
```bash
ssh root@192.168.100.218
docker ps | grep zc4gck0k4wgkksk00scgo8cc
docker ps | grep traefik
```

### Problema: Site não carrega
```bash
# Verificar DNS
nslookup icevanisolamento.com.br

# Deve resolver para IPs do Cloudflare (não 192.168.x.x)
```

---

## 📊 CHECKLIST RÁPIDO

- [ ] Tunnel criado no Cloudflare
- [ ] cloudflared instalado no servidor
- [ ] Tunnel instalado com comando do Cloudflare
- [ ] Serviço cloudflared rodando
- [ ] Rota configurada (HTTPS → 192.168.100.218:9443)
- [ ] DNS CNAME configurado
- [ ] Site carrega em: https://icevanisolamento.com.br

---

## 🎯 RESUMO DOS COMANDOS

```bash
# 1. Conectar
ssh root@192.168.100.218

# 2. Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared.deb

# 3. Instalar tunnel (use o comando do Cloudflare)
sudo cloudflared service install <SEU_TOKEN>

# 4. Iniciar
systemctl start cloudflared
systemctl enable cloudflared

# 5. Verificar
systemctl status cloudflared
```

**Pronto!** Agora configure a rota no Cloudflare e teste o site.

---

**Criado em**: 04/03/2026  
**Tempo estimado**: 15 minutos
