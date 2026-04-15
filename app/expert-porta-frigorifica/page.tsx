import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos, loadPhotoCaptions } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("expert-porta-frigorifica");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/expert-porta-frigorifica" },
      }
    : {};
}

export default async function ExpertPortaFrigorificaPage() {
  const result = await loadApplicationWithVideos("expert-porta-frigorifica");
  if (!result) notFound();
  
  // Carrega legendas personalizadas das fotos
  const captions = await loadPhotoCaptions("expert-porta-frigorifica");
  
  return <ApplicationDetailPage application={result.app} videos={result.videos} photoCaptions={captions} />;
}
