import prisma from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

const HEALTH_TIMEOUT = 8000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${HEALTH_TIMEOUT}ms`)), HEALTH_TIMEOUT);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

export async function runHealthChecks() {
  const checks: Record<string, boolean> = {};
  const missing: string[] = [];
  const details: Record<string, string> = {};

  let dbOk = false;
  let dbError: string | null = null;

  try {
    await withTimeout(prisma.$queryRaw`SELECT 1 LIMIT 1`, "database");
    dbOk = true;
    checks.database = true;
  } catch (e) {
    dbOk = false;
    checks.database = false;
    dbError = e instanceof Error ? e.message : "Unknown database error";
    missing.push("database");
    details.database = dbError;
  }

  if (dbOk) {
    try {
      await withTimeout(prisma.$queryRaw`SELECT 1 FROM photos LIMIT 1`, "photos table");
      checks.photos_table = true;
    } catch (e) {
      checks.photos_table = false;
      missing.push("photos table");
      details.photos_table = e instanceof Error ? e.message : "Unknown error";
    }

    try {
      await withTimeout(prisma.$queryRaw`SELECT additional FROM commission_submissions LIMIT 1`, "commission_submissions.additional column");
      checks.commission_additional_column = true;
    } catch (e) {
      checks.commission_additional_column = false;
      missing.push("commission_submissions.additional column");
      details.commission_additional_column = e instanceof Error ? e.message : "Unknown error";
    }
  } else {
    checks.photos_table = false;
    checks.commission_additional_column = false;
    missing.push("photos table");
    missing.push("commission_submissions.additional column");
    details.photos_table = "Skipped: database unreachable";
    details.commission_additional_column = "Skipped: database unreachable";
  }

  try {
    const { error } = await withTimeout(
      supabaseAdmin.storage.from("pannecomissions").list("", { limit: 1 }),
      "storage"
    );
    checks.storage_bucket = !error;
    if (error) {
      missing.push(`storage bucket 'pannecomissions' (${error.message})`);
      details.storage_bucket = error.message;
    }
  } catch (e) {
    checks.storage_bucket = false;
    const msg = e instanceof Error ? e.message : "Unknown storage error";
    missing.push(`storage bucket 'pannecomissions' (${msg})`);
    details.storage_bucket = msg;
  }

  return {
    ok: missing.length === 0,
    checks,
    missing,
    details,
    fix: missing.length > 0 ? "Review the errors below and check Supabase console" : null,
  };
}
