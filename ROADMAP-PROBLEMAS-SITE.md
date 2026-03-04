# 🚨 ROADMAP DE PROBLEMAS IDENTIFICADOS NO SITE

**Data**: 04/03/2026  
**Análise**: Playwright MCP + Inspeção Visual  
**Ambiente**: http://localhost:3000

---

## 📋 RESUMO EXECUTIVO

### Problemas Críticos (Bloqueadores)
- ❌ Logo do Header não aparece (404)
- ❌ Logo do Footer não aparece (404)
- ❌ 4x erro 401 em `/api/admin/settings` (componentes públicos tentando acessar API protegida)

### Problemas Visuais (Alta Prioridade)
- ⚠️ Filtro de cor do banner hero não está ativo
- ⚠️ Telefone do banner hero não está aparecendo
- ⚠️ Números de contato no Header podem estar desatualizados

---

## 🔴 PROBLEMA 1: Logo do Header não carrega (404)

### Sintoma
```
[ERROR] Failed to load resource: 404 (Not Found)
@ http://localhost:3000/images/logo/logo-white.svg
```

### Causa Raiz
1. **API `/api/logo` retorna `.jpeg`** mas componentes inicializam com `.svg`
2. **Header.tsx** inicializa estado com:
   ```typescript
   const [logoSrc, setLogoSrc] = useState(config.logo.branca || config.logo.principal);
   ```
3. **lib/empresa-config.ts** retorna hardcoded:
   ```typescript
   logo: {
     principal: "/images/logo/logo.svg",
     branca: "/images/logo/logo-white.svg",  // ❌ Não existe!
     escura: "/images/logo/logo-dark.svg",
     favicon: "/images/logo/favicon.ico",
   }
   ```
4. **API `/api/logo/route.ts` encontra** `logo-white.jpeg` mas componente já renderizou com `.svg`

### Solução
**Opção A (Recomendada)**: Buscar logo da API no servidor antes de renderizar
```typescript
// lib/empresa-config.ts
export async function getEmpresaConfig(): Promise<EmpresaConfig> {
  // ... código existente ...
  
  // Busca logos reais da API
  let logos = {
    principal: "/images/logo/logo.svg",
    branca: "/images/logo/logo-white.svg",
    escura: "/images/logo/logo-dark.svg",
    favicon: "/images/logo/favicon.ico",
  };
  
  try {
    const { readdir } = await import("fs/promises");
    const { join } = await import("path");
    const logoDir = join(process.cwd(), "public", "images", "logo");
    const files = await readdir(logoDir);
    
    const logoPrincipal = files.find(f => /^logo\.(svg|png|jpg|jpeg|webp|gif)$/i.test(f));
    const logoBranca = files.find(f => /^logo-white\.(svg|png|jpg|jpeg|webp|gif)$/i.test(f));
    const logoEscura = files.find(f => /^logo-dark\.(svg|png|jpg|jpeg|webp|gif)$/i.test(f));
    const favicon = files.find(f => /^favicon\.(ico|png|jpg|jpeg|svg|webp)$/i.test(f));
    
    if (logoPrincipal) logos.principal = `/images/logo/${logoPrincipal}`;
    if (logoBranca) logos.branca = `/images/logo/${logoBranca}`;
    if (logoEscura) logos.escura = `/images/logo/${logoEscura}`;
    if (favicon) logos.favicon = `/images/logo/${favicon}`;
  } catch (error) {
    console.error('Erro ao buscar logos:', error);
  }
  
  return {
    // ... outros campos ...
    logo: logos,
  };
}
```

**Opção B**: Remover fetch inicial do useEffect (já feito) e confiar nos dados do servidor

### Impacto
- **Usuário**: Logo não aparece, prejudica identidade visual
- **SEO**: Imagem quebrada pode afetar Core Web Vitals
- **Profissionalismo**: Site parece incompleto

---

## 🔴 PROBLEMA 2: Logo do Footer não carrega (404)

### Sintoma
Mesmo erro do Header - logo não aparece no rodapé

### Causa Raiz
Idêntica ao Problema 1 - Footer também inicializa com `.svg` hardcoded

### Solução
Mesma solução do Problema 1 - corrigir `getEmpresaConfig()` para buscar logos reais

---

## 🔴 PROBLEMA 3: Erros 401 em `/api/admin/settings` (4 ocorrências)

### Sintoma
```
[ERROR] Failed to load resource: 401 (Unauthorized)
@ http://localhost:3000/api/admin/settings (4x)
```

### Causa Raiz
Componentes públicos (Header, Footer, HeroSlider) tentam fazer fetch para API protegida:

**Header.tsx** (linha ~50):
```typescript
const settingsRes = await fetch("/api/admin/settings");
```

**Footer.tsx** (linha ~80):
```typescript
const res = await fetch("/api/admin/settings");
```

**HeroSlider.tsx** (linha ~60):
```typescript
fetch("/api/admin/settings")
```

### Solução
**Remover tentativas de fetch para API protegida** - os dados já vêm via props do servidor:

```typescript
// ❌ REMOVER
const settingsRes = await fetch("/api/admin/settings");
const settings = await settingsRes.json();

// ✅ USAR dados que já vêm via props
// Os componentes já recebem config via props do layout.tsx
```

**Alternativa**: Criar endpoint público `/api/settings` (sem autenticação) para dados públicos

### Impacto
- **Performance**: 4 requests falhando a cada carregamento
- **Console**: Poluição de erros no console do navegador
- **UX**: Possível delay no carregamento de dados

---

## ⚠️ PROBLEMA 4: Filtro de cor do banner hero não está ativo

### Sintoma
Banner hero não tem overlay de cor visível (deveria ter filtro azul com opacidade)

### Causa Raiz
**HeroSlider.tsx** busca configurações de filtro da API protegida:
```typescript
useEffect(() => {
  fetch("/api/admin/settings")  // ❌ 401 Unauthorized
    .then((r) => r.json())
    .then((data: Record<string, string>) => {
      if (data.hero_filtro_cor) setFiltroCor(data.hero_filtro_cor);
      if (data.hero_filtro_opacidade) setFiltroOpacidade(Number(data.hero_filtro_opacidade));
    })
}, []);
```

Como o fetch falha (401), os valores padrão não são aplicados corretamente.

### Solução
**Opção A**: Passar configurações de filtro via props do servidor
```typescript
// app/page.tsx
const heroConfig = {
  filtroCor: settings.hero_filtro_cor || "#2563EB",
  filtroOpacidade: Number(settings.hero_filtro_opacidade || 20),
};

<HeroSlider slides={slides} heroConfig={heroConfig} />
```

**Opção B**: Buscar de endpoint público `/api/settings`

### Impacto
- **Visual**: Banner sem contraste adequado
- **Legibilidade**: Texto pode ficar difícil de ler dependendo da imagem

---

## ⚠️ PROBLEMA 5: Telefone do banner hero não aparece

### Sintoma
Seção de telefone em destaque no banner não está visível (deveria aparecer no desktop)

### Causa Raiz
**HeroSlider.tsx** busca `banner_telefone` da API protegida:
```typescript
fetch("/api/admin/settings")  // ❌ 401 Unauthorized
  .then((data) => {
    if (data.banner_telefone) setBannerTelefone(data.banner_telefone);
  })
```

Como o fetch falha, `bannerTelefone` fica vazio e o componente não renderiza.

### Solução
Passar `banner_telefone` via props do servidor ou buscar de endpoint público

### Impacto
- **Conversão**: Perda de oportunidade de contato direto
- **UX**: Informação importante não está visível

---

## ⚠️ PROBLEMA 6: Números de contato podem estar desatualizados

### Sintoma
Header mostra `(11) 91330-8413` mas pode não ser o número correto do banco

### Causa Raiz
**Header.tsx** busca `header_telefone` da API protegida:
```typescript
fetch("/api/admin/settings")  // ❌ 401 Unauthorized
  .then((settings) => {
    setHeaderTelefone(settings.header_telefone || settings.empresa_telefone || "");
  })
```

### Verificação Necessária
Checar se `header_telefone` existe no banco:
```sql
SELECT * FROM settings WHERE key = 'header_telefone';
```

Se não existir, o seed não populou esse campo.

### Solução
1. Verificar se `header_telefone` está no seed
2. Executar seed novamente se necessário
3. Passar telefone via props do servidor

---

## 📊 PRIORIZAÇÃO DE CORREÇÕES

### Sprint 1 - Crítico (Hoje)
1. ✅ **Corrigir logos** - Modificar `getEmpresaConfig()` para buscar logos reais
2. ✅ **Remover fetch para API protegida** - Header, Footer, HeroSlider

### Sprint 2 - Alta Prioridade (Esta semana)
3. ✅ **Adicionar overlay de cor nos banners** - Passar config via props
4. ✅ **Exibir telefone do banner** - Passar via props
5. ✅ **Verificar seed** - Garantir que `header_telefone` e `banner_telefone` existem

### Sprint 3 - Melhorias (Próxima semana)
6. 🔄 **Criar endpoint público** `/api/settings` para dados não sensíveis
7. 🔄 **Adicionar loading states** nos componentes
8. 🔄 **Implementar error boundaries** para falhas de fetch

---

## 🛠️ PLANO DE AÇÃO IMEDIATO

### Passo 1: Corrigir logos
```bash
# Editar lib/empresa-config.ts
# Adicionar lógica de busca de logos reais do filesystem
```

### Passo 2: Remover fetch para API protegida
```bash
# Editar components/Header.tsx
# Editar components/Footer.tsx  
# Editar components/HeroSlider.tsx
# Remover chamadas para /api/admin/settings
```

### Passo 3: Passar configurações via props
```bash
# Editar app/page.tsx
# Buscar configurações do banco no servidor
# Passar via props para HeroSlider
```

### Passo 4: Verificar e atualizar seed
```bash
# Editar scripts/seed-empresa-config.ts
# Garantir que header_telefone e banner_telefone existem
# Executar: npx tsx scripts/seed-empresa-config.ts
```

### Passo 5: Testar localmente
```bash
npm run dev
# Abrir http://localhost:3000
# Verificar console (deve estar limpo)
# Verificar logos aparecem
# Verificar overlay do banner
# Verificar telefone do banner
```

### Passo 6: Deploy
```bash
git add .
git commit -m "fix: corrige logos, remove fetch para API protegida, adiciona overlay e telefone do banner"
git push origin main
# Deploy no Coolify
# Executar seed no servidor
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após correções, validar:

- [ ] Logo do Header aparece corretamente
- [ ] Logo do Footer aparece corretamente
- [ ] Console do navegador está limpo (sem erros 404 ou 401)
- [ ] Overlay de cor do banner está visível
- [ ] Telefone do banner aparece no desktop
- [ ] Números de contato estão corretos
- [ ] Site carrega rápido (sem requests falhando)
- [ ] Build passa sem erros
- [ ] Deploy funciona corretamente

---

## 📝 NOTAS TÉCNICAS

### Arquitetura Atual
- **Server Components**: `app/layout.tsx` busca config do banco
- **Client Components**: Header, Footer, HeroSlider recebem props
- **Problema**: Client components tentam re-fetch dados que já têm

### Solução Arquitetural
- **Dados iniciais**: Sempre via props do servidor (SSR)
- **Atualizações**: Apenas via eventos do admin (eventBus)
- **API pública**: Criar `/api/settings` para dados não sensíveis
- **API protegida**: Manter `/api/admin/settings` apenas para admin

### Performance
- **Antes**: 4 requests falhando (401) + 1 request falhando (404) = 5 erros
- **Depois**: 0 erros, carregamento mais rápido, console limpo

---

**Próximo passo**: Implementar correções na ordem de prioridade acima.
