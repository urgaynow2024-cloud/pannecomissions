import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/blob";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await prisma.PortfolioItem.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { sort_order: "asc" },
        },
      },
    });
    if (!item || !item.nsfw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to fetch NSFW portfolio item:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load item." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    const existing = await prisma.PortfolioItem.findUnique({
      where: { id },
    });
    if (!existing || !existing.nsfw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let displayTitle = existing.display_title;
    let description = existing.description;
    let category = existing.category;
    let altText = existing.alt_text;
    let visible = existing.visible;
    let sort_order = existing.sort_order;
    let imageUrl = existing.image_url;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      if (body.displayTitle !== undefined) displayTitle = body.displayTitle || null;
      if (body.description !== undefined) description = body.description || null;
      if (body.category !== undefined) category = body.category || null;
      if (body.altText !== undefined) altText = body.altText || null;
      if (body.visible !== undefined) visible = body.visible === true;
      if (body.sort_order !== undefined) sort_order = body.sort_order;
      if (body.image_url) imageUrl = body.image_url;
    } else {
      const formData = await request.formData();
      const formDisplayTitle = formData.get("displayTitle") as string;
      const formDescription = formData.get("description") as string;
      const formCategory = formData.get("category") as string;
      const formAltText = formData.get("altText") as string;
      const formVisible = formData.get("visible") === "true";
      const formSortOrder = parseInt(formData.get("sortOrder") as string || "0", 10);
      const file = formData.get("image") as File | null;

      if (formDisplayTitle !== "") displayTitle = formDisplayTitle || null;
      if (formDescription !== "") description = formDescription || null;
      if (formCategory !== "") category = formCategory || null;
      if (formAltText !== "") altText = formAltText || null;
      visible = formVisible;
      sort_order = formSortOrder;

      if (file && file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large" }, { status: 400 });
        }
        imageUrl = await uploadImage(file);
      }
    }

    const item = await prisma.PortfolioItem.update({
      where: { id },
      data: {
        display_title: displayTitle,
        description,
        category,
        alt_text: altText,
        image_url: imageUrl,
        visible,
        sort_order,
      },
      include: {
        photos: {
          orderBy: { sort_order: "asc" },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update NSFW portfolio item:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update NSFW portfolio item" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await prisma.PortfolioItem.findUnique({
      where: { id },
    });
    if (!existing || !existing.nsfw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await prisma.PortfolioItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete NSFW portfolio item:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
