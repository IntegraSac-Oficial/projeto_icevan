# Solução: PHPMyAdmin "no available server"

## 🔍 Problema Identificado

**Erro:** "no available server"

**Causa:** O PHPMyAdmin não consegue se conectar ao banco de dados MySQL porque:
1. Eles não estão na mesma rede Docker, OU
2. As credenciais estão incorretas, OU
3. O MySQL não está aceitando conexões externas

## ✅ Solução Completa

### Opção 1: Recriar o Serviço PHPMyAdmin (RECOMENDADO)

Esta é a forma mais fácil e garantida de funcionar:

#### Passo 1: Deletar o PHPMyAdmin Atual

1. Acesse: https://coolify.integrasac.com.br
2. Faça login
3. Vá para o projeto "site-ice-van"
4. Clique em "Services"
5. Encontre "phpmyadmin-ycks8ws8wo0000kko4884s0c"
6. Clique nos 3 pontinhos (⋮) → "Delete"
7. Confirme a exclusão

#### Passo 2: Criar Novo PHPMyAdmin

1. No projeto "site-ice-van", clique em "+ Add"
2. Selecione "Service"
3. Procure por "PHPMyAdmin" ou "Database Management"
4. Clique em "PHPMyAdmin"

#### Passo 3: Configurar o Novo PHPMyAdmin

Preencha os campos:

**Nome:** `phpmyadmin-icevans`

**Database Host:** `gsgcc8sgw0sooows4sw84s80`
(Este é o UUID do seu banco MySQL)

**Database Port:** `3306`

**Root Password:** `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`

**Network:** Selecione a mesma rede do banco de dados (provavelmente "coolify")

**Port:** `80` (porta interna do container)

**Public Port:** `9080` (ou outra porta que preferir)

#### Passo 4: Deploy

1. Clique em "Save" ou "Deploy"
2. Aguarde o deploy finalizar (1-2 minutos)
3. Anote a nova URL gerada

#### Passo 5: Atualizar o arquivo hosts

1. Abra o Bloco de Notas como Administrador
2. Abra: `C:\Windows\System32\drivers\etc\hosts`
3. **Remova** a linha antiga:
   ```
   192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
   ```
4. **Adicione** a nova linha com a URL gerada:
   ```
   192.168.100.218    [NOVA-URL-AQUI].192.168.100.218.sslip.io
   ```
5. Salve o arquivo
6. Execute: `ipconfig /flushdns`

---

### Opção 2: Corrigir o PHPMyAdmin Existente

Se você preferir não recriar, pode tentar corrigir:

#### Passo 1: Editar o Docker Compose

1. Acesse o Coolify
2. Vá até o serviço PHPMyAdmin
3. Clique em "Edit" ou "Configuration"
4. Procure pela seção "Docker Compose" ou "Environment Variables"

#### Passo 2: Verificar/Corrigir as Variáveis

Certifique-se de que estas variáveis estão corretas:

```yaml
environment:
  - PMA_HOST=gsgcc8sgw0sooows4sw84s80
  - PMA_PORT=3306
  - PMA_USER=root
  - PMA_PASSWORD=NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
  - PMA_ARBITRARY=0
```

#### Passo 3: Verificar a Rede

Certifique-se de que o PHPMyAdmin está na mesma rede do MySQL:

```yaml
networks:
  - coolify
```

#### Passo 4: Redeploy

1. Salve as alterações
2. Clique em "Redeploy" ou "Restart"
3. Aguarde 1-2 minutos
4. Teste o acesso

---

### Opção 3: Usar IP Direto (Temporário)

Se você só precisa acessar rapidamente:

1. Acesse: http://192.168.100.218:9080
2. No campo "Servidor", digite: `gsgcc8sgw0sooows4sw84s80`
3. Usuário: `root`
4. Senha: `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`

---

## 🔧 Diagnóstico Avançado

Se nenhuma das opções acima funcionar, vamos diagnosticar:

### 1. Verificar se o MySQL está acessível

Via SSH no servidor:

```bash
ssh root@192.168.100.218

# Verificar se o MySQL está rodando
docker ps | grep mysql

# Tentar conectar ao MySQL
docker exec -it gsgcc8sgw0sooows4sw84s80 mysql -u root -p
# Senha: NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
```

### 2. Verificar conectividade entre containers

```bash
# Do PHPMyAdmin para o MySQL
docker exec phpmyadmin-ycks8ws8wo0000kko4884s0c ping gsgcc8sgw0sooows4sw84s80

# Testar conexão MySQL
docker exec phpmyadmin-ycks8ws8wo0000kko4884s0c nc -zv gsgcc8sgw0sooows4sw84s80 3306
```

### 3. Verificar logs do PHPMyAdmin

```bash
docker logs phpmyadmin-ycks8ws8wo0000kko4884s0c --tail 100
```

Procure por erros como:
- "Connection refused"
- "Access denied"
- "Unknown MySQL server host"

### 4. Verificar logs do MySQL

```bash
docker logs gsgcc8sgw0sooows4sw84s80 --tail 100
```

---

## 🎯 Solução Alternativa: PHPMyAdmin Local

Se você não conseguir fazer funcionar no Coolify, pode usar o PHPMyAdmin local:

### 1. Expor a porta do MySQL

No Coolify:
1. Vá até o banco de dados MySQL
2. Ative "Public Access" ou configure "Port Mapping"
3. Mapeie a porta 3306 para uma porta pública (ex: 33060)

### 2. Conectar do PHPMyAdmin local

No seu `docker-compose.yml` local, adicione:

```yaml
phpmyadmin:
  image: phpmyadmin:latest
  environment:
    PMA_HOST: 192.168.100.218
    PMA_PORT: 33060  # Porta pública que você configurou
    PMA_USER: root
    PMA_PASSWORD: NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
  ports:
    - "8091:80"
```

Depois:
```bash
docker compose up -d phpmyadmin
```

Acesse: http://localhost:8091

⚠️ **ATENÇÃO:** Expor o MySQL publicamente é um risco de segurança! Use apenas temporariamente e com senha forte.

---

## 📋 Checklist de Verificação

Antes de tentar as soluções, verifique:

- [ ] O banco MySQL está rodando (status: running:healthy)
- [ ] O PHPMyAdmin está rodando (status: running:healthy)
- [ ] Ambos estão na mesma rede Docker
- [ ] As credenciais estão corretas
- [ ] O arquivo hosts está configurado corretamente
- [ ] O cache DNS foi limpo (`ipconfig /flushdns`)
- [ ] O navegador foi recarregado (Ctrl + Shift + R)

---

## 🔐 Credenciais Corretas

**Banco de dados MySQL:**
- Host: `gsgcc8sgw0sooows4sw84s80` (nome do container)
- Porta: `3306`
- Usuário root: `root`
- Senha root: `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`
- Usuário normal: `mysql`
- Senha normal: `heNdo3onSWHXTFibfv0f2g4TdXztbDX4e1MlGmTlnms81AEAo0As0eW7gpDBCudf`
- Database: `default`

---

## 🎬 Passo a Passo Recomendado (Resumo)

1. **Delete o PHPMyAdmin atual no Coolify**
2. **Crie um novo PHPMyAdmin**
3. **Configure com as credenciais acima**
4. **Certifique-se de que está na rede "coolify"**
5. **Deploy e aguarde**
6. **Atualize o arquivo hosts com a nova URL**
7. **Limpe o cache DNS**
8. **Acesse a nova URL**

Esta é a forma mais garantida de funcionar! 🚀

---

## 📞 Se Ainda Não Funcionar

Capture estas informações e me envie:

```bash
# Status dos containers
docker ps | grep -E "mysql|phpmyadmin"

# Logs do PHPMyAdmin
docker logs phpmyadmin-ycks8ws8wo0000kko4884s0c --tail 50

# Logs do MySQL
docker logs gsgcc8sgw0sooows4sw84s80 --tail 50

# Redes Docker
docker network ls
docker network inspect coolify
```

---

**Última atualização:** 03/03/2026
**Prioridade:** Alta
**Dificuldade:** Média
