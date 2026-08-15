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
    const requests = await prisma.SupportRequest.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch support requests:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load support requests";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.client_name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: "All fields are required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }
    const supportRequest = await prisma.SupportRequest.create({
      data: {
        client_name: body.client_name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        status: body.status || "PENDING",
      },
    });
    return NextResponse.json(supportRequest, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create support request:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create support request";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
