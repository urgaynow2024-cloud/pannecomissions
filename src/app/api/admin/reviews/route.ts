import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const reviews = await prisma.Review.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch reviews:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load reviews";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.display_name || !body.review_text) {
      return NextResponse.json({ error: "Client name and review text are required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }
    const review = await prisma.Review.create({
      data: {
        display_name: body.display_name,
        rating: body.rating || 5,
        review_text: body.review_text,
        image_url: body.image_url || null,
        status: body.status || "PENDING",
        hidden: body.hidden ?? false,
        rejection_reason: body.rejection_reason || null,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create review:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
