# Tasks: Sincronização de Veículos Dinâmicos no Admin

## 1. Preparação e Análise
- [x] 1.1 Ler arquivo `/app/admin/textos/legendas-fotos/page.tsx` completo para verificar se tem lista hardcoded
- [x] 1.2 Ler arquivo `/app/admin/textos/legendas-fotos/LegendasFotosClient.tsx` para entender estrutura
- [x] 1.3 Documentar estrutura atual de legendas-fotos (se tem lista hardcoded ou não)

## 2. Refatorar `/app/admin/imagens/page.tsx`
- [x] 2.1 Criar novo arquivo `/app/admin/imagens/ImagensPageClient.tsx`
  - [x] 2.1.1 Copiar toda a lógica Client Component atual
  - [x] 2.1.2 Adicionar prop `folderGroups: FolderGroup[]`
  - [x] 2.1.3 Remover `FOLDER_GROUPS` hardcoded
  - [x] 2.1.4 Usar `folderGroups` da prop
  - [x] 2.1.5 Manter toda a lógica de upload, delete, replace, etc.
- [x] 2.2 Modificar `/app/admin/imagens/page.tsx`
  - [x] 2.2.1 Remover `"use client"` (converter para Server Component)
  - [x] 2.2.2 Importar `getVehicleRegistry` de `@/lib/applications`
  - [x] 2.2.3 Buscar `registry = await getVehicleRegistry()`
  - [x] 2.2.4 Gerar `vehicleFolders` dinamicamente a partir de `registry`
  - [x] 2.2.5 Manter `siteFolders` hardcoded (Fotos de Serviços, Empresa, etc.)
  - [x] 2.2.6 Construir `FOLDER_GROUPS` com veículos dinâmicos + site hardcoded
  - [x] 2.2.7 Renderizar `<ImagensPageClient folderGroups={FOLDER_GROUPS} />`
- [ ] 2.3 Testar funcionalidade de imagens
  - [ ] 2.3.1 Verificar se veículos estáticos aparecem na lista
  - [ ] 2.3.2 Verificar se veículo "teste" aparece na lista
  - [ ] 2.3.3 Testar upload de imagem para "teste"
  - [ ] 2.3.4 Testar substituição de imagem para "teste"
  - [ ] 2.3.5 Testar deleção de imagem para "teste"

## 3. Refatorar `/app/admin/textos/aplicacoes/[slug]/page.tsx`
- [x] 3.1 Remover `STATIC_DEFAULTS` completamente
- [x] 3.2 Modificar função `load()`
  - [x] 3.2.1 Remover dependência de `staticDefault`
  - [x] 3.2.2 Sempre buscar do banco via `/api/admin/settings`
  - [x] 3.2.3 Se não existir no banco, criar dados vazios:
    ```typescript
    {
      titulo: "",
      subtitulo: "",
      tituloSecao: "",
      conteudo: [""],
      specs: [{ label: "", valor: "" }],
    }
    ```
  - [x] 3.2.4 Apenas retornar `null` em caso de erro de rede
- [x] 3.3 Modificar validação de erro
  - [x] 3.3.1 Remover `if (!staticDefault || !data)`
  - [x] 3.3.2 Apenas mostrar erro se `data === null` (erro de rede)
  - [x] 3.3.3 Permitir edição mesmo se dados estiverem vazios
- [ ] 3.4 Testar edição de textos
  - [ ] 3.4.1 Verificar se veículos estáticos carregam corretamente
  - [ ] 3.4.2 Verificar se veículo "teste" carrega (mesmo sem dados)
  - [ ] 3.4.3 Testar edição de título, subtítulo, conteúdo de "teste"
  - [ ] 3.4.4 Testar salvamento de dados de "teste"
  - [ ] 3.4.5 Verificar se título sincroniza com `vehicles_registry`

## 4. Refatorar `/app/admin/textos/legendas-fotos/` (se necessário)
- [ ] 4.1 **SE** `page.tsx` tem lista hardcoded de aplicações:
  - [ ] 4.1.1 Converter para Server Component (se ainda não for)
  - [ ] 4.1.2 Importar `getVehicleRegistry` de `@/lib/applications`
  - [ ] 4.1.3 Buscar `registry = await getVehicleRegistry()`
  - [ ] 4.1.4 Passar `registry` como prop para Client Component
- [ ] 4.2 **SE** `LegendasFotosClient.tsx` tem lista hardcoded:
  - [ ] 4.2.1 Adicionar prop `aplicacoes: VehicleRegistryItem[]`
  - [ ] 4.2.2 Remover lista hardcoded
  - [ ] 4.2.3 Usar `aplicacoes` da prop
- [ ] 4.3 Testar legendas de fotos
  - [ ] 4.3.1 Verificar se veículos estáticos aparecem na lista
  - [ ] 4.3.2 Verificar se veículo "teste" aparece na lista
  - [ ] 4.3.3 Testar adição de legenda para foto de "teste"
  - [ ] 4.3.4 Testar salvamento de legenda de "teste"

## 5. Testes de Integração
- [ ] 5.1 Criar novo veículo "caminhao-truck"
  - [ ] 5.1.1 Acessar `/admin/veiculos`
  - [ ] 5.1.2 Adicionar veículo "Caminhão Truck" com slug "caminhao-truck"
  - [ ] 5.1.3 Verificar se aparece na lista de veículos
- [ ] 5.2 Verificar sincronização em todas as páginas
  - [ ] 5.2.1 Acessar `/admin/imagens` → "Caminhão Truck" deve aparecer
  - [ ] 5.2.2 Acessar `/admin/textos/aplicacoes` → "Caminhão Truck" deve aparecer
  - [ ] 5.2.3 Acessar `/admin/textos/legendas-fotos` → "Caminhão Truck" deve aparecer
- [ ] 5.3 Testar funcionalidades completas
  - [ ] 5.3.1 Upload de 3 imagens para "caminhao-truck"
  - [ ] 5.3.2 Editar textos de "caminhao-truck" (título, subtítulo, conteúdo)
  - [ ] 5.3.3 Adicionar legenda para foto de "caminhao-truck"
  - [ ] 5.3.4 Verificar se tudo salva corretamente
- [ ] 5.4 Testar deleção de veículo
  - [ ] 5.4.1 Deletar "caminhao-truck" em `/admin/veiculos`
  - [ ] 5.4.2 Verificar se some de `/admin/imagens`
  - [ ] 5.4.3 Verificar se some de `/admin/textos/aplicacoes`
  - [ ] 5.4.4 Verificar se some de `/admin/textos/legendas-fotos`

## 6. Testes de Regressão (Veículos Estáticos)
- [ ] 6.1 Testar "fiorinos"
  - [ ] 6.1.1 Acessar `/fiorinos` → deve carregar normalmente
  - [ ] 6.1.2 Acessar `/admin/imagens` → "Fiorino" deve aparecer
  - [ ] 6.1.3 Acessar `/admin/textos/aplicacoes/fiorinos` → deve permitir editar
  - [ ] 6.1.4 Upload de imagem para "fiorinos" → deve funcionar
- [ ] 6.2 Testar "van-ducato"
  - [ ] 6.2.1 Acessar `/van-ducato` → deve carregar normalmente
  - [ ] 6.2.2 Acessar `/admin/imagens` → "Van Ducato" deve aparecer
  - [ ] 6.2.3 Acessar `/admin/textos/aplicacoes/van-ducato` → deve permitir editar
- [ ] 6.3 Testar outros veículos estáticos
  - [ ] 6.3.1 van-sprinter
  - [ ] 6.3.2 van-master
  - [ ] 6.3.3 expert-porta-frigorifica
  - [ ] 6.3.4 isolamento-fiorino

## 7. Validação Final
- [ ] 7.1 Verificar que não há erros no console do navegador
- [ ] 7.2 Verificar que não há erros no terminal do servidor
- [ ] 7.3 Verificar que todas as funcionalidades funcionam:
  - [ ] 7.3.1 Criar veículo dinâmico
  - [ ] 7.3.2 Editar textos de veículo dinâmico
  - [ ] 7.3.3 Upload de imagens para veículo dinâmico
  - [ ] 7.3.4 Adicionar legendas para veículo dinâmico
  - [ ] 7.3.5 Deletar veículo dinâmico
- [ ] 7.4 Verificar que veículos estáticos continuam funcionando
- [ ] 7.5 Fazer commit das alterações com mensagem descritiva

## Notas de Implementação

### Estrutura de `vehicleFolders`
```typescript
const vehicleFolders = registry.map(v => ({
  value: `images/aplicacoes/${v.slug}`,
  label: v.label,
  slotLabels: [
    "Thumbnail (card do veículo)",
    "Galeria — Foto 1",
    "Galeria — Foto 2",
    "Galeria — Foto 3",
    "Galeria — Foto 4",
    "Galeria — Foto 5",
  ],
  genericSuffix: "Galeria — Foto",
  recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
  description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
}));
```

### Dados Vazios para Novo Veículo
```typescript
const emptyData = {
  titulo: "",
  subtitulo: "",
  tituloSecao: "",
  conteudo: [""],
  specs: [{ label: "", valor: "" }],
};
```

### Validação de Erro
```typescript
// ANTES
if (!staticDefault || !data) {
  return "Aplicação não encontrada";
}

// DEPOIS
if (data === null) {
  return "Erro ao carregar aplicação";
}
// Se data === emptyData, permite editar normalmente
```
