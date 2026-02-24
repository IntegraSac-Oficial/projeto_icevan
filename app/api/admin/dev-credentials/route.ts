import { NextResponse } from "next/server"

/** Endpoint exclusivo para desenvolvimento — retorna credenciais do admin.
 *  Lê diretamente do .env.local (sem DB).
 *  Bloqueado automaticamente em produção. */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 })
  }

  const email    = process.env.ADMIN_EMAIL    ?? ""
  const password = process.env.ADMIN_PASSWORD ?? ""

  if (!email || !password) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env.local" },
      { status: 500 }
    )
  }

  return NextResponse.json({ email, password })
}
