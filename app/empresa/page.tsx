import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { empresa } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { loadEmpresaImages } from "@/lib/applications";

export const metadata: Metadata = {
  title: "Empresa — Quem Somos",
  description:
    "Conheça a Ice Van: missão, visão, valores e diferenciais de uma empresa especializada em refrigeração para transporte de perecíveis em São Paulo.",
  alternates: { canonical: "/empresa" },
};

const mvv = [
  {
    icon: Target,
    title: "Missão",
    color: "bg-brand-primary",
    desc: "Oferecer soluções completas de refrigeração e isolamento térmico para veículos de transporte, garantindo a integridade dos produtos perecíveis e a satisfação total dos nossos clientes.",
  },
  {
    icon: Eye,
    title: "Visão",
    color: "bg-brand-secondary",
    desc: "Ser referência nacional no segmento de refrigeração veicular, reconhecidos pela qualidade técnica, inovação e pelo relacionamento de longo prazo com nossos parceiros e clientes.",
  },
  {
    icon: Heart,
    title: "Valores",
    color: "bg-brand-accent",
    desc: "Qualidade sem compromisso. Honestidade nas relações. Comprometimento com o prazo. Respeito ao cliente. Melhoria contínua em processos e materiais.",
  },
];

const diferenciais = [
  "Técnicos especializados e certificados",
  "Materiais de alta qualidade e durabilidade",
  "Projetos personalizados por veículo e aplicação",
  "Cumprimento rigoroso de prazos",
  "Garantia de 12 meses nas instalações",
  "Suporte e assistência técnica pós-venda",
  "Conformidade com normas sanitárias ANVISA",
  "Atendimento consultivo — não somos apenas vendedores",
];

export default async function EmpresaPage() {
  // Carrega imagens dinamicamente da pasta empresa
  const empresaImages = await loadEmpresaImages();
  
  // Primeira imagem (01-) = Nosso Escritório
  // Segunda imagem (02-) = Nossos Diferenciais
  const imagemEscritorio = empresaImages[0] || "/images/empresa/instalacoes.webp";
  const imagemDiferenciais = empresaImages[1] || "/images/empresa/equipe.webp";
  
  return (
    <main className="pt-24 md:pt-28">
      {/* Hero da página */}
      <section className="bg-brand-primary text-white py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="text-brand-secondary text-sm font-semibold uppercase tracking-wider mb-3">
              Quem somos
            </p>
            <h1 className="text-white mb-5">
              Especialistas em Refrigeração para Transporte
            </h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Há anos no mercado, a {empresa.nome} é referência em soluções de
              isolamento térmico e refrigeração para veículos de transporte de
              perecíveis em São Paulo e região.
            </p>
          </div>
        </div>
      </section>

      {/* Sobre a empresa */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <SectionTitle
                title="Nossa História"
                centered={false}
                className="mb-6"
              />
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A {empresa.nome} nasceu da necessidade de oferecer soluções
                  profissionais de refrigeração para o crescente mercado de
                  transporte de perecíveis no Brasil. Desde o início, nossa
                  proposta foi clara: entregar qualidade técnica, materiais de
                  primeira linha e atendimento consultivo que realmente ajude o
                  cliente a tomar a melhor decisão para o seu negócio.
                </p>
                <p>
                  Ao longo dos anos, instalamos sistemas de refrigeração e
                  isolamento térmico em centenas de veículos — desde Fiorinos
                  para pequenas distribuidoras até Sprinters e Ducatos para
                  grandes frotas. Cada projeto é único e desenvolvido
                  conforme as necessidades específicas de temperatura, volume
                  de carga e perfil de operação do cliente.
                </p>
                <p>
                  Hoje, a {empresa.nome} atua a partir de São Paulo,
                  atendendo clientes de todo o estado com agilidade, seriedade
                  e o mesmo compromisso com a qualidade que sempre nos
                  diferenciou no mercado.
                </p>
              </div>
            </div>

            {/* Imagem */}
            <div className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-card-hover">
              <Image
                src={imagemEscritorio}
                alt={`Instalações da ${empresa.nome}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="section-padding section-light">
        <div className="container-site">
          <SectionTitle
            title="Missão, Visão e Valores"
            subtitle="Os pilares que orientam cada projeto e cada relação com nossos clientes."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mvv.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card p-6">
                  <div className={`${item.color} inline-flex p-3 rounded-xl mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-brand-primary text-xl mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem */}
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-card-hover">
              <Image
                src={imagemDiferenciais}
                alt={`Equipe ${empresa.nome}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Lista */}
            <div>
              <SectionTitle
                title="Nossos Diferenciais"
                centered={false}
                className="mb-6"
              />
              <ul className="space-y-3">
                {diferenciais.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-secondary">
        <div className="container-site text-center">
          <h2 className="text-white mb-4">Vamos conversar sobre seu projeto?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Entre em contato agora e descubra como podemos ajudar a transformar seu
            veículo em uma plataforma de refrigeração profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent px-10 py-4 text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Fale no WhatsApp
            </a>
            <Link
              href="/contato"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-primary px-10 py-4 text-lg"
            >
              Formulário de Contato
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
