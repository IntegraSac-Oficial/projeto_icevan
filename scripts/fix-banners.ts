/**
 * Script para corrigir os banners hero
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { prisma } from "../lib/db";

async function fixBanners() {
  console.log("🔧 Corrigindo banners hero...\n");

  try {
    // 1. Limpa banners existentes
    console.log("1. Limpando banners existentes...");
    await prisma.heroBanner.deleteMany();
    console.log("✅ Banners limpos\n");

    // 2. Busca imagens hero (não mobile)
    console.log("2. Buscando imagens hero...");
    const heroImages = await prisma.imageStorage.findMany({
      where: { 
        category: "hero",
        filename: { not: { contains: "-mobile" } }
      },
      orderBy: { filename: "asc" }
    });

    console.log(`📊 Encontradas ${heroImages.length} imagens hero:`);
    heroImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.filename}`);
    });

    // 3. Cria banners com títulos e descrições adequados
    const bannerData = [
      {
        titulo: "Isolamento Térmico Profissional",
        descricao: "Painéis de alta performance que mantêm a temperatura estável e reduzem o consumo do sistema de frio."
      },
      {
        titulo: "Sistemas de Refrigeração para Transporte", 
        descricao: "Qualidade e eficiência para conservar sua carga perecível do ponto de partida até a entrega."
      },
      {
        titulo: "Solução Completa para Sua Frota",
        descricao: "Atendemos autônomos, pequenas e médias frotas com projetos personalizados e assistência técnica."
      }
    ];

    console.log("\n3. Criando banners corrigidos...");
    for (let i = 0; i < Math.min(heroImages.length, bannerData.length); i++) {
      const image = heroImages[i];
      const data = bannerData[i];

      const banner = await prisma.heroBanner.create({
        data: {
          filename: image.filename,
          imageId: image.id,
          titulo: data.titulo,
          descricao: data.descricao,
          sortOrder: i,
          visible: true,
        },
      });

      console.log(`✅ Banner ${banner.id}: ${data.titulo} → ${image.filename}`);
    }

    console.log("\n✅ Banners corrigidos com sucesso!");

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBanners();