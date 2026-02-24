import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const app = await loadApplicationImages("expert-porta-frigorifica");
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: "/expert-porta-frigorifica" },
      }
    : {};
}

export default async function ExpertPortaFrigorificaPage() {
  const app = await loadApplicationImages("expert-porta-frigorifica");
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
