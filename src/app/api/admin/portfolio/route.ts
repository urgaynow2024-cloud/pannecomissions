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
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: false, deleted_at: null },
      orderBy: { sort_order: "asc" },
      include: {
        photos: {
          orderBy: { sort_order: "asc" },
        },
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch admin portfolio:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database table missing. Run supabase/schema.sql in Supabase SQL Editor.", code: "SCHEMA_MISSING", diagnosticId }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Failed to load portfolio";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const contentType = request.headers.get("content-type") || "";
    let displayTitle: string | null = null;
    let description: string | null = null;
    let category: string | null = null;
    let altText: string | null = null;
    let featured = false;
    let visible = true;
    let homepageVisible = true;
    let focalPointX = 0.5;
    let focalPointY = 0.5;
    let imageUrl = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      displayTitle = body.displayTitle ?? null;
      description = body.description ?? null;
      category = body.category ?? null;
      altText = body.altText ?? null;
      featured = body.featured === true;
      visible = body.visible !== false;
      homepageVisible = body.homepageVisible !== false;
      focalPointX = typeof body.focalPointX === "number" ? body.focalPointX : 0.5;
      focalPointY = typeof body.focalPointY === "number" ? body.focalPointY : 0.5;
      imageUrl = body.image_url || "";
      if (!imageUrl) {
        return NextResponse.json({ error: "image_url is required for direct uploads", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
    } else {
      const formData = await request.formData();
      displayTitle = (formData.get("displayTitle") as string) || null;
      description = (formData.get("description") as string) || null;
      category = (formData.get("category") as string) || null;
      altText = (formData.get("altText") as string) || null;
      featured = formData.get("featured") === "true";
      visible = formData.get("visible") !== "false";
      homepageVisible = formData.get("homepageVisible") !== "false";
      const file = formData.get("image") as File | null;

      if (file && file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Invalid file type", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
        }
        if (file.size > 20 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large (max 20MB)", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
        }
        imageUrl = await uploadImage(file);
      } else {
        return NextResponse.json({ error: "Image is required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
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
        visible,
        homepage_visible: homepageVisible,
        focal_point_x: focalPointX,
        focal_point_y: focalPointY,
        nsfw: false,
        sort_order: 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create portfolio item:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database table missing. Run supabase/schema.sql in Supabase SQL Editor.", code: "SCHEMA_MISSING", diagnosticId }, { status: 500 });
    }
    if (error instanceof Error && error.message.includes("Storage")) {
      return NextResponse.json({ error: error.message, code: "STORAGE_ERROR", diagnosticId }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Failed to create portfolio item";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
