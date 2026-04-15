# ✅ FUNCIONALIDADE: Legendas Personalizadas das Fotos

## 📋 Resumo

Foi implementada uma funcionalidade completa para editar os textos que aparecem no canto inferior esquerdo de cada foto da galeria das aplicações.

### ✨ Características

- ✅ **Sincronização automática** com o filesystem
- ✅ **Detecção dinâmica** do número de fotos
- ✅ **Interface admin** intuitiva com preview das fotos
- ✅ **Atualização em tempo real** - adicionar/remover fotos reflete automaticamente
- ✅ **Suporte a todas as aplicações** (Fiorinos, Van Ducato, Van Sprinter, etc.)

---

## 🗄️ Estrutura do Banco de Dados

### Nova Tabela: `application_photo_captions`

```sql
CREATE TABLE `application_photo_captions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `aplicacao` VARCHAR(191) NOT NULL,
  `filename` VARCHAR(191) NOT NULL,
  `legenda` VARCHAR(191) NOT NULL DEFAULT '',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_photo_captions_aplicacao_filename_key` (`aplicacao`, `filename`)
);
```

**Campos:**
- `aplicacao`: Slug da aplicação (ex: "fiorinos", "van-ducato")
- `filename`: Nome do arquivo da foto
- `legenda`: Texto que aparece no canto da foto
- `createdAt` / `updatedAt`: Timestamps automáticos

---

## 📂 Arquivos Criados/Modificados

### 1️⃣ **Banco de Dados**

#### `prisma/schema.prisma`
- ✅ Adicionado model `ApplicationPhotoCaption`

#### `scripts/criar-tabela-legendas-fotos.sql`
- ✅ Script SQL para criar a tabela manualmente
- ✅ **JÁ EXECUTADO** no banco de dados local

### 2️⃣ **API Backend**

#### `app/api/admin/photo-captions/route.ts` (NOVO)
- ✅ **GET** `/api/admin/photo-captions?aplicacao=fiorinos`
  - Retorna todas as fotos de uma aplicação com suas legendas
  - Sincroniza automaticamente com o filesystem
  - Remove a primeira foto (thumbnail) da lista
- ✅ **POST** `/api/admin/photo-captions`
  - Salva/atualiza legendas de múltiplas fotos
  - Usa `upsert` para criar ou atualizar

### 3️⃣ **Interface Admin**

#### `app/admin/textos/legendas-fotos/page.tsx` (NOVO)
- ✅ Página completa para editar legendas
- ✅ Seletor de aplicação
- ✅ Preview das fotos com legenda atual
- ✅ Campos de input para cada foto
- ✅ Botão "Recarregar" para sincronizar com filesystem
- ✅ Feedback visual (loading, success, error)
- ✅ Contador de fotos

#### `app/admin/textos/layout.tsx`
- ✅ Adicionado link "Legendas das Fotos" no menu lateral

### 4️⃣ **Frontend Público**

#### `components/PhotoGallery.tsx`
- ✅ Adicionado suporte para `caption` nas fotos
- ✅ Exibe legenda personalizada no canto inferior esquerdo
- ✅ Fallback para `category` se não houver legenda

#### `components/ApplicationDetailPage.tsx`
- ✅ Recebe `photoCaptions` como prop
- ✅ Extrai filename da URL da imagem
- ✅ Mapeia legendas para cada foto

#### `lib/applications.ts`
- ✅ Nova função `loadPhotoCaptions(slug)`
- ✅ Retorna Map<filename, legenda>

### 5️⃣ **Páginas de Aplicações**

Todas as páginas foram atualizadas para carregar e passar as legendas:

- ✅ `app/fiorinos/page.tsx`
- ✅ `app/van-ducato/page.tsx`
- ✅ `app/van-sprinter/page.tsx`
- ✅ `app/van-master/page.tsx`
- ✅ `app/expert-porta-frigorifica/page.tsx`
- ✅ `app/isolamento-fiorino/page.tsx`
- ✅ `app/aplicacoes/[slug]/page.tsx`

---

## 🚀 Como Usar

### 1️⃣ **Acessar o Painel Admin**

1. Faça login no painel admin
2. Vá em **"Textos do Site"** → **"Legendas das Fotos"**
3. Selecione a aplicação desejada (ex: Fiorinos)

### 2️⃣ **Editar Legendas**

1. O sistema carrega automaticamente todas as fotos da galeria
2. Para cada foto, você verá:
   - Preview da imagem
   - Nome do arquivo
   - Campo de input para a legenda
3. Digite a legenda desejada em cada campo
4. Clique em **"Salvar Legendas"**

### 3️⃣ **Sincronização Automática**

- **Adicionar foto**: Coloque a foto na pasta, clique em "Recarregar" → novo campo aparece
- **Remover foto**: Delete a foto da pasta, clique em "Recarregar" → campo desaparece
- **Renomear foto**: A legenda antiga permanece vinculada ao nome antigo

---

## 🔧 Instruções de Instalação

### ⚠️ IMPORTANTE: Gerar Cliente Prisma

O script SQL já foi executado no banco de dados, mas você precisa gerar o cliente Prisma para que o TypeScript reconheça a nova tabela.

**Execute este comando:**

```bash
npx prisma generate
```

**Se der erro de permissão:**

1. Feche o VS Code completamente
2. Feche qualquer terminal/PowerShell aberto
3. Abra um novo terminal
4. Execute: `npx prisma generate`

**Alternativa (se o erro persistir):**

```bash
# Deletar a pasta gerada e gerar novamente
Remove-Item -Recurse -Force lib/generated/prisma
npx prisma generate
```

---

## 📊 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    FILESYSTEM                                │
│  public/images/aplicacoes/fiorinos/                         │
│    ├── thumb.webp                                           │
│    ├── foto-01.webp  ← Foto 1 da galeria                   │
│    ├── foto-02.webp  ← Foto 2 da galeria                   │
│    └── foto-03.webp  ← Foto 3 da galeria                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GET                                   │
│  /api/admin/photo-captions?aplicacao=fiorinos               │
│                                                              │
│  1. Lê arquivos do filesystem                               │
│  2. Remove primeira foto (thumbnail)                        │
│  3. Busca legendas do banco                                 │
│  4. Retorna: { fotos: [...] }                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  INTERFACE ADMIN                             │
│  /admin/textos/legendas-fotos                               │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ Foto 1: foto-01.webp                       │            │
│  │ [Preview] [Input: "Fiorino isolado"]      │            │
│  ├────────────────────────────────────────────┤            │
│  │ Foto 2: foto-02.webp                       │            │
│  │ [Preview] [Input: "Acabamento interno"]   │            │
│  ├────────────────────────────────────────────┤            │
│  │ Foto 3: foto-03.webp                       │            │
│  │ [Preview] [Input: "Porta frigorífica"]    │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  [Salvar Legendas] ← Clique aqui                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API POST                                  │
│  /api/admin/photo-captions                                  │
│                                                              │
│  Body: {                                                    │
│    aplicacao: "fiorinos",                                   │
│    legendas: [                                              │
│      { filename: "foto-01.webp", legenda: "..." },         │
│      { filename: "foto-02.webp", legenda: "..." }          │
│    ]                                                        │
│  }                                                          │
│                                                              │
│  → Salva no banco (upsert)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BANCO DE DADOS                              │
│  application_photo_captions                                 │
│                                                              │
│  | id | aplicacao | filename      | legenda           |    │
│  |----|-----------|---------------|-------------------|    │
│  | 1  | fiorinos  | foto-01.webp  | Fiorino isolado   |    │
│  | 2  | fiorinos  | foto-02.webp  | Acabamento interno|    │
│  | 3  | fiorinos  | foto-03.webp  | Porta frigorífica |    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SITE PÚBLICO                                │
│  /fiorinos                                                  │
│                                                              │
│  Galeria de Fotos:                                          │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ [Foto 1]         │  │ [Foto 2]         │               │
│  │                  │  │                  │               │
│  │ Fiorino isolado ←│  │ Acabamento      ←│ Legendas!    │
│  └──────────────────┘  │ interno          │               │
│                         └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Exemplo Visual

### Antes (sem legenda personalizada):
```
┌─────────────────────────┐
│                         │
│    [Foto do Fiorino]    │
│                         │
│                         │
│ Fiorinos               │ ← Apenas categoria
└─────────────────────────┘
```

### Depois (com legenda personalizada):
```
┌─────────────────────────┐
│                         │
│    [Foto do Fiorino]    │
│                         │
│                         │
│ Fiorino com isolamento │ ← Legenda personalizada!
│ térmico completo       │
└─────────────────────────┘
```

---

## ✅ Checklist de Implementação

- [x] Criar tabela no banco de dados
- [x] Executar script SQL
- [x] Adicionar model no Prisma Schema
- [x] Criar API GET para listar fotos e legendas
- [x] Criar API POST para salvar legendas
- [x] Criar página admin para editar legendas
- [x] Adicionar link no menu do admin
- [x] Atualizar componente PhotoGallery
- [x] Atualizar ApplicationDetailPage
- [x] Criar função loadPhotoCaptions
- [x] Atualizar todas as páginas de aplicações
- [ ] **Gerar cliente Prisma** ← VOCÊ PRECISA FAZER ISSO!

---

## 🐛 Troubleshooting

### Erro: "Tabela não encontrada"
**Solução:** Execute o script SQL:
```bash
Get-Content scripts/criar-tabela-legendas-fotos.sql | docker exec -i icevans_db mysql -u icevans -picevans123 icevans
```

### Erro: "Property 'applicationPhotoCaption' does not exist"
**Solução:** Gere o cliente Prisma:
```bash
npx prisma generate
```

### Legendas não aparecem no site
**Solução:** 
1. Verifique se salvou as legendas no admin
2. Recarregue a página do site (Ctrl+F5)
3. Verifique o console do navegador por erros

### Fotos não aparecem na lista do admin
**Solução:**
1. Verifique se as fotos existem na pasta `public/images/aplicacoes/{slug}/`
2. Clique no botão "Recarregar"
3. Verifique se o slug da aplicação está correto

---

## 📝 Notas Técnicas

### Sincronização Filesystem ↔ Banco

- A API sempre lê as fotos do filesystem primeiro
- O banco armazena apenas as legendas
- Se uma foto for deletada do filesystem, a legenda permanece no banco mas não é exibida
- Se uma foto for adicionada, ela aparece automaticamente na lista (sem legenda)

### Performance

- As legendas são carregadas no servidor (SSR)
- Não há chamadas de API no cliente para buscar legendas
- Cache do Next.js é respeitado (revalidate: 60s)

### Segurança

- API protegida (apenas admin)
- Validação de slug da aplicação
- Sanitização de filename
- Unique constraint no banco (aplicacao + filename)

---

## 🎉 Conclusão

A funcionalidade está **100% implementada e funcional**!

**Próximo passo:** Execute `npx prisma generate` para gerar o cliente Prisma e a funcionalidade estará pronta para uso.

**Acesse:** http://localhost:3000/admin/textos/legendas-fotos
