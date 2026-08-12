"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
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
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setMessage({ type: "success", text: "Changes saved successfully. Note: some settings require redeployment to take effect." });
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
          <div className="h-8 bg-white/5 rounded w-28 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-56 animate-pulse" />
        </div>
        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 animate-pulse h-16" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-white/5 rounded animate-pulse w-32" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Read-only environment settings. To update, edit your environment variables and redeploy.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-300 flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>These settings are managed via environment variables. Changes here are for reference only.</p>
        </div>

        <div className="space-y-5">
          {[
            ["site_name", "Site Name"],
            ["site_url", "Site URL"],
            ["social_links", "Social Links"],
            ["footer_text", "Footer Text"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                value={data[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                readOnly
              />
            </div>
          ))}
        </div>

        {message && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={saving} className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition-colors">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
