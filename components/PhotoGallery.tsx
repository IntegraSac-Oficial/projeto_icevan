"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Photo {
  src: string;
  alt: string;
  category?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  // Atalhos de teclado no lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  // Bloqueia scroll quando lightbox aberto
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      {/* Grid de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative h-60 rounded-xl overflow-hidden shadow-card
                       hover:shadow-card-hover transition-all duration-300 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-brand-secondary"
            aria-label={`Ver foto: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Overlay ao hover */}
            <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/40
                            transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 drop-shadow-lg" />
            </div>
            {/* Badge de categoria */}
            {photo.category && (
              <span className="absolute bottom-3 left-3 badge bg-brand-primary/80 text-white text-xs">
                {photo.category}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de imagem"
        >
          {/* Botão fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20
                       text-white transition-colors z-10"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navegação prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                       bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Imagem central */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
            />
            {/* Legenda */}
            <p className="text-center text-white/70 text-sm mt-3">
              {photos[currentIndex].alt}
              <span className="ml-2 text-white/40">
                ({currentIndex + 1}/{photos.length})
              </span>
            </p>
          </div>

          {/* Navegação next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full
                       bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </>
  );
}
