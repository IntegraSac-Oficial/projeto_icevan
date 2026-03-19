import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, saveSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, string>;
  await saveSettings(body);
  
  // Revalida todas as páginas que usam settings
  revalidatePath("/", "layout");
  
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json() as { key: string; value: string };
  
  // Salva uma única configuração
  await saveSettings({ [body.key]: body.value });
  
  // Revalida todas as páginas que usam settings
  revalidatePath("/", "layout");
  
  return NextResponse.json({ ok: true });
}
