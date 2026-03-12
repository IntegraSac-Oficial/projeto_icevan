/**
 * Script para migrar banners hero existentes para o banco de dados
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readdir, readFile, stat } from "fs/promises";
import { existsSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

import { prisma } from "../lib/db";

async function getMimeType(filename: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

async function main() {
  console.log("🚀 Migrando banners hero para o banco...\n");

  try {
    const heroDir = "public/images/hero";
    
    if (!existsSync(heroDir)) {
      console.log("❌ Diretório public/images/hero não existe");
      return;
    }

    const files = await readdir(heroDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    console.log(`📁 Encontrados ${imageFiles.length} arquivos de imagem`);

    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const filePath = `${heroDir}/${filename}`;
      
      try {
        // Lê o arquivo
        const fileBuffer = await readFile(filePath);
        const fileStats = await stat(filePath);
        const mimeType = await getMimeType(filename);

        // Salva imagem no banco
        const savedImage = await prisma.imageStorage.create({
          data: {
            filename,
            originalName: filename,
            mimeType,
            size: fileStats.size,
            data: fileBuffer,
            category: "hero",
          },
        });

        // Cria ou atualiza banner
        const banner = await prisma.heroBanner.upsert({
          where: { 
            id: i + 1 // Assume IDs sequenciais
          },
          update: {
            filename,
            imageId: savedImage.id,
            titulo: `Banner ${i + 1}`,
            descricao: "Banner migrado automaticamente",
            sortOrder: i,
            visible: true,
          },
          create: {
            filename,
            imageId: savedImage.id,
            titulo: `Banner ${i + 1}`,
            descricao: "Banner migrado automaticamente", 
            sortOrder: i,
            visible: true,
          },
        });

        console.log(`✅ ${filename} → Banner ID ${banner.id}, Imagem ID ${savedImage.id}`);
      } catch (error) {
        console.error(`❌ Erro ao migrar ${filename}:`, error);
      }
    }

    console.log("\n✅ Migração concluída!");
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();