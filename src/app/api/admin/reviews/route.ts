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
    const reviews = await prisma.Review.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const review = await prisma.Review.create({
      data: {
        display_name: body.display_name,
        rating: body.rating,
        review_text: body.review_text,
        image_url: body.image_url || null,
        status: body.status || "PENDING",
        hidden: body.hidden ?? false,
        rejection_reason: body.rejection_reason || null,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
