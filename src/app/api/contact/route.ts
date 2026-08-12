import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await prisma.contactSubmission.create({
      data: body,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact" }, { status: 500 });
  }
}
