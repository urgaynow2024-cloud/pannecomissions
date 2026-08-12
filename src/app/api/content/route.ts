import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const KEYS = [
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
  "support_info",
];

export async function GET() {
  try {
    const settings = await prisma.SiteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    const result: Record<string, string> = {};
    for (const key of KEYS) {
      result[key] = map[key] || "";
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}


