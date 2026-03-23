import { prisma } from '@/lib/db';

async function atualizarAplicacoesParte1() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO APLICAÇÕES - PARTE 1');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Fiorinos
    console.log('1️⃣  Atualizando Fiorinos...');
    const fiorinos = {
      titulo: "Fiorinos",
      subtitulo: "Isolamento térmico profissional para Fiat Fiorino — ideal para transporte urbano de produtos sensíveis à temperatura.",
      tituloSecao: "Isolamento Térmico para Fiorino",
      conteudo: [
        "O Fiat Fiorino é um dos veículos utilitários mais utilizados no transporte urbano de produtos sensíveis à temperatura. Sua agilidade, baixo consumo e facilidade de estacionamento o tornam a escolha preferida de pequenos empreendedores, padarias, açougues, distribuidoras de laticínios e empresas de delivery que necessitam de proteção térmica.",
        "Na Ice Van, desenvolvemos soluções completas de isolamento térmico especialmente dimensionadas para o Fiorino. O processo começa com a aplicação de painéis de poliuretano injetado de alta densidade no baú, garantindo excelente eficiência térmica sem comprometer a capacidade de carga útil do veículo.",
        "O revestimento interno é realizado em PVC alimentício ou alumínio, materiais de fácil higienização e conformidade com as normas sanitárias da ANVISA para transporte de alimentos. As vedações das portas são reforçadas para garantir a estanqueidade e manutenção da temperatura interna durante todo o trajeto.",
        "Oferecemos também a opção de porta frigorífica com vedação magnética reforçada, ideal para operações com múltiplas paradas onde a abertura frequente do compartimento exige maior controle térmico. O acabamento é feito com perfis de proteção em alumínio nos cantos e bordas, garantindo durabilidade.",
        "Nossos técnicos realizam a instalação de ponta a ponta — do desmonte do baú original até a entrega do veículo pronto para operação. Todos os trabalhos são executados com garantia e acompanhamento pós-venda, assegurando que o seu Fiorino esteja sempre em plena capacidade operacional."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 650 kg" },
        { label: "Volume útil do baú", valor: "Aprox. 2,5 m³" },
        { label: "Material de isolamento", valor: "Poliuretano injetado" },
        { label: "Espessura do isolamento", valor: "40 a 60 mm" },
        { label: "Acabamento interno", valor: "PVC alimentício ou alumínio" },
        { label: "Garantia", valor: "12 meses (instalação)" }
      ],
      metaTitulo: "Isolamento Térmico para Fiorino | Adaptação Profissional — Ice Van",
      metaDescricao: "Isolamento térmico profissional para Fiat Fiorino. Revestimento interno, vedação e acabamento de alta qualidade para transporte de produtos sensíveis. Solicite orçamento."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_fiorinos' },
      update: { value: JSON.stringify(fiorinos) },
      create: { key: 'content_application_fiorinos', value: JSON.stringify(fiorinos) }
    });
    console.log('   ✅ Atualizado');

    // 2. Van Ducato
    console.log('2️⃣  Atualizando Van Ducato...');
    const ducato = {
      titulo: "Van Ducato",
      subtitulo: "Isolamento térmico completo para Fiat Ducato — adaptação profissional para transporte de cargas sensíveis.",
      tituloSecao: "Isolamento Térmico para Van Ducato",
      conteudo: [
        "O Fiat Ducato é um dos furgões mais populares no Brasil para transporte de médio porte. Com amplo espaço de carga, motor robusto e excelente custo-benefício, o Ducato é a preferência de distribuidoras, redes de supermercados, farmácias e empresas de logística que precisam de capacidade sem abrir mão da agilidade.",
        "A Ice Van oferece projetos personalizados de isolamento térmico para o Ducato em suas diversas versões (curto, longo, teto elevado). Utilizamos painéis de PU injetado de alta densidade nas paredes, teto e piso, garantindo máxima eficiência térmica e durabilidade estrutural.",
        "O acabamento interno é executado com materiais de primeira linha: PVC alimentício ou alumínio, com perfis de proteção nos cantos e bordas. O piso recebe tratamento antiderrapante e impermeável, facilitando a higienização e garantindo segurança durante as operações de carga e descarga.",
        "Oferecemos ainda a opção de porta traseira com vedação reforçada e sistema de abertura facilitada, ideal para operações frequentes. Toda a instalação é feita preservando a integridade estrutural do veículo e seguindo as normas sanitárias vigentes.",
        "Solicite uma visita técnica gratuita para avaliação do seu Ducato e receba um orçamento personalizado. Nossa equipe técnica dimensiona a solução ideal conforme o tipo de carga, rota de operação e necessidades específicas do seu negócio."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 1.500 kg" },
        { label: "Volume útil do baú", valor: "8 a 14 m³ (varia por versão)" },
        { label: "Material de isolamento", valor: "Poliuretano injetado de alta densidade" },
        { label: "Espessura do isolamento", valor: "50 a 80 mm" },
        { label: "Acabamento interno", valor: "Alumínio ou PVC alimentício" },
        { label: "Garantia", valor: "12 meses (instalação)" }
      ],
      metaTitulo: "Isolamento Térmico para Van Ducato | Fiat Ducato Adaptado — Ice Van",
      metaDescricao: "Transforme seu Fiat Ducato com isolamento térmico profissional. Revestimento interno de alta qualidade e acabamento durável. Orçamento grátis."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_van-ducato' },
      update: { value: JSON.stringify(ducato) },
      create: { key: 'content_application_van-ducato', value: JSON.stringify(ducato) }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PARTE 1 CONCLUÍDA (Fiorinos e Ducato)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarAplicacoesParte1();
