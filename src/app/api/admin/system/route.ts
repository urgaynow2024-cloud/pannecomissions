import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { runHealthChecks } from "@/lib/health";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function generateDiagnosticId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  const diagnosticId = generateDiagnosticId();
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
      results.counts.settings = await prisma.SiteSetting.count();
    } catch (e) {
      results.checks.database = false;
      dbError = e instanceof Error ? e.message : "Unknown database error";
    }

    try {
      const { data, error } = await supabaseAdmin.storage.from("pannecomissions").list("", { limit: 1 });
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
      const health = await runHealthChecks();
      results.checks.healthPhotos = health.checks.photos_table;
      results.checks.healthCommissionColumn = health.checks.commission_additional_column;
      results.checks.healthStorage = health.checks.storage_bucket;
      results.healthDetails = health;
    } catch (e) {
      results.checks.healthEndpoint = false;
    }

    results.errors = { db: dbError, storage: storageError };
    results.ok = !dbError && !storageError;

    return NextResponse.json(results);
  } catch (error) {
    console.error(`[${diagnosticId}] System status failed:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication expired. Please log in again.", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "System status failed";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
