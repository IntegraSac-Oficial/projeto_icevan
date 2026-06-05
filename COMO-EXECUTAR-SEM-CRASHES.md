# Como Executar o Projeto Sem Crashes de Memória

## Problema Identificado
O Node.js estava ficando sem memória (JavaScript heap out of memory) durante a execução do `npm run dev`, causando travamentos no navegador e no terminal.

## Soluções Implementadas

### 1. Arquivo `.npmrc` Criado
Configuração global de memória para o Node.js:
```
node-options=--max-old-space-size=4096
```

### 2. Script `dev.bat` Criado (Windows)
Script otimizado para Windows que configura memória antes de iniciar:
```batch
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev:base
```

### 3. Configuração `next.config.mjs` Otimizada
- Limitado número de workers
- Desabilitado worker threads
- Limitado CPUs para 1

## Como Executar Agora

### Opção 1: Usando o Script BAT (Recomendado para Windows)
```bash
.\dev.bat
```

**IMPORTANTE**: Acesse o site em `http://localhost:3001` (porta alterada para evitar conflitos!)

### Opção 2: Configurando Memória Manualmente no PowerShell
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```
Acesse: `http://localhost:3001`

### Opção 3: Configurando Memória Manualmente no CMD
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev
```
Acesse: `http://localhost:3001`

## Dicas Adicionais

### 1. Limpar Cache do Next.js
Se ainda tiver problemas, limpe o cache:
```bash
# Deletar a pasta .next
Remove-Item -Recurse -Force .next

# Reinstalar node_modules
Remove-Item -Recurse -Force node_modules
npm install

# Executar novamente
.\dev.bat
```

### 2. Monitorar Uso de Memória
Abra o Gerenciador de Tarefas do Windows (Ctrl+Shift+Esc) e monitore o uso de memória do processo Node.js.

### 3. Fechar Outros Programas
Se o computador tiver pouca RAM disponível (menos de 8GB), feche outros programas pesados enquanto desenvolve.

### 4. Reiniciar Periodicamente
Se deixar o servidor rodando por muito tempo, reinicie-o a cada 2-3 horas para liberar memória.

## O Que Foi Alterado

### Antes
- Limite padrão de memória: ~512MB
- Turbopack ativo (consome mais memória)
- Múltiplos workers em paralelo

### Depois
- Limite de memória: 4GB (4096MB)
- Workers limitados
- Configuração otimizada para desenvolvimento

## Verificação

Após executar `.\dev.bat`, você deve ver:
```
✓ Starting...
✓ Ready in X.Xs
```

E o servidor deve permanecer estável sem mostrar erros de "heap out of memory".

## Se Ainda Tiver Problemas

1. Aumente ainda mais a memória (se tiver RAM disponível):
   ```
   --max-old-space-size=8192
   ```

2. Use o modo de produção (mais leve):
   ```bash
   npm run build
   npm start
   ```

3. Verifique se há memory leaks no código (loops infinitos, listeners não removidos, etc.)
