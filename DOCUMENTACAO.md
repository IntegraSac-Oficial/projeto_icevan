# Documentação — Ice Van Site

> Versão atual · Next.js 14 · MySQL · Tailwind CSS
> Última atualização: 2026-02-20

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Como Rodar o Projeto](#3-como-rodar-o-projeto)
4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Estrutura de Pastas](#5-estrutura-de-pastas)
6. [Mapa do Site — Páginas Públicas](#6-mapa-do-site--páginas-públicas)
7. [Painel Administrativo](#7-painel-administrativo)
8. [Rotas de API](#8-rotas-de-api)
9. [Banco de Dados (Prisma)](#9-banco-de-dados-prisma)
10. [Componentes](#10-componentes)
11. [Biblioteca de Funções (lib/)](#11-biblioteca-de-funções-lib)
12. [Design System — CSS / Tailwind](#12-design-system--css--tailwind)
13. [Imagens e Vídeos](#13-imagens-e-vídeos)
14. [Autenticação](#14-autenticação)
15. [SEO e Schema.org](#15-seo-e-schemaorg)
16. [Fluxos Importantes](#16-fluxos-importantes)

---

## 1. Visão Geral

**Ice Van** é um site institucional + painel admin para uma empresa de refrigeração para transporte.
O site apresenta os serviços e aplicações em diferentes veículos (Fiorino, Van Ducato, Van Sprinter, etc.) e possui um painel de administração completo para gerenciar conteúdo sem necessidade de deploys.

### O que o site faz

| Área | Função |
|------|--------|
| Site público | Apresentação da empresa, aplicações por veículo, galeria de fotos, formulário de contato |
| Painel admin | Gerenciar contatos recebidos, imagens, vídeos, SEO e configurações |
| API interna | Endpoints REST para todas as operações do painel |
| Banco de dados | Contatos, vídeos, galeria, SEO e configurações globais (cores, SMTP, credenciais) |

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 14.2.5 | Framework principal (App Router) |
| React | 18.3.1 | UI |
| TypeScript | 5.6.2 | Tipagem estática |
| Tailwind CSS | 3.4.13 | Estilização |
| Prisma ORM | 5.22.0 | Acesso ao banco de dados |
| MySQL | — | Banco de dados (Docker, porta 3307) |
| jose | 6.x | JWT para autenticação |
| Nodemailer | 8.x | Envio de e-mails via SMTP |
| EmailJS | 4.x | Formulário de contato (client-side) |
| React Hook Form | 7.x | Validação de formulários |
| Zod | 3.x | Schema de validação |
| Embla Carousel | 8.x | Slider de banners (Hero) |
| Lucide React | 0.447 | Ícones |
| clsx + tailwind-merge | — | Utilitário de classes CSS |

---

## 3. Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- Docker (para o MySQL)
- npm ou pnpm

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Subir o MySQL via Docker (porta 3307)
docker run -d \
  --name ice_van_mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ice_van \
  -p 3307:3306 \
  mysql:8

# 3. Copiar o arquivo de variáveis de ambiente
cp .env.example .env
# Editar .env com as configurações corretas

# 4. Executar as migrations do Prisma
npx prisma migrate deploy

# 5. (Opcional) Gerar o cliente Prisma
npx prisma generate

# 6. Rodar o servidor de desenvolvimento
npm run dev
```

O site estará disponível em: `http://localhost:3000`
O painel admin em: `http://localhost:3000/admin`

### Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (hot reload) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (requer build) |
| `npm run lint` | Verificação de código com ESLint |
| `npx prisma studio` | Interface visual do banco de dados |
| `npx prisma migrate dev` | Criar e aplicar nova migration |

---

## 4. Variáveis de Ambiente

Arquivo: `.env` na raiz do projeto.

```env
# Banco de Dados MySQL
DATABASE_URL="mysql://root:root@localhost:3307/ice_van"

# Segredo para geração de JWT (autenticação admin)
JWT_SECRET="sua-chave-secreta-longa-e-aleatoria"

# Credenciais do admin (fallback caso não estejam no banco)
ADMIN_EMAIL="admin@icevantermo.com.br"
ADMIN_PASSWORD="sua-senha-aqui"
```

> **Prioridade de credenciais:** O sistema primeiro verifica o banco de dados (tabela `settings`, chaves `admin_email` / `admin_password`). Se não encontrar, usa as variáveis de ambiente como fallback.

---

## 5. Estrutura de Pastas

```
ice_van_site/
├── app/                          # App Router (Next.js 14)
│   ├── layout.tsx                # Layout raiz (HTML, metadados, CSS vars, Header/Footer)
│   ├── globals.css               # Estilos globais e design system
│   ├── robots.ts                 # Configuração robots.txt
│   ├── sitemap.ts                # Geração do sitemap.xml
│   │
│   ├── page.tsx                  # Home /
│   ├── empresa/page.tsx          # /empresa
│   ├── aplicacoes/page.tsx       # /aplicacoes (listagem)
│   ├── fotos-servicos/page.tsx   # /fotos-servicos
│   ├── contato/page.tsx          # /contato
│   │
│   ├── fiorinos/page.tsx                    # /fiorinos
│   ├── van-ducato/page.tsx                  # /van-ducato
│   ├── van-sprinter/page.tsx                # /van-sprinter
│   ├── van-master/page.tsx                  # /van-master
│   ├── expert-porta-frigorifica/page.tsx    # /expert-porta-frigorifica
│   ├── fiorino-porta-frigorifica/page.tsx   # /fiorino-porta-frigorifica
│   │
│   ├── admin/                    # Painel administrativo
│   │   ├── layout.tsx            # Layout do admin (sidebar + topbar)
│   │   ├── page.tsx              # /admin (dashboard)
│   │   ├── login/page.tsx        # /admin/login
│   │   ├── contatos/page.tsx     # /admin/contatos
│   │   ├── imagens/page.tsx      # /admin/imagens
│   │   ├── videos/page.tsx       # /admin/videos
│   │   ├── seo/page.tsx          # /admin/seo
│   │   └── configuracoes/page.tsx # /admin/configuracoes
│   │
│   └── api/admin/                # API REST (protegida por JWT)
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       ├── contacts/route.ts
│       ├── contacts/[id]/route.ts
│       ├── contact-submit/route.ts
│       ├── images/route.ts
│       ├── images/[filename]/route.ts
│       ├── videos/route.ts
│       ├── videos/[id]/route.ts
│       ├── videos/upload/route.ts
│       ├── gallery/route.ts
│       ├── gallery/[id]/route.ts
│       ├── seo/route.ts
│       └── settings/
│           ├── route.ts
│           └── test-smtp/route.ts
│
├── components/                   # Componentes React reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSlider.tsx
│   ├── SolutionSection.tsx
│   ├── ApplicationCard.tsx
│   ├── ApplicationDetailPage.tsx
│   ├── PhotoGallery.tsx
│   ├── VideoGrid.tsx
│   ├── ContactForm.tsx
│   ├── WhatsAppButton.tsx
│   └── ui/
│       ├── Button.tsx
│       └── SectionTitle.tsx
│
├── lib/                          # Utilitários e lógica de negócio
│   ├── config.ts                 # Configurações da empresa (nome, contato, logos, etc.)
│   ├── utils.ts                  # cn(), whatsappUrl()
│   ├── applications.ts           # Dados dos 6 veículos/aplicações
│   ├── db.ts                     # Prisma Client singleton
│   ├── auth.ts                   # JWT: criar, verificar, deletar sessão
│   ├── settings.ts               # Ler/gravar configurações no banco
│   └── generated/prisma/         # Cliente gerado pelo Prisma (não editar)
│
├── prisma/
│   ├── schema.prisma             # Modelos do banco de dados
│   └── migrations/               # Histórico de migrations
│
├── public/                       # Arquivos estáticos servidos diretamente
│   ├── images/
│   │   ├── logo/                 # Logos (SVG + WebP)
│   │   ├── hero/                 # Banners do slider (4 imagens)
│   │   ├── og/                   # Imagem Open Graph
│   │   ├── empresa/              # Fotos da empresa
│   │   ├── fotos-servicos/       # Fotos de serviços (até 9)
│   │   └── aplicacoes/
│   │       ├── fiorinos/
│   │       ├── van-ducato/
│   │       ├── van-sprinter/
│   │       ├── van-master/
│   │       ├── expert-porta-frigorifica/
│   │       └── fiorino-porta-frigorifica/
│   └── videos/                   # Vídeos locais enviados pelo painel admin
│
├── middleware.ts                  # Proteção de rotas admin + injeção de header
├── next.config.mjs               # Configurações do Next.js
├── tailwind.config.ts            # Configuração do Tailwind + cores brand
├── tsconfig.json                 # Configuração TypeScript
└── DOCUMENTACAO.md               # Este arquivo
```

---

## 6. Mapa do Site — Páginas Públicas

```
/ ─────────────────────────── Home
│   Hero Slider (4 banners)
│   Seção de soluções
│   Cards de aplicações (6 veículos)
│   Chamada para contato
│
├── /empresa ─────────────── Sobre a empresa
│   Texto institucional
│   Galeria de fotos da empresa
│   Diferenciais / valores
│
├── /aplicacoes ──────────── Listagem de veículos
│   6 cards de veículos (thumb + título + CTA)
│   Link para cada detalhe
│
│   ├── /fiorinos
│   ├── /van-ducato
│   ├── /van-sprinter
│   ├── /van-master
│   ├── /expert-porta-frigorifica
│   └── /fiorino-porta-frigorifica
│         Cada página de detalhe contém:
│         - Galeria de fotos do veículo
│         - Especificações técnicas
│         - Descrição do serviço
│         - CTA para orçamento
│
├── /fotos-servicos ──────── Galeria de fotos
│   Grade de fotos de serviços realizados
│   Lightbox ao clicar
│
└── /contato ─────────────── Formulário de contato
    Campos: nome, empresa, telefone, e-mail,
            tipo de veículo, mensagem, como conheceu
    Envio via EmailJS (client-side) ou Nodemailer (server)
```

---

## 7. Painel Administrativo

Acessível em `/admin`. Protegido por autenticação JWT (cookie HttpOnly).
O layout do admin suprime automaticamente o Header/Footer do site público.

### Telas do painel

| URL | Página | Função |
|-----|--------|--------|
| `/admin` | Dashboard | Resumo: total de contatos, não lidos, vídeos, etc. |
| `/admin/login` | Login | Formulário e-mail + senha |
| `/admin/contatos` | Contatos | Lista de leads do formulário. Marcar como lido, ver detalhes, excluir |
| `/admin/imagens` | Imagens | Gerenciar imagens por seção do site. Upload, substituição e exclusão por slot |
| `/admin/videos` | Vídeos | Adicionar vídeos do YouTube ou arquivos locais. Ordenar, ocultar, excluir |
| `/admin/seo` | SEO | Meta title, meta description e OG image por página |
| `/admin/configuracoes` | Configurações | Cores do site, SMTP, troca de e-mail/senha do admin |

### Navegação da sidebar

```
[Snowflake] Ice Van · Painel Admin
─────────────────────────────────
📊  Dashboard
💬  Contatos
🖼️  Imagens
🎬  Vídeos
🔍  SEO
⚙️  Configurações
─────────────────────────────────
🔗  Ver o site (nova aba)
🚪  Sair
```

### Cores da sidebar

A sidebar usa sempre as cores originais da brand (`#003957`), mesmo que as cores sejam alteradas nas configurações. Isso é intencional para manter a interface admin consistente.

---

## 8. Rotas de API

Todas as rotas `/api/admin/*` são protegidas por JWT via middleware.
Exceções: `/api/admin/auth/login` e `/api/admin/auth/logout`.

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/admin/auth/login` | Login com e-mail e senha. Retorna cookie JWT |
| POST | `/api/admin/auth/logout` | Invalida o cookie de sessão |

### Contatos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/contacts` | Lista todos os contatos |
| PATCH | `/api/admin/contacts/[id]` | Marcar como lido/não lido |
| DELETE | `/api/admin/contacts/[id]` | Excluir contato |
| POST | `/api/admin/contact-submit` | Endpoint público para o formulário de contato |

### Imagens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/images?folder=images/hero` | Lista imagens de uma pasta |
| POST | `/api/admin/images` | Upload de imagem. FormData: `file`, `folder`, `saveas?` |
| DELETE | `/api/admin/images/[filename]?folder=...` | Excluir imagem |

> `saveas`: quando informado, sobrescreve o arquivo com esse nome (substituição de slot direto).

### Vídeos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/videos` | Lista todos os vídeos ordenados por `sortOrder` |
| POST | `/api/admin/videos` | Adiciona vídeo. Body: `{ youtubeId, titulo, categoria }` |
| PATCH | `/api/admin/videos/[id]` | Atualiza campos (visible, sortOrder) |
| DELETE | `/api/admin/videos/[id]` | Remove vídeo |
| POST | `/api/admin/videos/upload` | Upload de arquivo de vídeo local. Salva em `public/videos/` |

### Galeria

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/gallery` | Lista fotos da galeria |
| POST | `/api/admin/gallery` | Adiciona foto |
| PATCH | `/api/admin/gallery/[id]` | Atualiza (visible, sortOrder, alt) |
| DELETE | `/api/admin/gallery/[id]` | Remove foto |

### SEO

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/seo` | Retorna todas as configurações de SEO por página |
| POST | `/api/admin/seo` | Cria ou atualiza SEO de uma página (upsert por `pageSlug`) |

### Configurações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/settings` | Retorna todas as chaves/valores de configuração |
| POST | `/api/admin/settings` | Salva múltiplas configurações (upsert por chave) |
| POST | `/api/admin/settings/test-smtp` | Envia e-mail de teste com as configurações SMTP atuais |

---

## 9. Banco de Dados (Prisma)

**Engine:** MySQL 8 · **Porta Docker:** 3307 · **Database:** `ice_van`
**Schema:** `prisma/schema.prisma` · **Output:** `lib/generated/prisma`

### Modelos

#### Contact — Leads do formulário de contato

```prisma
model Contact {
  id           Int      @id @default(autoincrement())
  nome         String
  empresa      String?
  telefone     String
  email        String
  tipoVeiculo  String
  mensagem     String   @db.Text
  comoConheceu String?
  lido         Boolean  @default(false)
  createdAt    DateTime @default(now())

  @@map("contacts")
}
```

#### SeoSetting — Meta tags por página

```prisma
model SeoSetting {
  id             Int      @id @default(autoincrement())
  pageSlug       String   @unique   // ex: "/", "/empresa", "/fiorinos"
  metaTitulo     String
  metaDescricao  String   @db.Text
  ogImage        String?
  updatedAt      DateTime @updatedAt

  @@map("seo_settings")
}
```

#### GalleryPhoto — Galeria de fotos de serviços

```prisma
model GalleryPhoto {
  id        Int      @id @default(autoincrement())
  filename  String
  alt       String
  category  String
  sortOrder Int      @default(0)
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("gallery_photos")
}
```

#### Video — Vídeos (YouTube ou locais)

```prisma
model Video {
  id        Int      @id @default(autoincrement())
  youtubeId String              // YouTube ID ou "/videos/arquivo.mp4" para locais
  titulo    String
  categoria String              // "Fiorino", "Van Ducato", etc.
  sortOrder Int      @default(0)
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("videos")
}
```

> **Vídeos locais:** quando `youtubeId` começa com `/`, o sistema trata como arquivo local em `public/videos/`.

#### Setting — Configurações globais (chave/valor)

```prisma
model Setting {
  id    Int    @id @default(autoincrement())
  key   String @unique
  value String @db.Text

  @@map("settings")
}
```

**Chaves utilizadas pelo sistema:**

| Chave | Descrição | Valor padrão |
|-------|-----------|--------------|
| `admin_email` | E-mail de acesso ao painel | (env `ADMIN_EMAIL`) |
| `admin_password` | Senha de acesso ao painel | (env `ADMIN_PASSWORD`) |
| `cor_primaria` | Cor azul escuro | `#003957` |
| `cor_secundaria` | Cor azul claro | `#2D92BE` |
| `cor_destaque` | Cor laranja (CTA) | `#F28C28` |
| `cor_texto` | Cor do texto | `#1A1A1A` |
| `cor_neutra` | Cor de fundo claro | `#F5F5F5` |
| `smtp_host` | Servidor SMTP | — |
| `smtp_port` | Porta SMTP | `587` |
| `smtp_user` | Usuário SMTP | — |
| `smtp_pass` | Senha SMTP | — |
| `smtp_from` | E-mail remetente | — |
| `smtp_from_name` | Nome remetente | — |

---

## 10. Componentes

### Header.tsx

Header fixo no topo do site público. **Não aparece no painel admin.**

- Barra superior (desktop): telefone + link WhatsApp
- Logo (imagem `/images/logo/logo-white.svg`)
- Menu de navegação desktop com links
- Botão CTA "Orçamento" (abre WhatsApp)
- Menu hamburger para mobile (dropdown animado)
- Sombra ao rolar a página

**Links de navegação:**
```
Home  |  Empresa  |  Aplicações  |  Fotos e Serviços  |  Contato
```

---

### Footer.tsx

Rodapé do site público com informações da empresa, links e copyright.

---

### HeroSlider.tsx

Slider de banners na página inicial. Usa **Embla Carousel**.

- Lê imagens de `public/images/hero/` (ordenadas alfabeticamente)
- Suporta até 4 banners (banner-01 a banner-04)
- Autoplay com indicadores de posição
- Responsivo (aspect-ratio fixo)

---

### ApplicationCard.tsx

Card para listagem dos veículos em `/aplicacoes`.

Props:
- `slug` — usado para o link de detalhe
- `titulo` — nome do veículo
- `subtitulo` — descrição curta
- `thumb` — imagem do card (posição 1 da galeria)

Ações: "Saiba mais" → `/[slug]` | "Orçamento" → WhatsApp

---

### ApplicationDetailPage.tsx

Componente de página para cada veículo. Recebe o objeto `Application` de `lib/applications.ts`.

Seções:
- Galeria de fotos (lightbox)
- Especificações técnicas
- Descrição detalhada
- CTA para orçamento

---

### PhotoGallery.tsx

Grade de fotos com suporte a lightbox.

- Carrega imagens de `public/images/fotos-servicos/`
- Filtro por categoria (quando aplicável)
- Abre lightbox com navegação anterior/próximo

---

### VideoGrid.tsx

Grade de vídeos do YouTube ou arquivos locais.

- Vídeos do YouTube: embed iframe
- Vídeos locais (youtubeId começa com `/`): tag `<video>` HTML5
- Agrupamento por categoria de veículo

---

### ContactForm.tsx

Formulário de contato com validação client-side.

**Campos:**
- Nome completo *
- Empresa (opcional)
- Telefone / WhatsApp *
- E-mail *
- Tipo de veículo * (Fiat Fiorino, Fiat Ducato, Sprinter, Master, Expert, Caminhão Baú, Outro)
- Mensagem *
- Como conheceu (Google, Instagram, Indicação, Facebook, WhatsApp, Outro)

**Validação:** Zod + React Hook Form
**Envio:** POST `/api/admin/contact-submit` (salva no banco + envia e-mail via SMTP)

---

### WhatsAppButton.tsx

Botão flutuante fixo no canto inferior direito.
Abre o WhatsApp com mensagem pré-definida. **Não aparece no painel admin.**

---

## 11. Biblioteca de Funções (lib/)

### lib/config.ts

Arquivo central de configuração da empresa. **Edite aqui** para alterar dados básicos.

```typescript
export const empresa = {
  nome: "Ice Van Termo",
  slogan: "...",
  descricao: "...",
  telefone: "(11) 9XXXX-XXXX",
  whatsapp: "5511XXXXXXXXX",
  email: "contato@icevantermo.com.br",
  endereco: "...",
  cidade: "São Paulo",
  estado: "SP",
  cep: "...",
  instagram: "https://instagram.com/...",
  siteUrl: "https://icevantermo.com.br",
  ga4Id: "G-XXXXXXXXXX",            // Google Analytics 4
  logo: {
    principal: "/images/logo/logo.svg",
    branca:    "/images/logo/logo-white.svg",
    escura:    "/images/logo/logo-dark.svg",
    favicon:   "/images/logo/favicon.ico",
  },
  ogImage: "/images/og/og-image.webp",
  emailjs: {
    serviceId:  "...",
    templateId: "...",
    publicKey:  "...",
  },
}
```

---

### lib/utils.ts

```typescript
cn(...inputs)
// Combina classes Tailwind sem conflitos (clsx + tailwind-merge)
// Uso: className={cn("base-class", condition && "conditional-class")}

whatsappUrl(message?: string)
// Gera link wa.me/ com número da empresa e mensagem opcional
// Uso: href={whatsappUrl("Olá, quero um orçamento")}
```

---

### lib/applications.ts

Array com os dados dos 6 veículos. Cada objeto tem:

```typescript
interface Application {
  slug: string           // "fiorinos", "van-ducato", etc.
  titulo: string         // "Fiorino Frigorífico"
  subtitulo: string      // Descrição curta para o card
  conteudo: string[]     // Parágrafos de descrição
  specs: { label: string; value: string }[]  // Especificações técnicas
  thumb: string          // Caminho da thumbnail
  imagens: string[]      // Caminhos das fotos da galeria
  metaTitulo: string     // <title> da página
  metaDescricao: string  // meta description
}

getApplicationBySlug(slug: string): Application | undefined
```

---

### lib/auth.ts

```typescript
createSession(email: string): Promise<void>
// Cria JWT com 7 dias de expiração e define cookie HttpOnly

deleteSession(): Promise<void>
// Remove o cookie de sessão

verifySession(): Promise<{ email: string } | null>
// Verifica e decodifica o JWT do cookie atual

verifyAdminCredentials(email: string, password: string): Promise<boolean>
// 1º busca no banco (settings: admin_email / admin_password)
// 2º fallback para variáveis de ambiente ADMIN_EMAIL / ADMIN_PASSWORD
```

---

### lib/settings.ts

```typescript
getSetting(key: string, fallback?: string): Promise<string>
// Lê um valor do banco. Retorna fallback se não existir.

saveSettings(data: Record<string, string>): Promise<void>
// Salva múltiplas chaves/valores (upsert)

getAllSettings(): Promise<Record<string, string>>
// Retorna todas as configurações como objeto chave/valor
```

---

### lib/db.ts

Singleton do Prisma Client para evitar múltiplas conexões em desenvolvimento.

```typescript
import { prisma } from "@/lib/db"
// Usar prisma.contact.findMany(), prisma.video.create(), etc.
```

---

## 12. Design System — CSS / Tailwind

### Cores da marca

As cores são definidas como **CSS Custom Properties** e injetadas dinamicamente pelo root layout. Isso permite que o admin altere as cores do site sem rebuild.

| Classe Tailwind | CSS Var | Padrão | Uso |
|----------------|---------|--------|-----|
| `brand-primary` | `--brand-primary` | `#003957` | Azul escuro — headers, botões primários, sidebar |
| `brand-secondary` | `--brand-secondary` | `#2D92BE` | Azul claro — destaques, links, badges |
| `brand-accent` | `--brand-accent` | `#F28C28` | Laranja — botões CTA, destaques |
| `brand-dark` | `--brand-dark` | `#1A1A1A` | Cor do texto principal |
| `brand-light` | `--brand-light` | `#F5F5F5` | Fundo de seções claras |

### Componentes de estilo global (globals.css)

#### Layout

```css
.container-site      /* max-w-7xl, mx-auto, px responsivo */
.section-padding     /* py-16 sm:py-20 lg:py-24 */
.section-light       /* bg-brand-light */
```

#### Botões

```css
.btn-primary         /* Fundo brand-primary, texto branco */
.btn-accent          /* Fundo brand-accent (laranja), texto branco */
.btn-outline         /* Borda brand-primary, texto brand-primary, hover fill */
```

> Hover dos botões usa `filter: brightness(0.88)` em vez de opacity modifier,
> pois CSS variables não são compatíveis com modificadores de opacidade do Tailwind.

#### Formulários

```css
.form-input          /* Campo de texto estilizado com focus ring */
.form-label          /* Label do campo */
.form-error          /* Mensagem de erro (vermelho) */
```

#### Cards e Badges

```css
.card                /* bg-white, rounded-xl, shadow-card, hover elevação */
.badge               /* rounded-full, cor secundária com fundo suave */
```

#### Outros

```css
.breadcrumb          /* Navegação de migalhas */
.lightbox-overlay    /* Overlay escuro para galeria de fotos */
```

### Tipografia

| Fonte | Uso | Classe Tailwind |
|-------|-----|----------------|
| Inter | Corpo do texto | `font-sans` (padrão) |
| Montserrat | Títulos e headings | `font-heading` |

### Sombras customizadas

```
shadow-card       → 0 2px 12px rgba(0,0,0,0.08)   [card normal]
shadow-card-hover → 0 8px 24px rgba(0,0,0,0.14)   [card hover]
```

### Animações

```
animate-fade-in   → opacity 0→1 em 0.5s
animate-slide-up  → translateY(10px)→0 em 0.4s
```

---

## 13. Imagens e Vídeos

### Organização de imagens

As imagens ficam em `public/images/` e são servidas diretamente pelo Next.js.

| Pasta | Conteúdo | Slots / Posições |
|-------|----------|-----------------|
| `images/logo/` | Logos e favicon | logo.svg, logo-white.svg, logo-dark.svg, favicon |
| `images/hero/` | Banners do slider | 4 banners, ordenados alfabeticamente |
| `images/og/` | Open Graph | 1 imagem (1200×630px) |
| `images/empresa/` | Fotos da empresa | Foto principal + extras |
| `images/fotos-servicos/` | Galeria de serviços | Sem limite, ordem alfabética |
| `images/aplicacoes/fiorinos/` | Fotos do Fiorino | Posição 1 = thumbnail do card |
| `images/aplicacoes/van-ducato/` | Fotos da Ducato | Posição 1 = thumbnail do card |
| `images/aplicacoes/van-sprinter/` | Fotos da Sprinter | Posição 1 = thumbnail do card |
| `images/aplicacoes/van-master/` | Fotos da Master | Posição 1 = thumbnail do card |
| `images/aplicacoes/expert-porta-frigorifica/` | Fotos Expert | Posição 1 = thumbnail do card |
| `images/aplicacoes/fiorino-porta-frigorifica/` | Fotos Fiorino c/ Porta | Posição 1 = thumbnail do card |

> **Ordenação:** As imagens são ordenadas **alfabeticamente** pelo nome do arquivo.
> Para controlar a ordem, prefixe os nomes: `01-thumbnail.webp`, `02-galeria.webp`, etc.

### Substituição de imagem por slot

No painel `/admin/imagens`:
1. Selecione a seção na sidebar
2. Clique no ícone **↻** (substituir) na linha da imagem desejada
3. Selecione o novo arquivo — ele será salvo com o **mesmo nome do original**, mantendo a posição/slot

### Formatos aceitos

| Tipo | Extensões |
|------|-----------|
| Imagens | `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif` |
| Vídeos | `.mp4`, `.webm`, `.mov`, `.avi`, `.mkv` |

### Vídeos locais

Vídeos enviados pelo painel ficam em `public/videos/`.
No banco, o campo `youtubeId` armazena o caminho: `/videos/nome-do-arquivo.mp4`.
O componente `VideoGrid.tsx` detecta automaticamente se é local (começa com `/`) ou YouTube.

---

## 14. Autenticação

### Fluxo de login

```
1. Admin acessa /admin/login
2. Preenche e-mail + senha
3. POST /api/admin/auth/login
4. Servidor verifica credenciais:
   - Busca "admin_email" e "admin_password" na tabela settings
   - Se não encontrar, usa ADMIN_EMAIL / ADMIN_PASSWORD das env vars
5. Se correto: gera JWT (7 dias) e define cookie "admin_token" (HttpOnly, Secure)
6. Redireciona para /admin (dashboard)
```

### Proteção de rotas

O `middleware.ts` intercepta todas as requisições para `/admin/*` e `/api/admin/*`:

```
/admin/login              → Livre (sem autenticação)
/api/admin/auth/login     → Livre (sem autenticação)
/api/admin/auth/logout    → Livre (sem autenticação)
/admin/*                  → Verifica JWT. Se inválido → redireciona para /admin/login
/api/admin/*              → Verifica JWT. Se inválido → retorna 401 JSON
```

### Header x-is-admin

O middleware também injeta `x-is-admin: 1` nos headers para todas as rotas `/admin/*`.
O root layout (`app/layout.tsx`) lê esse header e **omite** o `<Header>`, `<Footer>` e `<WhatsAppButton>` nas páginas admin.

### Trocar credenciais de admin

No painel: `Configurações → aba Acesso`
As novas credenciais são salvas na tabela `settings` com as chaves `admin_email` e `admin_password`.

---

## 15. SEO e Schema.org

### Metadados dinâmicos

O root layout gera metadados globais via `generateMetadata()`:

1. Tenta ler da tabela `seo_settings` (slug `/`)
2. Fallback para `lib/config.ts`

Cada página individual pode ter seus próprios metadados em `generateMetadata()`.
O painel `/admin/seo` permite editar title, description e OG image por página sem redeploy.

### Schema.org LocalBusiness

Injetado no `<head>` como JSON-LD com:
- Nome, descrição, URL, telefone, e-mail
- Endereço completo
- Horário de funcionamento (Seg-Sex 8h-18h, Sáb 8h-12h)
- Link Instagram

### Sitemap e Robots

| Arquivo | URL gerada | Conteúdo |
|---------|-----------|----------|
| `app/sitemap.ts` | `/sitemap.xml` | Todas as páginas públicas com prioridade e frequência |
| `app/robots.ts` | `/robots.txt` | Allow: `/` · Disallow: `/admin` |

### Open Graph

- Imagem padrão: `/images/og/og-image.webp` (1200×630px)
- Editável pelo painel SEO por página
- Twitter card: `summary_large_image`

---

## 16. Fluxos Importantes

### Fluxo: Adicionar novo vídeo YouTube

```
1. Admin → /admin/videos → "Adicionar Vídeo"
2. Toggle: YouTube (padrão)
3. Preencher YouTube ID (ex: dQw4w9WgXcQ)
   → Preview do thumbnail aparece automaticamente
4. Preencher Título e Categoria (veículo)
5. "Salvar" → POST /api/admin/videos
6. Vídeo aparece agrupado na categoria correta
```

### Fluxo: Adicionar vídeo local

```
1. Admin → /admin/videos → "Adicionar Vídeo"
2. Toggle: "Arquivo local"
3. Clicar no botão de upload → selecionar arquivo .mp4/.webm/.mov
   → Arquivo é enviado para POST /api/admin/videos/upload
   → Salvo em public/videos/
4. Preencher Título e Categoria
5. "Salvar" → POST /api/admin/videos (youtubeId = "/videos/arquivo.mp4")
```

### Fluxo: Substituir imagem de um slot específico

```
1. Admin → /admin/imagens
2. Selecionar seção na sidebar (ex: Fiorino)
3. Na lista, clicar no ícone ↻ da imagem desejada
4. Selecionar novo arquivo
   → Upload com parâmetro saveas=nome_original.webp
   → Arquivo sobrescreve o anterior com o mesmo nome
   → Posição/slot mantido
```

### Fluxo: Alterar cores do site

```
1. Admin → /admin/configuracoes → aba "Aparência"
2. Usar os color pickers para escolher as novas cores
3. "Salvar" → POST /api/admin/settings
   → Cores salvas na tabela settings
4. Próxima requisição ao site público:
   → Root layout lê as cores do banco
   → Injeta <style>:root { --brand-primary: ...; }</style>
   → Todas as classes Tailwind bg-brand-primary, text-brand-primary, etc.
     passam a usar os novos valores — sem rebuild necessário
```

### Fluxo: Envio do formulário de contato

```
1. Usuário preenche formulário em /contato
2. Validação client-side (Zod)
3. POST /api/admin/contact-submit
4. Servidor:
   a. Salva contato na tabela contacts (banco MySQL)
   b. Envia e-mail via Nodemailer (SMTP configurado no painel)
5. Sucesso: exibe mensagem de confirmação
6. Lead aparece em /admin/contatos como "não lido"
```

### Fluxo: Configurar SMTP

```
1. Admin → /admin/configuracoes → aba "SMTP"
2. Preencher: host, porta, usuário, senha, remetente
3. "Testar conexão" → POST /api/admin/settings/test-smtp
   → Envia e-mail de teste para o próprio endereço configurado
4. Se OK: "Salvar configurações" → POST /api/admin/settings
```

---

*Documentação gerada automaticamente com base no código-fonte do projeto.*
*Para dúvidas ou atualizações, consulte os arquivos referenciados acima.*
