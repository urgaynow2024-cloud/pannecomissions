"use client";

import { useState, useEffect } from "react";

const KEYS = [
  "site_name",
  "hero_title",
  "hero_subtitle",
  "hero_description",
  "about_text",
  "commission_cta",
  "portfolio_heading",
  "reviews_heading",
  "pricing_heading",
  "footer_description",
  "support_info",
];

const FIELD_LABELS: Record<string, { label: string; type: "input" | "textarea" }> = {
  site_name: { label: "Site Name", type: "input" },
  hero_title: { label: "Hero Title", type: "input" },
  hero_subtitle: { label: "Hero Subtitle", type: "input" },
  hero_description: { label: "Hero Description", type: "textarea" },
  about_text: { label: "About Text", type: "textarea" },
  commission_cta: { label: "Commission CTA", type: "textarea" },
  portfolio_heading: { label: "Portfolio Heading", type: "input" },
  reviews_heading: { label: "Reviews Heading", type: "input" },
  pricing_heading: { label: "Pricing Heading", type: "input" },
  footer_description: { label: "Footer Description", type: "textarea" },
  support_info: { label: "Support Info", type: "textarea" },
};

export default function ContentPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setData(data);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setMessage({ type: "success", text: "Changes saved successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (message) setMessage(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-white/5 rounded animate-pulse w-32" />
              <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Site Content</h1>
        <p className="text-gray-400 mt-1">Edit text shown on the public website.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {KEYS.map((key) => {
            const field = FIELD_LABELS[key] || { label: key.replace(/_/g, " "), type: "input" };
            const isLong = field.type === "textarea";
            return (
              <div key={key} className={isLong ? "lg:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                {isLong ? (
                  <textarea
                    value={data[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none transition-colors resize-y"
                  />
                ) : (
                  <input
                    value={data[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>

        {message && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && message.type === "success" && (
            <span className="text-sm text-green-400 flex items-center">Saved</span>
          )}
        </div>
      </form>
    </div>
  );
}
