import { MetadataRoute } from "next";
import { empresa } from "@/lib/config";
import { applications } from "@/lib/applications";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = empresa.siteUrl;
  const now = new Date();

  // Páginas estáticas principais
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/empresa`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aplicacoes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fotos-servicos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Páginas de detalhe por aplicação
  const appPages: MetadataRoute.Sitemap = applications.map((app) => ({
    url: `${baseUrl}/${app.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...appPages];
}
