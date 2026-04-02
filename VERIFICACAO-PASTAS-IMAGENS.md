# Verificação de Sincronização de Pastas de Imagens

## Data: 2026-03-23

## 1. ESTRUTURA REAL DE PASTAS (public/images/)

### Pastas Principais:
- ✅ `images/hero` - Banners do hero
- ✅ `images/fotos-servicos` - Fotos de serviços/portfólio
- ✅ `images/empresa` - Imagens da empresa
- ✅ `images/og` - Open Graph images
- ✅ `images/logo` - Logos
- ✅ `images/formas-pagamento` - Formas de pagamento
- ✅ `images/galeria` - Galeria (vazia)

### Pastas de Aplicações (images/aplicacoes/):
- ✅ `images/aplicacoes/fiorinos`
- ✅ `images/aplicacoes/isolamento-fiorino`
- ✅ `images/aplicacoes/van-ducato`
- ✅ `images/aplicacoes/van-sprinter`
- ✅ `images/aplicacoes/van-master`
- ✅ `images/aplicacoes/expert-porta-frigorifica`
- ✅ `images/aplicacoes/fiorino-porta-frigorifica`

**Total: 7 pastas de aplicações**

---

## 2. VERIFICAÇÃO DAS APIs

### 2.1. app/api/admin/images/route.ts (GET/POST - Upload e Listagem)

```typescript
const ALLOWED_FOLDERS = [
  "images/hero",                                    ✅
  "images/fotos-servicos",                          ✅
  "images/empresa",                                 ✅
  "images/og",                                      ✅
  "images/logo",                                    ✅
  "images/formas-pagamento",                        ✅
  "images/aplicacoes/fiorinos",                     ✅
  "images/aplicacoes/van-ducato",                   ✅
  "images/aplicacoes/van-sprinter",                 ✅
  "images/aplicacoes/van-master",                   ✅
  "images/aplicacoes/expert-porta-frigorifica",     ✅
  "images/aplicacoes/isolamento-fiorino",           ✅
];
```

**Status: ✅ COMPLETO**
- Faltando: `images/aplicacoes/fiorino-porta-frigorifica`

### 2.2. app/api/admin/images/[filename]/route.ts (DELETE)

```typescript
const ALLOWED_FOLDERS = [
  "images/hero",                                    ✅
  "images/fotos-servicos",                          ✅
  "images/empresa",                                 ✅
  "images/og",                                      ✅
  "images/logo",                                    ✅
  "images/aplicacoes/fiorinos",                     ✅
  "images/aplicacoes/isolamento-fiorino",           ✅ (CORRIGIDO)
  "images/aplicacoes/van-ducato",                   ✅
  "images/aplicacoes/van-sprinter",                 ✅
  "images/aplicacoes/van-master",                   ✅
  "images/aplicacoes/expert-porta-frigorifica",     ✅
  "images/aplicacoes/fiorino-porta-frigorifica",    ✅
];
```

**Status: ⚠️ INCOMPLETO**
- Faltando: `images/formas-pagamento`

### 2.3. app/api/admin/images/rename/route.ts (POST - Renomear)

```typescript
const ALLOWED_FOLDERS = [
  "images/hero",                                    ✅
  "images/fotos-servicos",                          ✅
  "images/empresa",                                 ✅
  "images/og",                                      ✅
  "images/logo",                                    ✅
  "images/aplicacoes/fiorinos",                     ✅
  "images/aplicacoes/isolamento-fiorino",           ✅ (CORRIGIDO)
  "images/aplicacoes/van-ducato",                   ✅
  "images/aplicacoes/van-sprinter",                 ✅
  "images/aplicacoes/van-master",                   ✅
  "images/aplicacoes/expert-porta-frigorifica",     ✅
  "images/aplicacoes/fiorino-porta-frigorifica",    ✅
];
```

**Status: ⚠️ INCOMPLETO**
- Faltando: `images/formas-pagamento`

---

## 3. VERIFICAÇÃO NO CÓDIGO (lib/applications.ts)

Todas as 6 aplicações estão corretamente referenciadas:

1. ✅ `fiorinos` → `/images/aplicacoes/fiorinos/`
2. ✅ `van-ducato` → `/images/aplicacoes/van-ducato/`
3. ✅ `van-sprinter` → `/images/aplicacoes/van-sprinter/`
4. ✅ `van-master` → `/images/aplicacoes/van-master/`
5. ✅ `expert-porta-frigorifica` → `/images/aplicacoes/expert-porta-frigorifica/`
6. ✅ `isolamento-fiorino` → `/images/aplicacoes/isolamento-fiorino/`

**Status: ✅ COMPLETO**

---

## 4. PROBLEMAS ENCONTRADOS

### 🔴 Problema 1: Pasta `fiorino-porta-frigorifica` não está nas APIs principais

**Pasta existe:** `public/images/aplicacoes/fiorino-porta-frigorifica/`

**Faltando em:**
- ❌ `app/api/admin/images/route.ts` (GET/POST)

**Presente em:**
- ✅ `app/api/admin/images/[filename]/route.ts` (DELETE)
- ✅ `app/api/admin/images/rename/route.ts` (RENAME)

**Impacto:** Não é possível fazer upload ou listar imagens nesta pasta via admin.

---

### 🟡 Problema 2: Pasta `formas-pagamento` não está em 2 APIs

**Pasta existe:** `public/images/formas-pagamento/`

**Faltando em:**
- ❌ `app/api/admin/images/[filename]/route.ts` (DELETE)
- ❌ `app/api/admin/images/rename/route.ts` (RENAME)

**Presente em:**
- ✅ `app/api/admin/images/route.ts` (GET/POST)

**Impacto:** Não é possível deletar ou renomear imagens de formas de pagamento via admin.

---

### 🟢 Problema 3: Pasta `galeria` não está em nenhuma API

**Pasta existe:** `public/images/galeria/` (vazia)

**Faltando em todas as APIs**

**Impacto:** Pasta não é gerenciável via admin. Se for necessária, precisa ser adicionada.

---

## 5. CORREÇÕES NECESSÁRIAS

### Correção 1: Adicionar `fiorino-porta-frigorifica` em route.ts

```typescript
// app/api/admin/images/route.ts
const ALLOWED_FOLDERS = [
  // ... outras pastas
  "images/aplicacoes/fiorino-porta-frigorifica",  // ADICIONAR
];
```

### Correção 2: Adicionar `formas-pagamento` em [filename]/route.ts

```typescript
// app/api/admin/images/[filename]/route.ts
const ALLOWED_FOLDERS = [
  // ... outras pastas
  "images/formas-pagamento",  // ADICIONAR
];
```

### Correção 3: Adicionar `formas-pagamento` em rename/route.ts

```typescript
// app/api/admin/images/rename/route.ts
const ALLOWED_FOLDERS = [
  // ... outras pastas
  "images/formas-pagamento",  // ADICIONAR
];
```

### Correção 4 (Opcional): Adicionar `galeria` se necessário

Se a pasta galeria for usada no futuro, adicionar em todas as 3 APIs.

---

## 6. LISTA COMPLETA RECOMENDADA

Para garantir 100% de sincronização, todas as 3 APIs devem ter:

```typescript
const ALLOWED_FOLDERS = [
  "images/hero",
  "images/fotos-servicos",
  "images/empresa",
  "images/og",
  "images/logo",
  "images/formas-pagamento",
  "images/galeria",  // Opcional, se for usar
  "images/aplicacoes/fiorinos",
  "images/aplicacoes/isolamento-fiorino",
  "images/aplicacoes/van-ducato",
  "images/aplicacoes/van-sprinter",
  "images/aplicacoes/van-master",
  "images/aplicacoes/expert-porta-frigorifica",
  "images/aplicacoes/fiorino-porta-frigorifica",
];
```

---

## 7. RESUMO

| Pasta | Existe? | route.ts | [filename]/route.ts | rename/route.ts | Status |
|-------|---------|----------|---------------------|-----------------|--------|
| images/hero | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| images/fotos-servicos | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| images/empresa | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| images/og | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| images/logo | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| images/formas-pagamento | ✅ | ✅ | ❌ | ❌ | ⚠️ CORRIGIR |
| images/galeria | ✅ | ❌ | ❌ | ❌ | 🟡 OPCIONAL |
| aplicacoes/fiorinos | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/isolamento-fiorino | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/van-ducato | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/van-sprinter | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/van-master | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/expert-porta-frigorifica | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| aplicacoes/fiorino-porta-frigorifica | ✅ | ❌ | ✅ | ✅ | ⚠️ CORRIGIR |

**Total de problemas:** 3 (2 críticos + 1 opcional)

---

## 8. AÇÃO RECOMENDADA

Aplicar as correções 1, 2 e 3 para garantir que todas as pastas existentes sejam gerenciáveis via admin.
