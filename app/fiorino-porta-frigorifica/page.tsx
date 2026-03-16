import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("fiorino-porta-frigorifica");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/fiorino-porta-frigorifica" },
      }
    : {};
}

export default async function FiorinoPortaFrigorificaPage() {
  const result = await loadApplicationWithVideos("fiorino-porta-frigorifica");
  if (!result) notFound();
  return <ApplicationDetailPage application={result.app} videos={result.videos} />;
}
