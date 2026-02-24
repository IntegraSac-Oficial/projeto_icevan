import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const app = await loadApplicationImages("van-master");
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: "/van-master" },
      }
    : {};
}

export default async function VanMasterPage() {
  const app = await loadApplicationImages("van-master");
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
