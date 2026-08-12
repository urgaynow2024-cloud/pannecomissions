import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await verifySession();
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: admin });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

