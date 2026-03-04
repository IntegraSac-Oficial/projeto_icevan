/**
 * CONFIGURAÇÃO DINÂMICA DA EMPRESA - 100% BANCO DE DADOS
 * 
 * ⚠️ ATENÇÃO: SEM FALLBACKS!
 * Todas as configurações vêm EXCLUSIVAMENTE do banco de dados.
 * Se o banco estiver vazio, os campos ficarão vazios no site.
 * 
 * Substitui completamente o antigo lib/config.ts hardcoded.
 */

import { getAllSettings } from "@/lib/settings";

export interface EmpresaConfig {
  // Identidade
  nome: string;
  slogan: string;
  descricao: string;

  // Contato
  telefone: string;
  whatsapp: string;
  whatsappNumero: string;
  email: string;

  // Endereço
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  enderecoCompleto: string;

  // Horários
  horario: string;

  // Redes sociais
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  twitter: string;

  // Logo
  logo: {
    principal: string;
    branca: string;
    escura: string;
    favicon: string;
  };

  // SEO
  siteUrl: string;
  ogImage: string;

  // Google Analytics 4
  ga4Id: string;

  // EmailJS
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };

  // Google Maps
  googleMapsEmbed: string;
}

/**
 * Busca configurações da empresa do banco de dados
 * ⚠️ SEM FALLBACKS - Retorna strings vazias se não houver dados
 */
export async function getEmpresaConfig(): Promise<EmpresaConfig> {
  try {
    const settings = await getAllSettings();

    // Monta endereço completo a partir dos componentes
    const rua = settings.empresa_rua || "";
    const bairro = settings.empresa_bairro || "";
    const cidade = settings.empresa_cidade || "";
    const estado = settings.empresa_estado || "";
    const cep = settings.empresa_cep || "";
    const enderecoCompleto = settings.empresa_endereco || 
      (rua && bairro && cidade && estado && cep 
        ? `${rua} — ${bairro}, ${cidade}/${estado}, CEP ${cep}`
        : "");

    return {
      // Identidade
      nome: settings.empresa_nome || "",
      slogan: settings.empresa_slogan || "",
      descricao: settings.empresa_descricao || "",

      // Contato
      telefone: settings.empresa_telefone || "",
      whatsapp: settings.empresa_whatsapp || "",
      whatsappNumero: settings.empresa_whatsapp_numero || "",
      email: settings.empresa_email || "",

      // Endereço
      endereco: rua,
      bairro,
      cidade,
      estado,
      cep,
      enderecoCompleto,

      // Horários
      horario: settings.empresa_horario || "",

      // Redes sociais
      instagram: settings.empresa_instagram || "",
      facebook: settings.empresa_facebook || "",
      youtube: settings.empresa_youtube || "",
      tiktok: settings.empresa_tiktok || "",
      linkedin: settings.empresa_linkedin || "",
      twitter: settings.empresa_twitter || "",

      // Logo - busca da API /api/logo em runtime
      logo: {
        principal: "/images/logo/logo.svg",
        branca: "/images/logo/logo-white.svg",
        escura: "/images/logo/logo-dark.svg",
        favicon: "/images/logo/favicon.ico",
      },

      // SEO
      siteUrl: settings.site_url || "",
      ogImage: settings.site_og_image || "",

      // Google Analytics 4
      ga4Id: settings.google_analytics_id || "",

      // EmailJS
      emailjs: {
        serviceId: settings.emailjs_service_id || "",
        templateId: settings.emailjs_template_id || "",
        publicKey: settings.emailjs_public_key || "",
      },

      // Google Maps
      googleMapsEmbed: settings.google_maps_embed || "",
    };
  } catch (error) {
    console.error("❌ Erro ao buscar configurações da empresa:", error);
    // Retorna objeto vazio em caso de erro
    return {
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
    };
  }
}
