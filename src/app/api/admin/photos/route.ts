import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/blob";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const portfolioItemId = searchParams.get("portfolioItemId");
    const reviewId = searchParams.get("reviewId");

    const where: any = {};
    if (serviceId) where.serviceId = serviceId;
    if (portfolioItemId) where.portfolioItemId = portfolioItemId;
    if (reviewId) where.reviewId = reviewId;

    const photos = await prisma.photo.findMany({
      where,
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch photos:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch photos", code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;
    const portfolioItemId = formData.get("portfolioItemId") as string | null;
    const serviceId = formData.get("serviceId") as string | null;
    const reviewId = formData.get("reviewId") as string | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Image is required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 20MB)", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

    const url = await uploadImage(file);

    const photo = await prisma.photo.create({
      data: {
        url,
        alt_text: altText || null,
        mime_type: file.type,
        file_size: file.size,
        portfolioItemId: portfolioItemId || undefined,
        serviceId: serviceId || undefined,
        reviewId: reviewId || undefined,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to upload photo:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database table missing. Run supabase/schema.sql in Supabase SQL Editor.", code: "SCHEMA_MISSING", diagnosticId }, { status: 500 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Failed to upload photo";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
