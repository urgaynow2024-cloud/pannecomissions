import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const SESSION_COOKIE = "admin-session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

let cachedAdminPasswordHash: string | null = null;

export async function getCachedAdminPasswordHash(): Promise<string> {
  if (cachedAdminPasswordHash) return cachedAdminPasswordHash;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("Server misconfigured: ADMIN_PASSWORD is not set");
  }

  cachedAdminPasswordHash = await hashPassword(adminPassword.trim());
  return cachedAdminPasswordHash;
}

export async function getAdmin() {
  return prisma.AdminUser.findFirst({
    select: { id: true, username: true, password_hash: true },
  });
}

export async function ensureAdminExists(passwordHash: string) {
  const existing = await prisma.AdminUser.findFirst();
  if (!existing) {
    await prisma.AdminUser.create({
      data: { username: "admin", password_hash: passwordHash },
    });
  }
}

export async function createSession(adminId: string) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  const session = await prisma.Session.create({
    data: { id: sessionId, adminId, expiresAt, tokenHash: sessionId },
  });

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function verifySession() {
  const start = performance.now();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    console.log(`[auth] verifySession no cookie: ${(performance.now() - start).toFixed(1)}ms`);
    return null;
  }

  const session = await prisma.Session.findUnique({
    where: { id: sessionId },
    include: { admin: true },
  });

  if (!session || session.expiresAt < new Date()) {
    console.log(`[auth] verifySession invalid/expired: ${(performance.now() - start).toFixed(1)}ms`);
    return null;
  }

  console.log(`[auth] verifySession ok: ${(performance.now() - start).toFixed(1)}ms`);
  return session.admin ? { id: session.admin.id, username: session.admin.username } : null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    try {
      await prisma.Session.delete({ where: { id: sessionId } });
    } catch {
      // Session already deleted or invalid
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}
