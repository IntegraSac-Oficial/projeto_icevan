import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.seoSetting.findMany();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { pageSlug, metaTitulo, metaDescricao, ogImage } = body;

  if (!pageSlug || !metaTitulo || !metaDescricao) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const setting = await prisma.seoSetting.upsert({
    where: { pageSlug },
    update: { metaTitulo, metaDescricao, ogImage: ogImage || null },
    create: { pageSlug, metaTitulo, metaDescricao, ogImage: ogImage || null },
  });

  return NextResponse.json(setting);
}
