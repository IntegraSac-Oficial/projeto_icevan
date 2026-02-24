# Correções - Sistema de Favicon Dinâmico

## ✅ Problema Resolvido

O favicon não estava atualizando após o upload de um novo arquivo. O sistema estava carregando o favicon de forma estática no `generateMetadata()`.

## 🔧 Mudanças Implementadas

### 1. Favicon Dinâmico no Layout (`app/layout.tsx`)
- Modificado `generateMetadata()` para buscar o favicon dinamicamente do diretório `/public/images/logo/`
- Sistema detecta automaticamente arquivos com nome `favicon.*` e qualquer extensão válida
- Adicionado cache-busting com timestamp (`?t=${Date.now()}`)
- Adicionado suporte para WebP no favicon
- Adicionado logging para debug

**Extensões suportadas para favicon:**
- `.ico` (recomendado para compatibilidade)
- `.png`
- `.jpg` / `.jpeg`
- `.svg`
- `.webp`

### 2. API de Logo (`app/api/logo/route.ts`)
- Adicionado suporte para `.webp` na detecção do favicon
- Regex atualizado: `/^favicon\.(ico|png|jpg|jpeg|svg|webp)$/i`

### 3. Upload de Logos (`app/admin/configuracoes/page.tsx`)
- Adicionado `.ico` na lista de extensões para deletar arquivos antigos
- Atualizado card de informações com aviso sobre cache do favicon
- Atualizada descrição do favicon para incluir todos os formatos suportados

## 📝 Como Funciona

1. **Upload do Favicon:**
   - Usuário clica em "Trocar" no campo "Favicon / Ícone do Site"
   - Sistema deleta TODOS os arquivos antigos: `favicon.ico`, `favicon.png`, `favicon.svg`, `favicon.jpg`, `favicon.jpeg`, `favicon.webp`, `favicon.gif`
   - Salva o novo arquivo com o nome `favicon.{extensão}`
   - Adiciona timestamp para cache-busting

2. **Carregamento do Favicon:**
   - `generateMetadata()` busca dinamicamente o arquivo `favicon.*` no diretório
   - Adiciona timestamp na URL: `/images/logo/favicon.png?t=1771605283541`
   - Next.js injeta o favicon no `<head>` da página

3. **Cache do Navegador:**
   - Favicon tem cache muito agressivo nos navegadores
   - Timestamp ajuda, mas pode não ser suficiente
   - Usuário pode precisar usar **Ctrl+Shift+R** (Windows) ou **Cmd+Shift+R** (Mac) para forçar atualização

## ⚠️ Notas Importantes

1. **Cache do Navegador:**
   - O favicon é um dos recursos com cache mais agressivo
   - Mesmo com cache-busting, alguns navegadores podem demorar para atualizar
   - Recomenda-se sempre testar em aba anônima ou após limpar cache

2. **Formato Recomendado:**
   - `.ico` é o formato mais compatível com todos os navegadores
   - `.png` 32×32px ou 64×64px também funciona bem
   - `.svg` é moderno mas pode não funcionar em navegadores antigos

3. **Atualização no Admin:**
   - Após upload, clicar em "Atualizar Página" para recarregar
   - Verificar no console do navegador se o favicon foi carregado
   - Testar em aba anônima para confirmar

## 🔍 Debug

Para verificar se o favicon está sendo carregado corretamente:

1. Abra o Console do navegador (F12)
2. Procure por logs: `Favicon encontrado: /images/logo/favicon.png?t=...`
3. Verifique a aba Network para ver se o arquivo foi baixado
4. Inspecione o `<head>` da página para ver o `<link rel="icon">`

## 📂 Arquivos Modificados

- `app/layout.tsx` - Favicon dinâmico com cache-busting
- `app/api/logo/route.ts` - Suporte para WebP no favicon
- `app/admin/configuracoes/page.tsx` - Upload com deleção de arquivos antigos e avisos sobre cache
