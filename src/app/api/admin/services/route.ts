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
    const services = await prisma.Service.findMany({
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch services:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load services";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required", code: "VALIDATION_ERROR", diagnosticId }, { status: 400 });
    }
    const service = await prisma.Service.create({
      data: {
        name: body.name,
        description: body.description || null,
        image_url: body.image_url || null,
        sort_order: body.sort_order || 0,
        visible: body.visible ?? true,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to create service:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create service";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
