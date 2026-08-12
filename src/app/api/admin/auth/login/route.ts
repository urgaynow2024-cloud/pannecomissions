import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword, getAdmin, ensureAdminExists, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const trimmedPassword = password.trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const passwordHash = await hashPassword(adminPassword.trim());
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
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = crypto.randomUUID();
    await createSession(admin.id, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
