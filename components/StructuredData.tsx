import { prisma } from "@/lib/db";

interface StructuredDataProps {
  organizationName: string;
  organizationDescription: string;
  businessType: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  telephone: string;
  email: string;
  priceRange: string;
  servicesOffered: string;
}

async function getStructuredData(): Promise<StructuredDataProps | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "structured_data" },
    });

    if (!setting?.value) return null;

    return JSON.parse(setting.value);
  } catch (error) {
    console.error("Erro ao carregar dados estruturados:", error);
    return null;
  }
}

export default async function StructuredData() {
  const data = await getStructuredData();

  if (!data || !data.organizationName) return null;

  const services = data.servicesOffered
    ? data.servicesOffered.split(",").map((s) => s.trim())
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": data.businessType || "AutoRepair",
    name: data.organizationName,
    description: data.organizationDescription,
    priceRange: data.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.streetAddress,
      addressLocality: data.addressLocality,
      addressRegion: data.addressRegion,
      postalCode: data.postalCode,
      addressCountry: "BR",
    },
    telephone: data.telephone,
    email: data.email,
    ...(services.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços",
        itemListElement: services.map((service, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
          position: index + 1,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
