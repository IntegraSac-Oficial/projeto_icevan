import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationWithVideos } from "@/lib/applications";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadApplicationWithVideos(slug);
  return result?.app
    ? {
        title: result.app.metaTitulo,
        description: result.app.metaDescricao,
        alternates: { canonical: `/aplicacoes/${slug}` },
      }
    : {};
}

export default async function DynamicAplicacaoPage({ params }: Props) {
  const { slug } = await params;
  const result = await loadApplicationWithVideos(slug);
  if (!result) notFound();
  return <ApplicationDetailPage application={result.app} videos={result.videos} />;
}
