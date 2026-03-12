import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/banners - Lista todos os banners */
export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        image: true,       // Inclui dados da imagem desktop
        mobileImage: true, // Inclui dados da imagem mobile
      },
    });

    // Mapeia os banners para incluir URLs das imagens
    const bannersWithUrls = banners.map(banner => ({
      ...banner,
      imageUrl: banner.image 
        ? `/api/images/${banner.image.filename}`
        : banner.filename 
          ? `/images/hero/${banner.filename}`
          : null,
      mobileImageUrl: banner.mobileImage 
        ? `/api/images/${banner.mobileImage.filename}`
        : banner.mobileFilename 
          ? `/images/hero/${banner.mobileFilename}`
          : null,
    }));

    return NextResponse.json({ banners: bannersWithUrls });
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 });
  }
}

/** POST /api/admin/banners - Cria novo banner */
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, imageId, mobileImageId, titulo, descricao, sortOrder, visible } = body;

    const banner = await prisma.heroBanner.create({
      data: {
        filename,
        imageId,
        mobileImageId,
        titulo: titulo || "",
        descricao: descricao || "",
        sortOrder: sortOrder || 0,
        visible: visible !== false,
      },
      include: {
        image: true,
        mobileImage: true,
      },
    });

    return NextResponse.json({ banner });
  } catch (error) {
    console.error("Erro ao criar banner:", error);
    return NextResponse.json({ error: "Erro ao criar banner" }, { status: 500 });
  }
}
