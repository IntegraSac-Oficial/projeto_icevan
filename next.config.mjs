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
};

export default nextConfig;
