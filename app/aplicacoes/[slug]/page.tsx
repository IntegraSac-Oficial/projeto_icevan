import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos } from "@/lib/applications";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadApplicationWithVideos(params.slug);
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: `/aplicacoes/${params.slug}` },
      }
    : {};
}

export default async function DynamicAplicacaoPage({ params }: Props) {
  const result = await loadApplicationWithVideos(params.slug);
  if (!result) notFound();
  return <ApplicationDetailPage application={result.app} videos={result.videos} />;
}
