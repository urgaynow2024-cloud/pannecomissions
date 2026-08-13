import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

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
    } catch (e) {
      checks.photos_table = false;
      missing.push("photos table");
    }

    try {
      await prisma.$queryRaw`SELECT additional FROM commission_submissions LIMIT 1`;
      checks.commission_additional_column = true;
    } catch (e) {
      checks.commission_additional_column = false;
      missing.push("commission_submissions.additional column");
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
      }
    } catch (e) {
      checks.storage_bucket = false;
      missing.push("storage bucket 'pannecomissions'");
    }

    return NextResponse.json({
      ok: missing.length === 0,
      checks,
      missing,
      fix: missing.length > 0 ? "Fix the items below in Supabase" : null,
    });
  } catch (error) {
    console.error("[Health] Failed:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
