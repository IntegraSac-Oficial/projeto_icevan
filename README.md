# Ice Van — Site Institucional

Site institucional completo para a **Ice Van**, empresa especializada em sistemas de refrigeração e isolamento térmico para veículos de transporte.

---

## 🚀 Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org) 18.17 ou superior
- npm (incluso no Node.js)

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📦 Scripts Disponíveis

```bash
npm run dev     # Servidor de desenvolvimento (hot-reload)
npm run build   # Build de produção
npm run start   # Servidor de produção (após build)
npm run lint    # Verificação de código
```

---

## ⚙️ Configuração da Empresa

Edite o arquivo **`lib/config.ts`** para atualizar todas as informações da empresa de uma só vez. Todas as páginas do site usam essas variáveis automaticamente.

```typescript
// lib/config.ts
export const empresa = {
  nome: "Ice Van",
  telefone: "(11) 94824-2999",
  whatsapp: "+55 (11) 94824-2999",
  email: "vendas@icevans.com.br",
  endereco: "Rua Gabriela Mistral, 1246",
  // ... demais campos
};
```

### Configurações que precisam ser preenchidas

| Campo | Onde | O que fazer |
|-------|------|-------------|
| `ga4Id` | `lib/config.ts` | Substituir `G-XXXXXXXXXX` pelo ID real do GA4 |
| `instagram` | `lib/config.ts` | Inserir URL real do Instagram |
| `googleMapsEmbed` | `lib/config.ts` | Substituir pela URL de embed do Maps real |
| `emailjs.*` | `lib/config.ts` | Configurar credenciais do EmailJS |
| `siteUrl` | `lib/config.ts` | Inserir domínio real (`https://icevans.com.br`) |

---

## 📸 Imagens — Como Substituir os Placeholders

As imagens placeholder (fundo azul com texto) estão em `public/images/`. Substitua-as pelas fotos reais:

### Formato recomendado

- **Formato:** WebP (melhor compressão + qualidade)
- **Nomenclatura:** `kebab-case` (sem espaços, sem acentos)
- **Converter PNG/JPG para WebP:** Use [Squoosh](https://squoosh.app) ou [CloudConvert](https://cloudconvert.com)

### Estrutura de imagens

```
public/images/
├── logo/
│   ├── logo.svg              ← Logo principal (SVG vetorial)
│   ├── logo-white.svg        ← Versão branca (para fundos escuros)
│   ├── logo-dark.svg         ← Versão escura (para fundos claros)
│   └── favicon.ico           ← Favicon (32x32px)
│
├── hero/
│   ├── banner-01.webp        ← Slide 1 do hero (1920×780px)
│   ├── banner-02.webp        ← Slide 2 do hero
│   ├── banner-03.webp        ← Slide 3 do hero
│   └── banner-04.webp        ← Slide 4 do hero
│
├── aplicacoes/
│   ├── fiorinos/
│   │   ├── thumb.webp        ← Card em /aplicacoes (800×600px)
│   │   ├── foto-01.webp      ← Galeria em /fiorinos
│   │   └── foto-02.webp
│   ├── van-ducato/ ...       ← (mesma estrutura)
│   ├── van-sprinter/ ...
│   ├── van-master/ ...
│   ├── expert-porta-frigorifica/ ...
│   └── fiorino-porta-frigorifica/ ...
│
├── fotos-servicos/
│   ├── foto-01.webp          ← Galeria em /fotos-servicos
│   ├── foto-02.webp
│   └── ...
│
├── empresa/
│   ├── equipe.webp           ← Foto da equipe (página /empresa)
│   └── instalacoes.webp      ← Foto das instalações
│
└── og/
    └── og-image.webp         ← Imagem OG (1200×630px)
```

> **Dica:** Após adicionar as imagens reais em WebP, remova a linha `unoptimized: true` do arquivo `next.config.ts` para ativar a otimização automática de imagens do Next.js.

---

## 📧 Configuração do EmailJS

1. Crie uma conta em [emailjs.com](https://www.emailjs.com)
2. Crie um **Service** e anote o `Service ID`
3. Crie um **Email Template** com os campos:
   - `{{from_name}}` — Nome do contato
   - `{{empresa_nome}}` — Empresa
   - `{{telefone}}` — Telefone
   - `{{email}}` — E-mail
   - `{{tipo_veiculo}}` — Tipo de veículo
   - `{{mensagem}}` — Mensagem
   - `{{como_conheceu}}` — Canal de origem
4. Anote o `Template ID` e a `Public Key`
5. Preencha em `lib/config.ts`:

```typescript
emailjs: {
  serviceId: "service_SEU_ID",
  templateId: "template_SEU_ID",
  publicKey: "SUA_PUBLIC_KEY",
},
```

---

## 📍 Configuração do Google Maps

1. Acesse [Google Maps](https://maps.google.com)
2. Pesquise o endereço da empresa
3. Clique em **Compartilhar → Incorporar um mapa**
4. Copie apenas a URL dentro de `src="..."` do iframe
5. Cole em `lib/config.ts` no campo `googleMapsEmbed`

---

## 🎨 Personalização de Cores

Edite `tailwind.config.ts` para alterar a paleta de cores:

```typescript
colors: {
  brand: {
    primary: "#003957",    // Azul escuro — cor principal
    secondary: "#2D92BE",  // Azul médio — destaque secundário
    accent: "#F28C28",     // Laranja — CTAs e botões de ação
  }
}
```

---

## 🌐 Deploy na Vercel (Recomendado)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Importe este repositório do GitHub
3. A Vercel detecta automaticamente o Next.js — apenas clique **Deploy**
4. Configure as variáveis de ambiente se necessário

### Deploy alternativo — Netlify

```bash
npm run build
# Faça upload da pasta .next para o Netlify
```

---

## 📂 Estrutura do Projeto

```
ice_van_site/
├── app/                    # Páginas (Next.js App Router)
│   ├── layout.tsx          # Layout raiz (Header, Footer, WhatsApp, GA4)
│   ├── page.tsx            # Home
│   ├── empresa/            # /empresa
│   ├── aplicacoes/         # /aplicacoes
│   ├── fotos-servicos/     # /fotos-servicos
│   ├── contato/            # /contato
│   ├── fiorinos/           # /fiorinos
│   ├── van-ducato/         # /van-ducato
│   ├── van-sprinter/       # /van-sprinter
│   ├── van-master/         # /van-master
│   ├── expert-porta-frigorifica/
│   ├── fiorino-porta-frigorifica/
│   ├── sitemap.ts          # /sitemap.xml (automático)
│   └── robots.ts           # /robots.txt (automático)
├── components/             # Componentes React reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   ├── HeroSlider.tsx
│   ├── SolutionSection.tsx
│   ├── ApplicationCard.tsx
│   ├── PhotoGallery.tsx    # Galeria com lightbox
│   ├── VideoGrid.tsx       # Grid de vídeos YouTube
│   ├── ContactForm.tsx     # Formulário com EmailJS
│   ├── ApplicationDetailPage.tsx
│   └── ui/
│       ├── Button.tsx
│       └── SectionTitle.tsx
├── lib/
│   ├── config.ts           # ← EDITE AQUI: dados da empresa
│   ├── applications.ts     # ← EDITE AQUI: conteúdo das 6 aplicações
│   └── utils.ts            # Utilitários (cn, whatsappUrl)
├── public/
│   └── images/             # Imagens estáticas
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🔧 Adicionar Vídeos

Edite `app/fotos-servicos/page.tsx` e adicione os IDs do YouTube:

```typescript
const videos = [
  {
    youtubeId: "SEU_ID_YOUTUBE",  // Ex: "dQw4w9WgXcQ"
    titulo: "Título do vídeo",
    categoria: "Fiorino",
  },
  // ...
];
```

O ID do YouTube está na URL: `youtube.com/watch?v=**ID_AQUI**`

---

## 📊 Google Analytics 4

1. Crie uma propriedade GA4 em [analytics.google.com](https://analytics.google.com)
2. Copie o Measurement ID (formato: `G-XXXXXXXXXX`)
3. Cole em `lib/config.ts` no campo `ga4Id`

O GA4 rastreia automaticamente:
- Visualizações de página
- Cliques no botão de WhatsApp
- Envios de formulário

---

## 📞 Suporte

Em caso de dúvidas sobre o projeto, entre em contato com o desenvolvedor.

---

*Projeto gerado com Next.js 14, Tailwind CSS, TypeScript e Embla Carousel.*
