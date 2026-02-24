/**
 * DADOS DAS 6 APLICAÇÕES — Ice Van
 *
 * Cada objeto representa uma aplicação com:
 * - slug: usado na URL (/van-ducato)
 * - titulo: nome exibido na UI
 * - subtitulo: descrição curta para cards
 * - conteudo: texto SEO de 300-500 palavras para a página de detalhe
 * - specs: especificações técnicas básicas
 * - thumb: imagem do card na página /aplicacoes
 * - imagens: fotos da galeria na página de detalhe
 */

export interface Application {
  slug: string;
  titulo: string;
  subtitulo: string;
  conteudo: string[];
  specs: { label: string; valor: string }[];
  thumb: string;
  imagens: string[];
  metaTitulo: string;
  metaDescricao: string;
}

export const applications: Application[] = [
  {
    slug: "fiorinos",
    titulo: "Fiorinos",
    subtitulo:
      "Isolamento térmico e refrigeração para Fiat Fiorino — ideal para pequenas entregas de perecíveis.",
    conteudo: [
      "O Fiat Fiorino é um dos veículos utilitários mais utilizados no transporte de perecíveis em centros urbanos. Sua agilidade, baixo consumo e facilidade de estacionamento o tornam a escolha preferida de pequenos empreendedores, padarias, açougues, distribuidoras de laticínios e empresas de delivery refrigerado.",
      "Na Ice Van, desenvolvemos soluções completas de isolamento térmico e refrigeração especialmente dimensionadas para o Fiorino. O processo começa com a aplicação de painéis de poliuretano injetado de alta densidade no baú, garantindo excelente eficiência térmica sem comprometer a capacidade de carga útil do veículo.",
      "Para o sistema de refrigeração, trabalhamos com equipamentos compactos e de alta performance, projetados para manter temperaturas entre -18°C e +8°C, conforme a necessidade do cliente. Os compressores utilizados são de marcas reconhecidas no mercado, garantindo durabilidade e confiabilidade mesmo em operações intensas.",
      "O acabamento interno é realizado em PVC alimentício ou alumínio, materiais de fácil higienização e conformidade com as normas sanitárias da ANVISA para transporte de alimentos. As vedações das portas são reforçadas para garantir a estanqueidade e manutenção da temperatura durante todo o trajeto.",
      "Nossos técnicos realizam a instalação de ponta a ponta — do desmonte do baú original até a entrega do veículo pronto para operação. Todos os trabalhos são executados com garantia e acompanhamento pós-venda, assegurando que o seu Fiorino esteja sempre em plena capacidade de refrigeração.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 650 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 2,5 m³" },
      { label: "Faixa de temperatura", valor: "-18°C a +8°C" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Acabamento interno", valor: "PVC alimentício ou alumínio" },
      { label: "Garantia", valor: "12 meses (sistema de refrigeração)" },
    ],
    thumb: "/images/aplicacoes/fiorinos/thumb.webp",
    imagens: [
      "/images/aplicacoes/fiorinos/foto-01.webp",
      "/images/aplicacoes/fiorinos/foto-02.webp",
    ],
    metaTitulo: "Refrigeração para Fiorino | Isolamento Térmico — Ice Van",
    metaDescricao:
      "Instale sistemas de refrigeração e isolamento térmico no seu Fiat Fiorino. Soluções profissionais para transporte de perecíveis. Solicite orçamento.",
  },
  {
    slug: "van-ducato",
    titulo: "Van Ducato",
    subtitulo:
      "Solução completa de refrigeração para Fiat Ducato — um dos furgões mais utilizados no transporte de alimentos.",
    conteudo: [
      "O Fiat Ducato é um dos furgões mais populares no Brasil para o transporte refrigerado de médio porte. Com amplo espaço de carga, motor robusto e excelente custo-benefício, o Ducato é a preferência de distribuidoras, redes de supermercados, farmácias e empresas de logística alimentar que precisam de capacidade sem abrir mão da agilidade.",
      "A Ice Van oferece projetos personalizados de isolamento térmico e refrigeração para o Ducato em suas diversas versões (curto, longo, teto elevado). Utilizamos painéis de PU injetado de alta densidade nas paredes, teto e piso, garantindo máxima eficiência térmica e durabilidade estrutural.",
      "Os equipamentos de refrigeração instalados são dimensionados conforme o volume do baú e a faixa de temperatura exigida: desde climatizado (+18°C a +25°C) para produtos sensíveis, até congelados (-18°C) para cargas que exigem temperatura negativa.",
      "Toda a instalação elétrica do sistema de refrigeração é integrada ao circuito elétrico do veículo com proteções adequadas, garantindo segurança e confiabilidade. O painel de controle digital facilita o monitoramento da temperatura em tempo real pelo motorista.",
      "Oferecemos ainda a opção de porta traseira frigorífica com vedação reforçada e sistema de abertura facilitada, ideal para operações de carga e descarga frequentes. Solicite uma visita técnica gratuita para avaliação do seu Ducato e receba um orçamento personalizado.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.500 kg" },
      { label: "Volume útil do baú", valor: "8 a 14 m³ (varia por versão)" },
      { label: "Faixa de temperatura", valor: "-18°C a +25°C" },
      { label: "Material de isolamento", valor: "Poliuretano injetado de alta densidade" },
      { label: "Acabamento interno", valor: "Alumínio ou PVC alimentício" },
      { label: "Garantia", valor: "12 meses (sistema de refrigeração)" },
    ],
    thumb: "/images/aplicacoes/van-ducato/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-ducato/foto-01.webp",
      "/images/aplicacoes/van-ducato/foto-02.webp",
    ],
    metaTitulo: "Refrigeração para Van Ducato | Fiat Ducato Frigorífico — Ice Van",
    metaDescricao:
      "Transforme seu Fiat Ducato em um veículo frigorífico profissional. Isolamento térmico e refrigeração de alta performance. Orçamento grátis.",
  },
  {
    slug: "van-sprinter",
    titulo: "Van Sprinter",
    subtitulo:
      "Equipamento de refrigeração de alta capacidade para Mercedes-Benz Sprinter.",
    conteudo: [
      "A Mercedes-Benz Sprinter é referência em furgões de alta capacidade no segmento de transporte refrigerado. Robusta, confiável e com excelente desempenho em rodovias, a Sprinter é amplamente utilizada por distribuidoras de grande porte, redes hospitalares, indústrias alimentícias e operadoras logísticas que exigem máxima performance.",
      "Na Ice Van, desenvolvemos soluções de refrigeração especialmente projetadas para a Sprinter, levando em conta sua estrutura robusta e seu alto volume de carga. O isolamento térmico é executado com painéis de poliuretano de alta densidade (40–60 kg/m³), garantindo baixíssima troca térmica e eficiência energética superior.",
      "Os sistemas de refrigeração instalados são de alta potência, capazes de manter temperaturas estáveis mesmo em condições extremas de calor externo. Trabalhamos com equipamentos de acionamento independente (motor auxiliar diesel ou elétrico), garantindo refrigeração contínua mesmo com o veículo desligado — essencial para operações prolongadas de carga e descarga.",
      "O acabamento interno é feito em alumínio ou aço inox, com piso antiderrapante e canais de drenagem para fácil higienização. Todas as instalações seguem as normas sanitárias vigentes para transporte de alimentos e medicamentos.",
      "A Ice Van oferece suporte técnico especializado para a Sprinter, incluindo revisão periódica do sistema de refrigeração, recarga de gás refrigerante e manutenção preventiva. Entre em contato e solicite um projeto personalizado para a sua operação.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 3.200 kg (varia por versão)" },
      { label: "Volume útil do baú", valor: "10 a 17 m³ (varia por versão)" },
      { label: "Faixa de temperatura", valor: "-25°C a +25°C" },
      { label: "Material de isolamento", valor: "PU injetado 40–60 kg/m³" },
      { label: "Acabamento interno", valor: "Alumínio ou aço inox" },
      { label: "Acionamento do sistema", valor: "Elétrico ou motor auxiliar diesel" },
    ],
    thumb: "/images/aplicacoes/van-sprinter/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-sprinter/foto-01.webp",
      "/images/aplicacoes/van-sprinter/foto-02.webp",
    ],
    metaTitulo: "Refrigeração para Sprinter | Van Mercedes Frigorífica — Ice Van",
    metaDescricao:
      "Equipamentos de refrigeração de alta capacidade para Mercedes-Benz Sprinter. Isolamento profissional e sistemas robustos para transporte de perecíveis.",
  },
  {
    slug: "van-master",
    titulo: "Van Master",
    subtitulo:
      "Isolamento e refrigeração para Renault Master — excelente custo-benefício para frotas médias.",
    conteudo: [
      "A Renault Master é uma excelente opção para frotas médias que buscam volume de carga generoso aliado a custo-benefício competitivo. Muito utilizada por distribuidoras de bebidas, laticínios, produtos farmacêuticos e empresas de alimentação coletiva, a Master oferece versatilidade e robustez para operações urbanas e regionais.",
      "A Ice Van possui ampla experiência na instalação de sistemas de isolamento térmico e refrigeração para a Renault Master em todas as suas versões (curta, longa e teto alto). O processo de adaptação preserva a integridade estrutural do veículo e valoriza o investimento do cliente.",
      "Utilizamos painéis de poliuretano injetado com acabamento em PVC ou alumínio, garantindo eficiência térmica de longa duração. A espessura dos painéis é calculada conforme a faixa de temperatura desejada e as condições climáticas da rota de operação do cliente.",
      "Os sistemas de refrigeração instalados são selecionados conforme a necessidade operacional: resfriados (0°C a +8°C), climatizados (+15°C a +25°C) ou congelados (-18°C a -25°C). Trabalhamos com equipamentos de reconhecida qualidade no mercado nacional e internacional.",
      "Além do serviço de conversão, oferecemos manutenção preventiva e corretiva para sistemas de refrigeração em Van Master, com atendimento rápido e peças de reposição disponíveis. Solicite um orçamento sem compromisso e descubra as melhores soluções para a sua frota.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.300 kg" },
      { label: "Volume útil do baú", valor: "8 a 13 m³ (varia por versão)" },
      { label: "Faixa de temperatura", valor: "-25°C a +25°C" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Acabamento interno", valor: "PVC ou alumínio" },
      { label: "Garantia", valor: "12 meses (sistema de refrigeração)" },
    ],
    thumb: "/images/aplicacoes/van-master/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-master/foto-01.webp",
      "/images/aplicacoes/van-master/foto-02.webp",
    ],
    metaTitulo: "Refrigeração para Van Master | Renault Master Frigorífica — Ice Van",
    metaDescricao:
      "Soluções de refrigeração e isolamento térmico para Renault Master. Ótimo custo-benefício para frotas médias. Solicite orçamento personalizado.",
  },
  {
    slug: "expert-porta-frigorifica",
    titulo: "Expert com Porta Frigorífica",
    subtitulo:
      "Citroën/Peugeot Expert adaptado com porta frigorífica de alta vedação.",
    conteudo: [
      "A Citroën Berlingo Expert e a Peugeot Expert são furgões compactos muito utilizados no comércio e na distribuição urbana. Quando equipadas com sistema de isolamento térmico e porta frigorífica de alta vedação, tornam-se plataformas extremamente eficientes para o transporte de alimentos frescos, laticínios, floricultura e produtos farmacêuticos.",
      "A porta frigorífica é um dos elementos mais críticos do sistema de refrigeração. Na Ice Van, instalamos portas com perfis de vedação dupla, juntas magnéticas e dobradiças reforçadas em aço inox, garantindo estanqueidade total e resistência ao uso intensivo. O sistema de fechamento é seguro e de fácil operação, mesmo com as mãos ocupadas.",
      "O processo de conversão da Expert inclui o revestimento completo do compartimento de carga com painéis de poliuretano injetado, seguido pela instalação do sistema de refrigeração e pela montagem da porta frigorífica sob medida. Todo o trabalho é executado sem comprometer a garantia de fábrica do veículo.",
      "Oferecemos acabamento interno em PVC alimentício na cor branca, com perfis de proteção de canto em aço inox para maior durabilidade em operações de carga e descarga. O piso é revestido com material antiderrapante e impermeável, facilitando a higienização.",
      "A combinação de isolamento térmico de qualidade com uma porta frigorífica bem projetada resulta em menor consumo de energia, maior autonomia do sistema de refrigeração e melhor conservação dos produtos. Entre em contato e solicite uma avaliação técnica para a sua Expert.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.000 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 5 a 7 m³" },
      { label: "Faixa de temperatura", valor: "0°C a +8°C" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Porta frigorífica", valor: "Vedação dupla, junta magnética" },
      { label: "Acabamento interno", valor: "PVC alimentício branco" },
    ],
    thumb: "/images/aplicacoes/expert-porta-frigorifica/thumb.webp",
    imagens: [
      "/images/aplicacoes/expert-porta-frigorifica/foto-01.webp",
      "/images/aplicacoes/expert-porta-frigorifica/foto-02.webp",
    ],
    metaTitulo: "Expert com Porta Frigorífica | Citroën Peugeot Frigorífico — Ice Van",
    metaDescricao:
      "Adaptação da Citroën/Peugeot Expert com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para transporte de perecíveis.",
  },
  {
    slug: "fiorino-porta-frigorifica",
    titulo: "Fiorino com Porta Frigorífica",
    subtitulo:
      "Fiat Fiorino com porta frigorífica integrada para operações que exigem mais isolamento.",
    conteudo: [
      "O Fiat Fiorino com porta frigorífica é a solução ideal para pequenos negócios que necessitam de um veículo compacto, ágil e com alto grau de isolamento térmico. Perfeito para roteiros urbanos com múltiplas paradas, este equipamento garante que a temperatura interna seja mantida mesmo durante as aberturas frequentes do compartimento de carga.",
      "A versão com porta frigorífica se diferencia da conversão padrão pela instalação de uma porta de alto desempenho com vedação reforçada, juntas magnéticas flexíveis e perfis de alumínio que garantem o mínimo de troca térmica a cada abertura. Esta solução é especialmente recomendada para entrega de sorvetes, produtos lácteos, carnes frescas e produtos farmacêuticos.",
      "O processo de instalação começa com o revestimento interno do baú com painéis de poliuretano injetado de alta densidade (40 kg/m³), seguido pela instalação da porta frigorífica sob medida e do sistema de refrigeração compacto, especialmente selecionado para o volume reduzido do Fiorino.",
      "Apesar do tamanho compacto, o sistema instalado é capaz de manter temperaturas de 0°C a -10°C de forma estável, suficiente para a maioria das aplicações de transporte resfriado urbano. O acabamento interno em PVC alimentício facilita a limpeza e mantém a conformidade sanitária.",
      "A Ice Van oferece um serviço completo de conversão do Fiorino: projeto técnico, instalação e assistência pós-venda. Nosso time de técnicos especializados garante que o seu veículo esteja 100% operacional dentro do prazo acordado. Solicite seu orçamento agora mesmo.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 600 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 2,0 a 2,5 m³" },
      { label: "Faixa de temperatura", valor: "0°C a -10°C" },
      { label: "Material de isolamento", valor: "PU injetado 40 kg/m³" },
      { label: "Porta frigorífica", valor: "Vedação reforçada, junta magnética" },
      { label: "Acabamento interno", valor: "PVC alimentício" },
    ],
    thumb: "/images/aplicacoes/fiorino-porta-frigorifica/thumb.webp",
    imagens: [
      "/images/aplicacoes/fiorino-porta-frigorifica/foto-01.webp",
      "/images/aplicacoes/fiorino-porta-frigorifica/foto-02.webp",
    ],
    metaTitulo: "Fiorino com Porta Frigorífica | Isolamento e Refrigeração — Ice Van",
    metaDescricao:
      "Fiat Fiorino adaptado com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para pequenas entregas urbanas de perecíveis.",
  },
];

/** Busca uma aplicação pelo slug */
export function getApplicationBySlug(slug: string): Application | undefined {
  return applications.find((app) => app.slug === slug);
}

/**
 * Carrega imagens dinamicamente do filesystem para uma aplicação
 * Retorna a aplicação com as imagens atualizadas do disco
 */
export async function loadApplicationImages(slug: string): Promise<Application | undefined> {
  const app = getApplicationBySlug(slug);
  if (!app) return undefined;

  try {
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    
    const folderPath = path.join(process.cwd(), "public", "images", "aplicacoes", slug);
    const files = await readdir(folderPath);
    
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b)); // Ordenar alfabeticamente
    
    if (imageFiles.length > 0) {
      const imagens = imageFiles.map((f) => `/images/aplicacoes/${slug}/${f}`);
      return {
        ...app,
        thumb: imagens[0] || app.thumb, // Primeira imagem é o thumbnail
        imagens,
      };
    }
  } catch {
    // Se falhar, retorna a aplicação com imagens padrão
  }
  
  return app;
}

/**
 * Carrega imagens dinamicamente da pasta empresa
 * Retorna array de URLs das imagens ordenadas por prefixo numérico
 */
export async function loadEmpresaImages(): Promise<string[]> {
  try {
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    
    const folderPath = path.join(process.cwd(), "public", "images", "empresa");
    const files = await readdir(folderPath);
    
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b)); // Ordenar alfabeticamente (01-, 02-, 03-...)
    
    return imageFiles.map((f) => `/images/empresa/${f}`);
  } catch {
    // Se falhar, retorna array vazio
    return [];
  }
}
