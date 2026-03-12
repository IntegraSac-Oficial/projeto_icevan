/**
 * Script para testar se os banners estão sendo carregados corretamente
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { prisma } from "../lib/db";

async function testBanners() {
  console.log("🧪 Testando carregamento de banners...\n");

  try {
    // Testa conexão com banco
    console.log("1. Testando conexão com banco...");
    await prisma.$connect();
    console.log("✅ Conexão com banco OK\n");

    // Lista todos os banners
    console.log("2. Listando banners no banco...");
    const banners = await prisma.heroBanner.findMany({
      include: {
        image: true,
        mobileImage: true,
      },
    });
    
    console.log(`📊 Encontrados ${banners.length} banners:`);
    banners.forEach((banner, i) => {
      console.log(`   ${i + 1}. ID: ${banner.id}`);
      console.log(`      Filename: ${banner.filename}`);
      console.log(`      ImageId: ${banner.imageId}`);
      console.log(`      Image: ${banner.image ? '✅' : '❌'}`);
      console.log(`      Visible: ${banner.visible ? '✅' : '❌'}`);
      console.log(`      Título: ${banner.titulo}`);
      console.log("");
    });

    // Lista imagens no banco
    console.log("3. Listando imagens no banco...");
    const images = await prisma.imageStorage.findMany({
      where: { category: "hero" },
    });
    
    console.log(`📊 Encontradas ${images.length} imagens hero:`);
    images.forEach((img, i) => {
      console.log(`   ${i + 1}. ID: ${img.id} - ${img.filename} (${Math.round(img.size/1024)}KB)`);
    });

    // Testa a função loadHeroBanners simulada
    console.log("\n4. Simulando loadHeroBanners...");
    const visibleBanners = await prisma.heroBanner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        image: true,
        mobileImage: true,
      },
    });

    if (visibleBanners.length > 0) {
      console.log(`✅ ${visibleBanners.length} banners visíveis encontrados:`);
      visibleBanners.forEach((banner, i) => {
        const imageUrl = banner.image 
          ? `/api/images/${banner.image.filename}`
          : `/images/hero/${banner.filename}`;
        console.log(`   ${i + 1}. ${banner.titulo} → ${imageUrl}`);
      });
    } else {
      console.log("❌ Nenhum banner visível encontrado!");
    }

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBanners();