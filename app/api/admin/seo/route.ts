import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.seoSetting.findMany();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageSlug, metaTitulo, metaDescricao, ogImage } = body;

    console.log('📝 SEO API - Recebendo dados:', { pageSlug, metaTitulo, metaDescricao, ogImage });

    if (!pageSlug) {
      console.error('❌ SEO API - pageSlug ausente');
      return NextResponse.json({ error: "pageSlug é obrigatório" }, { status: 400 });
    }

    // Permitir salvar mesmo se apenas um campo estiver preenchido
    if (!metaTitulo && !metaDescricao) {
      console.error('❌ SEO API - Título e descrição ausentes');
      return NextResponse.json({ error: "Preencha pelo menos o título ou a descrição" }, { status: 400 });
    }

    console.log('💾 SEO API - Salvando no banco...');
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

    console.log('✅ SEO API - Salvo com sucesso:', setting);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('❌ SEO API - Erro ao salvar:', error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
