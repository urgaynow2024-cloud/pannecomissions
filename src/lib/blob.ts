import { supabaseAdmin } from "@/lib/supabase";

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const ext = file.name.split(".").pop() || "png";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `uploads/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from("pannecomissions")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    if (error.message.includes("row-level security") || error.message.includes("RLS")) {
      throw new Error("Storage blocked: create a 'pannecomissions' bucket in Supabase Storage and make it Public");
    }
    if (error.message.includes("bucket") || error.message.includes("not found")) {
      throw new Error("Storage bucket 'pannecomissions' not found. Create it in Supabase Storage.");
    }
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from("pannecomissions")
    .getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("Failed to get public URL from Supabase Storage");
  }

  return data.publicUrl;
}
