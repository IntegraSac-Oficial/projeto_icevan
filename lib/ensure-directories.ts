import { mkdir } from "fs/promises";
import { join } from "path";

/**
 * Garante que um diretório existe, criando-o se necessário
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    // Ignora erro se o diretório já existe
    if (error.code !== 'EEXIST') {
      console.warn(`Aviso: Não foi possível criar diretório ${dirPath}:`, error.message);
    }
  }
}

/**
 * Garante que todos os diretórios de imagens necessários existam
 */
export async function ensureImageDirectories(): Promise<void> {
  const baseDir = join(process.cwd(), "public", "images");
  
  const requiredDirs = [
    "logo",
    "hero", 
    "aplicacoes",
    "empresa",
    "galeria",
    "formas-pagamento"
  ];

  for (const dir of requiredDirs) {
    await ensureDirectory(join(baseDir, dir));
  }
}

/**
 * Garante que o diretório de uma aplicação específica existe
 */
export async function ensureApplicationDirectory(slug: string): Promise<void> {
  const appDir = join(process.cwd(), "public", "images", "aplicacoes", slug);
  await ensureDirectory(appDir);
}