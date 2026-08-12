import { NextResponse } from "next/server";
import { verifyPassword, ensureAdminExists, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const passwordHash = await import("@/lib/auth").then((m) => m.hashPassword(adminPassword));
    await ensureAdminExists(passwordHash);

    const admin = await import("@/lib/auth").then((m) => m.getAdmin());
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = crypto.randomUUID();
    await createSession(admin.id, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

