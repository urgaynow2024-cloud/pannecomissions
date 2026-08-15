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
    const supportRequest = await prisma.SupportRequest.findUnique({
      where: { id },
    });
    if (!supportRequest) {
      return NextResponse.json({ error: "Support request not found", code: "NOT_FOUND", diagnosticId }, { status: 404 });
    }
    return NextResponse.json(supportRequest);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch support request:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load support request";
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
    const supportRequest = await prisma.SupportRequest.update({
      where: { id },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json(supportRequest);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to update support request:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to update support request";
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
    await prisma.SupportRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to delete support request:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete support request";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
