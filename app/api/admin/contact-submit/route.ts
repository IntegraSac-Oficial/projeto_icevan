import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, empresa_nome, telefone, email, tipo_veiculo, mensagem, como_conheceu } = body;

    if (!nome || !telefone || !email || !tipo_veiculo || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        nome,
        empresa: empresa_nome || null,
        telefone,
        email,
        tipoVeiculo: tipo_veiculo,
        mensagem,
        comoConheceu: como_conheceu || null,
      },
    });

    return NextResponse.json({ ok: true, id: contact.id });
  } catch (error) {
    console.error("Erro ao salvar contato:", error);
    return NextResponse.json({ error: "Erro ao salvar contato" }, { status: 500 });
  }
}
