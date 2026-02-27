import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Grid3x3,
  MessageCircle,
  ShieldCheck,
  Clock,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import { SolutionSection } from "@/components/SolutionSection";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { applications, loadApplicationImages } from "@/lib/applications";
import { empresa } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";
import { getSettingJSON } from "@/lib/settings";

export const metadata: Metadata = {
  title: `${empresa.nome} — ${empresa.slogan}`,
  description: empresa.descricao,
  alternates: { canonical: "/" },
};

// Carregar banners dinamicamente do banco de dados
async function loadHeroBanners() {
  try {
    const { prisma } = await import("@/lib/db");
    
    // Busca banners do banco de dados
    const dbBanners = await prisma.heroBanner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });

    if (dbBanners.length > 0) {
      return dbBanners.map((banner) => ({
        image: `/images/hero/${banner.filename}`,
        alt: `Banner — ${empresa.nome}`,
        headline: banner.titulo || "Sistemas de Refrigeração para Transporte",
        sub: banner.descricao || "Qualidade e eficiência para conservar sua carga perecível.",
      }));
    }

    // Se não houver banners no banco, carrega do filesystem
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    
    const heroDir = path.join(process.cwd(), "public", "images", "hero");
    const files = await readdir(heroDir);
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));

    if (imageFiles.length === 0) return undefined;

    return imageFiles.map((file, index) => ({
      image: `/images/hero/${file}`,
      alt: `Banner ${index + 1} — ${empresa.nome}`,
      headline: "Sistemas de Refrigeração para Transporte",
      sub: "Qualidade e eficiência para conservar sua carga perecível do ponto de partida até a entrega.",
    }));
  } catch {
    return undefined;
  }
}

const ICONS_DIFERENCIAIS = [ShieldCheck, Clock, Award, Users];

const DEFAULT_DIFERENCIAIS = [
  {
    title: "Qualidade Garantida",
    desc: "Materiais de primeira linha e mão de obra especializada com garantia de 12 meses.",
  },
  {
    title: "Prazo no Combinado",
    desc: "Cumprimos os prazos de entrega para você não perder tempo nem dinheiro.",
  },
  {
    title: "Experiência Comprovada",
    desc: "Anos de atuação no mercado de refrigeração veicular com centenas de instalações realizadas.",
  },
  {
    title: "Atendimento Personalizado",
    desc: "Cada projeto é dimensionado conforme o veículo, a carga e a necessidade do cliente.",
  },
];

interface DiferenciaisContent {
  titulo_secao: string;
  subtitulo_secao: string;
  cards: { title: string; desc: string }[];
}

const DEFAULT_DIFERENCIAIS_CONTENT: DiferenciaisContent = {
  titulo_secao: "Por que escolher a",
  subtitulo_secao:
    "Somos especialistas em refrigeração veicular com foco em qualidade, pontualidade e satisfação total do cliente.",
  cards: DEFAULT_DIFERENCIAIS,
};

interface ContatoCta {
  label: string;
  numero: string;
}

interface CtaContent {
  titulo: string;
  subtitulo: string;
  texto: string;
  titulo_form: string;
  contatos: ContatoCta[];
}

const DEFAULT_CTA: CtaContent = {
  titulo: "Solicite seu Orçamento",
  subtitulo: "Sem Compromisso",
  texto:
    "Preencha o formulário ao lado ou entre em contato direto pelo WhatsApp. Nossa equipe responde rapidamente com a solução ideal para o seu veículo.",
  titulo_form: "Fale com nosso time",
  contatos: [{ label: "WhatsApp", numero: empresa.whatsapp }],
};

export default async function Home() {
  const [heroBanners, difContent, ctaContent, firstThreeApps] = await Promise.all([
    loadHeroBanners(),
    getSettingJSON<DiferenciaisContent>("content_diferenciais", DEFAULT_DIFERENCIAIS_CONTENT),
    getSettingJSON<CtaContent>("content_cta", DEFAULT_CTA),
    Promise.all(applications.slice(0, 3).map(app => loadApplicationImages(app.slug))),
  ]);

  const validApps = firstThreeApps.filter(app => app !== undefined);
  const diferenciais = (difContent.cards ?? DEFAULT_DIFERENCIAIS).slice(0, 4).map(
    (card, i) => ({ ...DEFAULT_DIFERENCIAIS[i], ...card, icon: ICONS_DIFERENCIAIS[i] })
  );

  return (
    <main>
      {/* Hero Slider */}
      <div className="pt-16 md:pt-[88px]">
        <HeroSlider slides={heroBanners} />
      </div>

      {/* Navegação rápida — 2 cards */}
      <section className="bg-brand-primary">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <Link
              href="/empresa"
              className="flex items-center gap-4 px-8 py-7 text-white
                         hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-brand-accent transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">
                  Conheça a
                </p>
                <p className="font-heading font-bold text-lg">Empresa</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/aplicacoes"
              className="flex items-center gap-4 px-8 py-7 text-white
                         hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-brand-accent transition-colors">
                <Grid3x3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">
                  Veja nossas
                </p>
                <p className="font-heading font-bold text-lg">Aplicações</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de soluções */}
      <SolutionSection />

      {/* Aplicações — preview das 6 */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <SectionTitle
            title="Nossas Aplicações"
            subtitle="Soluções de refrigeração e isolamento térmico para os principais veículos utilizados no transporte de perecíveis."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {validApps.map((app) => (
              <ApplicationCard key={app.slug} application={app} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/aplicacoes" className="btn-primary px-10 py-4 text-lg">
              Ver Todas as Aplicações
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section-padding section-light">
        <div className="container-site">
          <SectionTitle
            title={difContent.titulo_secao || DEFAULT_DIFERENCIAIS_CONTENT.titulo_secao}
            accent={empresa.nome}
            subtitle={difContent.subtitulo_secao || DEFAULT_DIFERENCIAIS_CONTENT.subtitulo_secao}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="card p-6 text-center group hover:-translate-y-1 hover:scale-105 transition-all duration-500 ease-out bg-brand-accent hover:bg-white">
                  <div className="inline-flex p-3 rounded-xl bg-white/20 mb-4 group-hover:bg-brand-accent/10 transition-all duration-500 ease-out">
                    <Icon className="w-7 h-7 text-white group-hover:text-brand-accent transition-all duration-500 ease-out" />
                  </div>
                  <h3 className="font-heading font-bold text-white group-hover:text-brand-primary text-base mb-2 transition-all duration-500 ease-out">
                    {d.title}
                  </h3>
                  <p className="text-white/90 group-hover:text-gray-600 text-sm leading-relaxed transition-all duration-500 ease-out">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA banner + Mini formulário de contato */}
      <section className="section-padding bg-brand-primary">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto CTA */}
            <div className="text-white">
              <h2 className="text-white mb-5">
                {ctaContent.titulo || DEFAULT_CTA.titulo}
                <span className="block text-brand-accent">{ctaContent.subtitulo || DEFAULT_CTA.subtitulo}</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                {ctaContent.texto || DEFAULT_CTA.texto}
              </p>
              <div className="space-y-4">
                {(ctaContent.contatos ?? DEFAULT_CTA.contatos).map((c, i) => {
                  const digits = c.numero.replace(/\D/g, "");
                  return (
                    <div key={i} className="space-y-0.5">
                      {c.label && (
                        <p className="text-white/60 text-xs uppercase tracking-wider">{c.label}</p>
                      )}
                      <a
                        href={`https://wa.me/${digits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-white hover:text-brand-accent transition-colors"
                      >
                        <MessageCircle className="w-6 h-6 text-[#25D366]" />
                        <span className="text-lg font-semibold">{c.numero}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulário compacto */}
            <div className="bg-white rounded-2xl p-7 shadow-xl">
              <h3 className="text-brand-primary font-heading font-bold text-xl mb-6">
                {ctaContent.titulo_form || DEFAULT_CTA.titulo_form}
              </h3>
              <ContactForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Formas de Pagamento */}
      <PaymentMethodsSection />
    </main>
  );
}

// Componente para exibir formas de pagamento
async function PaymentMethodsSection() {
  try {
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    
    const paymentDir = path.join(process.cwd(), "public", "images", "formas-pagamento");
    const files = await readdir(paymentDir);
    const imageFile = files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b))[0];

    if (!imageFile) return null;

    return (
      <section className="bg-brand-primary">
        <div className="container-site flex justify-center">
          <Image
            src={`/images/formas-pagamento/${imageFile}`}
            alt="Formas de Pagamento Aceitas"
            width={900}
            height={200}
            className="h-auto"
          />
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
