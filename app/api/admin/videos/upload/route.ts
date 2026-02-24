import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const VIDEOS_DIR = "videos";

const ALLOWED_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".mkv"];

/** POST /api/admin/videos/upload — Upload de arquivo de vídeo local */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Formato não permitido. Use MP4, WebM, MOV ou AVI." },
        { status: 400 }
      );
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, "-")
      .replace(/-+/g, "-");

    const dirPath = path.join(PUBLIC_DIR, VIDEOS_DIR);
    await mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      url: `/${VIDEOS_DIR}/${safeName}`,
      filename: safeName,
    });
  } catch (error) {
    console.error("Erro no upload de vídeo:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
