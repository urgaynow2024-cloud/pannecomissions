import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await prisma.Pricing.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.Pricing.update({
      where: { id },
      data: {
        name: body.name,
        min_price: body.min_price !== undefined ? body.min_price : undefined,
        max_price: body.max_price !== undefined ? body.max_price : undefined,
        description: body.description !== undefined ? body.description : undefined,
        visible: body.visible ?? true,
        sort_order: body.sort_order ?? 0,
        category: body.category || "sfw",
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update pricing:", error);
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.Pricing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
