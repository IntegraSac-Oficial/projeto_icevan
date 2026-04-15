import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readdir } from "fs/promises";
import { join } from "path";

/**
 * GET /api/admin/photo-captions?aplicacao=fiorinos
 * Retorna todas as fotos de uma aplicação com suas legendas
 * Sincroniza automaticamente com o filesystem
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const aplicacao = searchParams.get("aplicacao");

    if (!aplicacao) {
      return NextResponse.json(
        { error: "Parâmetro 'aplicacao' é obrigatório" },
        { status: 400 }
      );
    }

    // Lê as fotos do filesystem
    const aplicacoesDir = join(process.cwd(), "public", "images", "aplicacoes", aplicacao);
    
    let files: string[] = [];
    try {
      const allFiles = await readdir(aplicacoesDir);
      // Filtra apenas imagens e ordena
      files = allFiles
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      // Diretório não existe ou erro ao ler - retorna lista vazia ao invés de erro
      console.warn(`Diretório não encontrado ou vazio: ${aplicacoesDir}`);
      return NextResponse.json({
        aplicacao,
        totalFotos: 0,
        fotos: [],
      });
    }

    // Remove a primeira foto (thumbnail) da lista
    const galleryFiles = files.slice(1);

    // Busca legendas existentes no banco
    const captions = await prisma.applicationPhotoCaption.findMany({
      where: { aplicacao },
    });

    // Cria um mapa de legendas por filename
    const captionsMap = new Map(
      captions.map((c) => [c.filename, c.legenda])
    );

    // Monta resposta com todas as fotos e suas legendas
    const photos = galleryFiles.map((filename) => ({
      filename,
      legenda: captionsMap.get(filename) || "",
      src: `/api/images/${filename}?folder=images/aplicacoes/${aplicacao}`,
    }));

    return NextResponse.json({
      aplicacao,
      totalFotos: photos.length,
      fotos: photos,
    });
  } catch (error) {
    console.error("Erro ao buscar legendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar legendas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/photo-captions
 * Salva/atualiza legendas de fotos
 * Body: { aplicacao: string, legendas: { filename: string, legenda: string }[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aplicacao, legendas } = body;

    if (!aplicacao || !Array.isArray(legendas)) {
      return NextResponse.json(
        { error: "Dados inválidos. Esperado: { aplicacao, legendas: [] }" },
        { status: 400 }
      );
    }

    // Atualiza ou cria cada legenda
    const results = await Promise.all(
      legendas.map(async ({ filename, legenda }) => {
        return prisma.applicationPhotoCaption.upsert({
          where: {
            aplicacao_filename: {
              aplicacao,
              filename,
            },
          },
          update: {
            legenda,
            updatedAt: new Date(),
          },
          create: {
            aplicacao,
            filename,
            legenda,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `${results.length} legendas atualizadas`,
      aplicacao,
    });
  } catch (error) {
    console.error("Erro ao salvar legendas:", error);
    return NextResponse.json(
      { error: "Erro ao salvar legendas" },
      { status: 500 }
    );
  }
}
