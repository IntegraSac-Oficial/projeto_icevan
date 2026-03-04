# 🚀 FAZER DEPLOY NO COOLIFY

**Data**: 03/03/2026  
**Aplicação**: Ice Van (UUID: zc4gck0k4wgkksk00scgo8cc)

---

## 📋 INFORMAÇÕES DO DEPLOY

### Aplicação
- **Nome**: lovely-lizard-zc4gck0k4wgkksk00scgo8cc
- **UUID**: zc4gck0k4wgkksk00scgo8cc
- **Domínio**: https://icevanisolamento.com.br
- **Servidor**: 192.168.100.218

### Repositório
- **GitHub**: https://github.com/IntegraSac-Oficial/projeto_icevan
- **Branch**: main
- **Último Commit**: 3887c44 (Migração 100% para banco de dados)

---

## 🎯 OPÇÃO 1: Deploy Automático via Webhook (Recomendado)

Se o webhook do GitHub está configurado, o Coolify já deve estar fazendo o deploy automaticamente!

### Verificar Status do Deploy:

1. Acesse: http://192.168.100.218:8000
2. Faça login no Coolify
3. Vá em "Applications" → "lovely-lizard"
4. Verifique a aba "Deployments"
5. O deploy mais recente deve estar em andamento ou concluído

---

## 🎯 OPÇÃO 2: Deploy Manual via Interface do Coolify

1. **Acesse o Coolify:**
   - URL: http://192.168.100.218:8000
   - Faça login

2. **Navegue até a aplicação:**
   - Menu lateral: "Applications"
   - Clique em "lovely-lizard-zc4gck0k4wgkksk00scgo8cc"

3. **Inicie o deploy:**
   - Clique no botão "Deploy" (canto superior direito)
   - Ou clique em "Redeploy" se já houver um deploy anterior

4. **Acompanhe o progresso:**
   - Aba "Deployments" mostra o log em tempo real
   - Aguarde até ver "Deployment successful"

---

## 🎯 OPÇÃO 3: Deploy Manual via SSH

Se preferir fazer via linha de comando:

### 1. Conecte via SSH:
```bash
ssh root@192.168.100.218
```

### 2. Force um novo deploy:
```bash
# Opção A: Via Docker (se souber o nome do serviço)
docker service update --force lovely-lizard-zc4gck0k4wgkksk00scgo8cc

# Opção B: Via Coolify CLI (se disponível)
coolify deploy zc4gck0k4wgkksk00scgo8cc

# Opção C: Trigger webhook manualmente
curl -X POST http://localhost:8000/api/v1/deploy/zc4gck0k4wgkksk00scgo8cc
```

### 3. Verifique o status:
```bash
# Ver logs do serviço
docker service logs lovely-lizard-zc4gck0k4wgkksk00scgo8cc --tail 100 --follow

# Ver status do serviço
docker service ps lovely-lizard-zc4gck0k4wgkksk00scgo8cc
```

---

## 🎯 OPÇÃO 4: Deploy via API do Coolify

Se você tiver o token da API:

```bash
# Substitua YOUR_API_TOKEN pelo token real
curl -X POST \
  http://192.168.100.218:8000/api/v1/applications/zc4gck0k4wgkksk00scgo8cc/deploy \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

---

## ✅ APÓS O DEPLOY

### 1. Verificar se o site está no ar:
```bash
curl -I https://icevanisolamento.com.br
```

Deve retornar `HTTP/2 200` (sucesso)

### 2. Popular o banco com dados iniciais:

**⚠️ IMPORTANTE: Execute isso APENAS UMA VEZ!**

```bash
# Conecte via SSH
ssh root@192.168.100.218

# Entre no container da aplicação
docker exec -it $(docker ps -q -f name=lovely-lizard) sh

# Execute o script de seed
npx tsx scripts/seed-empresa-config.ts

# Saia do container
exit
```

### 3. Acessar o admin e preencher dados:

1. Acesse: https://icevanisolamento.com.br/admin/configuracoes
2. Faça login com as credenciais do .env
3. Vá na aba "Redes & Integrações"
4. Preencha todos os campos:
   - Nome da empresa
   - Slogan
   - WhatsApp
   - Redes sociais (Instagram, Facebook, etc)
   - Endereço completo
   - Google Analytics
   - EmailJS
   - Google Maps
5. Clique em "Salvar"

### 4. Verificar no site:

- Header deve mostrar telefone e WhatsApp
- Footer deve mostrar redes sociais
- Todos os dados vindo do banco!

---

## 🔍 TROUBLESHOOTING

### Deploy não inicia:
```bash
# Verificar se o webhook está configurado
# No GitHub: Settings → Webhooks → Verificar URL e eventos

# Verificar logs do Coolify
ssh root@192.168.100.218
docker service logs coolify_coolify --tail 100
```

### Site não atualiza após deploy:
```bash
# Limpar cache do Cloudflare
# Acesse: https://dash.cloudflare.com
# Vá em "Caching" → "Purge Everything"

# Ou force reload no navegador
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

### Erro ao executar seed:
```bash
# Verificar se o banco está acessível
docker exec -it $(docker ps -q -f name=lovely-lizard) sh
npx prisma db push
exit
```

---

## 📊 MONITORAMENTO

### Ver logs em tempo real:
```bash
ssh root@192.168.100.218
docker service logs lovely-lizard-zc4gck0k4wgkksk00scgo8cc --tail 100 --follow
```

### Ver status dos serviços:
```bash
docker service ls | grep lovely-lizard
```

### Ver uso de recursos:
```bash
docker stats $(docker ps -q -f name=lovely-lizard)
```

---

## 🎉 SUCESSO!

Se tudo correu bem:
- ✅ Deploy concluído
- ✅ Site acessível em https://icevanisolamento.com.br
- ✅ Banco populado com dados iniciais
- ✅ Admin funcionando
- ✅ Configurações editáveis pelo painel

**Agora o site está 100% no banco de dados!** 🚀

---

**FIM DO GUIA**
