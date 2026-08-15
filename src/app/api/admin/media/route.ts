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

export async function GET(request: Request) {
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const filter = url.searchParams.get("filter") || "all";

    let query: any = {};

    if (filter === "orphaned") {
      const portfolioUrls = prisma.PortfolioItem.findMany({ where: { deleted_at: null }, select: { image_url: true } }).then((items: { image_url: string }[]) => items.map((i) => i.image_url));
      const serviceUrls = prisma.Service.findMany({ select: { image_url: true } }).then((items: { image_url: string | null }[]) => items.map((i) => i.image_url).filter((b): b is string => Boolean(b)));
      const reviewUrls = prisma.Review.findMany({ where: { image_url: { not: null } }, select: { image_url: true } }).then((items: { image_url: string }[]) => items.map((i) => i.image_url));
      const photoUrls = prisma.Photo.findMany({ select: { url: true } }).then((items: { url: string }[]) => items.map((i) => i.url));

      const [pUrls, sUrls, rUrls, phUrls] = await Promise.all([portfolioUrls, serviceUrls, reviewUrls, photoUrls]);
      const usedUrls = new Set<string>([...pUrls, ...sUrls, ...rUrls, ...phUrls]);

      const allPhotos = await prisma.Photo.findMany({ orderBy: { created_at: "desc" } });
      const orphaned = allPhotos.filter((p: { url: string }) => !usedUrls.has(p.url));
      return NextResponse.json({ photos: orphaned, total: orphaned.length, orphaned: true });
    }

    if (search) {
      query.OR = [
        { url: { contains: search, mode: "insensitive" } },
        { alt_text: { contains: search, mode: "insensitive" } },
      ];
    }

    if (filter !== "all") {
      if (filter === "portfolio") query.portfolioItemId = { not: null };
      else if (filter === "service") query.serviceId = { not: null };
      else if (filter === "review") query.reviewId = { not: null };
    }

    const photos = await prisma.Photo.findMany({
      where: query,
      orderBy: { created_at: "desc" },
      include: {
        portfolioItem: { select: { id: true, display_title: true } },
        service: { select: { id: true, name: true } },
        review: { select: { id: true, display_name: true } },
      },
    });

    const counts = {
      portfolio: await prisma.Photo.count({ where: { portfolioItemId: { not: null } } }),
      service: await prisma.Photo.count({ where: { serviceId: { not: null } } }),
      review: await prisma.Photo.count({ where: { reviewId: { not: null } } }),
    };

    return NextResponse.json({ photos, total: photos.length, counts });
  } catch (error) {
    console.error(`[${diagnosticId}] Media fetch failed:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load media library";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
