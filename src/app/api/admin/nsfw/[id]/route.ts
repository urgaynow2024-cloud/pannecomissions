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
    });
    if (!item || !item.nsfw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const altText = formData.get("altText") as string;
    const visible = formData.get("visible") === "true";
    const sort_order = parseInt(formData.get("sortOrder") as string || "0", 10);
    const file = formData.get("image") as File | null;

    const existing = await prisma.PortfolioItem.findUnique({
      where: { id },
    });
    if (!existing || !existing.nsfw) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let imageUrl = existing.image_url;
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }
      imageUrl = await uploadImage(file);
    }

    const item = await prisma.PortfolioItem.update({
      where: { id },
      data: {
        title: title || existing.title,
        description: description !== "" ? description : existing.description,
        alt_text: altText !== "" ? altText : existing.alt_text,
        image_url: imageUrl,
        visible,
        sort_order,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update NSFW portfolio item:", error);
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
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
