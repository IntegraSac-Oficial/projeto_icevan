import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationDetailPage } from "@/components/ApplicationDetailPage";
import { loadApplicationImages } from "@/lib/applications";

export async function generateMetadata(): Promise<Metadata> {
  const app = await loadApplicationImages("van-sprinter");
  return app
    ? {
        title: app.metaTitulo,
        description: app.metaDescricao,
        alternates: { canonical: "/van-sprinter" },
      }
    : {};
}

export default async function VanSprinterPage() {
  const app = await loadApplicationImages("van-sprinter");
  if (!app) notFound();
  return <ApplicationDetailPage application={app} />;
}
