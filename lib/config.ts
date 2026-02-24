/**
 * CONFIGURAÇÃO CENTRAL DA EMPRESA — Ice Van
 *
 * Edite este arquivo para atualizar as informações da empresa
 * em todo o site automaticamente.
 */

export const empresa = {
  nome: "Ice Van",
  slogan: "Refrigeração para Transporte com Qualidade e Eficiência",
  descricao:
    "Especialistas em sistemas de refrigeração e isolamento térmico para veículos de transporte. Atendemos transportadoras, frotas e autônomos em todo o Brasil.",

  // Contato
  telefone: "(11) 94824-2999",
  whatsapp: "+55 (11) 94824-2999",
  whatsappNumero: "5511948242999", // Apenas números — usado em links
  email: "vendas@icevans.com.br",

  // Endereço
  endereco: "Rua Gabriela Mistral, 1246",
  bairro: "Penha de França",
  cidade: "São Paulo",
  estado: "SP",
  cep: "03701-000",
  enderecoCompleto:
    "Rua Gabriela Mistral, 1246 — Penha de França, São Paulo/SP, CEP 03701-000",

  // Horários
  horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",

  // Redes sociais (preencha com a URL real quando disponível)
  instagram: "https://instagram.com/icevans",
  facebook:  "",
  youtube:   "",
  tiktok:    "",
  linkedin:  "",
  twitter:   "",

  // Logo
  logo: {
    principal: "/images/logo/logo.svg",
    branca: "/images/logo/logo-white.svg",
    escura: "/images/logo/logo-dark.svg",
    favicon: "/images/logo/favicon.ico",
  },

  // SEO
  siteUrl: "https://icevans.com.br",
  ogImage: "/images/og/og-image.webp",

  // Google Analytics 4 — substitua pelo ID real
  ga4Id: "G-XXXXXXXXXX",

  // EmailJS — preencha com suas credenciais do EmailJS
  emailjs: {
    serviceId: "service_icevans",
    templateId: "template_contato",
    publicKey: "YOUR_PUBLIC_KEY",
  },

  // Google Maps Embed — substitua pela URL real
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.9345!2d-46.5484!3d-23.5229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua+Gabriela+Mistral%2C+1246!5e0!3m2!1spt!2sbr!4v1",
} as const;

export type Empresa = typeof empresa;
