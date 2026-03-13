import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Caminho para o arquivo no sistema de arquivos
    const imagePath = join(process.cwd(), "public", "uploads", filename);

    // Verifica se o arquivo existe
    if (!existsSync(imagePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Lê o arquivo
    const imageBuffer = await readFile(imagePath);

    // Determina o tipo MIME baseado na extensão
    const extension = filename.split('.').pop()?.toLowerCase();
    let mimeType = "image/jpeg"; // padrão
    
    switch (extension) {
      case "png":
        mimeType = "image/png";
        break;
      case "webp":
        mimeType = "image/webp";
        break;
      case "gif":
        mimeType = "image/gif";
        break;
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        break;
    }

    // Retorna a imagem
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable", // Cache por 1 ano
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}