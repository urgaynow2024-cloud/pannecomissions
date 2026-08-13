import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { filename, contentType, bucket = "pannecomissions" } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const ext = filename.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      console.error("Supabase signed upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data?.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Failed to create signed upload URL:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
