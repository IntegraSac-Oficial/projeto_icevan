"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from "lucide-react";
import { empresa } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";

interface Slide {
  image: string;
  alt: string;
  headline: string;
  sub: string;
}

interface HeroSliderProps {
  slides?: Slide[];
}

const defaultSlides: Slide[] = [
  {
    image: "/images/hero/banner-01.webp",
    alt: "Van refrigerada em operação — Ice Van",
    headline: "Sistemas de Refrigeração para Transporte",
    sub: "Qualidade e eficiência para conservar sua carga perecível do ponto de partida até a entrega.",
  },
  {
    image: "/images/hero/banner-02.webp",
    alt: "Instalação de isolamento térmico em furgão",
    headline: "Isolamento Térmico Profissional",
    sub: "Painéis de alta performance que mantêm a temperatura estável e reduzem o consumo do sistema de frio.",
  },
  {
    image: "/images/hero/banner-03.webp",
    alt: "Aparelhos de refrigeração instalados em veículos",
    headline: "Aparelhos de Refrigeração de Alta Performance",
    sub: "Equipamentos dimensionados para cada tipo de veículo, carga e faixa de temperatura.",
  },
  {
    image: "/images/hero/banner-04.webp",
    alt: "Frota de veículos refrigerados — Ice Van",
    headline: "Solução Completa para Sua Frota",
    sub: "Atendemos autônomos, pequenas e médias frotas com projetos personalizados e assistência técnica.",
  },
];

export function HeroSlider({ slides = defaultSlides }: HeroSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filtroCor, setFiltroCor] = useState("#2563EB");
  const [filtroOpacidade, setFiltroOpacidade] = useState(20);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data.hero_filtro_cor)       setFiltroCor(data.hero_filtro_cor);
        if (data.hero_filtro_opacidade) setFiltroOpacidade(Number(data.hero_filtro_opacidade));
      })
      .catch(() => {});
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[780px] overflow-hidden">
      {/* Carousel */}
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide relative h-full">
              {/* Imagem de fundo */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Filtro de cor controlável pelo painel */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: filtroCor, opacity: filtroOpacidade / 100 }}
              />
              {/* Overlay - mais forte à esquerda */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 via-brand-primary/60 to-transparent" />

              {/* Conteúdo do slide - posicionado à esquerda */}
              <div className="absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28">
                  <div className="max-w-2xl text-left">
                    <h1 className="text-white font-heading font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 sm:mb-5 drop-shadow-lg">
                      {slide.headline}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-lg md:text-xl leading-relaxed mb-5 sm:mb-8 drop-shadow">
                      {slide.sub}
                    </p>
                    <div className="flex flex-col items-start sm:flex-row gap-3 sm:gap-4">
                      <a
                        href={whatsappUrl("Olá! Gostaria de solicitar um orçamento para refrigeração de veículo.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent text-sm sm:text-lg px-5 py-2.5 sm:px-8 sm:py-4 shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Solicite um Orçamento
                      </a>
                      <Link
                        href="/aplicacoes"
                        className="btn-outline border-white text-white hover:bg-white hover:text-brand-primary text-sm sm:text-lg px-5 py-2.5 sm:px-8 sm:py-4"
                      >
                        Conheça Nossas Aplicações
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </div>

                    {/* Telefone em destaque - escondido no mobile/tablet */}
                    <div className="mt-8 hidden lg:flex items-center gap-3 text-white/80">
                      <div className="w-px h-8 bg-white/30" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Fale conosco
                        </p>
                        <a
                          href={`tel:${empresa.telefone.replace(/\D/g, "")}`}
                          className="text-xl font-bold text-white hover:text-brand-accent transition-colors"
                        >
                          {empresa.telefone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de navegação - escondidos no mobile/tablet */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full bg-white/20 hover:bg-white/40 text-white
                   backdrop-blur-sm transition-all duration-200 hover:scale-110
                   hidden lg:block"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                   p-3 rounded-full bg-white/20 hover:bg-white/40 text-white
                   backdrop-blur-sm transition-all duration-200 hover:scale-110
                   hidden lg:block"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores (dots) - escondidos no mobile/tablet */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 gap-2 hidden lg:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-8 bg-brand-accent"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
