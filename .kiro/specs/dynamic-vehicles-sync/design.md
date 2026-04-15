# Design: Sincronização de Veículos Dinâmicos no Admin

## Visão Geral

Modificar as páginas admin que usam listas hardcoded de veículos para buscar dinamicamente do banco de dados via `getVehicleRegistry()`.

## Arquitetura Atual vs. Proposta

### Atual (Hardcoded)
```
┌─────────────────────────────────────┐
│ app/admin/imagens/page.tsx          │
│                                     │
│ const FOLDER_GROUPS = [             │
│   { folders: [                      │
│     { value: "fiorinos", ... },     │
│     { value: "van-ducato", ... }    │
│   ]}                                │
│ ]                                   │
└─────────────────────────────────────┘
         ❌ Lista estática
```

### Proposta (Dinâmica)
```
┌─────────────────────────────────────┐
│ app/admin/imagens/page.tsx          │
│                                     │
│ const registry = await              │
│   getVehicleRegistry()              │
│                                     │
│ const folders = registry.map(...)   │
└─────────────────────────────────────┘
         ✅ Busca do banco
         
┌─────────────────────────────────────┐
│ Database (settings table)           │
│                                     │
│ vehicles_registry: [                │
│   { slug: "fiorinos", ... },        │
│   { slug: "teste", ... }  ← dinâmico│
│ ]                                   │
└─────────────────────────────────────┘
```

## Componentes Afetados

### 1. `/app/admin/imagens/page.tsx`

**Problema**: `FOLDER_GROUPS` é hardcoded (linhas 18-106)

**Solução**: Converter para Server Component e buscar veículos dinamicamente

```typescript
// ANTES (Client Component com lista hardcoded)
"use client";
const FOLDER_GROUPS: FolderGroup[] = [
  {
    group: "Veículos",
    folders: [
      { value: "images/aplicacoes/fiorinos", label: "Fiorino", ... },
      // ... hardcoded
    ],
  },
];

// DEPOIS (Server Component com busca dinâmica)
import { getVehicleRegistry } from "@/lib/applications";

export default async function ImagensPage() {
  const registry = await getVehicleRegistry();
  
  const vehicleFolders = registry.map(v => ({
    value: `images/aplicacoes/${v.slug}`,
    label: v.label,
    slotLabels: [
      "Thumbnail (card do veículo)",
      "Galeria — Foto 1",
      "Galeria — Foto 2",
      // ...
    ],
    genericSuffix: "Galeria — Foto",
    recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
    description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
  }));
  
  const FOLDER_GROUPS = [
    { group: "Veículos", folders: vehicleFolders },
    { group: "Site", folders: [...] }, // mantém hardcoded
  ];
  
  // Passa para Client Component
  return <ImagensPageClient folderGroups={FOLDER_GROUPS} />;
}
```

**Mudanças**:
- Converter de Client Component para Server Component
- Buscar `getVehicleRegistry()` no servidor
- Gerar `vehicleFolders` dinamicamente
- Criar novo Client Component `ImagensPageClient` com a lógica atual
- Passar `folderGroups` como prop

### 2. `/app/admin/textos/aplicacoes/[slug]/page.tsx`

**Problema**: `STATIC_DEFAULTS` é hardcoded e valida slugs (linhas 9-150, 169-172)

**Solução**: Remover validação hardcoded e buscar dados do banco sempre

```typescript
// ANTES
const STATIC_DEFAULTS: Record<string, {...}> = {
  fiorinos: { titulo: "Fiorinos", ... },
  // ... hardcoded
};

const staticDefault = STATIC_DEFAULTS[slug];

if (!staticDefault || !data) {
  return <p>Aplicação não encontrada: "{slug}"</p>;
}

// DEPOIS
const load = useCallback(async () => {
  try {
    const res = await fetch("/api/admin/settings");
    const all = await res.json();
    const key = `content_application_${slug}`;
    
    if (all[key]) {
      // Veículo existe no banco
      setData(JSON.parse(all[key]));
    } else {
      // Veículo não existe - criar dados vazios
      setData({
        titulo: "",
        subtitulo: "",
        tituloSecao: "",
        conteudo: [""],
        specs: [{ label: "", valor: "" }],
      });
    }
  } catch {
    // Erro ao carregar
    setData(null);
  } finally {
    setLoading(false);
  }
}, [slug]);

// Validação: apenas verifica se conseguiu carregar
if (!data) {
  return <p>Erro ao carregar aplicação: "{slug}"</p>;
}
```

**Mudanças**:
- Remover `STATIC_DEFAULTS` completamente
- Remover validação `if (!staticDefault)`
- Sempre buscar do banco via `/api/admin/settings`
- Se não existir no banco, criar dados vazios (permite editar)
- Apenas mostrar erro se falhar ao carregar (erro de rede/servidor)

### 3. `/app/admin/textos/legendas-fotos/page.tsx`

**Problema**: Provavelmente tem lista hardcoded de aplicações

**Solução**: Buscar dinamicamente via `getVehicleRegistry()`

```typescript
// ANTES (se existir)
const aplicacoes = [
  { slug: "fiorinos", label: "Fiorinos" },
  // ... hardcoded
];

// DEPOIS
import { getVehicleRegistry } from "@/lib/applications";

export default async function LegendasFotosPage() {
  const registry = await getVehicleRegistry();
  
  return <LegendasFotosClient aplicacoes={registry} />;
}
```

**Mudanças**:
- Converter para Server Component (se ainda não for)
- Buscar `getVehicleRegistry()` no servidor
- Passar para Client Component como prop

## Fluxo de Dados

### Criação de Veículo
```
1. Usuário cria "teste" em /admin/veiculos
   ↓
2. Sistema salva em vehicles_registry (banco)
   ↓
3. Sistema cria content_application_teste (banco)
   ↓
4. Sistema cria pasta public/images/aplicacoes/teste/
   ↓
5. Usuário acessa /admin/imagens
   ↓
6. Server Component busca getVehicleRegistry()
   ↓
7. "teste" aparece na lista de veículos ✅
```

### Edição de Textos
```
1. Usuário acessa /admin/textos/aplicacoes/teste
   ↓
2. Client Component busca /api/admin/settings
   ↓
3. Encontra content_application_teste no banco
   ↓
4. Carrega dados e mostra formulário ✅
   ↓
5. Usuário edita e salva
   ↓
6. Sistema atualiza content_application_teste
   ↓
7. Sistema atualiza vehicles_registry.label (sincroniza título)
```

### Upload de Imagens
```
1. Usuário acessa /admin/imagens
   ↓
2. Seleciona "teste" na sidebar
   ↓
3. Faz upload de imagem
   ↓
4. Sistema salva em public/images/aplicacoes/teste/
   ↓
5. Imagem aparece na lista ✅
```

## Estrutura de Arquivos

```
app/admin/
├── imagens/
│   ├── page.tsx                    ← Server Component (busca registry)
│   └── ImagensPageClient.tsx       ← Client Component (lógica UI)
├── textos/
│   ├── aplicacoes/
│   │   ├── page.tsx                ← Já é Server Component ✅
│   │   └── [slug]/
│   │       └── page.tsx            ← Client Component (remove validação hardcoded)
│   └── legendas-fotos/
│       ├── page.tsx                ← Server Component (busca registry)
│       └── LegendasFotosClient.tsx ← Client Component (lógica UI)
└── veiculos/
    └── page.tsx                    ← Já funciona ✅

lib/
└── applications.ts
    └── getVehicleRegistry()        ← Já existe ✅
```

## Compatibilidade com Veículos Estáticos

Os 6 veículos originais (fiorinos, van-ducato, van-sprinter, van-master, expert-porta-frigorifica, isolamento-fiorino) devem continuar funcionando normalmente:

1. **Dados Estáticos**: Mantidos em `lib/applications.ts` como fallback
2. **Rotas Estáticas**: Mantidas em `app/fiorinos/page.tsx`, etc.
3. **Prioridade**: Banco de dados tem prioridade sobre dados estáticos
4. **Migração**: Não é necessária (sistema funciona com ambos)

## Validação de Slug

### Antes (Hardcoded)
```typescript
const STATIC_DEFAULTS = { fiorinos: {...}, ... };
if (!STATIC_DEFAULTS[slug]) {
  return "Aplicação não encontrada";
}
```

### Depois (Dinâmico)
```typescript
// Busca do banco
const data = await fetch(`/api/admin/settings`);
const content = data[`content_application_${slug}`];

if (!content) {
  // Cria dados vazios (permite editar novo veículo)
  return { titulo: "", subtitulo: "", ... };
}
```

## Tratamento de Erros

### Cenário 1: Veículo Não Existe no Banco
```typescript
// ANTES: Erro "Aplicação não encontrada"
// DEPOIS: Cria dados vazios, permite editar
```

### Cenário 2: Erro ao Buscar do Banco
```typescript
// ANTES: Usa fallback hardcoded
// DEPOIS: Mostra erro de rede, permite retry
```

### Cenário 3: Veículo Deletado
```typescript
// ANTES: Continua aparecendo (hardcoded)
// DEPOIS: Some automaticamente de todas as listas
```

## Performance

### Impacto
- **Server Components**: Busca no servidor (sem impacto no cliente)
- **Cache**: Next.js cacheia automaticamente (revalidate on-demand)
- **Latência**: +10-50ms por busca no banco (aceitável para admin)

### Otimizações
- Usar `revalidatePath()` ao criar/deletar veículo
- Manter Client Components para interatividade (upload, drag&drop)
- Passar dados via props (evita re-fetch desnecessário)

## Testes de Regressão

### Veículos Estáticos (Não Devem Quebrar)
```
✅ /fiorinos continua funcionando
✅ /van-ducato continua funcionando
✅ /admin/imagens mostra fiorinos, van-ducato, etc.
✅ /admin/textos/aplicacoes/fiorinos permite editar
✅ Dados estáticos em lib/applications.ts são usados como fallback
```

### Veículos Dinâmicos (Devem Funcionar)
```
✅ Criar "teste" em /admin/veiculos
✅ "teste" aparece em /admin/imagens
✅ "teste" aparece em /admin/textos/aplicacoes
✅ "teste" aparece em /admin/textos/legendas-fotos
✅ Editar textos de "teste" funciona
✅ Upload de imagens para "teste" funciona
✅ Deletar "teste" remove de todas as listas
```

## Rollback Plan

Se houver problemas:
1. Reverter commits
2. Restaurar listas hardcoded
3. Veículos dinâmicos voltam a não funcionar (estado atual)
4. Veículos estáticos continuam funcionando normalmente

## Cronograma de Implementação

1. **Fase 1**: `/app/admin/imagens/page.tsx` (2-3 horas)
   - Criar `ImagensPageClient.tsx`
   - Converter `page.tsx` para Server Component
   - Buscar `getVehicleRegistry()` e gerar folders dinamicamente
   - Testar upload de imagens para veículo dinâmico

2. **Fase 2**: `/app/admin/textos/aplicacoes/[slug]/page.tsx` (1-2 horas)
   - Remover `STATIC_DEFAULTS`
   - Remover validação hardcoded
   - Permitir edição de veículos dinâmicos
   - Testar edição de textos para veículo dinâmico

3. **Fase 3**: `/app/admin/textos/legendas-fotos/page.tsx` (1 hora)
   - Verificar se tem lista hardcoded
   - Se sim, converter para busca dinâmica
   - Testar legendas para veículo dinâmico

4. **Fase 4**: Testes de Regressão (1 hora)
   - Testar veículos estáticos (não devem quebrar)
   - Testar veículos dinâmicos (devem funcionar)
   - Testar criação, edição e deleção

**Total Estimado**: 5-7 horas
