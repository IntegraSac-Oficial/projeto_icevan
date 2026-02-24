import { Thermometer, Wind, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import Link from "next/link";

const solutions = [
  {
    icon: Thermometer,
    title: "Isolamento Térmico",
    color: "bg-brand-primary",
    href: "/aplicacoes",
    features: [
      "Painéis de poliuretano injetado de alta densidade",
      "Acabamento em PVC alimentício ou alumínio",
      "Conformidade com normas sanitárias da ANVISA",
      "Máxima eficiência térmica e durabilidade",
      "Reduz consumo do sistema de refrigeração",
    ],
    description:
      "O isolamento térmico é a base para garantir a eficiência da cadeia de frio no transporte de perecíveis. Aplicado em vans, furgões e utilitários, impede a troca de calor entre o interior e o exterior do veículo, mantendo a temperatura estável por mais tempo.",
  },
  {
    icon: Wind,
    title: "Aparelho de Refrigeração",
    color: "bg-brand-secondary",
    href: "/aplicacoes",
    features: [
      "Compressores e componentes de primeira linha",
      "Dimensionamento por volume e temperatura",
      "Resfriados, climatizados ou congelados",
      "Painel de controle digital",
      "Suporte técnico e manutenção preventiva",
    ],
    description:
      "Os aparelhos de refrigeração são instalados em vans, furgões e caminhões para manter a temperatura ideal no transporte de cargas perecíveis. Trabalhamos com equipamentos de alta tecnologia, dimensionados conforme o tipo de veículo e a faixa de temperatura exigida.",
  },
];

export function SolutionSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionTitle
          title="Nossas Soluções"
          subtitle="Oferecemos dois serviços principais para transformar seu veículo em uma plataforma completa de transporte refrigerado."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.title}
                className="card group hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Header do card */}
                <div className={`${sol.color} p-6 flex items-center gap-4`}>
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
                    {sol.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={sol.href}
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
