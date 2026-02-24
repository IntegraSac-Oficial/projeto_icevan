# Correções Aplicadas - Imagens e Vídeos

## 🐛 Problemas Corrigidos

### 1. Thumbnail Não Aparece no Site
**Problema:** Imagens enviadas pelo admin apareciam no painel mas não no site público (cards de aplicações).

**Causa:** A página `/aplicacoes` usava array estático em vez de carregar imagens dinamicamente.

**Solução:** Modificada a página para usar `loadApplicationImages()` em todas as aplicações.

**Arquivos:** `app/aplicacoes/page.tsx`

---

### 2. Botão de Substituir Abrindo Duas Vezes ✅ CORRIGIDO
**Problema:** Ao clicar no botão de substituir imagem, o popup de seleção abria duas vezes.

**Causa:** O botão estava dentro de uma área clicável (div de upload), causando propagação do evento.

**Solução:** 
- Adicionado `e.stopPropagation()` nos botões de ação
- Modificado o onClick da área de upload para verificar se o clique foi direto ou em um botão filho
- Adicionada classe `.upload-trigger` para identificar área clicável

**Arquivo:** `app/admin/imagens/page.tsx`

---

### 3. Vídeos Locais Esticados ✅ CORRIGIDO
**Problema:** Vídeos enviados do computador ficavam esticados e distorcidos.

**Causa:** CSS forçava `aspect-ratio: 16/9` e `object-cover` em todos os vídeos.

**Solução:** 
- Removido `aspect-ratio` fixo para vídeos locais
- Alterado para `h-auto` e `max-h-[500px]` para manter proporção original
- Vídeo centralizado com `mx-auto`
- Fundo preto para barras laterais quando necessário

**Arquivo:** `components/VideoGrid.tsx`

---

### 4. Preview de Vídeos Locais ✅ CORRIGIDO
**Problema:** Vídeos locais mostravam fundo cinza em vez de preview.

**Causa:** Não havia lógica para mostrar o primeiro frame do vídeo.

**Solução:** 
- Adicionado `<video>` com `preload="metadata"` para carregar primeiro frame
- Detecta automaticamente se é vídeo local (tem `src` mas não `youtubeId`)
- Mantém aspect ratio original do vídeo no preview
- Overlay e botão play sobre o preview

**Arquivo:** `components/VideoGrid.tsx`

---

### 5. Ordem das Imagens Invertida ✅ CORRIGIDO
**Problema:** Novas imagens apareciam no final em vez de seguir ordem alfabética.

**Causa:** A API não estava ordenando os arquivos.

**Solução:** Adicionado `.sort((a, b) => a.localeCompare(b))` na listagem de imagens.

**Arquivo:** `app/api/admin/images/route.ts`

---

### 6. Informações de Tamanho das Imagens ✅ ADICIONADO
**Problema:** Não havia indicação dos tamanhos recomendados.

**Solução:** Adicionado card informativo com tamanhos recomendados para cada seção.

**Tamanhos por seção:**
- **Banners Hero:** 1920×780px (desktop) | 1200×600px (mínimo)
- **Thumbnails de Veículos:** 800×600px
- **Galeria de Veículos:** 1200×900px
- **Fotos de Serviços:** 1200×900px ou 1000×1000px
- **Fotos da Empresa:** 1200×800px
- **OG Image:** 1200×630px (exato)
- **Logo:** SVG ou PNG 500×150px
- **Favicon:** 32×32px ou 64×64px

**Arquivo:** `app/admin/imagens/page.tsx`

---

## 📋 Como Funciona Agora

### Upload de Imagens
1. Faça upload na seção correspondente no painel admin
2. As imagens são salvas em `public/images/[seção]/`
3. São ordenadas **alfabeticamente** pelo nome do arquivo
4. Aparecem automaticamente no site público

### Controle de Ordem
Para controlar a ordem das imagens, nomeie os arquivos com prefixos numéricos:
```
01-thumbnail.webp
02-galeria-01.webp
03-galeria-02.webp
```

### Substituição de Imagens
1. Clique no ícone ↻ (substituir) na linha da imagem
2. Selecione o novo arquivo
3. O arquivo será salvo com o **mesmo nome**, mantendo a posição
4. **Agora funciona corretamente sem abrir duas vezes!**

### Vídeos

#### YouTube
- Insira apenas o ID do vídeo (ex: `dQw4w9WgXcQ`)
- Thumbnail carregado automaticamente do YouTube
- Aspect ratio 16:9 padrão

#### Vídeos Locais
- Faça upload do arquivo (MP4, WebM, MOV)
- Será salvo em `public/videos/`
- **Preview automático:** Mostra o primeiro frame do vídeo
- **Aspect ratio preservado:** Mantém proporção original (vertical, horizontal, quadrado)
- **Sem distorção:** Barras pretas aparecem quando necessário
- **Fullscreen correto:** Ao expandir, mantém proporção original

---

## 🔄 Carregamento Dinâmico

### Banners Hero (Home)
```typescript
// Lê arquivos de public/images/hero/
// Ordena alfabeticamente
// Usa como slides do carousel
```

### Aplicações (Veículos)
```typescript
// Lê arquivos de public/images/aplicacoes/[slug]/
// Primeira imagem (01-*.jpg) = thumbnail do card
// Demais imagens = galeria da página de detalhe
// AGORA FUNCIONA CORRETAMENTE NO SITE!
```

### Fotos de Serviços
```typescript
// Lê do banco de dados (tabela gallery_photos)
// Fallback para imagens estáticas se banco vazio
```

### Vídeos
```typescript
// Lê do banco de dados (tabela videos)
// Detecta se é YouTube (ID) ou local (começa com /)
// Preview automático para vídeos locais
// Aspect ratio preservado
```

---

## ✅ Teste as Correções

1. **Teste de Thumbnail:**
   - Vá em `/admin/imagens` → Fiorino
   - Verifique se a imagem `01-*.jpg` está marcada como "Thumbnail"
   - Acesse `/aplicacoes` no site
   - Verifique se o card do Fiorino mostra a imagem correta

2. **Teste de Substituição:**
   - Clique no ícone ↻ de uma imagem existente
   - Verifique se o popup abre **apenas uma vez**
   - Selecione um novo arquivo
   - Verifique se substituiu corretamente

3. **Teste de Vídeo Local:**
   - Adicione um vídeo local em `/admin/videos`
   - Vá em `/fotos-servicos`
   - Verifique se mostra o **primeiro frame como preview**
   - Clique para reproduzir
   - Verifique se mantém a **proporção original** (sem esticar)
   - Teste fullscreen - deve manter proporção

4. **Teste de Vídeo Vertical:**
   - Adicione um vídeo vertical (ex: 1080×1920)
   - Verifique se não fica esticado
   - Deve ter barras pretas nas laterais

---

## 🎯 Próximos Passos

1. Substitua todas as imagens placeholder por fotos reais
2. Nomeie os arquivos com prefixos numéricos: `01-`, `02-`, `03-`
3. Para thumbnails de veículos, use sempre `01-thumbnail.webp`
4. Adicione vídeos reais (YouTube ou locais)
5. Teste todas as páginas do site

---

## 📊 Resumo das Mudanças

| Problema | Status | Arquivo Modificado |
|----------|--------|-------------------|
| Thumbnail não aparece | ✅ Corrigido | `app/aplicacoes/page.tsx` |
| Botão substituir duplo | ✅ Corrigido | `app/admin/imagens/page.tsx` |
| Vídeos esticados | ✅ Corrigido | `components/VideoGrid.tsx` |
| Preview vídeos locais | ✅ Corrigido | `components/VideoGrid.tsx` |
| Ordem das imagens | ✅ Corrigido | `app/api/admin/images/route.ts` |
| Info de tamanhos | ✅ Adicionado | `app/admin/imagens/page.tsx` |

---

**Data das correções:** 2026-02-20
**Arquivos modificados:** 4 arquivos
**Status:** ✅ Todas as correções aplicadas e testadas
**Versão:** 2.0 - Correções Finais
