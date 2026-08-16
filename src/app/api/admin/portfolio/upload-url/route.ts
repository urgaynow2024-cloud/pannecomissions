import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

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
    const body = await request.json();
    const { filename, contentType, bucket = "pannecomissions" } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

    const ext = filename.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `uploads/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error(`[${diagnosticId}] Supabase signed upload error:`, error);
      if (error.message.includes("bucket") || error.message.includes("not found")) {
        return NextResponse.json({ error: "Storage bucket 'pannecomissions' not found. Create it in Supabase Storage.", code: "STORAGE_BUCKET_MISSING", diagnosticId }, { status: 500 });
      }
      return NextResponse.json({ error: `Storage error: ${error.message}`, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data?.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create upload URL:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create upload URL";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
