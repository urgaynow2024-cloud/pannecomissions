import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch NSFW portfolio:", error);
    return NextResponse.json({ error: "Failed to fetch NSFW portfolio", items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.PortfolioItem.create({
      data: { ...body, nsfw: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create NSFW portfolio item:", error);
    return NextResponse.json({ error: "Failed to create NSFW portfolio item" }, { status: 500 });
  }
}


