import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Busca a imagem no banco de dados
    const image = await prisma.imageStorage.findUnique({
      where: { filename },
    });

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Retorna a imagem com o tipo MIME correto
    return new NextResponse(image.data, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": image.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable", // Cache por 1 ano
        "ETag": `"${image.id}-${image.updatedAt.getTime()}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}