import { prisma } from '@/lib/db';

async function atualizarBancoJsons() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO JSONs NO BANCO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Atualizar content_solucoes
    console.log('1️⃣  Atualizando content_solucoes...');
    const solucoes = {
      titulo_secao: "Nossas Soluções",
      subtitulo_secao: "Oferecemos soluções completas de isolamento térmico e adaptação interna para transformar seu veículo em uma plataforma profissional de transporte.",
      cards: [
        {
          title: "Isolamento Térmico",
          description: "O isolamento térmico é essencial para proteger cargas sensíveis à temperatura e garantir eficiência no transporte. Aplicado em vans, furgões e utilitários, impede a troca de calor entre o interior e o exterior do veículo, mantendo a temperatura interna estável por mais tempo.",
          features: [
            "Painéis de poliuretano injetado de alta densidade",
            "Acabamento em PVC alimentício ou alumínio",
            "Conformidade com normas sanitárias da ANVISA",
            "Máxima eficiência térmica e durabilidade",
            "Reduz necessidade de controle térmico ativo"
          ]
        },
        {
          title: "Revestimento e Acabamento Interno",
          description: "O revestimento interno completa a adaptação do veículo, oferecendo proteção, higiene e durabilidade. Utilizamos materiais de alta qualidade que facilitam a limpeza e garantem conformidade sanitária para transporte de alimentos e produtos sensíveis.",
          features: [
            "Revestimento em PVC alimentício ou alumínio",
            "Piso antiderrapante e impermeável",
            "Vedação reforçada em portas e junções",
            "Proteção de cantos em aço inox",
            "Fácil higienização e manutenção"
          ]
        }
      ]
    };
    await prisma.setting.update({
      where: { key: 'content_solucoes' },
      data: { value: JSON.stringify(solucoes) }
    });
    console.log('   ✅ Atualizado');

    // 2. Atualizar content_diferenciais
    console.log('2️⃣  Atualizando content_diferenciais...');
    const diferenciais = {
      titulo_secao: "Por que escolher a",
      subtitulo_secao: "Somos especialistas em isolamento térmico veicular com foco em qualidade, pontualidade e satisfação total do cliente.",
      cards: [
        {
          title: "Qualidade Garantida",
          desc: "Materiais de primeira linha e mão de obra especializada com garantia de 12 meses."
        },
        {
          title: "Prazo no Combinado",
          desc: "Cumprimos os prazos de entrega para você não perder tempo nem dinheiro."
        },
        {
          title: "Experiência Comprovada",
          desc: "Anos de atuação no mercado de isolamento térmico veicular com centenas de instalações realizadas."
        },
        {
          title: "Atendimento Personalizado",
          desc: "Cada projeto é dimensionado conforme o veículo, a carga e a necessidade do cliente."
        }
      ]
    };
    await prisma.setting.update({
      where: { key: 'content_diferenciais' },
      data: { value: JSON.stringify(diferenciais) }
    });
    console.log('   ✅ Atualizado');

    // 3. Atualizar vehicles_registry
    console.log('3️⃣  Atualizando vehicles_registry...');
    const vehicles = [
      { slug: "fiorinos", label: "Fiorinos", href: "/fiorinos", ordem: 1 },
      { slug: "van-ducato", label: "Van Ducato", href: "/van-ducato", ordem: 2 },
      { slug: "van-sprinter", label: "Van Sprinter", href: "/van-sprinter", ordem: 3 },
      { slug: "van-master", label: "Van Master", href: "/van-master", ordem: 4 },
      { slug: "expert-porta-frigorifica", label: "Expert c/ Porta Frigorífica", href: "/expert-porta-frigorifica", ordem: 5 },
      { slug: "isolamento-fiorino", label: "Isolamento Fiorino", href: "/isolamento-fiorino", ordem: 6 }
    ];
    await prisma.setting.update({
      where: { key: 'vehicles_registry' },
      data: { value: JSON.stringify(vehicles) }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ JSONs ATUALIZADOS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarBancoJsons();
