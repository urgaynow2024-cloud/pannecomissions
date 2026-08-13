import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.client_name || !body.email || !body.service) {
      return NextResponse.json({ error: "Name, email, and service are required" }, { status: 400 });
    }

    const submission = await prisma.CommissionSubmission.create({
      data: {
        client_name: String(body.client_name).trim(),
        email: String(body.email).trim(),
        service: String(body.service).trim(),
        description: body.description ? String(body.description).trim() : null,
        additional: body.additional ? String(body.additional).trim() : null,
        nsfw: Boolean(body.nsfw),
        status: "PENDING",
      },
    });

    try {
      await sendDiscordWebhook({
        type: "commission",
        data: {
          client_name: submission.client_name,
          email: submission.email,
          service: submission.service,
          description: submission.description,
          additional: submission.additional,
          status: submission.status,
          nsfw: submission.nsfw,
        },
      });
    } catch (discordError) {
      console.error("Discord webhook failed:", discordError);
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Failed to submit commission:", error);
    return NextResponse.json({ error: "Failed to submit commission" }, { status: 500 });
  }
}


