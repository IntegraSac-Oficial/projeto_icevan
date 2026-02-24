import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(photos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = await prisma.galleryPhoto.count();
  const photo = await prisma.galleryPhoto.create({
    data: {
      filename: body.filename,
      alt: body.alt,
      category: body.category,
      sortOrder: count,
      visible: true,
    },
  });
  return NextResponse.json(photo);
}
