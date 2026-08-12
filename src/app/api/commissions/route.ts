import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit commission" }, { status: 500 });
  }
}
