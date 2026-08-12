import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET() {
  try {
    await requireAdmin();
    const requests = await prisma.SupportRequest.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
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
    console.error("Failed to create support request:", error);
    return NextResponse.json({ error: "Failed to create support request" }, { status: 500 });
  }
}


