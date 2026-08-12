import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supportRequest = await prisma.SupportRequest.create({
      data: body,
    });

    await sendDiscordWebhook({
      type: "support",
      data: supportRequest,
    });

    return NextResponse.json(supportRequest, { status: 201 });
  } catch (error) {
    console.error("Failed to submit support request:", error);
    return NextResponse.json({ error: "Failed to submit support request" }, { status: 500 });
  }
}


