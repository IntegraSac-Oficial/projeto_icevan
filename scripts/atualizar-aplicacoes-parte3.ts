import { prisma } from '@/lib/db';

async function atualizarAplicacoesParte3() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO APLICAÇÕES - PARTE 3');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 5. Expert com Porta Frigorífica
    console.log('5️⃣  Atualizando Expert com Porta Frigorífica...');
    const expert = {
      titulo: "Expert com Porta Frigorífica",
      subtitulo: "Citroën/Peugeot Expert com isolamento térmico e porta frigorífica de alta vedação.",
      tituloSecao: "Isolamento Térmico para Expert",
      conteudo: [
        "A Citroën Berlingo Expert e a Peugeot Expert são furgões compactos muito utilizados no comércio e na distribuição urbana. Quando equipadas com sistema de isolamento térmico e porta frigorífica de alta vedação, tornam-se plataformas extremamente eficientes para o transporte de alimentos frescos, laticínios, floricultura e produtos farmacêuticos.",
        "A porta frigorífica é um dos elementos mais críticos para garantir a eficiência térmica. Na Ice Van, instalamos portas com perfis de vedação dupla, juntas magnéticas e dobradiças reforçadas em aço inox, garantindo estanqueidade total e resistência ao uso intensivo. O sistema de fechamento é seguro e de fácil operação, mesmo com as mãos ocupadas.",
        "O processo de conversão da Expert inclui o revestimento completo do compartimento de carga com painéis de poliuretano injetado, seguido pela montagem da porta frigorífica sob medida. Todo o trabalho é executado sem comprometer a garantia de fábrica do veículo.",
        "Oferecemos acabamento interno em PVC alimentício na cor branca, com perfis de proteção de canto em aço inox para maior durabilidade em operações de carga e descarga. O piso é revestido com material antiderrapante e impermeável, facilitando a higienização.",
        "A combinação de isolamento térmico de qualidade com uma porta frigorífica bem projetada resulta em maior eficiência térmica e melhor conservação dos produtos. Entre em contato e solicite uma avaliação técnica para a sua Expert."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 1.000 kg" },
        { label: "Volume útil do baú", valor: "Aprox. 5 a 7 m³" },
        { label: "Material de isolamento", valor: "Poliuretano injetado" },
        { label: "Espessura do isolamento", valor: "40 a 60 mm" },
        { label: "Porta frigorífica", valor: "Vedação dupla, junta magnética" },
        { label: "Acabamento interno", valor: "PVC alimentício branco" }
      ],
      metaTitulo: "Expert com Porta Frigorífica | Citroën Peugeot Isolada — Ice Van",
      metaDescricao: "Adaptação da Citroën/Peugeot Expert com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para transporte urbano de produtos sensíveis."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_expert-porta-frigorifica' },
      update: { value: JSON.stringify(expert) },
      create: { key: 'content_application_expert-porta-frigorifica', value: JSON.stringify(expert) }
    });
    console.log('   ✅ Atualizado');

    // 6. Isolamento Fiorino
    console.log('6️⃣  Atualizando Isolamento Fiorino...');
    const isolamentoFiorino = {
      titulo: "Isolamento Fiorino",
      subtitulo: "Fiat Fiorino com isolamento térmico reforçado e porta frigorífica para operações que exigem máxima eficiência.",
      tituloSecao: "Isolamento Térmico Reforçado para Fiorino",
      conteudo: [
        "O Fiat Fiorino com porta frigorífica é a solução ideal para pequenos negócios que necessitam de um veículo compacto, ágil e com alto grau de isolamento térmico. Perfeito para roteiros urbanos com múltiplas paradas, este equipamento garante que a temperatura interna seja mantida mesmo durante as aberturas frequentes do compartimento de carga.",
        "A versão com porta frigorífica se diferencia da conversão padrão pela instalação de uma porta de alto desempenho com vedação reforçada, juntas magnéticas flexíveis e perfis de alumínio que garantem o mínimo de troca térmica a cada abertura. Esta solução é especialmente recomendada para entrega de sorvetes, produtos lácteos, carnes frescas e produtos farmacêuticos.",
        "O processo de instalação começa com o revestimento interno do baú com painéis de poliuretano injetado de alta densidade (40 kg/m³), seguido pela instalação da porta frigorífica sob medida. O acabamento interno em PVC alimentício facilita a limpeza e mantém a conformidade sanitária.",
        "Apesar do tamanho compacto, o sistema instalado oferece excelente eficiência térmica, suficiente para a maioria das aplicações de transporte urbano de produtos sensíveis à temperatura. Os perfis de proteção em alumínio garantem durabilidade mesmo em operações intensivas.",
        "A Ice Van oferece um serviço completo de conversão do Fiorino: projeto técnico, instalação e assistência pós-venda. Nosso time de técnicos especializados garante que o seu veículo esteja 100% operacional dentro do prazo acordado. Solicite seu orçamento agora mesmo."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 600 kg" },
        { label: "Volume útil do baú", valor: "Aprox. 2,0 a 2,5 m³" },
        { label: "Material de isolamento", valor: "PU injetado 40 kg/m³" },
        { label: "Espessura do isolamento", valor: "40 a 60 mm" },
        { label: "Porta frigorífica", valor: "Vedação reforçada, junta magnética" },
        { label: "Acabamento interno", valor: "PVC alimentício" }
      ],
      metaTitulo: "Isolamento Fiorino com Porta Frigorífica | Adaptação Profissional — Ice Van",
      metaDescricao: "Fiat Fiorino com isolamento térmico profissional e porta frigorífica de alta vedação. Ideal para pequenas entregas urbanas de produtos sensíveis."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_fiorino-porta-frigorifica' },
      update: { value: JSON.stringify(isolamentoFiorino) },
      create: { key: 'content_application_fiorino-porta-frigorifica', value: JSON.stringify(isolamentoFiorino) }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PARTE 3 CONCLUÍDA (Expert e Isolamento Fiorino)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarAplicacoesParte3();
