import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    const commission = await prisma.CommissionSubmission.findUnique({
      where: { id },
    });
    if (!commission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(commission);
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
    const body = await request.json();
    const commission = await prisma.CommissionSubmission.update({
      where: { id },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json(commission);
  } catch (error) {
    console.error("Failed to update commission:", error);
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.CommissionSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
