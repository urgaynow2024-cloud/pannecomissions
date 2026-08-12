import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supportRequest = await prisma.supportRequest.create({
      data: body,
    });

    await sendDiscordWebhook({
      type: "support",
      data: supportRequest,
    });

    await sendEmail({
      to: body.email,
      subject: "Support Request Received",
      content: "Thank you for contacting support. We will get back to you soon.",
    });

    return NextResponse.json(supportRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit support request" }, { status: 500 });
  }
}
