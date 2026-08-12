import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.Review.findMany({
      where: { status: "APPROVED" },
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
        ...body,
        status: "PENDING",
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}


