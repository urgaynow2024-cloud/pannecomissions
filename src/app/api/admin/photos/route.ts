import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/blob";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;
    const portfolioItemId = formData.get("portfolioItemId") as string | null;
    const serviceId = formData.get("serviceId") as string | null;
    const reviewId = formData.get("reviewId") as string | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
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
    console.error("Failed to upload photo:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
