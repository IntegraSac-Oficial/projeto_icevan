import { NextRequest, NextResponse } from "next/server";
import { rename } from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const ALLOWED_FOLDERS = [
  "images/hero",
  "images/fotos-servicos",
  "images/empresa",
  "images/og",
  "images/logo",
  "images/aplicacoes/fiorinos",
  "images/aplicacoes/van-ducato",
  "images/aplicacoes/van-sprinter",
  "images/aplicacoes/van-master",
  "images/aplicacoes/expert-porta-frigorifica",
  "images/aplicacoes/fiorino-porta-frigorifica",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder, oldFilename, newFilename } = body;

    if (!folder || !oldFilename || !newFilename) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Pasta não permitida" }, { status: 400 });
    }

    // Valida extensão do novo nome
    const ext = path.extname(newFilename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "Formato de arquivo não permitido" }, { status: 400 });
    }

    const dirPath = path.join(PUBLIC_DIR, folder);
    const oldPath = path.join(dirPath, oldFilename);
    const newPath = path.join(dirPath, newFilename);

    // Garante que os arquivos estão dentro de public/
    if (!oldPath.startsWith(PUBLIC_DIR) || !newPath.startsWith(PUBLIC_DIR)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    await rename(oldPath, newPath);

    return NextResponse.json({
      ok: true,
      oldFilename,
      newFilename,
    });
  } catch (error) {
    console.error("Erro ao renomear:", error);
    return NextResponse.json({ error: "Erro ao renomear arquivo" }, { status: 500 });
  }
}
