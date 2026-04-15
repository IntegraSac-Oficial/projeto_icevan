import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos, loadPhotoCaptions } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("van-sprinter");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/van-sprinter" },
      }
    : {};
}

export default async function VanSprinterPage() {
  const result = await loadApplicationWithVideos("van-sprinter");
  if (!result) notFound();
  
  // Carrega legendas personalizadas das fotos
  const captions = await loadPhotoCaptions("van-sprinter");
  
  return <ApplicationDetailPage application={result.app} videos={result.videos} photoCaptions={captions} />;
}
