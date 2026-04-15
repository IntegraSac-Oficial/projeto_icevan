import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos, loadPhotoCaptions } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("van-ducato");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/van-ducato" },
      }
    : {};
}

export default async function VanDucatoPage() {
  const result = await loadApplicationWithVideos("van-ducato");
  if (!result) notFound();
  
  // Carrega legendas personalizadas das fotos
  const captions = await loadPhotoCaptions("van-ducato");
  
  return <ApplicationDetailPage application={result.app} videos={result.videos} photoCaptions={captions} />;
}
