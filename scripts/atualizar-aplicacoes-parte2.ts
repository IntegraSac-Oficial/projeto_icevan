import { prisma } from '@/lib/db';

async function atualizarAplicacoesParte2() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO APLICAÇÕES - PARTE 2');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 3. Van Sprinter
    console.log('3️⃣  Atualizando Van Sprinter...');
    const sprinter = {
      titulo: "Van Sprinter",
      subtitulo: "Isolamento térmico de alta performance para Mercedes-Benz Sprinter — solução robusta para grandes volumes.",
      tituloSecao: "Isolamento Térmico para Van Sprinter",
      conteudo: [
        "A Mercedes-Benz Sprinter é referência em furgões de alta capacidade no segmento de transporte profissional. Robusta, confiável e com excelente desempenho em rodovias, a Sprinter é amplamente utilizada por distribuidoras de grande porte, redes hospitalares, indústrias alimentícias e operadoras logísticas que exigem máxima performance.",
        "Na Ice Van, desenvolvemos soluções de isolamento térmico especialmente projetadas para a Sprinter, levando em conta sua estrutura robusta e seu alto volume de carga. O isolamento térmico é executado com painéis de poliuretano de alta densidade (40–60 kg/m³), garantindo baixíssima troca térmica e eficiência energética superior.",
        "O acabamento interno é feito em alumínio ou aço inox, com piso antiderrapante e canais de drenagem para fácil higienização. Todas as instalações seguem as normas sanitárias vigentes para transporte de alimentos e medicamentos, garantindo conformidade total com as exigências regulatórias.",
        "Oferecemos também soluções de vedação reforçada em portas e junções, minimizando a entrada de ar externo e maximizando a eficiência térmica do compartimento de carga. Os perfis de proteção em aço inox garantem durabilidade mesmo em operações intensivas.",
        "A Ice Van oferece suporte técnico especializado para a Sprinter, incluindo manutenção preventiva e assistência pós-venda. Entre em contato e solicite um projeto personalizado para a sua operação."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 3.200 kg (varia por versão)" },
        { label: "Volume útil do baú", valor: "10 a 17 m³ (varia por versão)" },
        { label: "Material de isolamento", valor: "PU injetado 40–60 kg/m³" },
        { label: "Espessura do isolamento", valor: "60 a 100 mm" },
        { label: "Acabamento interno", valor: "Alumínio ou aço inox" },
        { label: "Garantia", valor: "12 meses (instalação)" }
      ],
      metaTitulo: "Isolamento Térmico para Sprinter | Van Mercedes Adaptada — Ice Van",
      metaDescricao: "Isolamento térmico de alta performance para Mercedes-Benz Sprinter. Revestimento profissional e acabamento robusto para grandes volumes. Solicite orçamento."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_van-sprinter' },
      update: { value: JSON.stringify(sprinter) },
      create: { key: 'content_application_van-sprinter', value: JSON.stringify(sprinter) }
    });
    console.log('   ✅ Atualizado');

    // 4. Van Master
    console.log('4️⃣  Atualizando Van Master...');
    const master = {
      titulo: "Van Master",
      subtitulo: "Isolamento térmico para Renault Master — excelente custo-benefício para frotas médias.",
      tituloSecao: "Isolamento Térmico para Van Master",
      conteudo: [
        "A Renault Master é uma excelente opção para frotas médias que buscam volume de carga generoso aliado a custo-benefício competitivo. Muito utilizada por distribuidoras de bebidas, laticínios, produtos farmacêuticos e empresas de alimentação coletiva, a Master oferece versatilidade e robustez para operações urbanas e regionais.",
        "A Ice Van possui ampla experiência na instalação de sistemas de isolamento térmico para a Renault Master em todas as suas versões (curta, longa e teto alto). O processo de adaptação preserva a integridade estrutural do veículo e valoriza o investimento do cliente.",
        "Utilizamos painéis de poliuretano injetado com acabamento em PVC ou alumínio, garantindo eficiência térmica de longa duração. A espessura dos painéis é calculada conforme as necessidades operacionais e as condições climáticas da rota de operação do cliente.",
        "O revestimento interno inclui proteção de cantos em alumínio, piso antiderrapante e vedação reforçada em todas as junções. O acabamento é executado com atenção aos detalhes, garantindo durabilidade e facilidade de higienização.",
        "Além do serviço de conversão, oferecemos manutenção preventiva e assistência técnica para Van Master, com atendimento rápido e suporte especializado. Solicite um orçamento sem compromisso e descubra as melhores soluções para a sua frota."
      ],
      specs: [
        { label: "Capacidade de carga", valor: "Até 1.300 kg" },
        { label: "Volume útil do baú", valor: "8 a 13 m³ (varia por versão)" },
        { label: "Material de isolamento", valor: "Poliuretano injetado" },
        { label: "Espessura do isolamento", valor: "50 a 80 mm" },
        { label: "Acabamento interno", valor: "PVC ou alumínio" },
        { label: "Garantia", valor: "12 meses (instalação)" }
      ],
      metaTitulo: "Isolamento Térmico para Van Master | Renault Master Adaptada — Ice Van",
      metaDescricao: "Soluções de isolamento térmico para Renault Master. Ótimo custo-benefício para frotas médias. Revestimento profissional e acabamento durável."
    };
    await prisma.setting.upsert({
      where: { key: 'content_application_van-master' },
      update: { value: JSON.stringify(master) },
      create: { key: 'content_application_van-master', value: JSON.stringify(master) }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PARTE 2 CONCLUÍDA (Sprinter e Master)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarAplicacoesParte2();
