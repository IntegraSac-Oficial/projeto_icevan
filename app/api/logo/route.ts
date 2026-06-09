import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function resolveLogoUrl(logoDir: string, baseName: string, extensions: string[], fallback: string) {
  const files = await readdir(logoDir);
  const preferred = files.find((file) => {
    const normalized = file.toLowerCase();
    return extensions.some((extension) => normalized === `${baseName}.${extension}`);
  });

  if (!preferred) {
    return fallback;
  }

  const fullPath = path.join(logoDir, preferred);
  const fileStats = await stat(fullPath);
  const version = fileStats.mtimeMs;

  return `/images/logo/${preferred}?v=${version}`;
}

export async function GET() {
  try {
    const logoDir = path.join(process.cwd(), "public", "images", "logo");

    // Garante que o diretório existe
    const { ensureDirectory } = await import("@/lib/ensure-directories");
    await ensureDirectory(logoDir);

    const [principal, branca, favicon] = await Promise.all([
      resolveLogoUrl(logoDir, "logo", ["svg", "png", "webp", "jpg", "jpeg", "gif"], "/images/logo/logo.svg"),
      resolveLogoUrl(logoDir, "logo-white", ["svg", "png", "webp", "jpg", "jpeg", "gif"], "/images/logo/logo-white.svg"),
      resolveLogoUrl(logoDir, "favicon", ["svg", "ico", "png", "jpg", "jpeg", "webp"], "/images/logo/favicon.jpg"),
    ]);

    return NextResponse.json({ principal, branca, favicon });
  } catch (error) {
    console.error("Erro ao buscar logos:", error);
    return NextResponse.json({
      principal: "/images/logo/logo.svg",
      branca: "/images/logo/logo-white.svg",
      favicon: "/images/logo/favicon.jpg",
    });
  }
}
