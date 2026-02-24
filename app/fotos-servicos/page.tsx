import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { FotosServicosFilter } from "./FotosServicosFilter";
import { whatsappUrl } from "@/lib/utils";
import { prisma } from "@/lib/db";

// Fallback — exibido enquanto o banco estiver vazio
const fotosDefault = [
  { src: "/images/fotos-servicos/foto-01.webp", alt: "Instalação de isolamento térmico em Fiorino", category: "Fiorino" },
  { src: "/images/fotos-servicos/foto-02.webp", alt: "Refrigeração instalada em Van Ducato", category: "Van Ducato" },
  { src: "/images/fotos-servicos/foto-03.webp", alt: "Baú frigorífico em Sprinter — acabamento interno", category: "Sprinter" },
  { src: "/images/fotos-servicos/foto-04.webp", alt: "Porta frigorífica com vedação reforçada", category: "Porta Frigorífica" },
  { src: "/images/fotos-servicos/foto-05.webp", alt: "Painel de controle de temperatura instalado", category: "Equipamentos" },
  { src: "/images/fotos-servicos/foto-06.webp", alt: "Isolamento de piso em van frigorífica", category: "Isolamento" },
  { src: "/images/fotos-servicos/foto-07.webp", alt: "Acabamento interno em alumínio — Van Master", category: "Van Master" },
  { src: "/images/fotos-servicos/foto-08.webp", alt: "Sistema de refrigeração instalado em Ducato", category: "Van Ducato" },
  { src: "/images/fotos-servicos/foto-09.webp", alt: "Fiorino com porta frigorífica — entrega concluída", category: "Fiorino" },
];

const videosDefault = [
  { youtubeId: "dQw4w9WgXcQ", titulo: "Instalação Completa — Fiat Fiorino Frigorífico", categoria: "Fiorino" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Isolamento Térmico em Van Ducato — Passo a Passo", categoria: "Van Ducato" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Sprinter com Sistema de Refrigeração de Alta Capacidade", categoria: "Sprinter" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Instalação de Porta Frigorífica com Vedação Magnética", categoria: "Porta Frigorífica" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Acabamento Interno em Alumínio — Van Master", categoria: "Van Master" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Expert com Porta Frigorífica — Processo Completo", categoria: "Expert" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Manutenção Preventiva — Sistema de Refrigeração", categoria: "Manutenção" },
];

// SEO dinâmico: lê do MySQL, fallback para valores estáticos
export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await prisma.seoSetting.findUnique({
      where: { pageSlug: "/fotos-servicos" },
    });
    if (seo) {
      return {
        title: seo.metaTitulo,
        description: seo.metaDescricao,
        ...(seo.ogImage && {
          openGraph: { images: [{ url: seo.ogImage }] },
          twitter: { images: [seo.ogImage] },
        }),
      };
    }
  } catch {
    // Banco indisponível — usa fallback
  }
  return {
    title: "Fotos e Serviços",
    description:
      "Confira o portfólio de serviços da Ice Van: instalações de refrigeração e isolamento térmico para furgões e vans.",
  };
}

async function getGalleryData() {
  try {
    // Carregar fotos dinamicamente do filesystem
    const { readdir } = await import("fs/promises");
    const path = await import("path");
    
    const fotosPath = path.join(process.cwd(), "public", "images", "fotos-servicos");
    let photos = fotosDefault;
    
    try {
      const files = await readdir(fotosPath);
      const imageFiles = files
        .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
        .sort((a, b) => a.localeCompare(b));
      
      if (imageFiles.length > 0) {
        photos = imageFiles.map((f) => ({
          src: `/images/fotos-servicos/${f}`,
          alt: `Serviço de refrigeração Ice Van`,
          category: "Serviços"
        }));
      }
    } catch {
      // Se falhar, usa fotos default
    }

    // Carregar vídeos do banco de dados
    const dbVideos = await prisma.video.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });

    const videos =
      dbVideos.length > 0
        ? dbVideos.map((v) => {
            // Se youtubeId começa com "/", é um vídeo local
            if (v.youtubeId.startsWith("/")) {
              return { src: v.youtubeId, titulo: v.titulo, categoria: v.categoria };
            }
            // Caso contrário, é um vídeo do YouTube
            return { youtubeId: v.youtubeId, titulo: v.titulo, categoria: v.categoria };
          })
        : videosDefault;

    return { photos, videos };
  } catch {
    return { photos: fotosDefault, videos: videosDefault };
  }
}

export default async function FotosServicosPage() {
  const { photos, videos } = await getGalleryData();

  return (
    <main className="pt-24 md:pt-28">
      {/* Hero da página */}
      <section className="bg-brand-primary text-white py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="text-brand-secondary text-sm font-semibold uppercase tracking-wider mb-3">
              Portfólio
            </p>
            <h1 className="text-white mb-5">Fotos e Serviços</h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Confira nossos trabalhos e serviços realizados. Cada instalação é
              executada com cuidado, precisão técnica e materiais de primeira linha.
            </p>
          </div>
        </div>
      </section>

      {/* Filtro + Galeria + Vídeos (Client Component) */}
      <FotosServicosFilter photos={photos} videos={videos} />

      {/* CTA */}
      <section className="py-16 bg-brand-secondary">
        <div className="container-site text-center">
          <h2 className="text-white mb-4">Gostou do que viu?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Solicite um orçamento agora e transforme seu veículo em uma
            plataforma de refrigeração profissional.
          </p>
          <a
            href={whatsappUrl(
              "Olá! Vi o portfólio no site e gostaria de solicitar um orçamento."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent px-10 py-4 text-lg shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Solicitar Orçamento
          </a>
        </div>
      </section>
    </main>
  );
}
