# Configurar Arquivo Hosts para Acessar PHPMyAdmin do Coolify

## 🎯 Problema

Você está tentando acessar:
`phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080`

Mas recebe o erro: **Bad Gateway**

## 🔍 Causa

O domínio `.sslip.io` não está sendo resolvido corretamente pelo seu computador. Precisamos adicionar uma entrada manual no arquivo `hosts` do Windows.

---

## ✅ Solução: Editar o Arquivo Hosts

### Passo 1: Abrir o Bloco de Notas como Administrador

1. Pressione a tecla **Windows**
2. Digite: `notepad`
3. Clique com o botão direito em "Bloco de notas"
4. Selecione **"Executar como administrador"**
5. Clique em **"Sim"** na janela de confirmação

### Passo 2: Abrir o Arquivo Hosts

1. No Bloco de Notas, clique em **Arquivo** → **Abrir**
2. Navegue até a pasta:
   ```
   C:\Windows\System32\drivers\etc
   ```
3. No campo "Tipo de arquivo", mude de "Documentos de Texto (*.txt)" para **"Todos os Arquivos (*.*)"**
4. Selecione o arquivo chamado **hosts** (sem extensão)
5. Clique em **Abrir**

### Passo 3: Adicionar a Entrada

Role até o final do arquivo e adicione esta linha:

```
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

**O arquivo deve ficar assim no final:**

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# ... (outras linhas) ...

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost

# Entrada para PHPMyAdmin do Coolify
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

### Passo 4: Salvar o Arquivo

1. Clique em **Arquivo** → **Salvar**
2. Feche o Bloco de Notas

### Passo 5: Limpar o Cache DNS

Abra o **Prompt de Comando** como Administrador e execute:

```cmd
ipconfig /flushdns
```

Você deve ver a mensagem:
```
Configuração de IP do Windows
Cache do DNS Resolver liberado com êxito.
```

### Passo 6: Testar o Acesso

1. Abra seu navegador
2. Acesse: http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080
3. Aguarde carregar (pode demorar alguns segundos na primeira vez)

---

## 🔐 Credenciais de Acesso

Quando a página carregar, use:

**Servidor:** Deixe em branco ou use `gsgcc8sgw0sooows4sw84s80`

**Usuário:** `root`

**Senha:** `NGPHLQR5SwAwFjzBjHcgPBlY3J3J9XI3o5WhWZ1wCYmtiupKfuht6WAxSUmDX7KR`

---

## 🎬 Passo a Passo em Vídeo (Texto)

### 1. Abrir Notepad como Admin
```
Windows Key → Digite "notepad" → Botão Direito → "Executar como administrador"
```

### 2. Abrir o arquivo hosts
```
Arquivo → Abrir → C:\Windows\System32\drivers\etc → Mostrar "Todos os Arquivos" → hosts → Abrir
```

### 3. Adicionar no final do arquivo
```
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

### 4. Salvar
```
Arquivo → Salvar → Fechar
```

### 5. Limpar DNS
```
Windows Key → Digite "cmd" → Botão Direito → "Executar como administrador"
ipconfig /flushdns
```

### 6. Acessar
```
Navegador → http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080
```

---

## ⚠️ Problemas Comuns

### 1. "Acesso Negado" ao salvar o arquivo hosts

**Causa:** Você não abriu o Bloco de Notas como Administrador

**Solução:**
- Feche o Bloco de Notas
- Abra novamente como Administrador (botão direito → "Executar como administrador")

### 2. Não consigo ver o arquivo "hosts"

**Causa:** O filtro de tipo de arquivo está errado

**Solução:**
- Na janela "Abrir", mude o filtro de "Documentos de Texto (*.txt)" para "Todos os Arquivos (*.*)"

### 3. Ainda recebo "Bad Gateway" após adicionar

**Possíveis causas e soluções:**

#### a) Cache DNS não foi limpo
```cmd
ipconfig /flushdns
```

#### b) Navegador com cache
- Pressione **Ctrl + Shift + R** para recarregar sem cache
- Ou feche e abra o navegador novamente

#### c) Entrada no hosts está errada
Verifique se a linha está exatamente assim (sem espaços extras):
```
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

#### d) Servidor Coolify está offline
Verifique se o servidor está acessível:
```cmd
ping 192.168.100.218
```

### 4. "Este site não pode ser acessado"

**Causa:** O IP está incorreto ou o servidor está offline

**Solução:**
- Verifique se o servidor 192.168.100.218 está ligado
- Teste o ping: `ping 192.168.100.218`
- Verifique se o serviço está rodando no Coolify

### 5. Página carrega mas não consigo fazer login

**Causa:** Credenciais incorretas ou banco de dados offline

**Solução:**
- Use as credenciais fornecidas acima
- Verifique se o banco MySQL está rodando no Coolify

---

## 🧪 Testes de Verificação

### Teste 1: Verificar se o hosts foi editado corretamente
```cmd
type C:\Windows\System32\drivers\etc\hosts
```

Você deve ver a linha:
```
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

### Teste 2: Verificar resolução DNS
```cmd
nslookup phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

Deve retornar o IP: `192.168.100.218`

### Teste 3: Verificar conectividade
```cmd
ping 192.168.100.218
```

Deve receber respostas do servidor.

### Teste 4: Verificar porta
```cmd
telnet 192.168.100.218 9080
```

Se conectar, a porta está aberta. Se não tiver o telnet instalado:
```cmd
Test-NetConnection -ComputerName 192.168.100.218 -Port 9080
```

---

## 🔄 Para Remover a Entrada (Opcional)

Se no futuro você quiser remover a entrada:

1. Abra o Bloco de Notas como Administrador
2. Abra o arquivo hosts
3. Delete ou comente (adicione # no início) a linha:
   ```
   # 192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
   ```
4. Salve o arquivo
5. Execute: `ipconfig /flushdns`

---

## 📱 Acessar de Outros Dispositivos

Se você quiser acessar o PHPMyAdmin de outro computador ou celular na mesma rede:

### Opção 1: Usar o IP diretamente
```
http://192.168.100.218:9080
```

### Opção 2: Adicionar entrada no hosts do outro dispositivo

**Windows:** Mesmo processo acima

**Mac/Linux:**
```bash
sudo nano /etc/hosts
```

Adicione:
```
192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
```

Salve: `Ctrl + O`, `Enter`, `Ctrl + X`

**Android/iOS:** Requer root/jailbreak (não recomendado)

---

## 🎯 Resumo Rápido

1. **Abrir Notepad como Admin**
2. **Abrir:** `C:\Windows\System32\drivers\etc\hosts`
3. **Adicionar no final:**
   ```
   192.168.100.218    phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io
   ```
4. **Salvar e fechar**
5. **Executar:** `ipconfig /flushdns`
6. **Acessar:** http://phpmyadmin-ycks8ws8wo0000kko4884s0c.192.168.100.218.sslip.io:9080

---

## ✅ Checklist Final

- [ ] Abri o Bloco de Notas como Administrador
- [ ] Abri o arquivo hosts corretamente
- [ ] Adicionei a linha com o IP e domínio
- [ ] Salvei o arquivo
- [ ] Executei `ipconfig /flushdns`
- [ ] Recarreguei o navegador (Ctrl + Shift + R)
- [ ] Consegui acessar o PHPMyAdmin
- [ ] Fiz login com sucesso

---

**Última atualização:** 03/03/2026
**Status:** Pronto para uso
**Dificuldade:** Fácil (5 minutos)
