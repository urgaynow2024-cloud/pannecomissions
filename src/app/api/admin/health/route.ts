import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
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
  const t0 = performance.now();
  try {
    await requireAdmin();
    const t1 = performance.now();
    const health = await runHealthChecks();
    console.log(`[health] id=${diagnosticId} total=${(performance.now() - t0).toFixed(1)}ms auth=${(t1 - t0).toFixed(1)}ms checks=${(performance.now() - t1).toFixed(1)}ms`);

    return NextResponse.json({
      ...health,
      diagnosticId,
    });
  } catch (error) {
    console.error(`[${diagnosticId}] Health check failed: ${(performance.now() - t0).toFixed(1)}ms`, error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED", diagnosticId }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ error: message, code: "SERVER_ERROR", diagnosticId, details: { checks: {}, missing: [], details: {} } }, { status: 500 });
  }
}
