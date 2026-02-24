# Como Funciona o Sistema de Imagens

## 🎯 Entendendo Upload vs Substituição

### 📤 Upload Novo (Adicionar Imagem)
**Como fazer:** Arraste ou clique na área de upload

**O que acontece:**
- O arquivo é salvo com o **nome original** que você escolheu
- Exemplo: Você envia `Minha-Foto-Linda.jpg` → Salva como `Minha-Foto-Linda.jpg`
- A imagem aparece na lista ordenada alfabeticamente

**Quando usar:**
- Adicionar novas fotos à galeria
- Primeira vez que está enviando imagens

---

### 🔄 Substituir Imagem (Botão ↻)
**Como fazer:** Clique no ícone ↻ ao lado da imagem

**O que acontece:**
- O **conteúdo** da imagem é trocado
- O **nome do arquivo** permanece o mesmo
- Exemplo: Você substitui `01.jpg` com `Nova-Foto.jpg` → Continua como `01.jpg`

**Quando usar:**
- Trocar uma foto específica mantendo a posição
- Atualizar thumbnail sem mudar o nome
- Manter a ordem das imagens

---

## 📁 Sistema de Ordem Alfabética

As imagens são ordenadas **alfabeticamente** pelo nome do arquivo.

### Exemplo:
```
01-thumbnail.jpg    ← Primeira (thumbnail)
02-galeria.jpg      ← Segunda
03-foto.jpg         ← Terceira
10-outra.jpg        ← Quarta
Foto-Sem-Numero.jpg ← Quinta (sem prefixo numérico)
```

### Dica:
Use prefixos numéricos para controlar a ordem:
- `01-`, `02-`, `03-` para ordem específica
- `10-`, `11-`, `12-` se tiver mais de 9 imagens

---

## 🖼️ Logo - Como Funciona

### Arquivos de Logo:
O sistema usa **nomes fixos** para as logos:
- `logo.svg` - Logo principal (header)
- `logo-white.svg` - Logo branca (footer)
- `favicon.ico` - Ícone do site

### Como Trocar a Logo:

1. **Vá em Configurações → Aparência**
2. **Clique em "Trocar"** na logo desejada
3. **Selecione seu arquivo** (pode ser qualquer nome)
4. **O sistema salva automaticamente** com o nome fixo correto
5. **Clique em "Atualizar Página"** para ver no header

### Exemplo:
- Você envia: `Minha-Logo-Nova.png`
- Sistema salva como: `logo.svg` (nome fixo)
- Substitui a logo anterior

---

## 🔧 Casos de Uso

### Caso 1: Primeira Vez Enviando Imagens
```
1. Renomeie seus arquivos:
   - 01-thumbnail.jpg
   - 02-galeria-frontal.jpg
   - 03-galeria-lateral.jpg

2. Faça upload de todos

3. Eles aparecem na ordem correta
```

### Caso 2: Trocar Apenas a Thumbnail
```
1. Clique no ↻ da imagem "01-thumbnail.jpg"

2. Selecione nova foto

3. O arquivo continua como "01-thumbnail.jpg"
   mas com o conteúdo novo
```

### Caso 3: Adicionar Mais Fotos
```
1. Renomeie novos arquivos:
   - 04-nova-foto.jpg
   - 05-outra-foto.jpg

2. Faça upload

3. Eles aparecem após as existentes
```

### Caso 4: Mudar a Ordem
```
Opção A - Renomear no computador:
1. Baixe as imagens
2. Renomeie com novos números
3. Delete as antigas
4. Faça upload das renomeadas

Opção B - Substituir uma por uma:
1. Clique em ↻ da imagem 01
2. Selecione a foto que quer como primeira
3. Repita para cada posição
```

---

## ⚠️ Importante Saber

### ✅ O que funciona:
- Upload mantém nome original
- Substituição mantém nome do slot
- Ordem alfabética automática
- Logo salva com nome fixo

### ❌ O que NÃO funciona:
- Renomear arquivo direto no painel (precisa deletar e fazer upload novo)
- Arrastar para reordenar (use prefixos numéricos)
- Logo salvar com nome personalizado (sempre usa nome fixo)

---

## 🎨 Recomendações

### Nomenclatura:
```
✅ BOM:
01-thumbnail.webp
02-galeria-frontal.webp
03-galeria-lateral.webp

❌ EVITAR:
foto.jpg (sem número)
IMG_1234.jpg (nome genérico)
Foto Nova (1).jpg (espaços e parênteses)
```

### Tamanhos:
- **Thumbnails:** 800×600px
- **Galeria:** 1200×900px
- **Banners:** 1920×780px
- **Logo:** SVG ou PNG 500×150px
- **Favicon:** 32×32px ou 64×64px

---

## 🔄 Fluxo de Trabalho Recomendado

### Setup Inicial:
1. Prepare todas as imagens no computador
2. Renomeie com prefixos numéricos
3. Faça upload de todas de uma vez
4. Verifique a ordem no painel

### Manutenção:
1. Para trocar uma foto: Use botão ↻
2. Para adicionar fotos: Upload novo com número seguinte
3. Para reordenar: Renomeie e faça upload novamente

### Logo:
1. Prepare logo em SVG (recomendado)
2. Vá em Configurações → Aparência
3. Troque cada logo
4. Clique em "Atualizar Página"

---

## 💡 Dicas Extras

1. **Cache do navegador:**
   - Após substituir, pressione Ctrl+Shift+R no site
   - Isso força o navegador a carregar a imagem nova

2. **Formato de arquivo:**
   - WebP: Melhor compressão
   - JPG: Fotos com muitas cores
   - PNG: Imagens com transparência
   - SVG: Logos e ícones (vetorial)

3. **Organização:**
   - Mantenha padrão de nomenclatura
   - Use prefixos numéricos sempre
   - Documente qual imagem é qual

---

**Resumo:** Upload novo = nome original | Substituir = mantém nome do slot | Logo = nome fixo automático
