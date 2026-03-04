# Correção do PHPMyAdmin no Coolify

## 🔍 Problema Identificado

**URL que não funciona:** 
`phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080`

**Status do Serviço:** ✅ Running:Healthy

## 🐛 Causa do Problema

Analisando a configuração do docker-compose no Coolify, identifiquei o seguinte:

```yaml
traefik.http.services.http-0-ycks8ws8wo0000kko4884s0c-phpmyadmin.loadbalancer.server.port=9080
```

O problema é que o **Traefik está configurado para rotear para a porta 9080**, mas o **PHPMyAdmin está rodando internamente na porta 80** dentro do container.

### Configuração Atual (Incorreta):
- Container PHPMyAdmin: Porta interna **80**
- Traefik tentando acessar: Porta **9080**
- Resultado: ❌ Não consegue conectar

### Configuração Correta:
- Container PHPMyAdmin: Porta interna **80**
- Traefik deve acessar: Porta **80**
- URL externa: Pode usar qualquer porta (9080 está OK)

---

## ✅ Solução

### Opção 1: Corrigir via Interface do Coolify (RECOMENDADO)

1. **Acesse o Coolify:**
   - URL: https://coolify.integrasac.com.br
   - Faça login

2. **Navegue até o serviço:**
   - Vá para o projeto "site-ice-van"
   - Clique em "Services"
   - Encontre "phpmyadmin-ycks8ws8wo0000kko4884s0c"

3. **Edite a configuração:**
   - Clique em "Edit" ou "Configuration"
   - Procure pela seção de "Ports" ou "Port Mappings"
   - Certifique-se de que está configurado assim:
     - **Internal Port (Container):** 80
     - **External Port (Host):** 9080 (ou qualquer porta que preferir)

4. **Salve e Redeploy:**
   - Clique em "Save"
   - Clique em "Redeploy" ou "Restart"

5. **Teste o acesso:**
   - Aguarde 1-2 minutos
   - Acesse: http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080

### Opção 2: Corrigir via Docker Compose

Se você tiver acesso SSH ao servidor, pode editar diretamente:

1. **Conecte via SSH:**
```bash
ssh root@192.168.100.218
```

2. **Edite o docker-compose do serviço:**
```bash
cd /data/coolify/services/ycks8ws8wo0000kko4884s0c
nano docker-compose.yml
```

3. **Corrija a configuração do Traefik:**

Procure por esta linha:
```yaml
- traefik.http.services.http-0-ycks8ws8wo0000kko4884s0c-phpmyadmin.loadbalancer.server.port=9080
```

Mude para:
```yaml
- traefik.http.services.http-0-ycks8ws8wo0000kko4884s0c-phpmyadmin.loadbalancer.server.port=80
```

4. **Reinicie o serviço:**
```bash
docker compose down
docker compose up -d
```

### Opção 3: Recriar o Serviço (Se as outras opções não funcionarem)

1. **No Coolify, delete o serviço atual:**
   - Vá até o serviço PHPMyAdmin
   - Clique em "Delete"
   - Confirme a exclusão

2. **Crie um novo serviço PHPMyAdmin:**
   - Clique em "Add Service"
   - Escolha "PHPMyAdmin"
   - Configure:
     - **Database Host:** O UUID do seu banco MySQL
     - **Database Port:** 3306
     - **Root Password:** A senha do seu banco
     - **Port:** 80 (porta interna)
     - **Public Port:** 9080 (ou outra porta externa)

3. **Deploy e teste**

---

## 🔧 Configuração Correta do Docker Compose

Aqui está como deveria estar o docker-compose.yml:

```yaml
services:
  phpmyadmin:
    image: 'lscr.io/linuxserver/phpmyadmin:latest'
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Sao_Paulo
      - PMA_ARBITRARY=0
      - PMA_HOST=gsgcc8sgw0sooows4sw84s80  # UUID do banco MySQL
      - PMA_PORT=3306
      - PMA_USER=root
      - PMA_PASSWORD=NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
    volumes:
      - 'phpmyadmin-config:/config'
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://127.0.0.1:80'  # ✅ Porta correta
      interval: 2s
      timeout: 10s
      retries: 15
    labels:
      - traefik.enable=true
      - traefik.http.routers.phpmyadmin.rule=Host(`phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io`)
      - traefik.http.routers.phpmyadmin.entrypoints=web
      - traefik.http.services.phpmyadmin.loadbalancer.server.port=80  # ✅ Porta correta (não 9080!)
    networks:
      - coolify
    restart: unless-stopped

volumes:
  phpmyadmin-config:

networks:
  coolify:
    external: true
```

---

## 🧪 Como Testar

### 1. Verificar se o container está rodando:
```bash
ssh root@192.168.100.218
docker ps | grep phpmyadmin
```

**Saída esperada:**
```
phpmyadmin-ycks8ws8wo0000kko4884s0c   Up X minutes   running:healthy
```

### 2. Testar acesso interno (dentro do servidor):
```bash
curl -I http://localhost:80
```

**Saída esperada:**
```
HTTP/1.1 200 OK
```

### 3. Verificar logs do Traefik:
```bash
docker logs coolify-proxy | grep phpmyadmin
```

### 4. Testar acesso externo:
```bash
curl -I http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080
```

**Saída esperada:**
```
HTTP/1.1 200 OK
```

---

## 🔐 Credenciais de Acesso

Após corrigir, use estas credenciais:

**URL:** http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080

**Servidor:** gsgcc8sgw0sooows4sw84s80 (ou deixe em branco)

**Usuário:** root

**Senha:** NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR

---

## 🚨 Problemas Comuns Após a Correção

### 1. "502 Bad Gateway"
**Causa:** Traefik não consegue se conectar ao container

**Solução:**
```bash
# Reinicie o Traefik
docker restart coolify-proxy

# Reinicie o PHPMyAdmin
docker restart phpmyadmin-ycks8ws8wo0000kko4884s0c
```

### 2. "404 Not Found"
**Causa:** Rota do Traefik não está configurada

**Solução:**
- Verifique se o label do Traefik está correto
- Certifique-se de que o container está na mesma rede do Traefik

### 3. "Connection Refused"
**Causa:** Porta incorreta ou container não está rodando

**Solução:**
```bash
# Verificar se o container está rodando
docker ps | grep phpmyadmin

# Verificar logs
docker logs phpmyadmin-ycks8ws8wo0000kko4884s0c

# Reiniciar
docker restart phpmyadmin-ycks8ws8wo0000kko4884s0c
```

### 4. "Can't connect to MySQL server"
**Causa:** PHPMyAdmin não consegue conectar ao banco de dados

**Solução:**
- Verifique se o banco MySQL está rodando
- Verifique se o PMA_HOST está correto (UUID do banco)
- Verifique se a senha está correta

---

## 📊 Verificação Final

Execute este checklist após aplicar a correção:

- [ ] Container PHPMyAdmin está rodando (`docker ps`)
- [ ] Healthcheck está OK (status: healthy)
- [ ] Traefik está rodando (`docker ps | grep traefik`)
- [ ] Porta 80 está exposta no container
- [ ] Label do Traefik aponta para porta 80
- [ ] URL externa responde (http://phpmyadmin...sslip.io:9080)
- [ ] Login funciona com as credenciais
- [ ] Consegue ver o banco de dados

---

## 🎯 Resumo da Correção

**Problema:** Traefik configurado para porta 9080, mas PHPMyAdmin roda na porta 80

**Solução:** Mudar o label do Traefik de:
```yaml
traefik.http.services.phpmyadmin.loadbalancer.server.port=9080
```

Para:
```yaml
traefik.http.services.phpmyadmin.loadbalancer.server.port=80
```

**Resultado:** PHPMyAdmin acessível em http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080

---

## 📞 Suporte Adicional

Se após seguir todos os passos ainda não funcionar:

1. **Capture os logs:**
```bash
# Logs do PHPMyAdmin
docker logs phpmyadmin-ycks8ws8wo0000kko4884s0c > phpmyadmin.log

# Logs do Traefik
docker logs coolify-proxy > traefik.log

# Logs do MySQL
docker logs [UUID_DO_MYSQL] > mysql.log
```

2. **Verifique a configuração do Traefik:**
```bash
docker exec coolify-proxy cat /etc/traefik/traefik.yml
```

3. **Teste conectividade:**
```bash
# Do servidor para o container
docker exec coolify-proxy curl http://phpmyadmin-ycks8ws8wo0000kko4884s0c

# Do container para o MySQL
docker exec phpmyadmin-ycks8ws8wo0000kko4884s0c ping gsgcc8sgw0sooows4sw84s80
```

---

**Última atualização:** 03/03/2026
**Status:** Aguardando correção
**Prioridade:** Alta
