'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface Video {
  youtubeId?: string;
  src?: string;
  titulo: string;
  categoria: string;
}

interface VideoGalleryProps {
  videos: Video[];
  title?: string;
  description?: string;
}

export function VideoGallery({ videos, title = "Vídeos dos Serviços", description = "Assista aos processos de instalação e veja a qualidade do nosso trabalho." }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  const getVideoThumbnail = (video: Video) => {
    if (video.youtubeId) {
      return `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
    }
    return '/images/video-placeholder.jpg'; // Placeholder para vídeos locais
  };

  const getVideoEmbedUrl = (video: Video) => {
    if (video.youtubeId) {
      return `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
    }
    return video.src;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="text-brand-primary mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={getVideoThumbnail(video)}
                  alt={video.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center hover:bg-brand-secondary/90 transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.titulo}
                </h3>
                <span className="text-sm text-brand-secondary font-medium">
                  {video.categoria}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de vídeo */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900 pr-4">
                  {selectedVideo.titulo}
                </h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video">
                {selectedVideo.youtubeId ? (
                  <iframe
                    src={getVideoEmbedUrl(selectedVideo)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.src}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}