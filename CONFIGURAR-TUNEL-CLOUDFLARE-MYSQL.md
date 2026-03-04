# 🔧 Configurar Túnel Cloudflare para MySQL

## 📋 Informações do Servidor MySQL

### Servidor Coolify:
- **IP:** `192.168.100.218`
- **Porta MySQL:** `3306`
- **Container:** `gsgcc8sgw0sooows4sw84s80`

### Credenciais MySQL:
- **Host:** `gsgcc8sgw0sooows4sw84s80` (nome do container)
- **Porta:** `3306`
- **Usuário:** `root`
- **Senha:** `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`
- **Banco de Dados:** `default`

---

## 🌐 Passo 1: Criar Túnel no Cloudflare Zero Trust

### 1.1 Acessar Cloudflare Zero Trust
1. Acesse: https://one.dash.cloudflare.com/
2. Faça login na sua conta
3. Selecione sua conta/organização

### 1.2 Criar Novo Túnel
1. No menu lateral, vá em: **Access** > **Tunnels**
2. Clique em **Create a tunnel**
3. Escolha **Cloudflared**
4. Dê um nome: `mysql-icevan` (ou o nome que preferir)
5. Clique em **Save tunnel**

### 1.3 Instalar Connector (Se Necessário)
Se você ainda não tem o cloudflared instalado no servidor:

```bash
# No servidor Coolify (192.168.100.218)
# Copie o comando que aparece na tela do Cloudflare
# Exemplo:
sudo cloudflared service install <seu-token-aqui>
```

---

## 🔗 Passo 2: Configurar Rota Pública

### 2.1 Adicionar Rota HTTP
Na tela de configuração do túnel:

1. **Subdomain:** `phpmyadmin-icevan` (ou o nome que preferir)
2. **Domain:** Selecione seu domínio (ex: `icevanisolamento.com.br`)
3. **Type:** `HTTP`
4. **URL:** `192.168.100.218:8090`

**Resultado:** `phpmyadmin-icevan.icevanisolamento.com.br` → PHPMyAdmin local

### OU

### 2.2 Adicionar Rota TCP (Acesso Direto ao MySQL)
Se você quiser acessar o MySQL diretamente (não recomendado por segurança):

1. **Subdomain:** `mysql-icevan`
2. **Domain:** Selecione seu domínio
3. **Type:** `TCP`
4. **URL:** `192.168.100.218:3306`

---

## 🎯 Opção Recomendada: PHPMyAdmin via Túnel

### Por que essa é a melhor opção:

1. ✅ Mais seguro (não expõe MySQL diretamente)
2. ✅ Interface visual (PHPMyAdmin)
3. ✅ Fácil de usar
4. ✅ Não precisa configurar cliente MySQL

### Configuração Completa:

```
Túnel Cloudflare:
├─ Nome: mysql-icevan
├─ Subdomain: phpmyadmin-icevan
├─ Domain: icevanisolamento.com.br
├─ Type: HTTP
└─ URL: 192.168.100.218:8090

Resultado:
https://phpmyadmin-icevan.icevanisolamento.com.br
```

---

## 🔐 Passo 3: Configurar Acesso (Opcional mas Recomendado)

### 3.1 Adicionar Política de Acesso
Para proteger o PHPMyAdmin:

1. No Cloudflare Zero Trust, vá em: **Access** > **Applications**
2. Clique em **Add an application**
3. Escolha **Self-hosted**
4. Configure:
   - **Application name:** `PHPMyAdmin Ice Van`
   - **Subdomain:** `phpmyadmin-icevan`
   - **Domain:** `icevanisolamento.com.br`
5. Em **Policies**, adicione:
   - **Policy name:** `Apenas você`
   - **Action:** `Allow`
   - **Include:** `Emails` → Adicione seu email
6. Salve

**Resultado:** Só você consegue acessar o PHPMyAdmin

---

## 📝 Passo 4: Testar Acesso

### 4.1 Acessar PHPMyAdmin
1. Abra: `https://phpmyadmin-icevan.icevanisolamento.com.br`
2. Se configurou política de acesso, faça login com seu email
3. Na tela do PHPMyAdmin:
   - **Servidor:** `gsgcc8sgw0sooows4sw84s80`
   - **Usuário:** `root`
   - **Senha:** `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`

### 4.2 Verificar Banco de Dados
1. Após login, você deve ver o banco `default`
2. Clique nele para ver as tabelas
3. Verifique se as tabelas do site estão lá:
   - `settings`
   - `seo_settings`
   - `hero_banners`
   - `contacts`
   - etc.

---

## 🔍 Passo 5: Executar Script SQL (Se Necessário)

Se você ainda quiser executar o script de atualização de domínio:

1. No PHPMyAdmin, selecione o banco `default`
2. Clique na aba **SQL**
3. Copie o conteúdo de: `scripts/atualizar-dominio.sql`
4. Cole na área de texto
5. Clique em **Executar**

---

## 🚨 Troubleshooting

### Erro: "Connection refused"
- Verifique se o PHPMyAdmin local está rodando: `http://localhost:8090`
- Verifique se o túnel está ativo no Cloudflare

### Erro: "Access denied"
- Verifique se está usando as credenciais corretas
- Servidor: `gsgcc8sgw0sooows4sw84s80` (não `localhost`)

### Erro: "No route to host"
- Verifique se o IP está correto: `192.168.100.218`
- Verifique se o servidor Coolify está acessível

---

## 📊 Resumo das Configurações

### Opção 1: PHPMyAdmin via Túnel (RECOMENDADO)
```
URL Pública: https://phpmyadmin-icevan.icevanisolamento.com.br
Túnel Cloudflare:
  - Type: HTTP
  - URL: 192.168.100.218:8090
  
Login PHPMyAdmin:
  - Servidor: gsgcc8sgw0sooows4sw84s80
  - Usuário: root
  - Senha: NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
```

### Opção 2: MySQL Direto via Túnel (NÃO RECOMENDADO)
```
URL Pública: mysql-icevan.icevanisolamento.com.br:3306
Túnel Cloudflare:
  - Type: TCP
  - URL: 192.168.100.218:3306
  
Conexão MySQL:
  - Host: mysql-icevan.icevanisolamento.com.br
  - Port: 3306
  - User: root
  - Password: NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR
```

---

## ✅ Checklist

- [ ] Túnel criado no Cloudflare Zero Trust
- [ ] Rota HTTP configurada para PHPMyAdmin
- [ ] Política de acesso configurada (opcional)
- [ ] Acesso testado via navegador
- [ ] Login no PHPMyAdmin funcionando
- [ ] Banco de dados `default` visível
- [ ] Tabelas do site visíveis

---

## 🎯 Próximos Passos

Após configurar o túnel:

1. Teste o acesso ao PHPMyAdmin
2. Verifique se consegue ver as tabelas
3. Execute o script SQL se necessário
4. Teste se o site atualiza após alterações no banco

---

**Data:** 03/03/2026
**Status:** 📝 Guia pronto para configuração
