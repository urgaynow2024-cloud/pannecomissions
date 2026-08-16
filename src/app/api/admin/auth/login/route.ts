import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedAdminPasswordHash, verifyPassword, getAdmin, ensureAdminExists, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const t0 = performance.now();
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const trimmedPassword = password.trim();
    const t1 = performance.now();
    const passwordHash = await getCachedAdminPasswordHash();
    const t2 = performance.now();
    await ensureAdminExists(passwordHash);

    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.password_hash !== passwordHash) {
      await prisma.AdminUser.update({
        where: { id: admin.id },
        data: { password_hash: passwordHash },
      });
    }

    const isValid = await verifyPassword(trimmedPassword, admin.password_hash);
    if (!isValid) {
      console.log(`[login] invalid password total=${(performance.now() - t0).toFixed(1)}ms hash=${(t2 - t1).toFixed(1)}ms`);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await createSession(admin.id);

    console.log(`[login] success total=${(performance.now() - t0).toFixed(1)}ms hash=${(t2 - t1).toFixed(1)}ms`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[login] error total=${(performance.now() - t0).toFixed(1)}ms`, error);
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
