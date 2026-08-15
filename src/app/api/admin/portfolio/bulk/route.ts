import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No items selected", code: "VALIDATION_ERROR" }, { status: 400 });
    }

    if (!["publish", "hide", "feature", "unfeature", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action", code: "VALIDATION_ERROR" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};

    switch (action) {
      case "publish":
        updateData.visible = true;
        break;
      case "hide":
        updateData.visible = false;
        break;
      case "feature":
        updateData.featured = true;
        break;
      case "unfeature":
        updateData.featured = false;
        break;
      case "delete":
        updateData.deleted_at = new Date();
        break;
    }

    if (action === "delete") {
      await prisma.PortfolioItem.updateMany({
        where: { id: { in: ids }, nsfw: false },
        data: updateData,
      });
    } else {
      await prisma.PortfolioItem.updateMany({
        where: { id: { in: ids }, nsfw: false },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Bulk portfolio action failed:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bulk action failed", code: "SERVER_ERROR" }, { status: 500 });
  }
}
