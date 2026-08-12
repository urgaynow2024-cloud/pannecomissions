import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.Review.findMany({
      where: { status: "APPROVED", hidden: false },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews", items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await prisma.Review.create({
      data: {
        display_name: body.display_name,
        rating: body.rating,
        review_text: body.review_text,
        image_url: body.image_url || null,
        status: "PENDING",
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
