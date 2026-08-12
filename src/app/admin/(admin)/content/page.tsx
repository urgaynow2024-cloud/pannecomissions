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

export default function ContentPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      alert(err instanceof Error ? err.message : "Failed to load");
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
      if (!res.ok) throw new Error("Save failed");
      setMessage("Changes saved successfully.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Site Content</h1>
        <p className="text-gray-400 mt-1">Edit text shown on the public website.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {KEYS.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{key.replace(/_/g, " ")}</label>
              {key.includes("description") || key.includes("text") || key.includes("message") ? (
                <textarea value={data[key] || ""} onChange={(e) => handleChange(key, e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
              ) : (
                <input value={data[key] || ""} onChange={(e) => handleChange(key, e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
              )}
            </div>
          ))}
        </div>

        {message && <p className="text-green-400 text-sm">{message}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
