import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.portfolioItem.findMany({
      where: { nsfw: false },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio", items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.portfolioItem.create({
      data: body,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}
