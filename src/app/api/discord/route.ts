import { NextResponse } from "next/server";
import { sendDiscordWebhook } from "@/lib/discord";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await sendDiscordWebhook(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send webhook" }, { status: 500 });
  }
}

