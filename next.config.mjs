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
  // Headers para cache otimizado - CACHE AGRESSIVO PARA DESENVOLVIMENTO
  async headers() {
    return [
      {
        // Cache FORTE para todas as páginas em desenvolvimento
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  // Configurações de build mais robustas
  experimental: {
    // Melhor handling de erros durante build
    optimizePackageImports: ['@radix-ui/react-icons'],
    // Limitar workers para reduzir consumo de memória
    workerThreads: false,
    cpus: 1,
  },
  // Configuração Turbopack vazia para compatibilidade Next.js 16
  turbopack: {},
  // Configurações para produção
  poweredByHeader: false,
  reactStrictMode: true,
  // Configurações de output para deployment
  output: 'standalone',
};

export default nextConfig;
