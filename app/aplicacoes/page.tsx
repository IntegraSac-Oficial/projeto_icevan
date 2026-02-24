import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { ApplicationCard } from "@/components/ApplicationCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { applications, loadApplicationImages } from "@/lib/applications";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aplicações — Refrigeração por Tipo de Veículo",
  description:
    "Soluções de refrigeração e isolamento térmico para Fiorino, Van Ducato, Sprinter, Master, Expert e mais. Projetos personalizados para cada veículo.",
  alternates: { canonical: "/aplicacoes" },
};

export default async function AplicacoesPage() {
  // Carregar imagens dinâmicas para todas as aplicações
  const applicationsWithImages = await Promise.all(
    applications.map(app => loadApplicationImages(app.slug))
  );
  const validApplications = applicationsWithImages.filter(app => app !== undefined);

  return (
    <main className="pt-24 md:pt-28">
      {/* Hero da página */}
      <section className="bg-brand-primary text-white py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="text-brand-secondary text-sm font-semibold uppercase tracking-wider mb-3">
              Soluções por veículo
            </p>
            <h1 className="text-white mb-5">
              Aplicações de Refrigeração para Transporte
            </h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Instalamos sistemas de isolamento térmico e refrigeração nos principais
              furgões e vans do mercado. Cada projeto é dimensionado conforme o
              veículo, o produto transportado e a faixa de temperatura necessária.
            </p>
          </div>
        </div>
      </section>

      {/* Grid de aplicações */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <SectionTitle
            title="Escolha seu Veículo"
            subtitle="Clique na aplicação que melhor se encaixa no seu veículo e veja os detalhes do serviço."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {validApplications.map((app) => (
              <ApplicationCard key={app.slug} application={app} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA — não encontrou */}
      <section className="section-padding section-light">
        <div className="container-site text-center">
          <h2 className="text-brand-primary mb-4">
            Não encontrou sua aplicação?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Trabalhamos com diversos tipos de veículos e soluções personalizadas.
            Fale com nossos especialistas e descreva sua necessidade.
          </p>
          <a
            href={whatsappUrl(
              "Olá! Preciso de refrigeração para um veículo que não vi nas aplicações do site. Pode me ajudar?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent px-10 py-4 text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Fale com Nossos Especialistas
          </a>
        </div>
      </section>
    </main>
  );
}
