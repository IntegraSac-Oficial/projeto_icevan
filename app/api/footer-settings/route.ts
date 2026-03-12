import { NextResponse } from "next/server";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** GET /api/footer-settings - Retorna apenas as configurações públicas do footer */
export async function GET() {
  try {
    const footerCopyright = await getSetting("footer_copyright", "");
    const footerRodape = await getSetting("footer_rodape", "");
    
    return NextResponse.json({
      footer_copyright: footerCopyright,
      footer_rodape: footerRodape,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações do footer:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}