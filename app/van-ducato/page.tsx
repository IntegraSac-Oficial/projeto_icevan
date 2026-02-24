import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const app = await loadApplicationImages("van-ducato");
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: "/van-ducato" },
      }
    : {};
}

export default async function VanDucatoPage() {
  const app = await loadApplicationImages("van-ducato");
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
