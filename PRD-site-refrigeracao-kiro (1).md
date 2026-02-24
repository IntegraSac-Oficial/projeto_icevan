# PRD — Site Institucional para Empresa de Refrigeração para Transporte
> **Prompt para geração no Kiro**

---

## 🎯 OBJETIVO DO PROJETO

Criar um site institucional completo para uma empresa brasileira especializada em **equipamentos de refrigeração e isolamento térmico para veículos de transporte** (furgões, vans, caminhões, utilitários). O site deve funcionar como vitrine de marca, canal de captação de leads via WhatsApp/formulário e gerador de tráfego orgânico (SEO), seguindo o modelo e estrutura do site www.koldking.com.br, porém com melhorias de UX, design moderno e identidade visual profissional.

---

## 🏢 CONTEXTO DO CLIENTE

- **Segmento:** B2B — venda e instalação de sistemas de refrigeração para transporte de cargas perecíveis
- **Público-alvo:** transportadoras, pequenos empresários com frota, motoristas autônomos, empresas do setor alimentício, farmacêutico e de logística
- **Tom de voz:** técnico, confiável, direto, com foco em qualidade e parceria
- **Localização:** Brasil (português do Brasil)
- **Conversão principal:** contato via WhatsApp e preenchimento de formulário de orçamento

---

## 📄 ESTRUTURA DE PÁGINAS

### 1. Home (`/` ou `index.html`)
- **Hero section** com banner rotativo (slider) de 3 a 4 imagens de alta qualidade mostrando veículos refrigerados em operação
- Headline principal: ex. _"Sistemas de Refrigeração para Transporte com Qualidade e Eficiência"_
- Subheadline com proposta de valor resumida
- CTA principal: botão "Solicite um Orçamento" (abre WhatsApp) e botão secundário "Conheça Nossos Serviços"
- Número de telefone e WhatsApp em destaque no hero
- Seção de 2 cards de navegação rápida: **Empresa** | **Aplicações**
- Seção explicando as 2 soluções oferecidas (ver seção de conteúdo abaixo): **Isolamento Térmico** e **Aparelho de Refrigeração**
- Mini formulário de contato/orçamento
- Rodapé completo com endereço, e-mail, telefone, links do menu e Instagram

### 2. Empresa (`/empresa`)
- História da empresa (missão, visão, valores)
- Diferenciais competitivos em formato de ícones + texto
- Foto/imagem da equipe ou instalações
- Marcas e parceiros (logos)
- CTA de contato

### 3. Aplicações (`/aplicacoes`)
- Grid de **6 cards** fixos, cada um com imagem ilustrativa, título, breve descrição e botão "Saiba mais" (abre WhatsApp ou ancora para detalhe)
- As 6 aplicações são:
  1. **Fiorinos** — isolamento térmico e refrigeração para Fiat Fiorino, ideal para pequenas entregas de perecíveis
  2. **Van Ducato** — solução completa de frio para Fiat Ducato, um dos furgões mais usados no transporte de alimentos
  3. **Van Sprinter** — equipamento de refrigeração de alta capacidade para Mercedes-Benz Sprinter
  4. **Van Master** — isolamento e refrigeração para Renault Master, com excelente custo-benefício para frotas médias
  5. **Expert com Porta Frigorífica** — Citroën/Peugeot Expert adaptado com porta frigorífica de alta vedação
  6. **Fiorino com Porta Frigorífica** — Fiat Fiorino com porta frigorífica integrada para operações que exigem mais isolamento
- Layout em grid 3x2 (desktop) / 2x3 (tablet) / 1x6 (mobile)
- Cada card com ícone ou foto real do serviço
- CTA ao final da página: "Não encontrou sua aplicação? Fale com nossos especialistas" → botão WhatsApp

### 4. Fotos e Serviços (`/fotos-servicos`)
- Título da página: "Fotos e Serviços" com breadcrumb (Home / Fotos e Serviços)
- Subtítulo: "Confira nossos trabalhos e serviços"
- **Galeria de fotos** em grid responsivo (3 colunas desktop / 2 tablet / 1 mobile) com lightbox ao clicar — exibindo fotos reais dos serviços executados (isolamentos e instalações)
- **Seção de vídeos** separada da galeria de fotos, com grid de até 7 vídeos incorporados (YouTube embed ou `<video>` HTML5), cada um com thumbnail e título descritivo (ex.: "Instalação Sprinter — Isolamento Completo")
- Legenda ou categoria em cada item (ex.: "Fiorino", "Van Ducato", "Baú Frigorífico")
- Filtro por categoria (Fotos | Vídeos | Todos) — via toggle simples no topo da seção
- CTA ao final: "Gostou do que viu? Solicite um orçamento" → botão WhatsApp

> **Melhorias em relação ao modelo Ice Vans:** A página original exibe apenas os vídeos sem título, sem thumbnail visível, sem fotos e sem filtro. A versão melhorada separa fotos de vídeos, adiciona títulos e categorias, implementa lightbox para as fotos e organiza o conteúdo visualmente com grid responsivo — transformando a página em uma vitrine de portfólio profissional.

### 5. Contato (`/contato`)
- Formulário completo: Nome | Empresa | Telefone | E-mail | Tipo de veículo | Mensagem | Como nos conheceu (dropdown)
- Mapa do Google Maps incorporado com localização da empresa
- Endereço, telefone, WhatsApp e e-mail em destaque
- Horário de atendimento

### 6. Páginas de detalhe por aplicação (`/[slug]`)
> Gerar **6 páginas** de conteúdo otimizado para SEO, uma para cada aplicação do cliente.
> Cada página deve ter: H1 com o nome da aplicação, texto descritivo de 300–500 palavras, galeria de fotos placeholder, especificações técnicas, CTA com botão WhatsApp e link para `/aplicacoes`.

---

## 🔧 FUNCIONALIDADES TÉCNICAS

### Navegação
- Menu fixo (sticky) no topo com logo à esquerda, links de navegação (Home | Empresa | Fotos e Serviços | Aplicações | Contato) e telefone/WhatsApp à direita
- Menu responsivo (hamburguer) para mobile
- Dropdown no item "Informações" **não se aplica** — a navegação é direta e enxuta, sem submenu de SEO
- Botão flutuante de WhatsApp fixo no canto inferior direito em todas as páginas

### Formulário de contato
- Campos: Nome, E-mail, Telefone, Tipo de Veículo (select), Mensagem, Como nos conheceu (radio ou select)
- Envio via e-mail (backend simples) ou integração com serviço tipo EmailJS / Formspree
- Mensagem de sucesso após envio

### SEO Técnico
- Meta title e meta description únicos por página
- Open Graph tags para compartilhamento em redes sociais
- Sitemap XML gerado automaticamente
- Robots.txt configurado
- Schema.org markup (LocalBusiness) na home e página de contato
- URLs amigáveis (sem extensão `.php`)
- Canonical tags para evitar conteúdo duplicado entre páginas de SEO similares

### Performance
- Imagens em formato WebP com lazy loading
- CSS e JS minificados
- Score Lighthouse mínimo: 85 (Performance), 90 (SEO), 90 (Acessibilidade)

### Analytics
- Integração com Google Analytics 4 (GA4)
- Evento de conversão rastreado: clique no botão de WhatsApp e envio de formulário

---

## 🎨 DESIGN E IDENTIDADE VISUAL

### Estilo
- Design moderno, limpo e profissional
- Inspiração: sites de empresas de logística/transporte — sóbrio, confiável, técnico
- Sem excesso de animações — foco em clareza e velocidade

### Paleta de cores (sugestão base, ajustável)
- **Primária:** Azul escuro `#0D2C54` (confiança, tecnologia)
- **Secundária:** Laranja/Amarelo `#F28C28` (energia, destaque de CTAs)
- **Neutra:** Cinza claro `#F5F5F5` (fundo de seções)
- **Texto:** `#1A1A1A`
- **Branco:** `#FFFFFF`

### Tipografia
- **Títulos:** Inter ou Montserrat (bold)
- **Corpo:** Inter ou Open Sans (regular/medium)
- Tamanho base: 16px, escala tipográfica com hierarquia clara (H1 > H2 > H3 > body)

### Componentes de UI
- Botões: bordas arredondadas, cor primária (azul) e CTA em laranja
- Cards com sombra suave e hover com elevação
- Ícones: biblioteca Lucide ou HeroIcons
- Imagens com overlay escuro leve quando usadas como fundo de seção
- Seções alternando fundo branco e cinza claro para separação visual

---

## 📝 CONTEÚDO — SOLUÇÕES OFERECIDAS

### Isolamento Térmico
O isolamento térmico é a base para garantir a eficiência da cadeia de frio no transporte de perecíveis. Aplicado em vans, furgões, caminhões baú e utilitários, o isolamento impede a troca de calor entre o interior e o exterior do veículo, reduzindo o consumo do sistema de refrigeração e mantendo a temperatura estável por mais tempo. Utilizamos materiais de alta performance como fibra de vidro antimicrobiana com poliuretano, painéis injetados em PU e acabamentos em PVC e alumínio, garantindo durabilidade, higiene e conformidade com as normas sanitárias vigentes.

### Aparelho de Refrigeração
Os aparelhos de refrigeração são instalados em vans, furgões e caminhões baú para manter a temperatura ideal no transporte de cargas perecíveis. Trabalhamos com equipamentos de alta tecnologia, com componentes de primeira linha como compressores, eletroventiladores, válvulas e filtros de marcas reconhecidas no mercado. Os sistemas são dimensionados de acordo com o tipo de veículo, volume de carga e faixa de temperatura exigida pelo produto transportado — seja resfriado, congelado ou climatizado.

---

## 🔑 PÁGINAS DE DETALHE — SLUGS DAS APLICAÇÕES

```
/fiorinos
/van-ducato
/van-sprinter
/van-master
/expert-porta-frigorifica
/fiorino-porta-frigorifica
```

> Cada uma dessas páginas corresponde a uma das 6 aplicações do cliente. Cada página deve conter: H1 com o nome da aplicação, texto descritivo de 300–500 palavras sobre o serviço de isolamento térmico e refrigeração para aquele veículo específico, galeria de fotos placeholder, especificações técnicas básicas, CTA com botão WhatsApp e link para a página de Aplicações.

---

## 📦 STACK TECNOLÓGICA SUGERIDA

> O Kiro pode escolher a stack mais adequada ao contexto, mas segue sugestão:

- **Frontend:** Next.js 14+ com App Router (React) — SSG para páginas de SEO, SSR para home
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Slider/Carousel:** Embla Carousel ou Swiper.js
- **Formulário:** React Hook Form + Zod para validação
- **E-mail:** EmailJS ou Resend (serverless)
- **Mapas:** Google Maps Embed API
- **Deploy:** Vercel (recomendado) ou Netlify
- **Analytics:** Google Analytics 4 via gtag.js

---

## 🚀 ENTREGÁVEIS ESPERADOS DO KIRO

1. **Estrutura completa de arquivos e pastas** do projeto
2. **Todas as páginas** listadas acima com código funcional
3. **Componentes reutilizáveis:** Header, Footer, HeroSlider, CardGrid, ContactForm, WhatsAppButton, SEOPage, SolutionSection, PhotoGallery, VideoGrid
4. **Layout responsivo** para mobile, tablet e desktop
5. **Conteúdo placeholder** para todas as páginas de SEO (texto otimizado baseado no slug)
6. **Configuração de SEO** (meta tags, sitemap, robots.txt, schema.org)
7. **Arquivo de configuração** centralizando dados da empresa (nome, telefone, WhatsApp, endereço, e-mail, Instagram) para fácil edição
8. **README** com instruções de instalação, deploy e personalização

---

## 🗂️ ESTRUTURA DE PASTAS — IMAGENS E ASSETS

Seguindo as boas práticas de organização de projetos web:

```
/public
  /images
    /logo
      logo.svg              ← logo principal (preferir SVG para escalabilidade)
      logo-dark.svg         ← versão escura (para fundos claros)
      logo-white.svg        ← versão branca (para fundos escuros/hero)
      favicon.ico
      favicon-32x32.png
      apple-touch-icon.png
    /hero
      banner-01.webp        ← slide 1 do hero
      banner-02.webp        ← slide 2 do hero
      banner-03.webp        ← slide 3 do hero
      banner-04.webp        ← slide 4 do hero
    /aplicacoes
      /fiorinos
        thumb.webp          ← imagem do card na página /aplicacoes
        foto-01.webp        ← fotos da página de detalhe /fiorinos
        foto-02.webp
      /van-ducato
        thumb.webp
        foto-01.webp
        foto-02.webp
      /van-sprinter
        thumb.webp
        foto-01.webp
        foto-02.webp
      /van-master
        thumb.webp
        foto-01.webp
        foto-02.webp
      /expert-porta-frigorifica
        thumb.webp
        foto-01.webp
        foto-02.webp
      /fiorino-porta-frigorifica
        thumb.webp
        foto-01.webp
        foto-02.webp
    /fotos-servicos
      foto-01.webp          ← galeria de fotos da página Fotos e Serviços
      foto-02.webp
      foto-03.webp
      ...
    /empresa
      equipe.webp           ← foto da equipe ou instalações
      instalacoes.webp
    /og
      og-image.webp         ← imagem Open Graph (1200x630px) para compartilhamento social
```

> **Boas práticas aplicadas:**
> - Todas as imagens em formato **WebP** para máxima compressão sem perda de qualidade
> - Logo em **SVG** para garantir nitidez em qualquer resolução e tamanho de tela
> - Pasta `/public` na raiz — padrão do Next.js, arquivos servidos diretamente pela URL (ex.: `/images/logo/logo.svg`)
> - Subpastas por contexto (hero, aplicacoes, empresa) para fácil manutenção
> - Cada aplicação tem sua própria subpasta com `thumb.webp` (card) e fotos de detalhe numeradas
> - Imagem OG dedicada para melhor aparência ao compartilhar o site em redes sociais e WhatsApp
> - Nomes de arquivo em **kebab-case** (minúsculas com hífen), sem espaços ou acentos

---

## ✏️ VARIÁVEIS DE CONFIGURAÇÃO (preencher antes de gerar)

```json
{
  "empresa": {
    "nome": "[NOME DA EMPRESA]",
    "slogan": "[SLOGAN DA EMPRESA]",
    "telefone": "[TELEFONE]",
    "whatsapp": "[NÚMERO WHATSAPP COM DDI, ex: 5511999999999]",
    "email": "[EMAIL@EMPRESA.COM.BR]",
    "endereco": "[RUA, NÚMERO - BAIRRO - CIDADE / UF]",
    "cep": "[CEP]",
    "instagram": "[URL DO INSTAGRAM]",
    "horario_atendimento": "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
    "cor_primaria": "#0D2C54",
    "cor_secundaria": "#F28C28",
    "logo": {
      "principal": "/images/logo/logo.svg",
      "branca": "/images/logo/logo-white.svg",
      "escura": "/images/logo/logo-dark.svg",
      "favicon": "/images/logo/favicon.ico"
    }
  }
}
```

---

## 📌 OBSERVAÇÕES FINAIS PARA O KIRO

- As **6 páginas de aplicação** devem ser geradas a partir de um array de objetos contendo `slug`, `titulo`, `descricao`, `conteudo` e `imagens[]`. Não copiar texto de terceiros.
- O **botão de WhatsApp flutuante** deve estar presente em **todas** as páginas.
- Toda referência a marcas de terceiros (Thermo King, Carrier, etc.) deve ser usada apenas em contexto informativo, nunca como afirmação de parceria oficial.
- O site deve estar **100% em português do Brasil**.
- O projeto deve ser **facilmente editável** por alguém sem conhecimento técnico avançado (variáveis centralizadas, comentários no código).
