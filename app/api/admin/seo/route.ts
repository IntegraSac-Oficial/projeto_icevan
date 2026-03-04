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

  if (!pageSlug) {
    return NextResponse.json({ error: "pageSlug é obrigatório" }, { status: 400 });
  }

  // Permitir salvar mesmo se apenas um campo estiver preenchido
  if (!metaTitulo && !metaDescricao) {
    return NextResponse.json({ error: "Preencha pelo menos o título ou a descrição" }, { status: 400 });
  }

  const setting = await prisma.seoSetting.upsert({
    where: { pageSlug },
    update: { 
      metaTitulo: metaTitulo || "", 
      metaDescricao: metaDescricao || "", 
      ogImage: ogImage || null 
    },
    create: { 
      pageSlug, 
      metaTitulo: metaTitulo || "", 
      metaDescricao: metaDescricao || "", 
      ogImage: ogImage || null 
    },
  });

  return NextResponse.json(setting);
}
