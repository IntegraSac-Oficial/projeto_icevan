import { prisma } from "./db";

/** Lê uma setting do banco. Retorna fallback se não existir ou DB indisponível. */
export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const s = await prisma.setting.findUnique({ where: { key } });
    return s?.value ?? fallback;
  } catch {
    return fallback;
  }
}

/** Lê uma setting JSON do banco. Retorna fallback se não existir ou inválido. */
export async function getSettingJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const s = await prisma.setting.findUnique({ where: { key } });
    if (!s?.value) return fallback;
    return JSON.parse(s.value) as T;
  } catch {
    return fallback;
  }
}

/** Salva múltiplas settings de uma vez (upsert por chave). */
export async function saveSettings(data: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}

/** Retorna todas as settings como Record<string, string>. */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}
