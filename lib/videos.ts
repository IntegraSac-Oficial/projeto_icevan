import { prisma } from "@/lib/db";

export interface Video {
  youtubeId?: string;
  src?: string;
  titulo: string;
  categoria: string;
}

// Vídeos padrão caso o banco esteja vazio
const videosDefault: Video[] = [
  { youtubeId: "dQw4w9WgXcQ", titulo: "Instalação Completa de Isolamento Térmico — Fiat Fiorino", categoria: "fiorino" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Isolamento Térmico em Van Ducato — Passo a Passo", categoria: "ducato" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Sprinter com Isolamento Térmico de Alta Performance", categoria: "sprinter" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Instalação de Porta Frigorífica com Vedação Magnética", categoria: "expert" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Acabamento Interno em Alumínio — Van Master", categoria: "master" },
  { youtubeId: "dQw4w9WgXcQ", titulo: "Fiorino com Porta Frigorífica — Processo Completo", categoria: "fiorino" },
];

export async function getVideos(): Promise<Video[]> {
  try {
    // Carregar vídeos do banco de dados
    const dbVideos = await prisma.video.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });

    if (dbVideos.length > 0) {
      return dbVideos.map((v) => {
        // Se youtubeId começa com "/", é um vídeo local
        if (v.youtubeId.startsWith("/")) {
          return { src: v.youtubeId, titulo: v.titulo, categoria: v.categoria };
        }
        // Caso contrário, é um vídeo do YouTube
        return { youtubeId: v.youtubeId, titulo: v.titulo, categoria: v.categoria };
      });
    }

    // Se não há vídeos no banco, retorna os padrão
    return videosDefault;
  } catch (error) {
    console.error("Erro ao carregar vídeos:", error);
    // Em caso de erro, sempre retorna vídeos padrão
    return videosDefault;
  }
}

export async function getVideosByCategory(categoria: string): Promise<Video[]> {
  try {
    // Primeiro tenta carregar do banco
    const allVideos = await getVideos();
    
    // Filtra por categoria
    const filteredVideos = allVideos.filter(video => 
      video.categoria.toLowerCase().includes(categoria.toLowerCase()) ||
      categoria.toLowerCase().includes(video.categoria.toLowerCase())
    );
    
    // Se encontrou vídeos filtrados, retorna eles
    if (filteredVideos.length > 0) {
      return filteredVideos;
    }
    
    // Se não encontrou vídeos específicos, retorna vídeos padrão relacionados
    const defaultVideosForCategory = videosDefault.filter(video => 
      video.categoria.toLowerCase().includes(categoria.toLowerCase()) ||
      categoria.toLowerCase().includes(video.categoria.toLowerCase())
    );
    
    // Se encontrou vídeos padrão para a categoria, retorna eles
    if (defaultVideosForCategory.length > 0) {
      return defaultVideosForCategory;
    }
    
    // Como último recurso, retorna alguns vídeos padrão genéricos
    return videosDefault.slice(0, 3);
    
  } catch (error) {
    console.error("Erro ao carregar vídeos por categoria:", error);
    // Em caso de erro, sempre retorna alguns vídeos padrão
    return videosDefault.slice(0, 2);
  }
}