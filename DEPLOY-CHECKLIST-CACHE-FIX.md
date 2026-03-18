# ✅ Checklist de Deploy - Fix Cache de Imagens

## 📋 RESUMO DA CORREÇÃO

Corrigido o problema de 404 ao substituir imagens no painel admin.

**Causa**: Timestamp compartilhado entre todas as imagens + cache agressivo  
**Solução**: Timestamp individual por arquivo + cache inteligente + ETag

## 🔧 ARQUIVOS MODIFICADOS

- ✅ `app/api/admin/images/route.ts` - Timestamp individual (mtimeMs)
- ✅ `app/api/images/[filename]/route.ts` - ETag + 304 Not Modified
- ✅ `app/admin/imagens/page.tsx` - Retry automático + reload forçado

## 🚀 PASSOS PARA DEPLOY

### 1. Commit e Push
```bash
git add .
git commit -m "fix: cache de imagens no admin - timestamp individual + ETag"
git push origin main
```

### 2. Deploy no Coolify
- Acesse o painel do Coolify
- Selecione o projeto
- Clique em "Deploy"
- Aguarde 10-15 minutos

### 3. Teste Pós-Deploy
1. Acesse `https://seu-dominio.com/admin/imagens`
2. Selecione qualquer pasta (ex: Fiorino)
3. Clique no ícone ↻ de uma imagem
4. Escolha um arquivo diferente
5. **Verifique**: Preview deve mostrar a nova imagem SEM erro 404

### 4. Verificação de Logs (Opcional)
Abra o DevTools Console e procure por:
```
✅✅✅ SUBSTITUIÇÃO CONCLUÍDA COM SUCESSO! ✅✅✅
⏰ Timestamp: [número]
🔄 Recarregando lista de imagens...
✅ Lista recarregada com novos timestamps
```

## 🎯 O QUE ESPERAR

### ✅ ANTES (Problema)
- Substituir imagem → Preview mostra 404
- Necessário Ctrl+Shift+R para ver nova imagem
- Imagem funciona no site mas não no admin

### ✅ DEPOIS (Corrigido)
- Substituir imagem → Preview atualiza automaticamente
- Não precisa Ctrl+Shift+R
- Funciona tanto no admin quanto no site

## 🔍 TROUBLESHOOTING

### Se ainda mostrar 404 após deploy:

1. **Limpe o cache do navegador**:
   - Chrome/Edge: Ctrl+Shift+Delete → Limpar cache
   - Ou use aba anônima para testar

2. **Verifique os logs do servidor**:
   - Procure por `[IMAGE API] Serving:` no console
   - Deve mostrar o caminho correto do arquivo

3. **Verifique se o arquivo existe**:
   - SSH no servidor
   - `ls -la public/images/aplicacoes/fiorinos/`
   - Confirme que o arquivo novo está lá

4. **Force rebuild no Coolify**:
   - Às vezes o cache do Docker precisa ser limpo
   - Use "Rebuild" ao invés de "Deploy"

## 📊 MÉTRICAS DE SUCESSO

- ✅ Substituição de imagem funciona sem 404
- ✅ Preview atualiza automaticamente
- ✅ Não precisa refresh manual (Ctrl+Shift+R)
- ✅ Logs mostram timestamps individuais
- ✅ Network tab mostra 200 ou 304 (não 404)

## 🎓 NOTAS TÉCNICAS

- **Timestamp**: Baseado em `mtimeMs` (modificação do arquivo)
- **Cache**: 1 hora com `must-revalidate`
- **ETag**: `"[timestamp]-[tamanho]"`
- **Retry**: Automático após 1s se falhar
- **Reload**: Forçado após substituição bem-sucedida

## 📞 SUPORTE

Se encontrar problemas após o deploy:
1. Verifique os logs do console (F12)
2. Verifique o Network tab (F12 → Network)
3. Teste em aba anônima
4. Verifique se os arquivos existem no servidor

---

**Pronto para deploy**: ✅ SIM  
**Testes locais**: ✅ Passando  
**Breaking changes**: ❌ Não  
**Requer migração**: ❌ Não
