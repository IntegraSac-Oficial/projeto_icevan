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

    // Para cada imagem, criar ou atualizar no banco
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      
      // Verificar se já existe
      const existing = await prisma.heroBanner.findFirst({
        where: { filename },
      });

      if (!existing) {
        // Criar novo
        await prisma.heroBanner.create({
          data: {
            filename,
            titulo: "",
            descricao: "",
            sortOrder: i + 1,
            visible: true,
          },
        });
      } else {
        // Atualizar sortOrder
        await prisma.heroBanner.update({
          where: { id: existing.id },
          data: { sortOrder: i + 1 },
        });
      }
    }

    // Remover banners que não existem mais no filesystem
    const allBanners = await prisma.heroBanner.findMany();
    for (const banner of allBanners) {
      if (!imageFiles.includes(banner.filename)) {
        await prisma.heroBanner.delete({
          where: { id: banner.id },
        });
      }
    }

    return NextResponse.json({ ok: true, synced: imageFiles.length });
  } catch (error) {
    console.error("Erro ao sincronizar banners:", error);
    return NextResponse.json({ error: "Erro ao sincronizar banners" }, { status: 500 });
  }
}
