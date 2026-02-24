import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.video.count();
  const video = await prisma.video.create({
    data: {
      youtubeId: body.youtubeId,
      titulo: body.titulo,
      categoria: body.categoria,
      sortOrder: count,
      visible: true,
    },
  });
  return NextResponse.json(video);
}
