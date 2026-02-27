import { NextRequest, NextResponse } from "next/server";
import { getSettingJSON, saveSettings } from "@/lib/settings";
import { getVehicleRegistry } from "@/lib/applications";

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
  return NextResponse.json({ ok: true });
}
