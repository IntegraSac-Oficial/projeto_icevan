import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/hero-banners - Lista todos os banners */
export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 });
  }
}

/** POST /api/admin/hero-banners - Cria ou atualiza um banner */
export async function POST(request: NextRequest) {
  try {
    const { filename, titulo, descricao } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename é obrigatório" }, { status: 400 });
    }

    // Busca se já existe um banner com esse filename
    const existing = await prisma.heroBanner.findFirst({
      where: { filename },
    });

    if (existing) {
      // Atualiza
      const updated = await prisma.heroBanner.update({
        where: { id: existing.id },
        data: {
          titulo: titulo || "",
          descricao: descricao || "",
        },
      });
      return NextResponse.json({ ok: true, banner: updated });
    } else {
      // Cria novo
      // Determina o sortOrder baseado no prefixo numérico do filename
      const match = filename.match(/^(\d+)-/);
      const sortOrder = match ? parseInt(match[1], 10) : 999;

      const created = await prisma.heroBanner.create({
        data: {
          filename,
          titulo: titulo || "",
          descricao: descricao || "",
          sortOrder,
          visible: true,
        },
      });
      return NextResponse.json({ ok: true, banner: created });
    }
  } catch (error) {
    console.error("Erro ao salvar banner:", error);
    return NextResponse.json({ error: "Erro ao salvar banner" }, { status: 500 });
  }
}
