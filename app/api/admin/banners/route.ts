import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

/** GET /api/admin/banners - Lista todos os banners */
export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 });
  }
}
