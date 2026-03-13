/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Desabilita otimização durante desenvolvimento (placeholder images são SVG).
    // Remova 'unoptimized: true' quando substituir os placeholders por imagens WebP reais.
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Compressão de assets
  compress: true,
  // Headers para cache otimizado
  async headers() {
    return [
      {
        // Cache para imagens estáticas
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Sem cache para páginas dinâmicas
        source: '/((?!images).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  // Configurações de build mais robustas
  experimental: {
    // Melhor handling de erros durante build
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  // Configurações para produção
  poweredByHeader: false,
  reactStrictMode: true,
  // Configurações de output para deployment
  output: 'standalone',
  // Configurações de webpack para melhor build
  webpack: (config, { isServer }) => {
    // Otimizações para build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
