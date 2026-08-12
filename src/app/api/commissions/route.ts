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

    try {
      await sendEmail({
        to: body.email,
        subject: "Commission Enquiry Received",
        content: "Thank you for your commission enquiry. I will get back to you soon.",
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to submit commission:", error);
    return NextResponse.json({ error: "Failed to submit commission" }, { status: 500 });
  }
}
