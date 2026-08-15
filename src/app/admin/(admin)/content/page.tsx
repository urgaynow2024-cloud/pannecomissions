"use client";

import { useState, useEffect } from "react";
import ImageManager from "@/components/admin/ImageManager";

interface ContentData {
  hero_title: string;
  hero_subtitle: string;
  marquee_text: string;
  commission_available: string;
  commission_status_text: string;
  about_text: string;
  cta_text: string;
  about_image_url: string;
}

export default function ContentPage() {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }
      const json = await res.json();
      setData({
        hero_title: json.hero_title || "",
        hero_subtitle: json.hero_subtitle || "",
        marquee_text: json.marquee_text || "",
        commission_available: json.commission_available || "true",
        commission_status_text: json.commission_status_text || "",
        about_text: json.about_text || "",
        cta_text: json.cta_text || "",
        about_image_url: json.about_image_url || "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load content" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      setMessage({ type: "success", text: "Content updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof ContentData, value: string) {
    if (!data) return;
    setData({ ...data, [field]: value });
    if (message) setMessage(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-72 animate-pulse" />
        </div>
        <div className="space-y-4">
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

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Content</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage homepage text and commission availability.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{message?.text || "Failed to load content"}</p>
          <button onClick={fetchContent} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Content</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage homepage text and commission availability.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Hero Section</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hero Title</label>
            <input value={data.hero_title} onChange={(e) => handleChange("hero_title", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. VRchat Commissions" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hero Subtitle</label>
            <textarea value={data.hero_subtitle} onChange={(e) => handleChange("hero_subtitle", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={2} placeholder="Short description under the title" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Marquee</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Marquee Text</label>
            <input value={data.marquee_text} onChange={(e) => handleChange("marquee_text", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="Text that scrolls horizontally" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Commissions</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Commission Availability</label>
            <select value={data.commission_available} onChange={(e) => handleChange("commission_available", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors">
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Commission Status Text</label>
            <input value={data.commission_status_text} onChange={(e) => handleChange("commission_status_text", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. Open for commissions" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">About & Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">About Text</label>
            <textarea value={data.about_text} onChange={(e) => handleChange("about_text", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} placeholder="About section text" />
          </div>
          <div className="flex flex-col gap-4">
            <ImageManager initialSettings={{ about_image_url: data.about_image_url }} />
          </div>
        </div>

        {message && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-brand-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={fetchContent} className="rounded-lg border border-white/10 px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}