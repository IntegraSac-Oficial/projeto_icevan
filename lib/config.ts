/**
 * ARQUIVO TEMPORÁRIO PARA COMPATIBILIDADE
 * 
 * Este arquivo existe apenas para não quebrar imports antigos durante a migração.
 * TODOS os valores retornam strings vazias.
 * 
 * ⚠️ NÃO USE ESTE ARQUIVO! Use lib/empresa-config.ts
 */

export const empresa = {
  nome: "",
  slogan: "",
  descricao: "",
  telefone: "",
  whatsapp: "",
  whatsappNumero: "",
  email: "",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  enderecoCompleto: "",
  horario: "",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  linkedin: "",
  twitter: "",
  logo: {
    principal: "/images/logo/logo.svg",
    branca: "/images/logo/logo-white.svg",
    escura: "/images/logo/logo-dark.svg",
    favicon: "/images/logo/favicon.ico",
  },
  siteUrl: "",
  ogImage: "",
  ga4Id: "",
  emailjs: {
    serviceId: "",
    templateId: "",
    publicKey: "",
  },
  googleMapsEmbed: "",
} as const;

export type Empresa = typeof empresa;
