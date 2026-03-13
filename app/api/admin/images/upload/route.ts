import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validações
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 10MB)" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
    }

    // Converte arquivo para buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Gera nome único para o arquivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomSuffix}.${extension}`;

    // Garante que o diretório existe
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Salva o arquivo no sistema de arquivos
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      image: {
        filename,
        originalName: file.name,
        size: file.size,
        url: `/api/images/${filename}`,
      },
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}