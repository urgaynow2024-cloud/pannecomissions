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
    const commissions = await prisma.CommissionSubmission.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(commissions);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
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
    console.error("Failed to create commission:", error);
    return NextResponse.json({ error: "Failed to create commission" }, { status: 500 });
  }
}


