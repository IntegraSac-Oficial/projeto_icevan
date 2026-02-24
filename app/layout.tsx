import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { empresa } from "@/lib/config";
import { prisma } from "@/lib/db";
import { getAllSettings } from "@/lib/settings";
import "./globals.css";

/** Converte hex (#RRGGBB) para string de componentes HSL usada pelas CSS vars do shadcn ("H S% L%"). */
function hexToHslStr(hex: string): string {
  if (!hex.startsWith("#") || hex.length !== 7) return "0 0% 0%";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// SEO dinâmico: lê configurações globais do MySQL (slug "/"), fallback para config.ts
export async function generateMetadata(): Promise<Metadata> {
  let globalTitle: string = `${empresa.nome} — ${empresa.slogan}`;
  let globalDescription: string = empresa.descricao;
  let globalOgImage: string = empresa.ogImage;
  let faviconUrl: string = empresa.logo.favicon;

  try {
    const seo = await prisma.seoSetting.findUnique({
      where: { pageSlug: "/" },
    });
    if (seo) {
      globalTitle = seo.metaTitulo;
      globalDescription = seo.metaDescricao;
      if (seo.ogImage) globalOgImage = seo.ogImage;
    }
    
    // Busca favicon dinâmico
    try {
      const { readdir } = await import("fs/promises");
      const { join } = await import("path");
      const logoDir = join(process.cwd(), "public", "images", "logo");
      const files = await readdir(logoDir);
      const favicon = files.find(f => /^favicon\.(ico|png|jpg|jpeg|svg|webp)$/i.test(f));
      if (favicon) {
        faviconUrl = `/images/logo/${favicon}`;
        console.log('Favicon encontrado:', faviconUrl);
      }
    } catch (err) {
      console.error('Erro ao buscar favicon:', err);
    }
  } catch (error) {
    console.error('Erro ao buscar favicon:', error);
    // Banco indisponível — usa valores de config.ts
  }

  return {
    metadataBase: new URL(empresa.siteUrl),
    title: {
      default: globalTitle,
      template: `%s | ${empresa.nome}`,
    },
    description: globalDescription,
    keywords: [
      "refrigeração para transporte",
      "isolamento térmico",
      "van frigorífica",
      "furgão refrigerado",
      "câmara fria veicular",
      "Fiorino frigorífico",
      "Ducato refrigeração",
      "Sprinter baú frigorífico",
      "Master van refrigerada",
      "transporte de perecíveis",
      "São Paulo",
      "Ice Van",
    ],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: empresa.siteUrl,
      siteName: empresa.nome,
      title: globalTitle,
      description: globalDescription,
      images: [
        {
          url: globalOgImage,
          width: 1200,
          height: 630,
          alt: `${empresa.nome} — Refrigeração para Transporte`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: globalTitle,
      description: globalDescription,
      images: [globalOgImage],
    },
    alternates: {
      canonical: empresa.siteUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: faviconUrl, type: 'image/x-icon' },
        { url: faviconUrl, sizes: '32x32', type: 'image/png' },
        { url: faviconUrl, sizes: '16x16', type: 'image/png' },
      ],
      apple: "/images/logo/apple-touch-icon.png",
    },
  };
}

// Schema.org — LocalBusiness
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: empresa.nome,
  description: empresa.descricao,
  url: empresa.siteUrl,
  telephone: empresa.telefone,
  email: empresa.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: empresa.endereco,
    addressLocality: empresa.cidade,
    addressRegion: empresa.estado,
    postalCode: empresa.cep,
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "12:00",
    },
  ],
  sameAs: [empresa.instagram].filter(Boolean),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detecta rotas admin via header injetado pelo middleware
  const isAdmin = headers().get("x-is-admin") === "1";

  // Lê todas as settings de uma vez para injetar CSS custom properties
  const s = await getAllSettings();

  // Brand colors — sempre injetadas com fallbacks
  const primary   = s.cor_primaria   ?? "#4747E8";
  const secondary = s.cor_secundaria ?? "#6B68FF";
  const accent    = s.cor_destaque   ?? "#FEB63D";
  const dark      = s.cor_texto      ?? "#0E0D35";
  const light     = s.cor_neutra     ?? "#F4F6F9";

  // Monta as linhas extras de CSS vars (só sobrescreve se salvo no DB)
  const extra: string[] = [
    // shadcn primary/accent/ring sincronizados com brand
    `--primary: ${hexToHslStr(primary)};`,
    `--ring:    ${hexToHslStr(primary)};`,
    `--accent:  ${hexToHslStr(accent)};`,
  ];
  if (s.cor_sucesso)    extra.push(`--success:     ${hexToHslStr(s.cor_sucesso)};`);
  if (s.cor_destrutivo) extra.push(`--destructive: ${hexToHslStr(s.cor_destrutivo)};`);
  if (s.cor_aviso)      extra.push(`--warning:     ${hexToHslStr(s.cor_aviso)};`);
  if (s.cor_info)       extra.push(`--info:        ${hexToHslStr(s.cor_info)};`);
  if (s.cor_fundo)      extra.push(`--background:  ${hexToHslStr(s.cor_fundo)};`);
  if (s.cor_card)       extra.push(`--card:        ${hexToHslStr(s.cor_card)};`);
  if (s.cor_muted)      extra.push(`--muted:       ${hexToHslStr(s.cor_muted)};`);
  if (s.raio_borda)     extra.push(`--radius:      ${s.raio_borda}rem;`);

  const cssVars = `:root {
      --brand-primary:   ${primary};
      --brand-secondary: ${secondary};
      --brand-accent:    ${accent};
      --brand-dark:      ${dark};
      --brand-light:     ${light};
      ${extra.join("\n      ")}
    }`;

  return (
    <html lang="pt-BR">
      <head>
        {/* CSS Custom Properties — cores editáveis pelo painel admin */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        {/* Favicon dinâmico */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Analytics 4 — apenas no site público */}
        {!isAdmin && empresa.ga4Id && empresa.ga4Id !== "G-XXXXXXXXXX" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${empresa.ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${empresa.ga4Id}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {!isAdmin && <Header />}
        {isAdmin ? children : <div className="flex-1">{children}</div>}
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
      </body>
    </html>
  );
}
