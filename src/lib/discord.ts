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
      const nsfwTag = data.nsfw ? "\n⚠️ **18+ NSFW COMMISSION**\n" : "";
      content = `${nsfwTag}🎨 **New Commission Enquiry**\nClient: ${data.client_name}\nEmail: ${data.email}\nService: ${data.service}\nDescription: ${data.description || "None"}\nStatus: ${data.status}`;
      break;
    case "review":
      content = `⭐ **New Review**\nClient: ${data.display_name}\nRating: ${data.rating}/5\nMessage: ${data.review_text}`;
      break;
    case "support":
      content = `🛠️ **New Support Request**\nClient: ${data.client_name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`;
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

