import { MetadataRoute } from "next";
import { empresa } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${empresa.siteUrl}/sitemap.xml`,
    host: empresa.siteUrl,
  };
}
