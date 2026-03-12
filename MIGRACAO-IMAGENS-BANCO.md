# 🗄️ Migração de Imagens para Banco de Dados

**Data**: 11/03/2026  
**Status**: ✅ Implementado

## 📋 RESUMO

Sistema implementado para armazenar imagens diretamente no banco de dados MySQL como BLOB, resolvendo o problema das imagens que somem quando substituídas no sistema de arquivos.

## 🎯 BENEFÍCIOS

- ✅ **Imagens nunca mais somem**: Armazenadas no banco, não no sistema de arquivos
- ✅ **Backup automático**: Imagens incluídas no backup do banco
- ✅ **Sincronização**: Imagens sempre consistentes entre deploys
- ✅ **Performance**: Cache otimizado com ETag e headers corretos
- ✅ **Compatibilidade**: Funciona com sistema existente

## 🔧 COMO EXECUTAR A MIGRAÇÃO

### 1. Gerar e aplicar migração do banco
```bash
npx prisma migrate dev --name add_image_storage
```

### 2. Executar script de migração
```bash
npm run migrate-images
```

### 3. Verificar se funcionou
- Acesse o site e veja se as imagens aparecem
- URLs das imagens agora são `/api/images/[filename]`

## 📊 ESTRUTURA CRIADA

### Nova tabela: `image_storage`
- `id`: ID único da imagem
- `filename`: Nome do arquivo
- `data`: BLOB com dados da imagem
- `mimeType`: Tipo MIME (image/jpeg, etc.)
- `size`: Tamanho em bytes
- `category`: Categoria (hero, gallery, etc.)

### Campos adicionados:
- `hero_banners.image_id`: Referência para imagem desktop
- `hero_banners.mobile_image_id`: Referência para imagem mobile
- `gallery_photos.image_id`: Referência para imagem da galeria

## 🔄 COMO FUNCIONA

1. **Upload**: Imagens são salvas no banco via `/api/admin/images/upload`
2. **Servir**: Imagens são servidas via `/api/images/[filename]`
3. **Cache**: Headers otimizados para cache de 1 ano
4. **Fallback**: Se imagem não existe no banco, tenta arquivo

## 📝 PRÓXIMOS PASSOS

Após executar a migração, todas as imagens estarão no banco e nunca mais vão sumir!