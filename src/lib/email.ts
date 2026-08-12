import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendEmail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  const client = getResendClient();

  if (!client) {
    console.warn("RESEND_API_KEY not configured");
    return;
  }

  try {
    await client.emails.send({
      from: "Panne Commissions <noreply@pannecomissions.shop>",
      to,
      subject,
      html: `<p>${content}</p>`,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
