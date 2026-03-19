import { MetadataRoute } from "next";
import { getEmpresaConfig } from "@/lib/empresa-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getEmpresaConfig();
  const siteUrl = config.siteUrl || "https://icevanisolamento.com.br";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
