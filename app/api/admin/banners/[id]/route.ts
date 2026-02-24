import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** PATCH /api/admin/banners/[id] - Atualiza título e descrição de um banner */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { titulo, descricao } = body;

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        titulo: titulo || "",
        descricao: descricao || "",
      },
    });

    return NextResponse.json({ ok: true, banner });
  } catch (error) {
    console.error("Erro ao atualizar banner:", error);
    return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 });
  }
}

/** DELETE /api/admin/banners/[id] - Deleta um banner do banco */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.heroBanner.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao deletar banner:", error);
    return NextResponse.json({ error: "Erro ao deletar banner" }, { status: 500 });
  }
}
