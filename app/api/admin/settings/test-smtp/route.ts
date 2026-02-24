import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_nome } =
    await request.json();

  if (!smtp_host || !smtp_user || !smtp_pass) {
    return NextResponse.json(
      { ok: false, error: "Host, usuário e senha são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port ?? "587"),
      secure: parseInt(smtp_port ?? "587") === 465,
      auth: { user: smtp_user, pass: smtp_pass },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: smtp_nome ? `"${smtp_nome}" <${smtp_from || smtp_user}>` : smtp_from || smtp_user,
      to: smtp_user,
      subject: "Teste de conexão SMTP — Ice Van",
      text: "Configuração SMTP funcionando corretamente!",
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
