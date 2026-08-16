"use client";

import { useState, useEffect } from "react";

interface ContentData {
  hero_title: string;
  hero_subtitle: string;
  marquee_text: string;
  commission_available: string;
  commission_status_text: string;
  about_text: string;
  cta_text: string;
  about_image_url: string;
  hero_image_url: string;
  featured_work_heading: string;
}

function MediaLibraryPicker({
  open,
  onClose,
  onSelect,
  currentUrl,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl: string;
}) {
  const [media, setMedia] = useState<{ id: string; url: string; filename: string; file_size: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchMedia() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/media-library");
        if (res.ok) {
          const json = await res.json();
          setMedia(json);
        }
      } catch {}
      setLoading(false);
    }
    fetchMedia();
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/admin/media-library", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const res2 = await fetch("/api/admin/media-library");
        if (res2.ok) {
          const json = await res2.json();
          setMedia(json);
        }
      }
    } catch {}
    setUploading(false);
    e.target.value = "";
  }

  function handleSelect(url: string) {
    onSelect(url);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-xl border border-white/10 bg-brand-dark p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white font-display">Select Image</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:border-brand-purple-400/50 hover:text-white transition-colors cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {uploading ? "Uploading..." : "Upload New"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading media library...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No images in media library.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {media.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:opacity-80 ${
                  currentUrl === item.url ? "border-brand-purple-400 ring-2 ring-brand-purple-400/30" : "border-white/5"
                }`}
              >
                <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-[10px] text-gray-300 truncate">{item.filename}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  pickerOpen,
  onOpenPicker,
  onClosePicker,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  pickerOpen: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5">
          <img src={value} alt={label} className="w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenPicker}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:border-brand-purple-400/50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Select from Media Library
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      {value && (
        <p className="text-xs text-gray-500 break-all">{value}</p>
      )}
      <MediaLibraryPicker
        open={pickerOpen}
        onClose={onClosePicker}
        onSelect={onChange}
        currentUrl={value}
      />
    </div>
  );
}

export default function ContentPage() {
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [featuredWorkHeading, setFeaturedWorkHeading] = useState("");
  const [showHeroPicker, setShowHeroPicker] = useState(false);
  const [showAboutPicker, setShowAboutPicker] = useState(false);

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
        hero_image_url: json.hero_image_url || "",
        featured_work_heading: json.featured_work_heading || "",
      });
      setHeroImageUrl(json.hero_image_url || "");
      setAboutImageUrl(json.about_image_url || "");
      setFeaturedWorkHeading(json.featured_work_heading || "");
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
      const payload = {
        ...data,
        hero_image_url: heroImageUrl,
        about_image_url: aboutImageUrl,
        featured_work_heading: featuredWorkHeading,
      };
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      setData({
        ...payload,
      });
      setMessage({ type: "success", text: "Content updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
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
            <input value={data.hero_title} onChange={(e) => setData({ ...data, hero_title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. VRchat Commissions" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hero Subtitle</label>
            <textarea value={data.hero_subtitle} onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={2} placeholder="Short description under the title" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Marquee</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Marquee Text</label>
            <input value={data.marquee_text} onChange={(e) => setData({ ...data, marquee_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="Text that scrolls horizontally" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Commissions</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Commission Availability</label>
            <select value={data.commission_available} onChange={(e) => setData({ ...data, commission_available: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors">
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Commission Status Text</label>
            <input value={data.commission_status_text} onChange={(e) => setData({ ...data, commission_status_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. Open for commissions" />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">About & Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">About Text</label>
            <textarea value={data.about_text} onChange={(e) => setData({ ...data, about_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} placeholder="About section text" />
          </div>
          <ImageField
            label="About Section Image"
            value={aboutImageUrl}
            onChange={setAboutImageUrl}
            pickerOpen={showAboutPicker}
            onOpenPicker={() => setShowAboutPicker(true)}
            onClosePicker={() => setShowAboutPicker(false)}
          />
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Homepage Images</h3>

          <ImageField
            label="Hero Image"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            pickerOpen={showHeroPicker}
            onOpenPicker={() => setShowHeroPicker(true)}
            onClosePicker={() => setShowHeroPicker(false)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Featured Work Heading</label>
            <input
              value={featuredWorkHeading}
              onChange={(e) => setFeaturedWorkHeading(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
              placeholder="Heading above the featured work section"
            />
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
