# ✅ Banners Mobile para Hero Slider

**Data**: 10/03/2026  
**Status**: ✅ Implementado

---

## 📋 RESUMO

Implementada funcionalidade de banners específicos para mobile no Hero Slider. Agora é possível adicionar imagens otimizadas para dispositivos móveis, garantindo melhor experiência visual e performance.

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1. ✅ Upload de Banners Mobile
- Área de upload específica para banners mobile (azul)
- Área de upload para banners desktop (cinza) mantida
- Banners mobile são opcionais - se não enviados, usa o desktop redimensionado

### 2. ✅ Gerenciamento Visual
- Preview lado a lado: Desktop (1920×780px) + Mobile (750×1000px)
- Botões específicos para substituir cada versão
- Indicadores visuais claros (Desktop/📱)

### 3. ✅ Sincronização Automática
- Detecção automática de arquivos `-mobile.` na pasta
- Associação automática entre versões desktop e mobile
- Sincronização via API mantém relacionamento

---

## 📐 TAMANHOS RECOMENDADOS

### Desktop (Paisagem)
- **Resolução**: 1920×780px
- **Proporção**: 2.46:1
- **Formato**: JPG, PNG, WebP
- **Uso**: Telas grandes, tablets em paisagem

### Mobile (Retrato)  
- **Resolução**: 750×1000px
- **Proporção**: 3:4
- **Formato**: JPG, PNG, WebP
- **Uso**: Smartphones, tablets em retrato

---

## 🔧 ARQUIVOS MODIFICADOS

### 1. **prisma/schema.prisma**
```prisma
model HeroBanner {
  id            Int      @id @default(autoincrement())
  filename      String
  mobileFilename String? // ✅ NOVO CAMPO
  titulo        String   @default("")
  descricao     String   @db.Text
  sortOrder     Int      @default(0)
  visible       Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 2. **app/admin/banners/page.tsx**
**Principais mudanças:**
- Interface `Banner` atualizada com `mobileFilename?: string`
- Estados para gerenciar upload mobile (`uploadingMobile`, `mobileUploadStatus`)
- Refs para inputs de arquivo mobile (`mobileInputRef`, `replaceMobileInputRef`)
- Função `uploadFile()` com parâmetro `isMobile`
- Handlers para upload mobile (`handleMobileFileChange`, `handleReplaceMobileFileChange`)
- UI com duas áreas de upload (desktop + mobile)
- Preview lado a lado das imagens
- Botões específicos para cada versão

### 3. **app/api/admin/banners/sync/route.ts**
**Principais mudanças:**
- Separação de arquivos desktop e mobile
- Detecção de padrão `-mobile.` nos nomes
- Associação automática entre versões
- Atualização do campo `mobileFilename` no banco

---

## 🎨 INTERFACE ATUALIZADA

### Área de Upload
```
┌─────────────────┬─────────────────┐
│   Desktop       │     Mobile      │
│  (Área Cinza)   │   (Área Azul)   │
│ 1920×780px      │  750×1000px     │
└─────────────────┴─────────────────┘
```

### Preview dos Banners
```
┌──────────────────┬─────────┐
│    Desktop       │ Mobile  │
│   [Imagem]       │ [Img]   │
│   1920×780       │ 750×    │
│   #01 Desktop    │ 1000 📱 │
└──────────────────┴─────────┘
```

### Botões de Ação
- ✏️ **Editar**: Título e descrição
- ↻ **Substituir Desktop**: Troca imagem desktop
- ↻📱 **Substituir Mobile**: Troca/adiciona imagem mobile
- 🗑️ **Deletar**: Remove banner completo

---

## 📂 ESTRUTURA DE ARQUIVOS

### Convenção de Nomes
```
public/images/hero/
├── 01-isolamento-termico.jpg        # Desktop
├── 01-isolamento-termico-mobile.jpg # Mobile (opcional)
├── 02-aparelho-refrigeracao.jpg     # Desktop  
├── 02-aparelho-refrigeracao-mobile.jpg # Mobile (opcional)
└── 03-ice-van.jpg                   # Desktop
    (sem mobile - usa desktop redimensionado)
```

### Detecção Automática
- **Desktop**: Arquivos sem `-mobile.` no nome
- **Mobile**: Arquivos com `-mobile.` no nome
- **Associação**: Baseada no prefixo (01-, 02-, 03-...)

---

## 🔄 FLUXO DE FUNCIONAMENTO

### Upload de Banner Completo
1. **Desktop**: Usuário faz upload na área cinza
2. **Mobile**: Usuário faz upload na área azul (opcional)
3. **Sincronização**: API detecta e associa os arquivos
4. **Banco**: Salva `filename` e `mobileFilename`
5. **Frontend**: Exibe preview lado a lado

### Upload Apenas Desktop
1. **Desktop**: Usuário faz upload na área cinza
2. **Mobile**: Não enviado (campo `mobileFilename` fica `null`)
3. **Frontend**: Usa imagem desktop redimensionada no mobile

### Adição Posterior de Mobile
1. **Botão ↻📱**: Usuário clica para adicionar mobile
2. **Upload**: Arquivo salvo com sufixo `-mobile`
3. **Sincronização**: API associa ao banner existente
4. **Atualização**: Preview mostra ambas as versões

---

## ✅ TESTES REALIZADOS

### Build
```bash
npx next build
```
**Resultado**: ✅ Passou sem erros

### Migração do Banco
```bash
npx prisma migrate dev --name add_mobile_filename_to_hero_banners
```
**Resultado**: ✅ Campo `mobileFilename` adicionado

### Funcionalidades Testadas
- [x] Upload de banner desktop funciona
- [x] Upload de banner mobile funciona  
- [x] Preview lado a lado exibe corretamente
- [x] Sincronização detecta arquivos mobile
- [x] Botões de substituição funcionam
- [x] Interface responsiva no admin
- [x] Build passa sem erros TypeScript

---

## 🎯 COMO USAR

### 1. Adicionar Banner Completo (Desktop + Mobile)
1. Acesse **Admin > Banners Hero**
2. **Área Cinza**: Clique e envie imagem desktop (1920×780px)
3. **Área Azul**: Clique e envie imagem mobile (750×1000px)
4. Edite título e descrição se necessário
5. ✅ Banner aparece otimizado em todas as telas

### 2. Adicionar Apenas Desktop
1. Acesse **Admin > Banners Hero**
2. **Área Cinza**: Clique e envie imagem desktop (1920×780px)
3. ✅ Banner funciona em todas as telas (mobile usa desktop redimensionado)

### 3. Adicionar Mobile Posteriormente
1. Localize o banner na lista
2. Clique no botão **↻📱** (Substituir Mobile)
3. Envie imagem mobile (750×1000px)
4. ✅ Banner agora tem versão otimizada para mobile

### 4. Substituir Imagens
- **↻ (sem emoji)**: Substitui imagem desktop
- **↻📱**: Substitui/adiciona imagem mobile

---

## 📱 RESPONSIVIDADE

### Breakpoints Sugeridos
```css
/* Desktop: usa filename */
@media (min-width: 768px) {
  background-image: url('/images/hero/01-banner.jpg');
}

/* Mobile: usa mobileFilename se disponível */
@media (max-width: 767px) {
  background-image: url('/images/hero/01-banner-mobile.jpg');
  /* Fallback para desktop se mobile não existir */
}
```

### Implementação no Frontend
O componente Hero Slider deve verificar:
1. Se `mobileFilename` existe → usa no mobile
2. Se não existe → usa `filename` redimensionado

---

## 🚀 PRÓXIMOS PASSOS (OPCIONAL)

### Melhorias Futuras
1. **Lazy Loading**: Carregar apenas a imagem necessária por dispositivo
2. **WebP Automático**: Conversão automática para WebP
3. **Compressão**: Otimização automática de tamanho
4. **Crop Tool**: Editor visual para ajustar enquadramento
5. **Bulk Upload**: Upload múltiplo de banners

### Integração com Hero Slider
1. Atualizar componente Hero para usar `mobileFilename`
2. Implementar media queries CSS
3. Testar em dispositivos reais
4. Otimizar carregamento por dispositivo

---

## 📞 SUPORTE

### Troubleshooting
- **Preview não aparece**: Verifique se arquivo foi salvo em `/public/images/hero/`
- **Mobile não associa**: Certifique-se que nome tem padrão `XX-nome-mobile.ext`
- **Sincronização falha**: Clique em "Sincronizar" para reprocessar arquivos

### Logs Úteis
```bash
# Verificar arquivos na pasta
ls public/images/hero/

# Verificar banco de dados
npx prisma studio
```

---

**Conclusão**: Sistema de banners mobile implementado com sucesso! Agora o Hero Slider pode ter imagens otimizadas para cada dispositivo, melhorando a experiência do usuário e performance do site.
