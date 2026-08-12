import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET() {
  try {
    await requireAdmin();
    const pricing = await prisma.Pricing.findMany({
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(pricing);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const item = await prisma.Pricing.create({
      data: {
        name: body.name,
        min_price: body.min_price ?? null,
        max_price: body.max_price ?? null,
        description: body.description || null,
        visible: body.visible ?? true,
        sort_order: body.sort_order || 0,
        category: body.category || "sfw",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create pricing:", error);
    return NextResponse.json({ error: "Failed to create pricing" }, { status: 500 });
  }
}



