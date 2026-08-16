import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/blob";
import { compressImage } from "@/lib/compress-image";
import prisma from "@/lib/prisma";

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    const contentType = request.headers.get("content-type") || "";
    let display_name = "";
    let rating = 5;
    let review_text = "";
    let imageUrl = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      display_name = body.display_name || "";
      rating = typeof body.rating === "number" ? body.rating : 5;
      review_text = body.review_text || "";
      imageUrl = body.image_url || "";
      if (!display_name || !review_text) {
        return NextResponse.json({ error: "Name and review text are required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
      if (!imageUrl) {
        return NextResponse.json({ error: "Image is required for public reviews", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
    } else {
      const formData = await request.formData();
      display_name = (formData.get("display_name") as string) || "";
      rating = parseInt((formData.get("rating") as string) || "5", 10);
      review_text = (formData.get("review_text") as string) || "";
      const file = formData.get("image") as File | null;

      if (!display_name || !review_text) {
        return NextResponse.json({ error: "Name and review text are required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }

      if (file && file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Invalid file type", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
        }
        if (file.size > 20 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large (max 20MB)", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
        }
        const compressed = await compressImage(file);
        imageUrl = await uploadImage(compressed);
      } else {
        return NextResponse.json({ error: "Image is required for public reviews", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
    }

    const review = await prisma.Review.create({
      data: {
        display_name,
        rating: Math.min(5, Math.max(1, rating)),
        review_text,
        image_url: imageUrl,
        status: "PENDING",
        hidden: false,
      },
    });

    return NextResponse.json({ success: true, message: "Review submitted for approval", id: review.id }, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to submit review:`, error);
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
