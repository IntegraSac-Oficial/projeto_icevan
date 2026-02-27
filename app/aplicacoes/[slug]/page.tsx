import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = await loadApplicationImages(params.slug);
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: `/aplicacoes/${params.slug}` },
      }
    : {};
}

export default async function DynamicAplicacaoPage({ params }: Props) {
  const app = await loadApplicationImages(params.slug);
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
