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
  tituloSecao?: string; // Título da seção de conteúdo (ex: "Refrigeração para Fiorinos")
  conteudo: string[];
  specs: { label: string; valor: string }[];
  thumb: string;
  imagens: string[];
  metaTitulo: string;
  metaDescricao: string;
  href?: string; // URL da página — se omitido usa /{slug}; novos veículos usam /aplicacoes/{slug}
}

export interface VehicleRegistryItem {
  slug: string;
  label: string;
  href: string;
  ordem: number;
}

/** Veículos padrão para o registro (fallback quando não há dado no banco) */
const DEFAULT_REGISTRY: VehicleRegistryItem[] = [
  { slug: "fiorinos",                  label: "Fiorinos",                       href: "/fiorinos",                  ordem: 1 },
  { slug: "van-ducato",                label: "Van Ducato",                     href: "/van-ducato",                ordem: 2 },
  { slug: "van-sprinter",              label: "Van Sprinter",                   href: "/van-sprinter",              ordem: 3 },
  { slug: "van-master",                label: "Van Master",                     href: "/van-master",                ordem: 4 },
  { slug: "expert-porta-frigorifica",  label: "Expert c/ Porta Frigorífica",   href: "/expert-porta-frigorifica",  ordem: 5 },
  { slug: "isolamento-fiorino", label: "Isolamento Fiorino",            href: "/isolamento-fiorino", ordem: 6 },
];

/** Lê o registro de veículos do banco, com fallback para os 6 padrão */
export async function getVehicleRegistry(): Promise<VehicleRegistryItem[]> {
  try {
    const { getSettingJSON } = await import("@/lib/settings");
    const registry = await getSettingJSON<VehicleRegistryItem[]>("vehicles_registry", DEFAULT_REGISTRY);
    return registry.sort((a, b) => a.ordem - b.ordem);
  } catch {
    return DEFAULT_REGISTRY;
  }
}

export const applications: Application[] = [
  {
    slug: "fiorinos",
    titulo: "Fiorinos",
    subtitulo:
      "Isolamento térmico profissional para Fiat Fiorino — ideal para transporte urbano de produtos sensíveis à temperatura.",
    conteudo: [
      "O Fiat Fiorino é um dos veículos utilitários mais utilizados no transporte urbano de produtos sensíveis à temperatura. Sua agilidade, baixo consumo e facilidade de estacionamento o tornam a escolha preferida de pequenos empreendedores, padarias, açougues, distribuidoras de laticínios e empresas de delivery que necessitam de proteção térmica.",
      "Na Ice Van, desenvolvemos soluções completas de isolamento térmico especialmente dimensionadas para o Fiorino. O processo começa com a aplicação de painéis de poliuretano injetado de alta densidade no baú, garantindo excelente eficiência térmica sem comprometer a capacidade de carga útil do veículo.",
      "O revestimento interno é realizado em PVC alimentício ou alumínio, materiais de fácil higienização e conformidade com as normas sanitárias da ANVISA para transporte de alimentos. As vedações das portas são reforçadas para garantir a estanqueidade e manutenção da temperatura interna durante todo o trajeto.",
      "Oferecemos também a opção de porta frigorífica com vedação magnética reforçada, ideal para operações com múltiplas paradas onde a abertura frequente do compartimento exige maior controle térmico. O acabamento é feito com perfis de proteção em alumínio nos cantos e bordas, garantindo durabilidade.",
      "Nossos técnicos realizam a instalação de ponta a ponta — do desmonte do baú original até a entrega do veículo pronto para operação. Todos os trabalhos são executados com garantia e acompanhamento pós-venda, assegurando que o seu Fiorino esteja sempre em plena capacidade operacional.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 650 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 2,5 m³" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Espessura do isolamento", valor: "40 a 60 mm" },
      { label: "Acabamento interno", valor: "PVC alimentício ou alumínio" },
      { label: "Garantia", valor: "12 meses (instalação)" },
    ],
    thumb: "/images/aplicacoes/fiorinos/thumb.webp",
    imagens: [
      "/images/aplicacoes/fiorinos/foto-01.webp",
      "/images/aplicacoes/fiorinos/foto-02.webp",
    ],
    metaTitulo: "Isolamento Térmico para Fiorino | Adaptação Profissional — Ice Van",
    metaDescricao:
      "Isolamento térmico profissional para Fiat Fiorino. Revestimento interno, vedação e acabamento de alta qualidade para transporte de produtos sensíveis. Solicite orçamento.",
  },
  {
    slug: "van-ducato",
    titulo: "Van Ducato",
    subtitulo:
      "Isolamento térmico completo para Fiat Ducato — adaptação profissional para transporte de cargas sensíveis.",
    conteudo: [
      "O Fiat Ducato é um dos furgões mais populares no Brasil para transporte de médio porte. Com amplo espaço de carga, motor robusto e excelente custo-benefício, o Ducato é a preferência de distribuidoras, redes de supermercados, farmácias e empresas de logística que precisam de capacidade sem abrir mão da agilidade.",
      "A Ice Van oferece projetos personalizados de isolamento térmico para o Ducato em suas diversas versões (curto, longo, teto elevado). Utilizamos painéis de PU injetado de alta densidade nas paredes, teto e piso, garantindo máxima eficiência térmica e durabilidade estrutural.",
      "O acabamento interno é executado com materiais de primeira linha: PVC alimentício ou alumínio, com perfis de proteção nos cantos e bordas. O piso recebe tratamento antiderrapante e impermeável, facilitando a higienização e garantindo segurança durante as operações de carga e descarga.",
      "Oferecemos ainda a opção de porta traseira com vedação reforçada e sistema de abertura facilitada, ideal para operações frequentes. Toda a instalação é feita preservando a integridade estrutural do veículo e seguindo as normas sanitárias vigentes.",
      "Solicite uma visita técnica gratuita para avaliação do seu Ducato e receba um orçamento personalizado. Nossa equipe técnica dimensiona a solução ideal conforme o tipo de carga, rota de operação e necessidades específicas do seu negócio.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.500 kg" },
      { label: "Volume útil do baú", valor: "8 a 14 m³ (varia por versão)" },
      { label: "Material de isolamento", valor: "Poliuretano injetado de alta densidade" },
      { label: "Espessura do isolamento", valor: "50 a 80 mm" },
      { label: "Acabamento interno", valor: "Alumínio ou PVC alimentício" },
      { label: "Garantia", valor: "12 meses (instalação)" },
    ],
    thumb: "/images/aplicacoes/van-ducato/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-ducato/foto-01.webp",
      "/images/aplicacoes/van-ducato/foto-02.webp",
    ],
    metaTitulo: "Isolamento Térmico para Van Ducato | Fiat Ducato Adaptado — Ice Van",
    metaDescricao:
      "Transforme seu Fiat Ducato com isolamento térmico profissional. Revestimento interno de alta qualidade e acabamento durável. Orçamento grátis.",
  },
  {
    slug: "van-sprinter",
    titulo: "Van Sprinter",
    subtitulo:
      "Isolamento térmico de alta performance para Mercedes-Benz Sprinter — solução robusta para grandes volumes.",
    conteudo: [
      "A Mercedes-Benz Sprinter é referência em furgões de alta capacidade no segmento de transporte profissional. Robusta, confiável e com excelente desempenho em rodovias, a Sprinter é amplamente utilizada por distribuidoras de grande porte, redes hospitalares, indústrias alimentícias e operadoras logísticas que exigem máxima performance.",
      "Na Ice Van, desenvolvemos soluções de isolamento térmico especialmente projetadas para a Sprinter, levando em conta sua estrutura robusta e seu alto volume de carga. O isolamento térmico é executado com painéis de poliuretano de alta densidade (40–60 kg/m³), garantindo baixíssima troca térmica e eficiência energética superior.",
      "O acabamento interno é feito em alumínio ou aço inox, com piso antiderrapante e canais de drenagem para fácil higienização. Todas as instalações seguem as normas sanitárias vigentes para transporte de alimentos e medicamentos, garantindo conformidade total com as exigências regulatórias.",
      "Oferecemos também soluções de vedação reforçada em portas e junções, minimizando a entrada de ar externo e maximizando a eficiência térmica do compartimento de carga. Os perfis de proteção em aço inox garantem durabilidade mesmo em operações intensivas.",
      "A Ice Van oferece suporte técnico especializado para a Sprinter, incluindo manutenção preventiva e assistência pós-venda. Entre em contato e solicite um projeto personalizado para a sua operação.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 3.200 kg (varia por versão)" },
      { label: "Volume útil do baú", valor: "10 a 17 m³ (varia por versão)" },
      { label: "Material de isolamento", valor: "PU injetado 40–60 kg/m³" },
      { label: "Espessura do isolamento", valor: "60 a 100 mm" },
      { label: "Acabamento interno", valor: "Alumínio ou aço inox" },
      { label: "Garantia", valor: "12 meses (instalação)" },
    ],
    thumb: "/images/aplicacoes/van-sprinter/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-sprinter/foto-01.webp",
      "/images/aplicacoes/van-sprinter/foto-02.webp",
    ],
    metaTitulo: "Isolamento Térmico para Sprinter | Van Mercedes Adaptada — Ice Van",
    metaDescricao:
      "Isolamento térmico de alta performance para Mercedes-Benz Sprinter. Revestimento profissional e acabamento robusto para grandes volumes. Solicite orçamento.",
  },
  {
    slug: "van-master",
    titulo: "Van Master",
    subtitulo:
      "Isolamento térmico para Renault Master — excelente custo-benefício para frotas médias.",
    conteudo: [
      "A Renault Master é uma excelente opção para frotas médias que buscam volume de carga generoso aliado a custo-benefício competitivo. Muito utilizada por distribuidoras de bebidas, laticínios, produtos farmacêuticos e empresas de alimentação coletiva, a Master oferece versatilidade e robustez para operações urbanas e regionais.",
      "A Ice Van possui ampla experiência na instalação de sistemas de isolamento térmico para a Renault Master em todas as suas versões (curta, longa e teto alto). O processo de adaptação preserva a integridade estrutural do veículo e valoriza o investimento do cliente.",
      "Utilizamos painéis de poliuretano injetado com acabamento em PVC ou alumínio, garantindo eficiência térmica de longa duração. A espessura dos painéis é calculada conforme as necessidades operacionais e as condições climáticas da rota de operação do cliente.",
      "O revestimento interno inclui proteção de cantos em alumínio, piso antiderrapante e vedação reforçada em todas as junções. O acabamento é executado com atenção aos detalhes, garantindo durabilidade e facilidade de higienização.",
      "Além do serviço de conversão, oferecemos manutenção preventiva e assistência técnica para Van Master, com atendimento rápido e suporte especializado. Solicite um orçamento sem compromisso e descubra as melhores soluções para a sua frota.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.300 kg" },
      { label: "Volume útil do baú", valor: "8 a 13 m³ (varia por versão)" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Espessura do isolamento", valor: "50 a 80 mm" },
      { label: "Acabamento interno", valor: "PVC ou alumínio" },
      { label: "Garantia", valor: "12 meses (instalação)" },
    ],
    thumb: "/images/aplicacoes/van-master/thumb.webp",
    imagens: [
      "/images/aplicacoes/van-master/foto-01.webp",
      "/images/aplicacoes/van-master/foto-02.webp",
    ],
    metaTitulo: "Isolamento Térmico para Van Master | Renault Master Adaptada — Ice Van",
    metaDescricao:
      "Soluções de isolamento térmico para Renault Master. Ótimo custo-benefício para frotas médias. Revestimento profissional e acabamento durável.",
  },
  {
    slug: "expert-porta-frigorifica",
    titulo: "Expert com Porta Frigorífica",
    subtitulo:
      "Citroën/Peugeot Expert com isolamento térmico e porta frigorífica de alta vedação.",
    conteudo: [
      "A Citroën Berlingo Expert e a Peugeot Expert são furgões compactos muito utilizados no comércio e na distribuição urbana. Quando equipadas com sistema de isolamento térmico e porta frigorífica de alta vedação, tornam-se plataformas extremamente eficientes para o transporte de alimentos frescos, laticínios, floricultura e produtos farmacêuticos.",
      "A porta frigorífica é um dos elementos mais críticos para garantir a eficiência térmica. Na Ice Van, instalamos portas com perfis de vedação dupla, juntas magnéticas e dobradiças reforçadas em aço inox, garantindo estanqueidade total e resistência ao uso intensivo. O sistema de fechamento é seguro e de fácil operação, mesmo com as mãos ocupadas.",
      "O processo de conversão da Expert inclui o revestimento completo do compartimento de carga com painéis de poliuretano injetado, seguido pela montagem da porta frigorífica sob medida. Todo o trabalho é executado sem comprometer a garantia de fábrica do veículo.",
      "Oferecemos acabamento interno em PVC alimentício na cor branca, com perfis de proteção de canto em aço inox para maior durabilidade em operações de carga e descarga. O piso é revestido com material antiderrapante e impermeável, facilitando a higienização.",
      "A combinação de isolamento térmico de qualidade com uma porta frigorífica bem projetada resulta em maior eficiência térmica e melhor conservação dos produtos. Entre em contato e solicite uma avaliação técnica para a sua Expert.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 1.000 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 5 a 7 m³" },
      { label: "Material de isolamento", valor: "Poliuretano injetado" },
      { label: "Espessura do isolamento", valor: "40 a 60 mm" },
      { label: "Porta frigorífica", valor: "Vedação dupla, junta magnética" },
      { label: "Acabamento interno", valor: "PVC alimentício branco" },
    ],
    thumb: "/images/aplicacoes/expert-porta-frigorifica/thumb.webp",
    imagens: [
      "/images/aplicacoes/expert-porta-frigorifica/foto-01.webp",
      "/images/aplicacoes/expert-porta-frigorifica/foto-02.webp",
    ],
    metaTitulo: "Expert com Porta Frigorífica | Citroën Peugeot Isolada — Ice Van",
    metaDescricao:
      "Adaptação da Citroën/Peugeot Expert com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para transporte urbano de produtos sensíveis.",
  },
  {
    slug: "isolamento-fiorino",
    titulo: "Isolamento Fiorino",
    subtitulo:
      "Fiat Fiorino com isolamento térmico reforçado e porta frigorífica para operações que exigem máxima eficiência.",
    conteudo: [
      "O Fiat Fiorino com porta frigorífica é a solução ideal para pequenos negócios que necessitam de um veículo compacto, ágil e com alto grau de isolamento térmico. Perfeito para roteiros urbanos com múltiplas paradas, este equipamento garante que a temperatura interna seja mantida mesmo durante as aberturas frequentes do compartimento de carga.",
      "A versão com porta frigorífica se diferencia da conversão padrão pela instalação de uma porta de alto desempenho com vedação reforçada, juntas magnéticas flexíveis e perfis de alumínio que garantem o mínimo de troca térmica a cada abertura. Esta solução é especialmente recomendada para entrega de sorvetes, produtos lácteos, carnes frescas e produtos farmacêuticos.",
      "O processo de instalação começa com o revestimento interno do baú com painéis de poliuretano injetado de alta densidade (40 kg/m³), seguido pela instalação da porta frigorífica sob medida. O acabamento interno em PVC alimentício facilita a limpeza e mantém a conformidade sanitária.",
      "Apesar do tamanho compacto, o sistema instalado oferece excelente eficiência térmica, suficiente para a maioria das aplicações de transporte urbano de produtos sensíveis à temperatura. Os perfis de proteção em alumínio garantem durabilidade mesmo em operações intensivas.",
      "A Ice Van oferece um serviço completo de conversão do Fiorino: projeto técnico, instalação e assistência pós-venda. Nosso time de técnicos especializados garante que o seu veículo esteja 100% operacional dentro do prazo acordado. Solicite seu orçamento agora mesmo.",
    ],
    specs: [
      { label: "Capacidade de carga", valor: "Até 600 kg" },
      { label: "Volume útil do baú", valor: "Aprox. 2,0 a 2,5 m³" },
      { label: "Material de isolamento", valor: "PU injetado 40 kg/m³" },
      { label: "Espessura do isolamento", valor: "40 a 60 mm" },
      { label: "Porta frigorífica", valor: "Vedação reforçada, junta magnética" },
      { label: "Acabamento interno", valor: "PVC alimentício" },
    ],
    thumb: "/images/aplicacoes/isolamento-fiorino/thumb.webp",
    imagens: [
      "/images/aplicacoes/isolamento-fiorino/foto-01.webp",
      "/images/aplicacoes/isolamento-fiorino/foto-02.webp",
    ],
    metaTitulo: "Isolamento Fiorino com Porta Frigorífica | Adaptação Profissional — Ice Van",
    metaDescricao:
      "Fiat Fiorino com isolamento térmico profissional e porta frigorífica de alta vedação. Ideal para pequenas entregas urbanas de produtos sensíveis.",
  },
];

/** Busca uma aplicação pelo slug */
export function getApplicationBySlug(slug: string): Application | undefined {
  return applications.find((app) => app.slug === slug);
}

/**
 * Carrega conteúdo de texto do banco para uma aplicação.
 * Mescla com os dados estáticos — banco tem prioridade.
 * Suporta veículos dinâmicos (não presentes no array estático).
 */
export async function loadApplicationContent(slug: string): Promise<Application | undefined> {
  const staticApp = getApplicationBySlug(slug);

  try {
    const { getSettingJSON } = await import("@/lib/settings");
    type ContentOverride = Partial<Omit<Application, "slug">>;
    const override = await getSettingJSON<ContentOverride>(`content_application_${slug}`, {});

    if (staticApp) {
      return { ...staticApp, ...override };
    }

    // Veículo dinâmico (só existe no banco)
    if (override.titulo) {
      return {
        slug,
        titulo: override.titulo,
        subtitulo: override.subtitulo ?? "",
        conteudo: override.conteudo ?? [],
        specs: override.specs ?? [],
        thumb: override.thumb ?? `/images/aplicacoes/${slug}/thumb.webp`,
        imagens: override.imagens ?? [],
        metaTitulo: override.metaTitulo ?? override.titulo,
        metaDescricao: override.metaDescricao ?? "",
        href: `/aplicacoes/${slug}`,
      };
    }
  } catch {
    // fallback silencioso
  }

  return staticApp;
}

/**
 * Carrega legendas personalizadas das fotos de uma aplicação
 * Retorna um mapa de filename -> legenda
 */
export async function loadPhotoCaptions(slug: string): Promise<Map<string, string>> {
  try {
    const { prisma } = await import("@/lib/db");
    
    const captions = await prisma.applicationPhotoCaption.findMany({
      where: { aplicacao: slug },
    });

    const captionsMap = new Map(captions.map((c) => [c.filename, c.legenda]));
    return captionsMap;
  } catch (error) {
    console.warn(`Aviso: Erro ao carregar legendas para ${slug}:`, error);
    return new Map();
  }
}

/**
 * Carrega imagens dinamicamente do filesystem para uma aplicação
 * Retorna a aplicação com as imagens atualizadas do disco
 */
export async function loadApplicationImages(slug: string): Promise<Application | undefined> {
  // Primeiro mescla conteúdo do banco
  const app = await loadApplicationContent(slug);
  if (!app) return undefined;

  try {
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    const { ensureApplicationDirectory } = await import("@/lib/ensure-directories");

    const folderPath = path.join(process.cwd(), "public", "images", "aplicacoes", slug);
    
    // Garante que o diretório existe
    await ensureApplicationDirectory(slug);
    
    const files = await readdir(folderPath);

    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b)); // Ordenar alfabeticamente

    if (imageFiles.length > 0) {
      const imagens = imageFiles.map((f) => `/api/images/${f}?folder=images/aplicacoes/${slug}`);
      return {
        ...app,
        thumb: imagens[0] || app.thumb, // Primeira imagem é o thumbnail
        imagens,
      };
    }
  } catch (error) {
    // Se falhar, retorna a aplicação com imagens padrão
    console.warn(`Aviso: Erro ao carregar imagens para ${slug}:`, error);
  }

  return app;
}
/**
 * Carrega imagens e vídeos para uma aplicação
 * Retorna a aplicação com imagens do disco e vídeos filtrados por categoria
 */
export async function loadApplicationWithVideos(slug: string): Promise<{ app: Application; videos: any[] } | undefined> {
  const app = await loadApplicationImages(slug);
  if (!app) return undefined;

  try {
    const { getVideosByCategory } = await import("@/lib/videos");

    // Mapear slug para categoria de vídeo
    const categoryMap: Record<string, string> = {
      "fiorinos": "fiorino",
      "van-ducato": "ducato",
      "van-sprinter": "sprinter",
      "van-master": "master",
      "expert-porta-frigorifica": "expert",
      "isolamento-fiorino": "fiorino"
    };

    const categoria = categoryMap[slug] || slug;
    const videos = await getVideosByCategory(categoria);

    return { app, videos };
  } catch (error) {
    console.warn(`Aviso: Erro ao carregar vídeos para ${slug}:`, error);
    return { app, videos: [] };
  }
}

/**
 * Carrega imagens dinamicamente da pasta empresa
 * Retorna array de URLs das imagens ordenadas por prefixo numérico
 */
export async function loadEmpresaImages(): Promise<string[]> {
  try {
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    const { ensureDirectory } = await import("@/lib/ensure-directories");
    
    const folderPath = path.join(process.cwd(), "public", "images", "empresa");
    
    // Garante que o diretório existe
    await ensureDirectory(folderPath);
    
    const files = await readdir(folderPath);
    
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b)); // Ordenar alfabeticamente (01-, 02-, 03-...)
    
    return imageFiles.map((f) => `/api/images/${f}?folder=images/empresa`);
  } catch (error) {
    // Se falhar, retorna array vazio
    console.warn("Aviso: Erro ao carregar imagens da empresa:", error);
    return [];
  }
}
