import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pricing = await prisma.Pricing.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(pricing);
  } catch (error) {
    console.error("Failed to fetch pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing", items: [] }, { status: 500 });
  }
}



