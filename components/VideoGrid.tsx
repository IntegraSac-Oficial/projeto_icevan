"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

interface Video {
  youtubeId?: string;
  src?: string; // Para vídeos HTML5 locais
  thumbnail?: string;
  titulo: string;
  categoria?: string;
}

interface VideoGridProps {
  videos: Video[];
}

function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = video.youtubeId
    ? `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`
    : null;

  const thumbnail =
    video.thumbnail ||
    (video.youtubeId
      ? `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
      : null);

  // Para vídeos locais, não há thumbnail - será gerado pelo navegador com preload="metadata"
  const isLocalVideo = video.src && !video.youtubeId;

  return (
    <div className="card overflow-hidden group">
      {/* Área de vídeo */}
      <div className="relative bg-black">
        {playing && embedUrl ? (
          // YouTube embed
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={video.titulo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : playing && video.src ? (
          // Vídeo local - mantém o mesmo enquadramento do preview
          <div className="relative w-full">
            <video
              src={video.src}
              controls
              autoPlay
              className="w-full h-auto max-h-[300px] object-contain"
              style={{ display: 'block' }}
            />
          </div>
        ) : (
          // Preview/Thumbnail
          <button
            onClick={() => setPlaying(true)}
            className="w-full relative flex items-center justify-center"
            aria-label={`Reproduzir: ${video.titulo}`}
          >
            {isLocalVideo ? (
              // Vídeo local: mostra primeiro frame como preview
              <div className="relative w-full">
                <video
                  src={video.src}
                  preload="metadata"
                  className="w-full h-auto max-h-[300px] object-contain"
                  style={{ display: 'block' }}
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-brand-primary/30 group-hover:bg-brand-primary/20
                                transition-all duration-300" />
                {/* Botão play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-brand-accent shadow-xl
                                  group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>
            ) : thumbnail ? (
              // YouTube: mostra thumbnail
              <div className="relative aspect-video w-full">
                <Image
                  src={thumbnail}
                  alt={video.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-brand-primary/30 group-hover:bg-brand-primary/20
                                transition-all duration-300" />
                {/* Botão play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-brand-accent shadow-xl
                                  group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>
            ) : (
              // Fallback: fundo cinza
              <div className="aspect-video w-full bg-brand-primary/10 flex items-center justify-center">
                <div className="p-4 rounded-full bg-brand-accent shadow-xl
                                group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Info do vídeo */}
      <div className="p-4">
        {video.categoria && (
          <span className="badge mb-2 inline-block">{video.categoria}</span>
        )}
        <h4 className="font-semibold text-brand-primary leading-tight">
          {video.titulo}
        </h4>
      </div>
    </div>
  );
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <VideoCard key={index} video={video} />
      ))}
    </div>
  );
}
