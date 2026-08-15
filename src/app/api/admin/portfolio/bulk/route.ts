import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No items selected", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }

    if (!["publish", "hide", "feature", "unfeature", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
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

    const result = await prisma.PortfolioItem.updateMany({
      where: { id: { in: ids }, nsfw: false },
      data: updateData,
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error(`[${diagnosticId}] Bulk portfolio action failed:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Bulk action failed";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
