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
  const diagnosticId = generateDiagnosticId();
  try {
    await requireAdmin();

    const checks: Record<string, boolean> = {};
    const missing: string[] = [];
    const details: Record<string, string> = {};

    try {
      await prisma.$queryRaw`SELECT 1 FROM photos LIMIT 1`;
      checks.photos_table = true;
    } catch (e) {
      checks.photos_table = false;
      missing.push("photos table");
      details.photos_table = e instanceof Error ? e.message : "Unknown error";
    }

    try {
      await prisma.$queryRaw`SELECT additional FROM commission_submissions LIMIT 1`;
      checks.commission_additional_column = true;
    } catch (e) {
      checks.commission_additional_column = false;
      missing.push("commission_submissions.additional column");
      details.commission_additional_column = e instanceof Error ? e.message : "Unknown error";
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { error } = await supabase.storage.from("pannecomissions").list("", { limit: 1 });
      checks.storage_bucket = !error;
      if (error) {
        missing.push(`storage bucket 'pannecomissions' (${error.message})`);
        details.storage_bucket = error.message;
      }
    } catch (e) {
      checks.storage_bucket = false;
      missing.push("storage bucket 'pannecomissions'");
      details.storage_bucket = e instanceof Error ? e.message : "Unknown error";
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { error } = await supabase.storage.from("pannecomissions").list("", { limit: 1 });
      checks.storage_bucket = !error;
      if (error) {
        missing.push(`storage bucket 'pannecomissions' (${error.message})`);
        details.storage_bucket = error.message;
      }
    } catch (e) {
      checks.storage_bucket = false;
      missing.push("storage bucket 'pannecomissions'");
      details.storage_bucket = e instanceof Error ? e.message : "Unknown error";
    }

    return NextResponse.json({
      ok: missing.length === 0,
      checks,
      missing,
      details,
      fix: missing.length > 0 ? "Fix the items below in Supabase" : null,
    });
  } catch (error) {
    console.error(`[${diagnosticId}] Health check failed:`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    return NextResponse.json({ error: "Health check failed", code: "SERVER_ERROR", diagnosticId }, { status: 500 });
  }
}
