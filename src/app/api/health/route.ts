import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const start = Date.now();
    
    await prisma.$queryRaw`SELECT 1`;
    
    const latency = Date.now() - start;
    
    const counts = await Promise.all([
      prisma.PortfolioItem.count(),
      prisma.Service.count(),
      prisma.Pricing.count(),
      prisma.Review.count(),
      prisma.CommissionSubmission.count(),
      prisma.SupportRequest.count(),
    ]).catch(() => [0, 0, 0, 0, 0, 0]);

    return NextResponse.json({
      status: "ok",
      latency: `${latency}ms`,
      database: {
        connected: true,
        counts: {
          portfolio: counts[0],
          services: counts[1],
          pricing: counts[2],
          reviews: counts[3],
          commissions: counts[4],
          support: counts[5],
        },
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 503 }
    );
  }
}
