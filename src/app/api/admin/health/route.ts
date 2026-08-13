import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const admin = await verifySession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function GET() {
  try {
    await requireAdmin();

    const checks: Record<string, boolean> = {};
    const missing: string[] = [];

    try {
      await prisma.$queryRaw`SELECT 1 FROM photos LIMIT 1`;
      checks.photos_table = true;
    } catch {
      checks.photos_table = false;
      missing.push("photos table");
    }

    try {
      await prisma.$queryRaw`SELECT additional FROM commission_submissions LIMIT 1`;
      checks.commission_additional_column = true;
    } catch {
      checks.commission_additional_column = false;
      missing.push("commission_submissions.additional column");
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM portfolio_items LIMIT 1`;
      checks.portfolio_items = true;
    } catch {
      checks.portfolio_items = false;
      missing.push("portfolio_items table");
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM services LIMIT 1`;
      checks.services = true;
    } catch {
      checks.services = false;
      missing.push("services table");
    }

    return NextResponse.json({
      ok: missing.length === 0,
      checks,
      missing,
      fix: missing.length > 0 ? "Run supabase/schema.sql in Supabase SQL Editor" : null,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
