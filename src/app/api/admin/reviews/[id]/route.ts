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
    const review = await prisma.Review.findUnique({
      where: { id },
    });
    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(review);
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
    const review = await prisma.Review.update({
      where: { id },
      data: {
        display_name: body.display_name,
        rating: body.rating,
        review_text: body.review_text,
        image_url: body.image_url !== undefined ? body.image_url : undefined,
        status: body.status,
        hidden: body.hidden ?? false,
        rejection_reason: body.rejection_reason !== undefined ? body.rejection_reason : undefined,
      },
    });
    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.Review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
