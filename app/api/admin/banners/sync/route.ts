import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/** POST /api/admin/banners/sync - Sincroniza banners com a pasta images/hero */
export async function POST() {
  try {
    const heroPath = path.join(process.cwd(), "public", "images", "hero");
    
    // Ler arquivos da pasta
    const files = await readdir(heroPath);
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));

    // Separar arquivos desktop e mobile
    const desktopFiles = imageFiles.filter(f => !f.includes('-mobile.'));
    const mobileFiles = imageFiles.filter(f => f.includes('-mobile.'));

    // Para cada imagem desktop, criar ou atualizar no banco
    for (let i = 0; i < desktopFiles.length; i++) {
      const filename = desktopFiles[i];
      
      // Procurar arquivo mobile correspondente (ignora extensão)
      const baseName = filename.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
      const mobileFilename = mobileFiles.find(f => {
        const mobileBase = f.replace(/-mobile\.(jpg|jpeg|png|webp|svg)$/i, '');
        return mobileBase === baseName;
      });
      
      console.log(`Banner: ${filename} -> Mobile: ${mobileFilename || 'não encontrado'}`);
      
      // Verificar se já existe
      const existing = await prisma.heroBanner.findFirst({
        where: { filename },
      });

      if (!existing) {
        // Criar novo
        await prisma.heroBanner.create({
          data: {
            filename,
            mobileFilename: mobileFilename || null,
            titulo: "",
            descricao: "",
            sortOrder: i + 1,
            visible: true,
          },
        });
      } else {
        // Atualizar sortOrder e mobileFilename
        await prisma.heroBanner.update({
          where: { id: existing.id },
          data: { 
            sortOrder: i + 1,
            mobileFilename: mobileFilename || null,
          },
        });
      }
    }

    // Remover banners que não existem mais no filesystem
    const allBanners = await prisma.heroBanner.findMany();
    for (const banner of allBanners) {
      if (!desktopFiles.includes(banner.filename)) {
        await prisma.heroBanner.delete({
          where: { id: banner.id },
        });
      }
    }

    return NextResponse.json({ 
      ok: true, 
      synced: desktopFiles.length,
      mobileDetected: mobileFiles.length 
    });
  } catch (error) {
    console.error("Erro ao sincronizar banners:", error);
    return NextResponse.json({ error: "Erro ao sincronizar banners" }, { status: 500 });
  }
}
