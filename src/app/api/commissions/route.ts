import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission = await prisma.CommissionSubmission.create({
      data: body,
    });

    await sendDiscordWebhook({
      type: "commission",
      data: submission,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to submit commission:", error);
    return NextResponse.json({ error: "Failed to submit commission" }, { status: 500 });
  }
}


