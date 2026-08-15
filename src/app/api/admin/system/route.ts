import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  try {
    await requireAdmin();
    const results: any = {
      checks: {},
      counts: {},
      storage: {},
      timestamp: new Date().toISOString(),
    };

    let dbError: string | null = null;
    let storageError: string | null = null;

    try {
      await prisma.$queryRaw`SELECT 1 LIMIT 1`;
      results.checks.database = true;
      results.counts.portfolio = await prisma.PortfolioItem.count({ where: { deleted_at: null } });
      results.counts.portfolioDeleted = await prisma.PortfolioItem.count({ where: { deleted_at: { not: null } } });
      results.counts.nsfw = await prisma.PortfolioItem.count({ where: { nsfw: true } });
      results.counts.services = await prisma.Service.count();
      results.counts.pricing = await prisma.Pricing.count();
      results.counts.reviews = await prisma.Review.count();
      results.counts.commissions = await prisma.CommissionSubmission.count();
      results.counts.support = await prisma.SupportRequest.count();
      results.counts.photos = await prisma.Photo.count();
    } catch (e) {
      results.checks.database = false;
      dbError = e instanceof Error ? e.message : "Unknown database error";
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data, error } = await supabase.storage.from("pannecomissions").list("", { limit: 1 });
      results.checks.storage = !error;
      if (error) {
        storageError = error.message;
        results.storage.error = error.message;
      } else if (data) {
        results.storage.files = data.length;
      }
    } catch (e) {
      results.checks.storage = false;
      storageError = e instanceof Error ? e.message : "Unknown storage error";
    }

    try {
      const healthRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/health`, { cache: "no-store" });
      results.checks.healthEndpoint = healthRes.ok;
      if (healthRes.ok) {
        results.healthDetails = await healthRes.json();
      }
    } catch {
      results.checks.healthEndpoint = false;
    }

    results.errors = { db: dbError, storage: storageError };
    results.ok = !dbError && !storageError;

    return NextResponse.json(results);
  } catch (error) {
    console.error("System status failed:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }
    const diagnosticId = generateDiagnosticId();
    console.error(`[${diagnosticId}]`, error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "System status failed", code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
