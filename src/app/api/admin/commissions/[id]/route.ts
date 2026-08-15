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
    const commission = await prisma.CommissionSubmission.findUnique({
      where: { id },
    });
    if (!commission) {
      return NextResponse.json({ error: "Commission not found", code: "NOT_FOUND", diagnosticId }, { status: 404 });
    }
    return NextResponse.json(commission);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch commission:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load commission";
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
    const commission = await prisma.CommissionSubmission.update({
      where: { id },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json(commission);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to update commission:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to update commission";
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
    await prisma.CommissionSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to delete commission:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete commission";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
