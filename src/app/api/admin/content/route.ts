import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

const EDITABLE_KEYS = [
  "site_name",
  "hero_title",
  "hero_subtitle",
  "hero_description",
  "about_text",
  "commission_cta",
  "portfolio_heading",
  "reviews_heading",
  "pricing_heading",
  "footer_description",
  "contact_info",
  "support_info",
];

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.SiteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    const result: Record<string, string> = {};
    for (const key of EDITABLE_KEYS) {
      result[key] = map[key] || "";
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const keys = Object.keys(body);

    for (const key of keys) {
      if (!EDITABLE_KEYS.includes(key)) {
        continue;
      }
      const existing = await prisma.SiteSetting.findUnique({
        where: { key },
      });
      if (existing) {
        await prisma.SiteSetting.update({
          where: { key },
          data: { value: String(body[key]) },
        });
      } else {
        await prisma.SiteSetting.create({
          data: { key, value: String(body[key]) },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}


