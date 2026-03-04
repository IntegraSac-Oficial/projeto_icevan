/**
 * SCRIPT PARA POPULAR CONFIGURAÇÕES INICIAIS NO BANCO
 * 
 * Execute este script UMA VEZ para popular o banco com dados iniciais.
 * Depois disso, edite tudo pelo painel admin.
 * 
 * Como executar:
 * npx tsx scripts/seed-empresa-config.ts
 */

import { prisma } from "../lib/db";

const INITIAL_CONFIG = {
  // Identidade
  empresa_nome: "Ice Van",
  empresa_slogan: "Refrigeração para Transporte com Qualidade e Eficiência",
  empresa_descricao: "Especialistas em sistemas de refrigeração e isolamento térmico para veículos de transporte. Atendemos transportadoras, frotas e autônomos em todo o Brasil.",

  // Contato
  empresa_telefone: "(11) 94824-2999",
  empresa_whatsapp: "+55 (11) 94824-2999",
  empresa_whatsapp_numero: "5511948242999",
  empresa_email: "vendas@icevans.com.br",

  // Endereço
  empresa_rua: "Rua Gabriela Mistral, 1246",
  empresa_bairro: "Penha de França",
  empresa_cidade: "São Paulo",
  empresa_estado: "SP",
  empresa_cep: "03701-000",
  empresa_endereco: "Rua Gabriela Mistral, 1246 — Penha de França, São Paulo/SP, CEP 03701-000",

  // Horários
  empresa_horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",

  // Redes sociais
  empresa_instagram: "https://instagram.com/icevans",
  empresa_facebook: "",
  empresa_youtube: "",
  empresa_tiktok: "",
  empresa_linkedin: "",
  empresa_twitter: "",

  // SEO
  site_url: "https://icevanisolamento.com.br",
  site_og_image: "/images/og/og-image.webp",
  site_favicon: "/images/logo/favicon.ico",

  // Google Analytics
  google_analytics_id: "G-XXXXXXXXXX",

  // Google Maps
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.9345!2d-46.5484!3d-23.5229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua+Gabriela+Mistral%2C+1246!5e0!3m2!1spt!2sbr!4v1",

  // EmailJS
  emailjs_service_id: "service_icevans",
  emailjs_template_id: "template_contato",
  emailjs_public_key: "YOUR_PUBLIC_KEY",

  // Telefones específicos
  header_telefone: "(11) 4824-2999",
  banner_telefone: "(11) 94824-2999",

  // Footer
  footer_copyright: "© 2026 Ice Van. Todos os direitos reservados.",
  footer_rodape: "CNPJ — Refrigeração para Transporte | São Paulo, SP",
};

async function seed() {
  console.log("🌱 Populando configurações iniciais no banco...\n");

  try {
    let count = 0;

    for (const [key, value] of Object.entries(INITIAL_CONFIG)) {
      // Verifica se já existe
      const existing = await prisma.setting.findUnique({
        where: { key },
      });

      if (existing) {
        console.log(`⏭️  ${key}: já existe, pulando...`);
        continue;
      }

      // Cria novo
      await prisma.setting.create({
        data: { key, value },
      });

      console.log(`✅ ${key}: ${value.substring(0, 50)}${value.length > 50 ? "..." : ""}`);
      count++;
    }

    console.log(`\n✅ Concluído! ${count} configurações adicionadas ao banco.`);
    console.log("\n📝 Próximos passos:");
    console.log("1. Acesse /admin/configuracoes");
    console.log("2. Edite as configurações conforme necessário");
    console.log("3. As mudanças refletem no site imediatamente!");
  } catch (error) {
    console.error("\n❌ Erro ao popular banco:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
