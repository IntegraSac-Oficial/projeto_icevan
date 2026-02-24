import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageCircle, CheckSquare, ArrowLeft } from "lucide-react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { whatsappUrl } from "@/lib/utils";
import type { Application } from "@/lib/applications";

interface ApplicationDetailPageProps {
  application: Application;
}

export function ApplicationDetailPage({ application }: ApplicationDetailPageProps) {
  const { titulo, subtitulo, conteudo, specs, imagens } = application;

  // Remove a primeira imagem (thumbnail) da galeria - mostra apenas fotos de galeria
  const galleryImages = imagens.slice(1);
  
  const photos = galleryImages.map((img) => ({
    src: img,
    alt: `${titulo} — Ice Van`,
    category: titulo,
  }));

  return (
    <main className="pt-24 md:pt-28">
      {/* Hero da página */}
      <section className="bg-brand-primary text-white py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <Link
              href="/aplicacoes"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white
                         text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todas as aplicações
            </Link>
            <h1 className="text-white mb-4">{titulo}</h1>
            <p className="text-white/80 text-xl leading-relaxed mb-8">
              {subtitulo}
            </p>
            <a
              href={whatsappUrl(
                `Olá! Tenho interesse em refrigeração para ${titulo}. Gostaria de um orçamento.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent text-lg px-8 py-4"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Texto — 2/3 */}
            <div className="lg:col-span-2">
              <h2 className="text-brand-primary mb-6">
                Refrigeração para {titulo}
              </h2>
              <div className="space-y-5 text-gray-700 leading-relaxed">
                {conteudo.map((paragrafo, i) => (
                  <p key={i}>{paragrafo}</p>
                ))}
              </div>
            </div>

            {/* Especificações — 1/3 */}
            <div>
              <div className="card p-6 sticky top-28">
                <h3 className="text-brand-primary font-heading font-bold text-lg mb-5 pb-3
                               border-b border-gray-100">
                  Especificações Técnicas
                </h3>
                <dl className="space-y-3">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex gap-2">
                      <CheckSquare className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-xs text-gray-500 uppercase tracking-wider">
                          {spec.label}
                        </dt>
                        <dd className="font-semibold text-brand-dark text-sm mt-0.5">
                          {spec.valor}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                {/* CTA no sidebar */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                  <a
                    href={whatsappUrl(
                      `Olá! Quero saber mais sobre refrigeração para ${titulo}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent w-full justify-center text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Falar no WhatsApp
                  </a>
                  <Link
                    href="/contato"
                    className="btn-outline w-full justify-center text-sm"
                  >
                    Formulário de Contato
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de fotos */}
      {photos.length > 0 && (
        <section className="section-padding section-light">
          <div className="container-site">
            <h2 className="text-brand-primary mb-8">
              Galeria — {titulo}
            </h2>
            <PhotoGallery photos={photos} />
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 bg-brand-secondary">
        <div className="container-site text-center">
          <h2 className="text-white mb-4">
            Pronto para transformar seu veículo?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Entre em contato agora mesmo e receba um orçamento personalizado para o seu {titulo}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl(
                `Olá! Gostaria de um orçamento para refrigeração de ${titulo}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent px-10 py-4 text-lg shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Orçamento
            </a>
            <Link
              href="/aplicacoes"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-primary px-10 py-4 text-lg"
            >
              Ver Outras Aplicações
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
