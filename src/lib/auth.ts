import { cookies } from "next/headers";

export async function verifyAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");

  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return false;
  }

  return true;
}

export async function requireAuth() {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    throw new Error("Unauthorized");
  }
}
