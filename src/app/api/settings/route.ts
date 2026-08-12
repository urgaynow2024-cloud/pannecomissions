import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.SiteSetting.findMany({
      where: {
        key: {
          in: [
            "site_name",
            "site_url",
            "contact_email",
            "discord_contact",
            "social_links",
            "footer_text",
          ],
        },
      },
    });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json(map);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}


