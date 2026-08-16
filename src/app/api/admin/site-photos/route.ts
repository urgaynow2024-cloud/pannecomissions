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

const SLOT_CONFIG: Record<string, { label: string; description: string; wide?: boolean }> = {
  hero: { label: "Homepage — Main Hero", description: "Main hero background image", wide: true },
  "clothing-addons": { label: "Clothing Add-ons", description: "Homepage service image" },
  "complete-avatars": { label: "Complete Avatars", description: "Homepage service image" },
  toggles: { label: "Toggles", description: "Homepage service image" },
  "custom-textures": { label: "Custom Textures", description: "Homepage service image" },
  models: { label: "Models", description: "Homepage service image", wide: true },
};

export async function GET() {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const dbPhotos: Array<{ slug: string; id: string; url: string | null; alt_text: string | null }> = await prisma.SitePhoto.findMany({
      orderBy: { slug: "asc" },
    });

    const dbMap = new Map<string, { id: string; url: string | null; alt_text: string | null }>(dbPhotos.map((p) => [p.slug, p]));

interface SitePhotoSlot {
  id?: string;
  slug: string;
  url: string | null;
  alt_text: string | null;
}

    const allSlots = Object.keys(SLOT_CONFIG).map((slug): SitePhotoSlot => {
      const existing = dbMap.get(slug);
      return {
        id: existing?.id,
        slug,
        url: existing?.url || null,
        alt_text: existing?.alt_text || null,
      };
    });

    return NextResponse.json(allSlots);
  } catch (error) {
    console.error(`[${diagnosticId}] Failed to fetch site photos:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load site photos";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
