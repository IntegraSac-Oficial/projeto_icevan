import { PrismaClient } from "@/lib/generated/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

async function exportImagesFromDatabase() {
  try {
    console.log('🔄 Exportando imagens do banco de dados para o filesystem...');
    
    // Garante que o diretório existe
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log('📁 Diretório uploads criado');
    }

    // Busca todas as imagens no banco
    const images = await prisma.imageStorage.findMany();
    
    if (images.length === 0) {
      console.log('ℹ️ Nenhuma imagem encontrada no banco de dados');
      return;
    }

    console.log(`📊 Encontradas ${images.length} imagens para exportar`);

    let exported = 0;
    let skipped = 0;

    for (const image of images) {
      const filePath = join(uploadsDir, image.filename);
      
      // Verifica se o arquivo já existe
      if (existsSync(filePath)) {
        console.log(`⏭️ Pulando ${image.filename} (já existe)`);
        skipped++;
        continue;
      }

      // Escreve o arquivo
      await writeFile(filePath, image.data);
      console.log(`✅ Exportado: ${image.filename} (${(image.size / 1024).toFixed(1)} KB)`);
      exported++;
    }

    console.log(`\n🎉 Exportação concluída!`);
    console.log(`✅ Exportadas: ${exported} imagens`);
    console.log(`⏭️ Puladas: ${skipped} imagens`);
    console.log(`📁 Local: ${uploadsDir}`);

  } catch (error) {
    console.error('❌ Erro ao exportar imagens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa o script
exportImagesFromDatabase();