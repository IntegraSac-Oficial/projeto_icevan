# Configuração de Porta e Otimizações de Performance

## 🚀 Mudança de Porta

### Porta Alterada: 3000 → 3001

**Motivo**: Evitar conflito com outros projetos rodando na porta 3000 (como o projeto SVN).

### Como Acessar Agora

Após executar `.\dev.bat`, acesse:

```
http://localhost:3001
```

**Importante**: Sempre use a porta **3001** ao invés de 3000.

## ⚡ Otimizações de Performance Implementadas

### 1. Cache Habilitado
- **Antes**: `dynamic = 'force-dynamic'` (sem cache, MUITO LENTO)
- **Depois**: Cache de 5 minutos (`revalidate = 300`)
- **Resultado**: Páginas carregam instantaneamente após primeira visita

### 2. Limite de Memória Aumentado
- **Configuração**: 4GB de RAM para Node.js
- **Benefício**: Evita crashes e permite cache eficiente

### 3. Workers Limitados
- **Configuração**: 1 CPU, sem worker threads
- **Benefício**: Reduz consumo de memória e overhead

### 4. Porta Dedicada
- **Porta**: 3001 (sem conflitos)
- **Benefício**: Sem interferência de outros serviços

## 📊 Performance Esperada

### Desenvolvimento Local (deve ser RÁPIDO!)

| Ação | Tempo Esperado |
|------|---------------|
| Primeira carga | 2-5 segundos |
| Navegação entre páginas | < 1 segundo |
| Hot reload (após salvar código) | 1-3 segundos |
| Recarregar página (F5) | < 1 segundo (cache) |

### Se Ainda Estiver Lento

#### 1. Limpar Cache Completamente
```powershell
# Parar o servidor (Ctrl+C)

# Deletar cache do Next.js
Remove-Item -Recurse -Force .next

# Deletar cache do Prisma
Remove-Item -Recurse -Force node_modules\.prisma

# Reinstalar
npm install

# Executar novamente
.\dev.bat
```

#### 2. Verificar Conexão com Banco de Dados
```powershell
# Testar conexão MySQL
docker exec istar_db mysql -uistar_user -p'istar_password' -e "SELECT 1"
```

Se demorar, o problema é o banco! Reinicie o container:
```powershell
docker restart istar_db
```

#### 3. Verificar Processos na Porta 3001
```powershell
netstat -ano | findstr :3001
```

Se aparecer algo, mate o processo:
```powershell
# Exemplo: se o PID for 12345
taskkill /F /PID 12345
```

#### 4. Modo de Produção (Mais Rápido)
Se desenvolvimento estiver muito lento, use o modo produção localmente:

```powershell
# Build otimizado
npm run build

# Executar em produção
npm start
```

Acesse: `http://localhost:3000` (produção usa porta 3000)

## 🔧 Troubleshooting

### Problema: "Porta 3001 já está em uso"
```powershell
# Matar processo na porta 3001
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
}
```

### Problema: Página carrega mas fica em branco
1. Abra o DevTools (F12)
2. Veja o Console para erros
3. Verifique a aba Network para ver o que está demorando
4. Se for query do banco, reinicie o container MySQL

### Problema: Mudanças no código não aparecem
1. Salve o arquivo (Ctrl+S)
2. Aguarde mensagem no terminal: "✓ Compiled in X.Xs"
3. Se não aparecer, reinicie o servidor (Ctrl+C + `.\dev.bat`)

## 📝 Scripts Disponíveis

```powershell
# Desenvolvimento (porta 3001, com cache)
.\dev.bat

# Desenvolvimento com Turbopack (experimental, mais memória)
npm run dev:turbo

# Build de produção
npm run build

# Executar build (porta 3000)
npm start
```

## ⚙️ Configurações Aplicadas

### package.json
```json
"dev": "next dev -p 3001"
```

### .npmrc
```
node-options=--max-old-space-size=4096
```

### next.config.mjs
```javascript
experimental: {
  workerThreads: false,
  cpus: 1,
}
```

### app/page.tsx
```typescript
export const revalidate = 300; // 5 minutos de cache
```

## ✅ Checklist de Performance

Antes de reportar problemas, verifique:

- [ ] Usando porta 3001 (`http://localhost:3001`)
- [ ] Executando via `.\dev.bat`
- [ ] Container MySQL está rodando (`docker ps`)
- [ ] Sem erros no terminal
- [ ] Sem erros no Console do navegador (F12)
- [ ] Cache limpo (se necessário)
- [ ] Arquivos `.env.local` configurados corretamente

## 🎯 Objetivo

**Desenvolvimento local DEVE ser RÁPIDO!**

- Clicou → Carregou instantaneamente
- Salvou código → Atualizou em 1-2 segundos
- F5 → Recarregou em menos de 1 segundo

Se não estiver assim, algo está errado e precisa ser investigado!
