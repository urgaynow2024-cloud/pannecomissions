const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const QUALITY = 0.85;
const MIME_TYPE = "image/jpeg";

export function isGif(file: File): boolean {
  return file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
}

export function isVideo(file: File): boolean {
  return file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
}

export async function compressImage(file: File): Promise<File> {
  if (isGif(file) || isVideo(file)) {
    return file;
  }

  if (!file.type.startsWith("image/")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
    bitmap.close();
    return file;
  }

  const aspect = width / height;
  if (width > height) {
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH;
      height = Math.round(width / aspect);
    }
  } else {
    if (height > MAX_HEIGHT) {
      height = MAX_HEIGHT;
      width = Math.round(height * aspect);
    }
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: MIME_TYPE, quality: QUALITY });
  const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: MIME_TYPE });
  return compressedFile;
}
