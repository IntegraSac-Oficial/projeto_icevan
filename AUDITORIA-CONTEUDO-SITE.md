# 🔍 AUDITORIA COMPLETA: Conteúdo Hardcoded vs Banco de Dados

**Data**: 03/03/2026  
**Projeto**: Ice Van - Sistema de Refrigeração  
**Objetivo**: Identificar TODO conteúdo editável que está hardcoded no código e precisa migrar para o banco de dados

---

## ✅ O QUE JÁ ESTÁ NO BANCO DE DADOS

### 1. Header (components/Header.tsx)
- ✅ Logo (busca via `/api/logo`)
- ✅ Telefone (busca via `/api/admin/settings` - chave `empresa_telefone`)
- ✅ Menu de navegação (hardcoded mas não precisa ser editável)

### 2. Footer (components/Footer.tsx)
- ✅ Logo branca (busca via `/api/logo`)
- ✅ Descrição da empresa (`empresa_descricao`)
- ✅ Endereço completo (`empresa_endereco`)
- ✅ Telefone (`empresa_telefone`)
- ✅ Email (`empresa_email`)
- ✅ Horário de funcionamento (`empresa_horario`)
- ✅ Copyright (`footer_copyright`)
- ✅ Rodapé (`footer_rodape`)
- ✅ Lista de aplicações/veículos (`vehicles_registry` - JSON)
- ✅ Lista de contatos (`empresa_contatos` - JSON)
- ✅ Redes sociais (vem do `lib/config.ts` - PRECISA MIGRAR)

### 3. Página Inicial (app/page.tsx)
- ✅ Hero Banners (tabela `hero_banners` no banco)
- ✅ Diferenciais (`content_diferenciais` - JSON no settings)
- ✅ CTA/Formulário (`content_cta` - JSON no settings)
- ✅ Soluções (`content_solucoes` - JSON no settings via SolutionSection)
- ✅ Aplicações (primeiras 3 vêm do `applications.ts` + imagens do filesystem)
- ✅ Formas de pagamento (imagem do filesystem `/images/formas-pagamento/`)

### 4. Página Empresa (app/empresa/page.tsx)
- ✅ Todo conteúdo editável (`content_empresa` - JSON no settings)
- ✅ Imagens (filesystem `/images/empresa/`)

### 5. Aplicações (lib/applications.ts + app/aplicacoes/[slug]/page.tsx)
- ✅ Conteúdo de texto (`content_application_{slug}` - JSON no settings)
- ✅ Imagens (filesystem `/images/aplicacoes/{slug}/`)
- ✅ Registro de veículos (`vehicles_registry` - JSON no settings)

### 6. Galeria (app/fotos-servicos/page.tsx)
- ✅ Fotos (tabela `gallery_photos` no banco)

### 7. Vídeos
- ✅ Vídeos (tabela `videos` no banco)

### 8. SEO
- ✅ Meta tags por página (tabela `seo_settings` no banco)

### 9. Configurações Gerais
- ✅ Cores do tema (settings)
- ✅ SMTP (settings)
- ✅ Credenciais admin (settings)

---

## ❌ O QUE ESTÁ HARDCODED E PRECISA MIGRAR

### 1. **lib/config.ts** - ARQUIVO INTEIRO PRECISA MIGRAR
```typescript
export const empresa = {
  nome: "Ice Van",  // ❌ HARDCODED
  slogan: "Refrigeração para Transporte com Qualidade e Eficiência",  // ❌ HARDCODED
  descricao: "...",  // ✅ JÁ MIGRADO (empresa_descricao)
  
  // Contato
  telefone: "(11) 94824-2999",  // ✅ JÁ MIGRADO (empresa_telefone)
  whatsapp: "+55 (11) 94824-2999",  // ❌ HARDCODED
  whatsappNumero: "5511948242999",  // ❌ HARDCODED
  email: "vendas@icevans.com.br",  // ✅ JÁ MIGRADO (empresa_email)
  
  // Endereço
  endereco: "Rua Gabriela Mistral, 1246",  // ❌ HARDCODED (componentes individuais)
  bairro: "Penha de França",  // ❌ HARDCODED
  cidade: "São Paulo",  // ❌ HARDCODED
  estado: "SP",  // ❌ HARDCODED
  cep: "03701-000",  // ❌ HARDCODED
  enderecoCompleto: "...",  // ✅ JÁ MIGRADO (empresa_endereco)
  
  // Horários
  horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",  // ✅ JÁ MIGRADO (empresa_horario)
  
  // Redes sociais
  instagram: "https://instagram.com/icevans",  // ❌ HARDCODED
  facebook: "",  // ❌ HARDCODED
  youtube: "",  // ❌ HARDCODED
  tiktok: "",  // ❌ HARDCODED
  linkedin: "",  // ❌ HARDCODED
  twitter: "",  // ❌ HARDCODED
  
  // Logo
  logo: {
    principal: "/images/logo/logo.svg",  // ✅ JÁ MIGRADO (via API)
    branca: "/images/logo/logo-white.svg",  // ✅ JÁ MIGRADO (via API)
    escura: "/images/logo/logo-dark.svg",  // ✅ JÁ MIGRADO (via API)
    favicon: "/images/logo/favicon.ico",  // ❌ HARDCODED
  },
  
  // SEO
  siteUrl: "https://icevanisolamento.com.br",  // ❌ HARDCODED
  ogImage: "/images/og/og-image.webp",  // ❌ HARDCODED
  
  // Google Analytics 4
  ga4Id: "G-XXXXXXXXXX",  // ❌ HARDCODED
  
  // EmailJS
  emailjs: {
    serviceId: "service_icevans",  // ❌ HARDCODED
    templateId: "template_contato",  // ❌ HARDCODED
    publicKey: "YOUR_PUBLIC_KEY",  // ❌ HARDCODED
  },
  
  // Google Maps
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=...",  // ❌ HARDCODED
}
```

### 2. **lib/applications.ts** - DADOS ESTÁTICOS DAS APLICAÇÕES
```typescript
// ❌ HARDCODED - Array com 6 aplicações padrão
export const applications: Application[] = [
  {
    slug: "fiorinos",
    titulo: "Fiorinos",  // ❌ HARDCODED
    subtitulo: "...",  // ❌ HARDCODED
    conteudo: [...],  // ❌ HARDCODED (5 parágrafos)
    specs: [...],  // ❌ HARDCODED (6 especificações)
    thumb: "/images/aplicacoes/fiorinos/thumb.webp",  // ✅ Filesystem
    imagens: [...],  // ✅ Filesystem
    metaTitulo: "...",  // ❌ HARDCODED
    metaDescricao: "...",  // ❌ HARDCODED
  },
  // ... mais 5 aplicações com mesma estrutura
];
```

**NOTA**: O sistema JÁ suporta sobrescrever esses dados via `content_application_{slug}` no banco, mas os dados padrão ainda estão hardcoded como fallback.

### 3. **Footer - Redes Sociais**
```typescript
// ❌ HARDCODED - Vem do lib/config.ts
{empresa.instagram && (
  <a href={empresa.instagram}>Instagram</a>
)}
{empresa.facebook && (
  <a href={empresa.facebook}>Facebook</a>
)}
// ... outras redes
```

### 4. **Footer - Menu de Navegação**
```typescript
// ❌ HARDCODED - Array estático
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/empresa", label: "Empresa" },
  { href: "/fotos-servicos", label: "Serviços e Fotos" },
  { href: "/contato", label: "Contato" },
];
```

**NOTA**: Menu de navegação geralmente não precisa ser editável, mas se o usuário quiser adicionar/remover páginas, precisa migrar.

### 5. **Página Inicial - Navegação Rápida**
```typescript
// ❌ HARDCODED - 2 cards de navegação
<Link href="/empresa">
  <Building2 />
  <p>Conheça a</p>
  <p>Empresa</p>
</Link>

<Link href="/aplicacoes">
  <Grid3x3 />
  <p>Veja nossas</p>
  <p>Aplicações</p>
</Link>
```

---

## 📊 RESUMO DA AUDITORIA

### ✅ JÁ NO BANCO (80% do conteúdo)
- Hero Banners (tabela dedicada)
- Diferenciais da home
- CTA/Formulário da home
- Soluções (Isolamento + Refrigeração)
- Conteúdo da página Empresa
- Conteúdo das Aplicações (sobrescrita via JSON)
- Galeria de fotos
- Vídeos
- SEO por página
- Configurações gerais (SMTP, cores, etc)
- Logo, telefone, email, endereço, horário
- Lista de veículos/aplicações
- Lista de contatos

### ❌ AINDA HARDCODED (20% do conteúdo)
1. **Redes sociais** (Instagram, Facebook, YouTube, TikTok, LinkedIn, Twitter)
2. **Nome da empresa** e **slogan**
3. **WhatsApp** (número formatado e número limpo)
4. **Componentes do endereço** (rua, bairro, cidade, estado, CEP separados)
5. **Favicon**
6. **URL do site** e **OG Image**
7. **Google Analytics ID**
8. **EmailJS** (serviceId, templateId, publicKey)
9. **Google Maps Embed URL**
10. **Dados padrão das 6 aplicações** (fallback quando não há no banco)
11. **Menu de navegação** (se precisar ser editável)
12. **Cards de navegação rápida** da home (se precisar ser editável)

---

## 🎯 PRÓXIMOS PASSOS

### OPÇÃO 1: Migração Completa (Recomendado)
Migrar TUDO do `lib/config.ts` para o banco de dados, incluindo:
- Redes sociais
- Nome e slogan
- WhatsApp
- Endereço completo (componentes separados)
- Favicon
- URLs e IDs de serviços externos
- Google Maps

### OPÇÃO 2: Migração Parcial (Mais Rápido)
Migrar apenas o essencial que o usuário realmente edita:
- Redes sociais (Instagram, Facebook, etc)
- WhatsApp
- Google Maps Embed URL

### OPÇÃO 3: Manter Como Está
- Deixar `lib/config.ts` como arquivo de configuração técnica
- Apenas documentar que mudanças nele requerem redeploy

---

## 💡 RECOMENDAÇÃO

**Migrar OPÇÃO 1 (Completa)** porque:
1. Usuário quer que TUDO seja editável no admin
2. Evita necessidade de redeploy para mudanças simples
3. Centraliza TODA configuração no banco
4. Facilita manutenção futura
5. Permite backup completo via banco de dados

**Exceções que podem ficar hardcoded**:
- Menu de navegação (raramente muda)
- Cards de navegação rápida (raramente mudam)
- Estrutura de cores do tema (já está no banco)

---

## 📝 ESTRUTURA PROPOSTA NO BANCO

### Adicionar ao `settings`:
```typescript
// Redes sociais
empresa_instagram: "https://instagram.com/icevans"
empresa_facebook: ""
empresa_youtube: ""
empresa_tiktok: ""
empresa_linkedin: ""
empresa_twitter: ""

// Identidade
empresa_nome: "Ice Van"
empresa_slogan: "Refrigeração para Transporte com Qualidade e Eficiência"

// WhatsApp
empresa_whatsapp: "+55 (11) 94824-2999"
empresa_whatsapp_numero: "5511948242999"

// Endereço (componentes)
empresa_rua: "Rua Gabriela Mistral, 1246"
empresa_bairro: "Penha de França"
empresa_cidade: "São Paulo"
empresa_estado: "SP"
empresa_cep: "03701-000"

// SEO e Assets
site_url: "https://icevanisolamento.com.br"
site_og_image: "/images/og/og-image.webp"
site_favicon: "/images/logo/favicon.ico"

// Integrações
google_analytics_id: "G-XXXXXXXXXX"
google_maps_embed: "https://www.google.com/maps/embed?pb=..."
emailjs_service_id: "service_icevans"
emailjs_template_id: "template_contato"
emailjs_public_key: "YOUR_PUBLIC_KEY"
```

---

**FIM DA AUDITORIA**
