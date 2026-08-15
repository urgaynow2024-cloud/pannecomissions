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

const CONTENT_KEYS = [
  "hero_title",
  "hero_subtitle",
  "marquee_text",
  "commission_available",
  "commission_status_text",
  "about_text",
  "cta_text",
  "about_image_url",
];

export async function GET() {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const env = process.env;
    const result: Record<string, string> = {};

    for (const key of CONTENT_KEYS) {
      result[key] = env[key] || "";
    }

    const dbSettings = await prisma.SiteSetting.findMany();
    for (const setting of dbSettings) {
      if (CONTENT_KEYS.includes(setting.key)) {
        result[setting.key] = setting.value;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch content:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load content";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const body = await request.json();

    for (const key of CONTENT_KEYS) {
      if (key in body && typeof body[key] === "string") {
        await prisma.SiteSetting.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to update content:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to update content";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
