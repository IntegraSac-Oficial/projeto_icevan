import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contact.count(),
  ]);

  return NextResponse.json({ contacts, total, page, limit });
}

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();
  await prisma.contact.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ ok: true });
}
