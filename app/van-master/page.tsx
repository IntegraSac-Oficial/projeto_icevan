import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadApplicationWithVideos("van-master");
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: "/van-master" },
      }
    : {};
}

export default async function VanMasterPage() {
  const result = await loadApplicationWithVideos("van-master");
  if (!result) notFound();
  return <ApplicationDetailPage application={result.app} videos={result.videos} />;
}
