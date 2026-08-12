import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await prisma.contactSubmission.create({
      data: body,
    });

    await sendEmail({
      to: body.email,
      subject: "Contact Message Received",
      content: "Thank you for contacting us. We will get back to you soon.",
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact" }, { status: 500 });
  }
}
