import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "images/fotos-servicos";

    console.log(`[IMAGE API] Serving: ${folder}/${filename}`);

    // Caminho para o arquivo no sistema de arquivos
    const imagePath = join(process.cwd(), "public", folder, filename);

    // Verifica se o arquivo existe
    if (!existsSync(imagePath)) {
      console.error(`[IMAGE API] File not found: ${imagePath}`);
      return new NextResponse("Image not found", { status: 404 });
    }

    // Lê o arquivo e suas informações
    const [imageBuffer, stats] = await Promise.all([
      readFile(imagePath),
      stat(imagePath)
    ]);

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
      case "svg":
        mimeType = "image/svg+xml";
        break;
    }

    console.log(`[IMAGE API] Serving ${filename} (${imageBuffer.length} bytes, ${mimeType})`);

    // Retorna a imagem com headers otimizados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Last-Modified": stats.mtime.toUTCString(),
        "ETag": `"${stats.mtime.getTime()}-${stats.size}"`,
      },
    });
  } catch (error) {
    console.error("[IMAGE API] Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}