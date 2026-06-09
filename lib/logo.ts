import { readdir, stat } from "fs/promises";
import path from "path";

/**
 * Detecta automaticamente qual arquivo de logo existe
 * Procura por logo.* (qualquer extensão), priorizando SVG.
 */
export async function getLogoPath(type: "principal" | "branca" | "favicon"): Promise<string> {
  try {
    const logoDir = path.join(process.cwd(), "public", "images", "logo");
    const files = await readdir(logoDir);

    let baseName: string;
    let extensions: string[];
    let fallback: string;

    switch (type) {
      case "principal":
        baseName = "logo";
        extensions = ["svg", "png", "webp", "jpg", "jpeg", "gif"];
        fallback = "/images/logo/logo.svg";
        break;
      case "branca":
        baseName = "logo-white";
        extensions = ["svg", "png", "webp", "jpg", "jpeg", "gif"];
        fallback = "/images/logo/logo-white.svg";
        break;
      case "favicon":
        baseName = "favicon";
        extensions = ["svg", "ico", "png", "jpg", "jpeg", "webp"];
        fallback = "/images/logo/favicon.jpg";
        break;
    }

    const logoFile = files.find((file) => {
      const normalized = file.toLowerCase();
      return extensions.some((extension) => normalized === `${baseName}.${extension}`);
    });

    if (!logoFile) {
      return fallback;
    }

    const fullPath = path.join(logoDir, logoFile);
    const fileStats = await stat(fullPath);
    return `/images/logo/${logoFile}?v=${fileStats.mtimeMs}`;
  } catch {
    switch (type) {
      case "principal":
        return "/images/logo/logo.svg";
      case "branca":
        return "/images/logo/logo-white.svg";
      case "favicon":
        return "/images/logo/favicon.jpg";
    }
  }
}
