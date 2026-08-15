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

export async function GET() {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const commissions = await prisma.CommissionSubmission.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(commissions);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch commissions:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load commissions";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.client_name || !body.email || !body.service) {
      return NextResponse.json({ error: "Client name, email, and service are required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }
    const commission = await prisma.CommissionSubmission.create({
      data: {
        client_name: body.client_name,
        email: body.email,
        service: body.service,
        description: body.description || null,
        additional: body.additional || null,
        status: body.status || "PENDING",
        nsfw: body.nsfw ?? false,
      },
    });
    return NextResponse.json(commission, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create commission:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create commission";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
