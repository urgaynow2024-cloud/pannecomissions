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

  let embed: any = {};

  switch (type) {
    case "commission":
      embed = {
        title: "✦ NEW COMMISSION REQUEST",
        color: 0x9333ea,
        fields: [
          { name: "Client", value: String(data.client_name || "Unknown"), inline: true },
          { name: "Email", value: String(data.email || "N/A"), inline: true },
          { name: "Service", value: String(data.service || "N/A"), inline: false },
          { name: "Description", value: String(data.description || "None"), inline: false },
          ...(data.additional ? [{ name: "Additional Info", value: String(data.additional), inline: false }] : []),
          { name: "Status", value: String(data.status || "PENDING"), inline: true },
          ...(data.nsfw ? [{ name: "Content", value: "⚠️ 18+ NSFW", inline: true }] : []),
          { name: "Submitted", value: new Date().toLocaleString(), inline: true },
          { name: "Website", value: "https://www.pannecomissions.shop/", inline: false },
        ],
        footer: { text: "Panne Commissions" },
        timestamp: new Date().toISOString(),
      };
      break;
    case "review":
      embed = {
        title: "⭐ NEW REVIEW",
        color: 0xeab308,
        fields: [
          { name: "Client", value: String(data.display_name || "Unknown"), inline: true },
          { name: "Rating", value: `${data.rating || 0}/5`, inline: true },
          { name: "Message", value: String(data.review_text || "N/A"), inline: false },
        ],
        footer: { text: "Panne Commissions" },
        timestamp: new Date().toISOString(),
      };
      break;
    case "support":
      embed = {
        title: "🛠️ NEW SUPPORT REQUEST",
        color: 0x3b82f6,
        fields: [
          { name: "Client", value: String(data.client_name || "Unknown"), inline: true },
          { name: "Email", value: String(data.email || "N/A"), inline: true },
          { name: "Subject", value: String(data.subject || "N/A"), inline: false },
          { name: "Message", value: String(data.message || "N/A"), inline: false },
        ],
        footer: { text: "Panne Commissions" },
        timestamp: new Date().toISOString(),
      };
      break;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
    throw error;
  }
}

