import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const video = await prisma.video.update({
    where: { id: parseInt(id) },
    data: body,
  });
  return NextResponse.json(video);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.video.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
