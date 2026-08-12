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

export async function getAdmin() {
  return prisma.AdminUser.findFirst({
    select: { id: true, username: true },
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

export async function createSession(adminId: string, token: string) {
  const tokenHash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.Session.create({
    data: { adminId, tokenHash, expiresAt },
  });

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sessions = await prisma.Session.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { admin: true },
  });

  for (const session of sessions) {
    if (await bcrypt.compare(token, session.tokenHash)) {
      return session.admin ? { id: session.admin.id, username: session.admin.username } : null;
    }
  }

  return null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const sessions = await prisma.Session.findMany();
    for (const session of sessions) {
      if (await bcrypt.compare(token, session.tokenHash)) {
        await prisma.Session.delete({ where: { id: session.id } });
        break;
      }
    }
  }

  cookieStore.delete(SESSION_COOKIE);
}


