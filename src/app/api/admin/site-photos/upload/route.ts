import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

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

    const photo = await prisma.SitePhoto.update({
      where: { slug },
      data: { url, alt_text: file.name },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to upload site photo:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Site photo slot not found. Run supabase/schema.sql to seed slots.", code: "SLOT_MISSING", diagnosticId }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
