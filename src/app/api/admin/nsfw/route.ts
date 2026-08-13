import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/blob";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: true },
      orderBy: { sort_order: "asc" },
      include: {
        photos: {
          orderBy: { sort_order: "asc" },
        },
      },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const altText = formData.get("altText") as string;
    const file = formData.get("image") as File | null;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let imageUrl = "";
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }
      imageUrl = await uploadImage(file);
    } else {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const item = await prisma.PortfolioItem.create({
      data: {
        title,
        description: description || null,
        alt_text: altText || null,
        image_url: imageUrl,
        nsfw: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create NSFW portfolio item:", error);
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database table missing. Run supabase/schema.sql in Supabase SQL Editor." }, { status: 500 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create NSFW portfolio item" }, { status: 500 });
  }
}



