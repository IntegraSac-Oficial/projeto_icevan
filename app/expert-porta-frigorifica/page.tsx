import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos } from "@/lib/applications";

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
  return <ApplicationDetailPage application={result.app} videos={result.videos} />;
}
