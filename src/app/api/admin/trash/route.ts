import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "restore") {
      const id = url.searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "ID required for restore", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
      const result = await prisma.PortfolioItem.updateMany({
        where: { id, deleted_at: { not: null } },
        data: { deleted_at: null },
      });
      if (result.count === 0) {
        return NextResponse.json({ error: "Item not found in trash", code: "NOT_FOUND", diagnosticId }, { status: 404 });
      }
      return NextResponse.json({ success: true, restored: result.count });
    }

    if (action === "permanent-delete") {
      const id = url.searchParams.get("id");
      if (!id) {
        return NextResponse.json({ error: "ID required for permanent delete", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
      }
      const item = await prisma.PortfolioItem.findUnique({ where: { id } });
      if (!item) {
        return NextResponse.json({ error: "Item not found", code: "NOT_FOUND", diagnosticId }, { status: 404 });
      }
      if (item.image_url) {
        try {
          const path = item.image_url.split("/").slice(-2).join("/");
          await supabase.storage.from("pannecomissions").remove([path]);
        } catch (e) {
          console.warn(`[${diagnosticId}] Storage cleanup failed:`, e);
        }
      }
      await prisma.PortfolioItem.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const items = await prisma.PortfolioItem.findMany({
      where: { deleted_at: { not: null } },
      orderBy: { deleted_at: "desc" },
      include: { photos: true },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error(`[${diagnosticId}] Trash operation failed:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Trash operation failed";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
