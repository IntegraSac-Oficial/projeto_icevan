import { prisma } from '@/lib/db';

async function atualizarEmpresaStructured() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO EMPRESA E STRUCTURED DATA');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Atualizar content_empresa
    console.log('1️⃣  Atualizando content_empresa...');
    const empresa = {
      heroLabel: "Quem somos",
      heroTitulo: "Especialistas em Isolamento Térmico para Veículos Utilitários",
      heroSubtitulo: "Há anos no mercado, a Ice Van é referência em soluções de isolamento térmico e adaptação interna para vans, furgões e utilitários.",
      historiaTitle: "Nossa História",
      historiaParagrafos: [
        "A Ice Van nasceu da necessidade de oferecer soluções profissionais de isolamento térmico para o crescente mercado de transporte de produtos sensíveis à temperatura no Brasil. Desde o início, nossa proposta foi clara: entregar qualidade técnica, materiais de primeira linha e atendimento consultivo que realmente ajude o cliente a tomar a melhor decisão para o seu negócio.",
        "Ao longo dos anos, realizamos adaptações internas em centenas de veículos — desde Fiorinos para pequenas distribuidoras até Sprinters e Ducatos para grandes frotas. Cada projeto é único e desenvolvido conforme as necessidades específicas de proteção térmica, volume de carga e perfil de operação do cliente.",
        "Hoje, a Ice Van atua com agilidade, seriedade e o mesmo compromisso com a qualidade que sempre nos diferenciou no mercado."
      ],
      mvvTitle: "Missão, Visão e Valores",
      mvvSubtitulo: "Os pilares que orientam cada projeto e cada relação com nossos clientes.",
      missao: {
        titulo: "Missão",
        descricao: "Oferecer soluções completas de isolamento térmico e adaptação interna para veículos utilitários, garantindo proteção eficiente de cargas sensíveis e a satisfação total dos nossos clientes."
      },
      visao: {
        titulo: "Visão",
        descricao: "Ser referência nacional no segmento de isolamento térmico veicular, reconhecidos pela qualidade técnica, inovação e pelo relacionamento de longo prazo com nossos parceiros e clientes."
      },
      valores: {
        titulo: "Valores",
        descricao: "Qualidade sem compromisso. Honestidade nas relações. Comprometimento com o prazo. Respeito ao cliente. Melhoria contínua em processos e materiais."
      },
      diferenciaisTitle: "Nossos Diferenciais",
      diferenciaisLista: [
        "Técnicos especializados e certificados",
        "Materiais de alta qualidade e durabilidade",
        "Projetos personalizados por veículo e aplicação",
        "Cumprimento rigoroso de prazos",
        "Garantia de 12 meses nas instalações",
        "Suporte e assistência técnica pós-venda",
        "Conformidade com normas sanitárias ANVISA",
        "Atendimento consultivo — não somos apenas vendedores"
      ],
      ctaTitle: "Vamos conversar sobre seu projeto?",
      ctaSubtitulo: "Entre em contato agora e descubra como podemos ajudar a transformar seu veículo em uma plataforma profissional de transporte."
    };
    await prisma.setting.update({
      where: { key: 'content_empresa' },
      data: { value: JSON.stringify(empresa) }
    });
    console.log('   ✅ Atualizado');

    // 2. Atualizar structured_data
    console.log('2️⃣  Atualizando structured_data...');
    const structuredData = {
      organizationName: "Ice Van Isolamento Térmico",
      organizationDescription: "Especialistas em isolamento térmico e adaptação interna para vans, furgões e utilitários. Soluções personalizadas de revestimento, vedação e proteção térmica para transporte."
    };
    await prisma.setting.update({
      where: { key: 'structured_data' },
      data: { value: JSON.stringify(structuredData) }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ EMPRESA E STRUCTURED DATA ATUALIZADOS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarEmpresaStructured();
