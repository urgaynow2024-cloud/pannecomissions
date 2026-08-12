import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured");
    return;
  }

  try {
    await resend.emails.send({
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
