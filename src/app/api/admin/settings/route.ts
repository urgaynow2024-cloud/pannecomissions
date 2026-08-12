import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

const PUBLIC_SETTINGS = [
  "site_name",
  "site_url",
  "social_links",
  "footer_text",
];

export async function GET() {
  try {
    await requireAdmin();
    const env = process.env;
    const result: Record<string, string> = {};

    for (const key of PUBLIC_SETTINGS) {
      result[key] = env[key] || "";
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}


