import { NextRequest, NextResponse } from "next/server";
import { getSettingJSON, saveSettings } from "@/lib/settings";
import { getVehicleRegistry } from "@/lib/applications";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/** GET — retorna o registro atual de veículos */
export async function GET() {
  const registry = await getVehicleRegistry();
  return NextResponse.json(registry);
}

/** POST — atualiza o registro de veículos */
export async function POST(request: NextRequest) {
  const body = await request.json();
  await saveSettings({ vehicles_registry: JSON.stringify(body) });
  
  // Revalida todas as páginas que usam o registro de veículos
  revalidatePath("/", "layout");
  revalidatePath("/aplicacoes");
  
  return NextResponse.json({ ok: true });
}
