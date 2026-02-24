import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const app = await loadApplicationImages("fiorinos");
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: "/fiorinos" },
      }
    : {};
}

export default async function FiorinosPage() {
  const app = await loadApplicationImages("fiorinos");
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
