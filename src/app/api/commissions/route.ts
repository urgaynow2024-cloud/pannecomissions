import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission = await prisma.commissionSubmission.create({
      data: body,
    });

    await sendDiscordWebhook({
      type: "commission",
      data: submission,
    });

    await sendEmail({
      to: body.email,
      subject: "Commission Enquiry Received",
      content: "Thank you for your commission enquiry. We will get back to you soon.",
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit commission" }, { status: 500 });
  }
}
