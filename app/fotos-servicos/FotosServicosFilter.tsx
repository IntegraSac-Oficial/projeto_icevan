"use client";

import { useState } from "react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { VideoGrid } from "@/components/VideoGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

interface Photo {
  src: string;
  alt: string;
  category?: string;
}

interface Video {
  youtubeId?: string;
  src?: string;
  titulo: string;
  categoria?: string;
}

interface Props {
  photos: Photo[];
  videos: Video[];
}

type Filter = "todos" | "fotos" | "videos";

export function FotosServicosFilter({ photos, videos }: Props) {
  const [filter, setFilter] = useState<Filter>("todos");

  return (
    <>
      {/* Filtro */}
      <div className="sticky top-16 md:top-[88px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-site py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Filtrar:</span>
            {(["todos", "fotos", "videos"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filter === f
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fotos */}
      {(filter === "todos" || filter === "fotos") && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <SectionTitle
              title="Galeria de Fotos"
              subtitle="Registros reais dos nossos serviços de instalação e acabamento."
              centered={false}
            />
            <PhotoGallery photos={photos} />
          </div>
        </section>
      )}

      {filter === "todos" && <div className="border-t border-gray-100" />}

      {/* Vídeos */}
      {(filter === "todos" || filter === "videos") && (
        <section className={`section-padding ${filter === "videos" ? "bg-white" : "section-light"}`}>
          <div className="container-site">
            <SectionTitle
              title="Vídeos dos Serviços"
              subtitle="Assista ao processo de instalação e veja a qualidade do nosso trabalho."
              centered={false}
            />
            <VideoGrid videos={videos} />
          </div>
        </section>
      )}
    </>
  );
}
