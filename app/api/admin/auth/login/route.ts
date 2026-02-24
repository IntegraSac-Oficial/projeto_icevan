import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || !(await verifyAdminCredentials(email, password))) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    await createSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
