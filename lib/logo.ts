import { readdir } from "fs/promises";
import path from "path";

/**
 * Detecta automaticamente qual arquivo de logo existe
 * Procura por logo.* (qualquer extensão)
 */
export async function getLogoPath(type: "principal" | "branca" | "favicon"): Promise<string> {
  try {
    const logoDir = path.join(process.cwd(), "public", "images", "logo");
    const files = await readdir(logoDir);
    
    let pattern: RegExp;
    let fallback: string;
    
    switch (type) {
      case "principal":
        pattern = /^logo\.(svg|png|jpg|jpeg|webp)$/i;
        fallback = "/images/logo/logo.svg";
        break;
      case "branca":
        pattern = /^logo-white\.(svg|png|jpg|jpeg|webp)$/i;
        fallback = "/images/logo/logo-white.svg";
        break;
      case "favicon":
        pattern = /^favicon\.(ico|png|jpg|jpeg|svg)$/i;
        fallback = "/images/logo/favicon.ico";
        break;
    }
    
    const logoFile = files.find(f => pattern.test(f));
    
    if (logoFile) {
      return `/images/logo/${logoFile}`;
    }
    
    return fallback;
  } catch {
    // Se der erro, retorna fallback
    switch (type) {
      case "principal":
        return "/images/logo/logo.svg";
      case "branca":
        return "/images/logo/logo-white.svg";
      case "favicon":
        return "/images/logo/favicon.ico";
    }
  }
}
