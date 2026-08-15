import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET() {
  const t0 = performance.now();
  try {
    await requireAdmin();
    const t1 = performance.now();

    const [
      totalPortfolio,
      publishedPortfolio,
      hiddenPortfolio,
      featuredPortfolio,
      deletedPortfolio,
      nsfwPortfolio,
      pendingReviews,
      pendingCommissions,
      openSupport,
      totalServices,
      totalPricing,
      totalPhotos,
      recentCommissions,
      recentReviews,
      recentSupport,
    ] = await Promise.all([
      prisma.PortfolioItem.count({ where: { deleted_at: null } }),
      prisma.PortfolioItem.count({ where: { deleted_at: null, visible: true } }),
      prisma.PortfolioItem.count({ where: { deleted_at: null, visible: false } }),
      prisma.PortfolioItem.count({ where: { deleted_at: null, featured: true } }),
      prisma.PortfolioItem.count({ where: { deleted_at: { not: null } } }),
      prisma.PortfolioItem.count({ where: { nsfw: true } }),
      prisma.Review.count({ where: { status: "PENDING" } }),
      prisma.CommissionSubmission.count({ where: { status: "PENDING" } }),
      prisma.SupportRequest.count(),
      prisma.Service.count(),
      prisma.Pricing.count(),
      prisma.Photo.count(),
      prisma.CommissionSubmission.findMany({ take: 5, orderBy: { created_at: "desc" } }),
      prisma.Review.findMany({ take: 5, orderBy: { created_at: "desc" } }),
      prisma.SupportRequest.findMany({ take: 5, orderBy: { created_at: "desc" } }),
    ]);

    let storageEstimate = "Unknown";
    if (totalPhotos > 0) {
      const avgSize = await prisma.Photo.aggregate({ _avg: { file_size: true } });
      storageEstimate = `~${(totalPhotos * (avgSize._avg.file_size || 0) / (1024 * 1024)).toFixed(1)} MB`;
    }

    console.log(`[dashboard-stats] total=${(performance.now() - t0).toFixed(1)}ms auth=${(t1 - t0).toFixed(1)}ms queries=${(performance.now() - t1).toFixed(1)}ms`);

    return NextResponse.json({
      portfolioStats: {
        total: totalPortfolio,
        published: publishedPortfolio,
        hidden: hiddenPortfolio,
        featured: featuredPortfolio,
        deleted: deletedPortfolio,
      },
      nsfw: nsfwPortfolio,
      pendingReviews,
      pendingCommissions,
      openSupport,
      totalServices,
      totalPricing,
      storageEstimate,
      recentCommissions,
      recentReviews,
      recentSupport,
    });
  } catch (error) {
    console.error(`[dashboard-stats] error total=${(performance.now() - t0).toFixed(1)}ms`, error);
    return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
