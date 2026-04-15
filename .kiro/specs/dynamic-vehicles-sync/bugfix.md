# Bug: Veículos Dinâmicos Não Sincronizam com Admin

## Descrição do Bug

Quando um novo veículo é criado em "Gerenciar Veículos" (`/admin/veiculos`), ele:

✅ **Funciona**:
- Aparece na lista de veículos em `/admin/veiculos`
- Aparece na lista de aplicações em `/admin/textos/aplicacoes`
- Aparece no footer do site (após salvar)
- Cria conteúdo inicial no banco de dados
- Cria pasta de imagens no servidor

❌ **NÃO Funciona**:
- **NÃO** aparece na lista de pastas em `/admin/imagens` (lista hardcoded)
- **NÃO** permite editar textos em `/admin/textos/aplicacoes/[slug]` (erro "Aplicação não encontrada")
- **NÃO** aparece na lista de aplicações em `/admin/textos/legendas-fotos` (lista hardcoded)

## Condição do Bug C(X)

**C(X)**: Um veículo dinâmico X (criado via `/admin/veiculos`) existe no banco de dados (`vehicles_registry`) MAS:
- X não está presente em `FOLDER_GROUPS` de `/admin/imagens/page.tsx`, OU
- X não está presente em `STATIC_DEFAULTS` de `/admin/textos/aplicacoes/[slug]/page.tsx`, OU
- X não está presente na lista de aplicações de `/admin/textos/legendas-fotos/page.tsx`

## Exemplo Concreto

1. Usuário cria veículo "teste" com slug "teste" em `/admin/veiculos`
2. Sistema cria:
   - Entrada no banco: `vehicles_registry` com `{ slug: "teste", label: "teste", href: "/aplicacoes/teste", ordem: 7 }`
   - Conteúdo inicial: `content_application_teste` com título, subtítulo, etc.
   - Pasta: `public/images/aplicacoes/teste/`
3. Usuário vai em `/admin/imagens`:
   - ❌ "teste" NÃO aparece na lista de veículos (sidebar)
   - ❌ Não consegue fazer upload de imagens para "teste"
4. Usuário vai em `/admin/textos/aplicacoes` e clica em "teste":
   - ❌ Página mostra "Aplicação não encontrada: teste"
   - ❌ Não consegue editar textos do veículo
5. Usuário vai em `/admin/textos/legendas-fotos`:
   - ❌ "teste" NÃO aparece na lista de aplicações
   - ❌ Não consegue adicionar legendas para fotos de "teste"

## Causa Raiz

### 1. `/app/admin/imagens/page.tsx` (linhas 18-106)
```typescript
const FOLDER_GROUPS: FolderGroup[] = [
  {
    group: "Veículos",
    folders: [
      { value: "images/aplicacoes/fiorinos", label: "Fiorino", ... },
      { value: "images/aplicacoes/van-ducato", label: "Van Ducato", ... },
      // ... HARDCODED - não busca do banco
    ],
  },
];
```

**Problema**: Lista hardcoded não sincroniza com `vehicles_registry` do banco.

### 2. `/app/admin/textos/aplicacoes/[slug]/page.tsx` (linhas 9-150)
```typescript
const STATIC_DEFAULTS: Record<string, { titulo: string; ... }> = {
  fiorinos: { titulo: "Fiorinos", ... },
  "van-ducato": { titulo: "Van Ducato", ... },
  // ... HARDCODED - não busca do banco
};

// Linha 169-172
if (!staticDefault || !data) {
  return (
    <div className="space-y-4">
      <p className="text-destructive">Aplicação não encontrada: &quot;{slug}&quot;</p>
```

**Problema**: Página só funciona se o slug existir em `STATIC_DEFAULTS`. Veículos dinâmicos não têm entrada aqui.

### 3. `/app/admin/textos/legendas-fotos/page.tsx`
```typescript
// Provavelmente também tem lista hardcoded de aplicações
```

**Problema**: Lista hardcoded não sincroniza com `vehicles_registry` do banco.

## Impacto

- **Severidade**: Alta
- **Frequência**: Sempre que um novo veículo é criado
- **Usuários Afetados**: Administradores que criam novos veículos
- **Workaround**: Nenhum (usuário não consegue gerenciar imagens/textos do novo veículo)

## Arquivos Afetados

1. `app/admin/imagens/page.tsx` - Lista hardcoded de pastas de veículos
2. `app/admin/textos/aplicacoes/[slug]/page.tsx` - Validação hardcoded de slugs válidos
3. `app/admin/textos/legendas-fotos/page.tsx` - Lista hardcoded de aplicações
4. `lib/applications.ts` - Já tem `getVehicleRegistry()` que busca do banco ✅

## Solução Esperada

Quando um veículo dinâmico é criado:
1. ✅ Deve aparecer automaticamente na lista de pastas em `/admin/imagens`
2. ✅ Deve permitir edição de textos em `/admin/textos/aplicacoes/[slug]`
3. ✅ Deve aparecer na lista de aplicações em `/admin/textos/legendas-fotos`
4. ✅ Deve funcionar exatamente como os veículos estáticos (fiorinos, van-ducato, etc.)

## Testes de Validação

### Teste 1: Criar Novo Veículo
```
GIVEN: Usuário está em /admin/veiculos
WHEN: Cria veículo "Caminhão Truck" com slug "caminhao-truck"
THEN: 
  - Veículo aparece em /admin/veiculos ✅
  - Veículo aparece em /admin/textos/aplicacoes ✅
  - Veículo aparece em /admin/imagens (sidebar "Veículos") ✅
  - Veículo aparece em /admin/textos/legendas-fotos ✅
```

### Teste 2: Editar Textos de Veículo Dinâmico
```
GIVEN: Veículo "caminhao-truck" foi criado
WHEN: Acessa /admin/textos/aplicacoes/caminhao-truck
THEN:
  - Página carrega sem erro ✅
  - Mostra formulário de edição com campos preenchidos ✅
  - Permite salvar alterações ✅
```

### Teste 3: Upload de Imagens para Veículo Dinâmico
```
GIVEN: Veículo "caminhao-truck" foi criado
WHEN: Acessa /admin/imagens e seleciona "Caminhão Truck" na sidebar
THEN:
  - Pasta "caminhao-truck" aparece na lista ✅
  - Permite fazer upload de imagens ✅
  - Imagens aparecem na galeria do veículo ✅
```

### Teste 4: Legendas de Fotos para Veículo Dinâmico
```
GIVEN: Veículo "caminhao-truck" foi criado e tem fotos
WHEN: Acessa /admin/textos/legendas-fotos
THEN:
  - "Caminhão Truck" aparece na lista de aplicações ✅
  - Permite selecionar e adicionar legendas ✅
```

### Teste 5: Deletar Veículo
```
GIVEN: Veículo "caminhao-truck" existe
WHEN: Deleta veículo em /admin/veiculos
THEN:
  - Veículo some de /admin/veiculos ✅
  - Veículo some de /admin/textos/aplicacoes ✅
  - Veículo some de /admin/imagens ✅
  - Veículo some de /admin/textos/legendas-fotos ✅
```

## Notas Técnicas

- `lib/applications.ts` já tem `getVehicleRegistry()` que busca do banco
- Veículos estáticos (fiorinos, van-ducato, etc.) devem continuar funcionando normalmente
- Veículos dinâmicos usam rota `/aplicacoes/[slug]` (não têm rota estática própria)
- Sistema já cria pasta de imagens automaticamente ao criar veículo
- Sistema já cria conteúdo inicial no banco ao criar veículo
