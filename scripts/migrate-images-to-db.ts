/**
 * SCRIPT PARA MIGRAR IMAGENS DO SISTEMA DE ARQUIVOS PARA O BANCO DE DADOS
 * 
 * Este script:
 * 1. Lê todas as imagens das pastas public/images/
 * 2. Converte para BLOB e salva no banco
 * 3. Atualiza as referências nas tabelas
 * 4. Mantém os arquivos originais como backup
 * 
 * Execute: npx tsx scripts/migrate-images-to-db.ts
 */

import { config } from "dotenv";
import { resolve, join } from "path";
import { readdir, readFile, stat } from "fs/promises";
import { existsSync } from "fs";

// Carrega variáveis de ambiente
config({ path: resolve(process.cwd(), ".env.local") });

import { prisma } from "../lib/db";

const IMAGE_DIRS = [
  "public/images/hero",
  "public/images/galeria", 
  "public/images/logo",
  "public/images/aplicacoes",
  "public/images/empresa",
  "public/images/formas-pagamento"
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

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
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

async function migrateImagesFromDirectory(dirPath: string, category: string) {
  if (!existsSync(dirPath)) {
    console.log(`📁 Diretório não existe: ${dirPath}`);
    return;
  }

  console.log(`\n📂 Processando: ${dirPath}`);
  
  try {
    const files = await readdir(dirPath);
    const imageFiles = files.filter(file => 
      ALLOWED_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
    );

    console.log(`   Encontradas ${imageFiles.length} imagens`);

    for (const filename of imageFiles) {
      const filePath = join(dirPath, filename);
      
      try {
        // Verifica se já existe no banco
        const existing = await prisma.imageStorage.findUnique({
          where: { filename }
        });

        if (existing) {
          console.log(`   ⏭️  ${filename} - já existe no banco`);
          continue;
        }

        // Lê o arquivo
        const fileBuffer = await readFile(filePath);
        const fileStats = await stat(filePath);
        const mimeType = await getMimeType(filename);

        // Salva no banco
        const savedImage = await prisma.imageStorage.create({
          data: {
            filename,
            originalName: filename,
            mimeType,
            size: fileStats.size,
            data: fileBuffer,
            category,
          },
        });

        console.log(`   ✅ ${filename} - migrada (ID: ${savedImage.id}, ${Math.round(fileStats.size / 1024)}KB)`);
      } catch (error) {
        console.error(`   ❌ Erro ao migrar ${filename}:`, error);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao processar diretório ${dirPath}:`, error);
  }
}

async function updateHeroBannerReferences() {
  console.log(`\n🔗 Atualizando referências dos Hero Banners...`);
  
  const banners = await prisma.heroBanner.findMany();
  
  for (const banner of banners) {
    try {
      // Atualiza referência da imagem desktop
      if (banner.filename) {
        const image = await prisma.imageStorage.findUnique({
          where: { filename: banner.filename }
        });
        
        if (image && !banner.imageId) {
          await prisma.heroBanner.update({
            where: { id: banner.id },
            data: { imageId: image.id }
          });
          console.log(`   ✅ Banner ${banner.id}: desktop → imagem ${image.id}`);
        }
      }

      // Atualiza referência da imagem mobile
      if (banner.mobileFilename) {
        const mobileImage = await prisma.imageStorage.findUnique({
          where: { filename: banner.mobileFilename }
        });
        
        if (mobileImage && !banner.mobileImageId) {
          await prisma.heroBanner.update({
            where: { id: banner.id },
            data: { mobileImageId: mobileImage.id }
          });
          console.log(`   ✅ Banner ${banner.id}: mobile → imagem ${mobileImage.id}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Erro ao atualizar banner ${banner.id}:`, error);
    }
  }
}

async function updateGalleryReferences() {
  console.log(`\n🔗 Atualizando referências da Galeria...`);
  
  const photos = await prisma.galleryPhoto.findMany();
  
  for (const photo of photos) {
    try {
      if (photo.filename) {
        const image = await prisma.imageStorage.findUnique({
          where: { filename: photo.filename }
        });
        
        if (image && !photo.imageId) {
          await prisma.galleryPhoto.update({
            where: { id: photo.id },
            data: { imageId: image.id }
          });
          console.log(`   ✅ Foto ${photo.id}: ${photo.filename} → imagem ${image.id}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Erro ao atualizar foto ${photo.id}:`, error);
    }
  }
}

async function main() {
  console.log("🚀 Iniciando migração de imagens para o banco de dados...\n");

  try {
    // Migra imagens de cada diretório
    await migrateImagesFromDirectory("public/images/hero", "hero");
    await migrateImagesFromDirectory("public/images/galeria", "gallery");
    await migrateImagesFromDirectory("public/images/logo", "logo");
    await migrateImagesFromDirectory("public/images/aplicacoes", "applications");
    await migrateImagesFromDirectory("public/images/empresa", "company");
    await migrateImagesFromDirectory("public/images/formas-pagamento", "payment");

    // Atualiza referências nas tabelas
    await updateHeroBannerReferences();
    await updateGalleryReferences();

    // Estatísticas finais
    const totalImages = await prisma.imageStorage.count();
    const totalSize = await prisma.imageStorage.aggregate({
      _sum: { size: true }
    });

    console.log(`\n✅ Migração concluída!`);
    console.log(`📊 Estatísticas:`);
    console.log(`   • Total de imagens: ${totalImages}`);
    console.log(`   • Tamanho total: ${Math.round((totalSize._sum.size || 0) / 1024 / 1024)}MB`);
    console.log(`\n📝 Próximos passos:`);
    console.log(`   1. Teste o site para verificar se as imagens aparecem`);
    console.log(`   2. As imagens agora são servidas via /api/images/[filename]`);
    console.log(`   3. Os arquivos originais foram mantidos como backup`);
    console.log(`   4. Novos uploads serão salvos diretamente no banco`);

  } catch (error) {
    console.error("\n❌ Erro durante a migração:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();