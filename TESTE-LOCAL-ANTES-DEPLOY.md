# 🧪 Teste Local - Antes do Deploy

## ⚠️ IMPORTANTE: TESTE LOCALMENTE PRIMEIRO

Antes de fazer deploy para produção, siga estes passos para garantir que tudo funciona.

## 📋 PRÉ-REQUISITOS

- ✅ Docker Desktop rodando
- ✅ Node.js v24.14.0 ativo (`nvm use 24.14.0`)
- ✅ Banco de dados local rodando (`docker-compose up -d`)

## 🚀 PASSO A PASSO

### 1. Inicie o servidor de desenvolvimento

```bash
# No PowerShell (como administrador se possível)
npm.cmd run dev

# OU se já mudou a execution policy:
npm run dev
```

Aguarde até ver:
```
✓ Ready in [tempo]
○ Local: http://localhost:3000
```

### 2. Acesse o painel admin

1. Abra: `http://localhost:3000/admin/login`
2. Faça login com suas credenciais
3. Navegue para: **Gerenciar Imagens**

### 3. Teste a substituição de imagem

#### 3.1. Abra o DevTools
- Pressione `F12`
- Vá para a aba **Console**
- Vá para a aba **Network** (em outra janela)

#### 3.2. Selecione uma pasta
- Escolha qualquer pasta (ex: "Fiorino")
- Observe que as imagens carregam normalmente

#### 3.3. Substitua uma imagem
1. Clique no ícone **↻** (Substituir) de qualquer imagem
2. Escolha um arquivo diferente do seu computador
3. **OBSERVE O CONSOLE** - deve mostrar:

```
═══════════════════════════════════════════════════════════
🔄 SUBSTITUIÇÃO DE IMAGEM INICIADA
═══════════════════════════════════════════════════════════
📁 Pasta: images/aplicacoes/fiorinos
🗑️  Arquivo antigo: 11-10.jpg
📤 Arquivo novo: placeholder.jpg (124.44 KB)

───────────────────────────────────────────────────────────
ETAPA 1/4: Deletando arquivo antigo
───────────────────────────────────────────────────────────
✅ Arquivo antigo DELETADO com sucesso!

───────────────────────────────────────────────────────────
ETAPA 2/4: Encontrando posição do arquivo na lista
───────────────────────────────────────────────────────────
📍 Posição encontrada: 10 (índice base-0)

───────────────────────────────────────────────────────────
ETAPA 3/4: Construindo novo nome mantendo posição
───────────────────────────────────────────────────────────
📄 Nome final completo: 11-placeholder.jpg

───────────────────────────────────────────────────────────
ETAPA 4/4: Fazendo upload do novo arquivo
───────────────────────────────────────────────────────────
📥 Status HTTP: 200 ✅

═══════════════════════════════════════════════════════════
✅✅✅ SUBSTITUIÇÃO CONCLUÍDA COM SUCESSO! ✅✅✅
═══════════════════════════════════════════════════════════
🗑️  Arquivo deletado: 11-10.jpg
📤 Arquivo criado: 11-placeholder.jpg
📍 Posição mantida: 11
🌐 URL: /images/aplicacoes/fiorinos/11-placeholder.jpg
⏰ Timestamp: 1773856123456
═══════════════════════════════════════════════════════════

🔄 Recarregando lista de imagens...
✅ Lista recarregada com novos timestamps
```

#### 3.4. Verifique a preview
- A imagem deve aparecer **IMEDIATAMENTE** na lista
- **NÃO deve mostrar erro 404**
- A preview deve mostrar a nova imagem

#### 3.5. Verifique o Network tab
1. Vá para a aba **Network** do DevTools
2. Filtre por "images" ou pelo nome do arquivo
3. Procure pela requisição da imagem
4. Verifique:
   - **URL**: Deve ter `?t=` com um número grande (timestamp)
   - **Status**: Deve ser `200` (primeira vez) ou `304` (se recarregar)
   - **Headers de resposta**:
     ```
     Cache-Control: public, max-age=3600, must-revalidate
     ETag: "1773856123456-124440"
     Content-Type: image/jpeg (ou png, webp, etc)
     ```

### 4. Teste o retry automático (opcional)

1. Substitua uma imagem
2. Se por acaso aparecer 404 momentaneamente
3. Aguarde 1 segundo
4. O sistema deve tentar recarregar automaticamente
5. A imagem deve aparecer após o retry

### 5. Teste em diferentes pastas

Repita o teste de substituição em pelo menos 2-3 pastas diferentes:
- ✅ Fiorino
- ✅ Van Ducato
- ✅ Fotos de Serviços

## ✅ CRITÉRIOS DE SUCESSO

Para considerar o teste bem-sucedido, você deve ver:

1. ✅ **Console mostra logs detalhados** de cada etapa
2. ✅ **Preview atualiza automaticamente** após substituição
3. ✅ **Não aparece erro 404** na preview
4. ✅ **Network tab mostra 200 ou 304** (não 404)
5. ✅ **URL tem `?t=` com timestamp** diferente para cada imagem
6. ✅ **Mensagem de sucesso** aparece após substituição

## ❌ SINAIS DE PROBLEMA

Se você ver qualquer um destes, NÃO faça deploy:

1. ❌ Preview mostra 404 após substituição
2. ❌ Console mostra erros em vermelho
3. ❌ Network tab mostra 404 para a imagem
4. ❌ Timestamp é o mesmo para todas as imagens
5. ❌ Imagem não atualiza mesmo após 2-3 segundos

## 🔧 TROUBLESHOOTING LOCAL

### Problema: Servidor não inicia
```bash
# Verifique se a porta 3000 está livre
netstat -ano | findstr :3000

# Se estiver ocupada, mate o processo
taskkill /PID [número] /F

# Tente novamente
npm.cmd run dev
```

### Problema: Erro de permissão no PowerShell
```bash
# Execute como administrador e rode:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Depois tente novamente
npm run dev
```

### Problema: Docker não está rodando
```bash
# Inicie o Docker Desktop manualmente
# Depois rode:
docker-compose up -d

# Verifique se está rodando:
docker ps
```

### Problema: Imagem ainda mostra 404
1. Pare o servidor (Ctrl+C)
2. Limpe o cache do Next.js:
   ```bash
   Remove-Item -Recurse -Force .next
   ```
3. Inicie novamente:
   ```bash
   npm.cmd run dev
   ```

## 📊 CHECKLIST FINAL

Antes de fazer commit e deploy, confirme:

- [ ] Servidor local rodando sem erros
- [ ] Substituição de imagem funciona em pelo menos 3 pastas
- [ ] Preview atualiza automaticamente (sem 404)
- [ ] Console mostra logs detalhados
- [ ] Network tab mostra 200/304 (não 404)
- [ ] Timestamps são diferentes para cada imagem
- [ ] Não há erros no console do navegador
- [ ] Não há erros no terminal do servidor

## 🎯 PRÓXIMOS PASSOS

Se todos os testes passaram:
1. ✅ Faça commit das mudanças
2. ✅ Push para o GitHub
3. ✅ Deploy no Coolify
4. ✅ Teste novamente em produção

Se algum teste falhou:
1. ❌ NÃO faça deploy
2. ❌ Revise os logs de erro
3. ❌ Peça ajuda se necessário
4. ❌ Corrija o problema antes de continuar

---

**Tempo estimado de teste**: 5-10 minutos  
**Nível de dificuldade**: Fácil  
**Requer conhecimento técnico**: Básico
