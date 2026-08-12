export async function sendDiscordWebhook({
  type,
  data,
}: {
  type: "commission" | "review" | "support";
  data: Record<string, unknown>;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL not configured");
    return;
  }

  let content = "";

  switch (type) {
    case "commission":
      content = `🎨 **New Commission Enquiry**\nClient: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\nDescription: ${data.description}\nStatus: ${data.status}`;
      break;
    case "review":
      content = `⭐ **New Review**\nClient: ${data.clientName}\nRating: ${data.rating}/5\nMessage: ${data.message}`;
      break;
    case "support":
      content = `🛠️ **New Support Request**\nClient: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
      break;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
    throw error;
  }
}
