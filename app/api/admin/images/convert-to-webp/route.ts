import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const PUBLIC_DIR = path.join(process.cwd(), "public");

interface ConversionResult {
  originalFile: string;
  webpFile: string;
  originalSize: number;
  webpSize: number;
  reduction: number;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 CONVERSÃO EM LOTE PARA WEBP');
  console.log('═══════════════════════════════════════════════════════════');
  
  try {
    const body = await request.json();
    const { folder } = body;
    
    if (!folder) {
      return NextResponse.json({ 
        ok: false, 
        error: "Pasta não especificada" 
      }, { status: 400 });
    }
    
    console.log(`📁 Pasta selecionada: ${folder}`);
    
    const dirPath = path.join(PUBLIC_DIR, folder);
    const results: ConversionResult[] = [];
    let totalOriginalSize = 0;
    let totalWebPSize = 0;
    let convertedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    
    // Ler todos os arquivos da pasta
    const files = await readdir(dirPath);
    const imageFiles = files.filter(f => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );
    
    console.log(`📊 Total de imagens encontradas: ${imageFiles.length}`);
    console.log('');
    
    // Se for pasta de banners (images/hero), precisamos atualizar o banco de dados
    const isHeroFolder = folder === "images/hero";
    
    for (const file of imageFiles) {
      // Pular se já for WebP
      if (file.toLowerCase().endsWith('.webp')) {
        console.log(`⏭️  Pulando ${file} (já é WebP)`);
        skippedCount++;
        continue;
      }
      
      const originalPath = path.join(dirPath, file);
      
      // Manter o prefixo numérico e nome, apenas trocar extensão
      const webpFileName = file.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
      const webpPath = path.join(dirPath, webpFileName);
      
      try {
        // Ler tamanho original
        const originalStats = await stat(originalPath);
        const originalSize = originalStats.size;
        
        console.log(`🔄 Convertendo: ${file}`);
        console.log(`   📏 Tamanho original: ${(originalSize / 1024).toFixed(2)} KB`);
        
        // Converter para WebP com qualidade 85%
        const webpBuffer = await sharp(originalPath)
          .webp({ quality: 85 })
          .toBuffer();
        
        const webpSize = webpBuffer.length;
        const reduction = ((1 - webpSize / originalSize) * 100);
        
        // Salvar arquivo WebP
        await writeFile(webpPath, webpBuffer);
        
        console.log(`   📏 Tamanho WebP: ${(webpSize / 1024).toFixed(2)} KB`);
        console.log(`   💾 Redução: ${reduction.toFixed(1)}%`);
        
        // Aguardar um pouco para garantir que o arquivo foi escrito
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Se for pasta de banners, atualizar banco de dados
        if (isHeroFolder) {
          console.log(`   🗄️  Atualizando banco de dados...`);
          
          // Atualizar banners que usam este arquivo (desktop ou mobile)
          const updatedDesktop = await prisma.heroBanner.updateMany({
            where: { filename: file },
            data: { filename: webpFileName },
          });
          
          const updatedMobile = await prisma.heroBanner.updateMany({
            where: { mobileFilename: file },
            data: { mobileFilename: webpFileName },
          });
          
          if (updatedDesktop.count > 0) {
            console.log(`   ✅ ${updatedDesktop.count} banner(s) desktop atualizado(s)`);
          }
          if (updatedMobile.count > 0) {
            console.log(`   ✅ ${updatedMobile.count} banner(s) mobile atualizado(s)`);
          }
        }
        
        // Deletar arquivo original
        try {
          await unlink(originalPath);
          console.log(`   🗑️  Original deletado: ${file}`);
        } catch (deleteError) {
          console.error(`   ⚠️  AVISO: Não foi possível deletar ${file}`);
          console.error(`   Erro:`, deleteError instanceof Error ? deleteError.message : String(deleteError));
          console.error(`   O arquivo WebP foi criado com sucesso, mas o original permanece.`);
          console.error(`   Você pode deletá-lo manualmente ou tentar novamente.`);
        }
        
        console.log(`   ✅ ${file} → ${webpFileName}`);
        console.log('');
        
        results.push({
          originalFile: file,
          webpFile: webpFileName,
          originalSize,
          webpSize,
          reduction,
          success: true,
        });
        
        totalOriginalSize += originalSize;
        totalWebPSize += webpSize;
        convertedCount++;
      } catch (fileError) {
        console.error(`   ❌ Erro ao converter ${file}:`, fileError);
        console.log('');
        
        results.push({
          originalFile: file,
          webpFile: webpFileName,
          originalSize: 0,
          webpSize: 0,
          reduction: 0,
          success: false,
          error: fileError instanceof Error ? fileError.message : String(fileError),
        });
        
        failedCount++;
      }
    }
    
    const totalReduction = totalOriginalSize > 0 
      ? ((1 - totalWebPSize / totalOriginalSize) * 100) 
      : 0;
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ CONVERSÃO CONCLUÍDA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📊 Convertidas: ${convertedCount}`);
    console.log(`⏭️  Puladas (já WebP): ${skippedCount}`);
    console.log(`❌ Falharam: ${failedCount}`);
    console.log(`📉 Tamanho original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📉 Tamanho WebP total: ${(totalWebPSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Economia total: ${totalReduction.toFixed(1)}%`);
    if (isHeroFolder) {
      console.log(`🗄️  Banco de dados atualizado automaticamente`);
    }
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    return NextResponse.json({
      ok: true,
      converted: convertedCount,
      skipped: skippedCount,
      failed: failedCount,
      totalReduction: `${totalReduction.toFixed(1)}%`,
      originalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
      webpSizeMB: (totalWebPSize / 1024 / 1024).toFixed(2),
      databaseUpdated: isHeroFolder,
      results,
    });
  } catch (error) {
    console.error('❌ Erro geral na conversão:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
