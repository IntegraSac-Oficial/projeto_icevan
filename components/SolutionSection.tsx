import { Thermometer, Wind, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getSettingJSON } from "@/lib/settings";
import Link from "next/link";

const ICONS = [Thermometer, Wind];
const COLORS = ["bg-brand-primary", "bg-brand-secondary"];

interface SolutionCard {
  title: string;
  description: string;
  features: string[];
}

const DEFAULT_SOLUTIONS: SolutionCard[] = [
  {
    title: "Isolamento Térmico",
    description:
      "O isolamento térmico é essencial para proteger cargas sensíveis à temperatura e garantir eficiência no transporte. Aplicado em vans, furgões e utilitários, impede a troca de calor entre o interior e o exterior do veículo, mantendo a temperatura interna estável por mais tempo.",
    features: [
      "Painéis de poliuretano injetado de alta densidade",
      "Acabamento em PVC alimentício ou alumínio",
      "Conformidade com normas sanitárias da ANVISA",
      "Máxima eficiência térmica e durabilidade",
      "Reduz necessidade de controle térmico ativo",
    ],
  },
  {
    title: "Revestimento e Acabamento Interno",
    description:
      "O revestimento interno completa a adaptação do veículo, oferecendo proteção, higiene e durabilidade. Utilizamos materiais de alta qualidade que facilitam a limpeza e garantem conformidade sanitária para transporte de alimentos e produtos sensíveis.",
    features: [
      "Revestimento em PVC alimentício ou alumínio",
      "Piso antiderrapante e impermeável",
      "Vedação reforçada em portas e junções",
      "Proteção de cantos em aço inox",
      "Fácil higienização e manutenção",
    ],
  },
];

interface SolucoesContent {
  titulo_secao: string;
  subtitulo_secao: string;
  cards: SolutionCard[];
}

const DEFAULT_CONTENT: SolucoesContent = {
  titulo_secao: "Nossas Soluções",
  subtitulo_secao:
    "Oferecemos soluções completas de isolamento térmico e adaptação interna para transformar seu veículo em uma plataforma profissional de transporte.",
  cards: DEFAULT_SOLUTIONS,
};

export async function SolutionSection() {
  const content = await getSettingJSON<SolucoesContent>("content_solucoes", DEFAULT_CONTENT);

  // Garante que sempre existem 2 cards (mesmo se o banco retornar menos)
  const cards = (content.cards ?? DEFAULT_SOLUTIONS).slice(0, 2).map(
    (card, i) => ({ ...DEFAULT_SOLUTIONS[i], ...card })
  );

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionTitle
          title={content.titulo_secao || DEFAULT_CONTENT.titulo_secao}
          subtitle={content.subtitulo_secao || DEFAULT_CONTENT.subtitulo_secao}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((sol, i) => {
            const Icon = ICONS[i];
            const color = COLORS[i];
            return (
              <div
                key={i}
                className="card group hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Header do card */}
                <div className={`${color} p-6 flex items-center gap-4`}>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-heading font-bold text-2xl">
                    {sol.title}
                  </h3>
                </div>

                {/* Corpo do card */}
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {sol.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {sol.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/aplicacoes"
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold
                               hover:gap-3 transition-all duration-200 group/link"
                  >
                    Ver aplicações
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
