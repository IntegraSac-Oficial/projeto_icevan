import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos, loadPhotoCaptions } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("isolamento-fiorino");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/isolamento-fiorino" },
      }
    : {};
}

export default async function IsolamentoFiorinoPage() {
  const result = await loadApplicationWithVideos("isolamento-fiorino");
  if (!result) notFound();
  
  // Carrega legendas personalizadas das fotos
  const captions = await loadPhotoCaptions("isolamento-fiorino");
  
  return <ApplicationDetailPage application={result.app} videos={result.videos} photoCaptions={captions} />;
}
