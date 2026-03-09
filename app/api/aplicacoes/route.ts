import { NextResponse } from "next/server";
import { getVehicleRegistry } from "@/lib/applications";

/**
 * API pública para listar aplicações/veículos
 * Usado pelo Footer para sincronizar automaticamente
 */
export async function GET() {
  try {
    const registry = await getVehicleRegistry();
    
    // Retorna apenas os dados necessários para o footer
    const aplicacoes = registry.map((v) => ({
      href: v.href,
      label: v.label,
    }));

    return NextResponse.json(aplicacoes);
  } catch (error) {
    console.error("Erro ao buscar aplicações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aplicações" },
      { status: 500 }
    );
  }
}
