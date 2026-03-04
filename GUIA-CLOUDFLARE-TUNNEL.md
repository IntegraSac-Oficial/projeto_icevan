# 🌐 Guia Completo: Configurar Cloudflare Tunnel

**Data**: 04/03/2026  
**Objetivo**: Expor o site Ice Van para a internet de forma segura  
**Tempo estimado**: 15 minutos

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de ter:

- [x] Conta no Cloudflare
- [x] Domínio `icevanisolamento.com.br` adicionado no Cloudflare
- [x] Acesso SSH ao servidor (root@192.168.100.218)
- [x] Aplicação rodando no servidor (já está ✅)

---

## 🎯 PARTE 1: Criar Tunnel no Cloudflare Zero Trust

### Passo 1.1: Acessar Cloudflare Zero Trust

1. Abra o navegador
2. Acesse: https://one.dash.cloudflare.com/
3. Faça login com sua conta Cloudflare
4. Se for a primeira vez, você pode precisar criar uma "Team":
   - Nome da team: `Ice Van` (ou qualquer nome)
   - Clique em **Create team**

### Passo 1.2: Navegar até Tunnels

1. No menu lateral esquerdo, procure por: **Networks**
2. Clique em: **Tunnels**
3. Você verá uma lista de tunnels (pode estar vazia)

### Passo 1.3: Criar Novo Tunnel

1. Clique no botão: **Create a tunnel**
2. Escolha o tipo: **Cloudflared**
3. Clique em: **Next**

### Passo 1.4: Nomear o Tunnel

1. **Tunnel name**: `icevan-production`
2. Clique em: **Save tunnel**

### Passo 1.5: Copiar Comando de Instalação

Você verá uma tela com instruções de instalação. Procure por um comando parecido com:

```bash
sudo cloudflared service install eyJhIjoiYWJjMTIzLi4uIn0=
```

**IMPORTANTE**: Copie esse comando completo! Você vai precisar dele no próximo passo.

**NÃO CLIQUE EM "NEXT" AINDA!** Deixe essa aba aberta.

---

## 🖥️ PARTE 2: Instalar cloudflared no Servidor

### Passo 2.1: Conectar ao Servidor via SSH

Abra um terminal e conecte:

```bash
ssh root@192.168.100.218
```

Digite a senha quando solicitado.

### Passo 2.2: Baixar cloudflared

```bash
# Baixar o pacote .deb
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instalar
dpkg -i cloudflared.deb

# Verificar instalação
cloudflared --version
```

**Resultado esperado**: Deve mostrar a versão (ex: `cloudflared version 2024.x.x`)

### Passo 2.3: Instalar o Tunnel

Cole o comando que você copiou no Passo 1.5:

```bash
sudo cloudflared service install eyJhIjoiYWJjMTIzLi4uIn0=
```

**IMPORTANTE**: Use o comando EXATO que apareceu no seu painel do Cloudflare!

**Resultado esperado**:
```
INFO[...] Applied configuration from /etc/cloudflared/config.yml
INFO[...] Linux service for cloudflared installed successfully
```

### Passo 2.4: Verificar se o Tunnel está Rodando

```bash
systemctl status cloudflared
```

**Resultado esperado**: Deve mostrar `active (running)` em verde.

Se não estiver rodando:
```bash
systemctl start cloudflared
systemctl enable cloudflared
```

### Passo 2.5: Verificar Logs

```bash
journalctl -u cloudflared -f
```

**Resultado esperado**: Deve mostrar logs de conexão com o Cloudflare.

Pressione `Ctrl+C` para sair.

---

## 🔗 PARTE 3: Configurar Rota Pública no Cloudflare

### Passo 3.1: Voltar ao Painel do Cloudflare

Volte para a aba do navegador que você deixou aberta (Passo 1.5).

Agora você pode clicar em: **Next**

### Passo 3.2: Adicionar Public Hostname

Você verá uma tela para configurar rotas públicas.

**Configure assim:**

| Campo | Valor |
|-------|-------|
| **Subdomain** | (deixe vazio) |
| **Domain** | `icevanisolamento.com.br` |
| **Type** | `HTTPS` |
| **URL** | `https://192.168.100.218:9443` |

**Explicação:**
- **Subdomain vazio** = O site será acessível em `icevanisolamento.com.br` (sem www)
- **Type HTTPS** = Conexão segura entre Cloudflare e seu servidor
- **URL** = Endereço do Traefik no seu servidor (porta 9443 = HTTPS)

### Passo 3.3: Configurações Adicionais (Opcional)

Clique em **Additional application settings** para expandir.

**Recomendado:**
- **TLS Verification**: ✅ No TLS Verify (porque o Traefik usa certificado autoassinado)
- **HTTP Host Header**: (deixe vazio)

### Passo 3.4: Salvar

Clique em: **Save tunnel**

**Pronto!** O tunnel está configurado.

---

## 🌐 PARTE 4: Configurar DNS no Cloudflare

### Passo 4.1: Acessar DNS

1. Volte para o painel principal do Cloudflare: https://dash.cloudflare.com/
2. Selecione o domínio: `icevanisolamento.com.br`
3. No menu lateral, clique em: **DNS** → **Records**

### Passo 4.2: Verificar Registro CNAME

Procure por um registro CNAME que aponta para o tunnel.

**Deve ter algo assim:**

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| CNAME | @ | `<tunnel-id>.cfargotunnel.com` | ✅ Proxied |

**Se NÃO existir**, o Cloudflare deve ter criado automaticamente. Se não criou:

1. Clique em: **Add record**
2. **Type**: CNAME
3. **Name**: `@`
4. **Target**: `<tunnel-id>.cfargotunnel.com` (pegue o ID do tunnel no painel)
5. **Proxy status**: ✅ Proxied (nuvem laranja)
6. Clique em: **Save**

### Passo 4.3: Configurar www (Opcional)

Se você quiser que `www.icevanisolamento.com.br` também funcione:

1. Clique em: **Add record**
2. **Type**: CNAME
3. **Name**: `www`
4. **Target**: `icevanisolamento.com.br`
5. **Proxy status**: ✅ Proxied
6. Clique em: **Save**

---

## ✅ PARTE 5: Testar o Site

### Passo 5.1: Aguardar Propagação

Aguarde 1-2 minutos para o DNS propagar.

### Passo 5.2: Acessar o Site

Abra o navegador e acesse:

```
https://icevanisolamento.com.br
```

**Resultado esperado**: O site deve carregar normalmente! 🎉

### Passo 5.3: Verificar SSL

Clique no cadeado ao lado da URL no navegador.

**Deve mostrar:**
- ✅ Conexão segura
- ✅ Certificado válido (emitido pelo Cloudflare)

---

## 🔍 TROUBLESHOOTING

### Problema 1: "no available server"

**Causa**: Tunnel não está conectado.

**Solução**:
```bash
ssh root@192.168.100.218
systemctl status cloudflared
```

Se não estiver rodando:
```bash
systemctl restart cloudflared
journalctl -u cloudflared -f
```

### Problema 2: "ERR_TOO_MANY_REDIRECTS"

**Causa**: Configuração SSL incorreta.

**Solução**:
1. Vá em: **SSL/TLS** → **Overview** no Cloudflare
2. Mude para: **Full** (não Full Strict)

### Problema 3: "502 Bad Gateway"

**Causa**: Cloudflare não consegue conectar ao servidor.

**Solução**:
1. Verifique se a aplicação está rodando:
   ```bash
   ssh root@192.168.100.218
   docker ps | grep zc4gck0k4wgkksk00scgo8cc
   ```
2. Verifique se o Traefik está rodando:
   ```bash
   docker ps | grep traefik
   ```
3. Verifique a URL no tunnel (deve ser `https://192.168.100.218:9443`)

### Problema 4: Site não carrega

**Causa**: DNS não propagou ou está incorreto.

**Solução**:
1. Verifique o DNS:
   ```bash
   nslookup icevanisolamento.com.br
   ```
2. Deve resolver para IPs do Cloudflare (não 192.168.x.x)
3. Se resolver para 192.168.x.x, o registro CNAME está errado

---

## 📊 VERIFICAÇÃO FINAL

Execute estes comandos para verificar se tudo está OK:

### No Servidor
```bash
ssh root@192.168.100.218

# 1. Cloudflared está rodando?
systemctl status cloudflared

# 2. Aplicação está rodando?
docker ps | grep zc4gck0k4wgkksk00scgo8cc

# 3. Traefik está rodando?
docker ps | grep traefik

# 4. Teste local
curl -H "Host: icevanisolamento.com.br" http://localhost:9080
```

### No Navegador
1. Acesse: https://icevanisolamento.com.br
2. Deve carregar o site ✅
3. Verifique o SSL (cadeado verde) ✅

---

## 🎯 CHECKLIST COMPLETO

### Cloudflare Zero Trust
- [ ] Conta criada
- [ ] Team criada (se necessário)
- [ ] Tunnel criado (`icevan-production`)
- [ ] Comando de instalação copiado

### Servidor
- [ ] cloudflared instalado
- [ ] Tunnel instalado com o comando
- [ ] Serviço cloudflared rodando
- [ ] Logs mostram conexão ativa

### Cloudflare Tunnel
- [ ] Public hostname configurado
- [ ] Domain: `icevanisolamento.com.br`
- [ ] Type: HTTPS
- [ ] URL: `https://192.168.100.218:9443`
- [ ] TLS Verification: No TLS Verify

### Cloudflare DNS
- [ ] Registro CNAME existe
- [ ] Aponta para `<tunnel-id>.cfargotunnel.com`
- [ ] Proxy ativado (nuvem laranja)
- [ ] www configurado (opcional)

### Teste Final
- [ ] Site carrega em: https://icevanisolamento.com.br
- [ ] SSL válido (cadeado verde)
- [ ] Sem erros no console do navegador

---

## 📝 INFORMAÇÕES TÉCNICAS

### Tunnel
- **Nome**: `icevan-production`
- **Tipo**: Cloudflared
- **Protocolo**: HTTPS

### Rota
- **Origem**: `https://icevanisolamento.com.br`
- **Destino**: `https://192.168.100.218:9443`
- **Proxy**: Cloudflare

### Servidor
- **IP**: 192.168.100.218
- **Traefik HTTP**: 9080
- **Traefik HTTPS**: 9443
- **Aplicação**: 3000 (interna)

---

## 🚀 PRÓXIMOS PASSOS (Após Configurar)

1. ✅ Testar todas as páginas do site
2. ✅ Testar formulário de contato
3. ✅ Verificar imagens carregando
4. ✅ Testar área administrativa
5. ✅ Configurar backup automático
6. ✅ Configurar monitoramento

---

## 💡 DICAS

### Dica 1: Múltiplos Domínios
Se você quiser adicionar mais domínios (ex: `www.icevanisolamento.com.br`):
1. Vá no tunnel
2. Clique em **Edit**
3. Adicione outro **Public hostname**

### Dica 2: Logs do Tunnel
Para ver logs em tempo real:
```bash
journalctl -u cloudflared -f
```

### Dica 3: Reiniciar Tunnel
Se precisar reiniciar:
```bash
systemctl restart cloudflared
```

### Dica 4: Desinstalar Tunnel
Se precisar remover:
```bash
cloudflared service uninstall
apt remove cloudflared
```

---

## 🔐 SEGURANÇA

O Cloudflare Tunnel é seguro porque:

1. ✅ Não expõe o IP do servidor
2. ✅ Não precisa abrir portas no firewall
3. ✅ Conexão criptografada (TLS)
4. ✅ Proteção DDoS do Cloudflare
5. ✅ WAF (Web Application Firewall) do Cloudflare

---

## 📞 SUPORTE

Se tiver problemas:

1. **Documentação oficial**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
2. **Comunidade**: https://community.cloudflare.com/
3. **Status do Cloudflare**: https://www.cloudflarestatus.com/

---

**Criado em**: 04/03/2026  
**Versão**: 1.0  
**Status**: ✅ Pronto para uso
