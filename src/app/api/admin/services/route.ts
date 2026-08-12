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
    const services = await prisma.Service.findMany({
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
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
    console.error("Failed to create service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}



