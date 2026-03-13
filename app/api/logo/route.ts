import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logoDir = path.join(process.cwd(), "public", "images", "logo");
    
    // Garante que o diretório existe
    const { ensureDirectory } = await import("@/lib/ensure-directories");
    await ensureDirectory(logoDir);
    
    const files = await readdir(logoDir);
    
    // Procura logo principal - QUALQUER extensão
    const logoPrincipal = files.find(f => /^logo\.(svg|png|jpg|jpeg|webp|gif)$/i.test(f));
    const logoBranca = files.find(f => /^logo-white\.(svg|png|jpg|jpeg|webp|gif)$/i.test(f));
    const favicon = files.find(f => /^favicon\.(ico|png|jpg|jpeg|svg|webp)$/i.test(f));
    
    console.log('Logos encontradas:', { logoPrincipal, logoBranca, favicon });
    
    return NextResponse.json({
      principal: logoPrincipal ? `/images/logo/${logoPrincipal}` : "/images/logo/logo.jpeg",
      branca: logoBranca ? `/images/logo/${logoBranca}` : "/images/logo/logo-white.jpeg",
      favicon: favicon ? `/images/logo/${favicon}` : "/images/logo/favicon.jpeg",
    });
  } catch (error) {
    console.error('Erro ao buscar logos:', error);
    return NextResponse.json({
      principal: "/images/logo/logo.jpeg",
      branca: "/images/logo/logo-white.jpeg",
      favicon: "/images/logo/favicon.jpeg",
    });
  }
}
