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

export async function GET() {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const items = await prisma.MediaLibrary.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch media library:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load media library";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

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

    const item = await prisma.MediaLibrary.create({
      data: {
        url,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to upload to media library:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
