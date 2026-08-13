import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/blob";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: false },
      orderBy: { sort_order: "asc" },
      include: {
        photos: {
          orderBy: { sort_order: "asc" },
        },
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch admin portfolio:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load portfolio. Please try again." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const contentType = request.headers.get("content-type") || "";
    let displayTitle: string | null = null;
    let description: string | null = null;
    let category: string | null = null;
    let altText: string | null = null;
    let featured = false;
    let imageUrl = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      displayTitle = body.displayTitle || null;
      description = body.description || null;
      category = body.category || null;
      altText = body.altText || null;
      featured = body.featured === true;
      imageUrl = body.image_url || "";
      if (!imageUrl) {
        return NextResponse.json({ error: "image_url is required for direct uploads" }, { status: 400 });
      }
    } else {
      const formData = await request.formData();
      displayTitle = (formData.get("displayTitle") as string) || null;
      description = (formData.get("description") as string) || null;
      category = (formData.get("category") as string) || null;
      altText = (formData.get("altText") as string) || null;
      featured = formData.get("featured") === "true";
      const file = formData.get("image") as File | null;

      if (file && file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }
        imageUrl = await uploadImage(file);
      } else {
        return NextResponse.json({ error: "Image is required" }, { status: 400 });
      }
    }

    const item = await prisma.PortfolioItem.create({
      data: {
        display_title: displayTitle,
        description,
        category,
        alt_text: altText,
        image_url: imageUrl,
        featured,
        nsfw: false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database table missing. Run supabase/schema.sql in Supabase SQL Editor." }, { status: 500 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create portfolio item" }, { status: 500 });
  }
}


