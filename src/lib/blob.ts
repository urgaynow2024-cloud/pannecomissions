import { put } from "@vercel/blob";

export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}
