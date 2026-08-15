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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await prisma.Service.findUnique({
      where: { id },
      include: { photos: { orderBy: { sort_order: "asc" } } },
    });
    if (!item) {
      return NextResponse.json({ error: "Service not found", code: "NOT_FOUND", diagnosticId }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch service:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load service";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.Service.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description ?? null,
        image_url: body.image_url ?? null,
        sort_order: body.sort_order ?? 0,
        visible: body.visible ?? true,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to update service:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to update service";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.Service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to delete service:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete service";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
