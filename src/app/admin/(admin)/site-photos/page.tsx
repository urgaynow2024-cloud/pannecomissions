"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Trash2, ImageIcon, ExternalLink, RefreshCw, Check, X } from "lucide-react";

interface SitePhoto {
  id: string;
  slug: string;
  url: string | null;
  alt_text: string | null;
}

const SLOT_CONFIG: Record<string, { label: string; description: string; wide?: boolean }> = {
  hero: { label: "Homepage — Main Hero", description: "Main hero background image", wide: true },
  "clothing-addons": { label: "Clothing Add-ons", description: "Homepage service image" },
  "complete-avatars": { label: "Complete Avatars", description: "Homepage service image" },
  toggles: { label: "Toggles", description: "Homepage service image" },
  "custom-textures": { label: "Custom Textures", description: "Homepage service image" },
  models: { label: "Models", description: "Homepage service image", wide: true },
};

export default function SitePhotosPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const res = await fetch("/api/admin/site-photos");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setPhotos(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load site photos" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(slug: string, file: File) {
    setUploading(slug);
    setUploadProgress((prev) => ({ ...prev, [slug]: 0 }));
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("slug", slug);
      const res = await fetch("/api/admin/site-photos/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const photo = await res.json();
      setPhotos((prev) => prev.map((p) => (p.slug === slug ? photo : p)));
      setUploadProgress((prev) => ({ ...prev, [slug]: 100 }));
      setMessage({ type: "success", text: `${SLOT_CONFIG[slug]?.label || slug} updated` });
      setTimeout(() => {
        setMessage(null);
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[slug];
          return next;
        });
      }, 2000);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed" });
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
    } finally {
      setUploading(null);
    }
  }

  async function handleRemove(slug: string) {
    setRemoving(slug);
    try {
      const res = await fetch(`/api/admin/site-photos/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Remove failed");
      }
      setPhotos((prev) => prev.map((p) => (p.slug === slug ? { ...p, url: null, alt_text: null } : p)));
      setMessage({ type: "success", text: `${SLOT_CONFIG[slug]?.label || slug} removed` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Remove failed" });
    } finally {
      setRemoving(null);
    }
  }

  function handleDragOver(slug: string, e: React.DragEvent) {
    e.preventDefault();
    setDragOver(slug);
  }

  function handleDragLeave(slug: string) {
    setDragOver(null);
  }

  function handleDrop(slug: string, e: React.DragEvent) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(slug, file);
    }
  }

  const openHomepage = useCallback(() => {
    window.open("/", "_blank");
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/5 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
              <div className="h-6 bg-white/5 rounded w-40 animate-pulse" />
              <div className="aspect-video bg-white/5 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-2">Admin / Website</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display heading-pop">Site Photos</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Manage the images displayed throughout the public website.</p>
        </div>
        <button
          onClick={openHomepage}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Preview Homepage
        </button>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 ${
            message.type === "success"
              ? "border-green-500/20 bg-green-500/5 text-green-400"
              : "border-red-500/20 bg-red-500/5 text-red-400"
          }`}
        >
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos.map((photo) => {
          const config = SLOT_CONFIG[photo.slug] || { label: photo.slug, description: "" };
          const isUploading = uploading === photo.slug;
          const isDragOver = dragOver === photo.slug;
          const progress = uploadProgress[photo.slug] || 0;
          const hasImage = !!photo.url;

          return (
            <div
              key={photo.slug}
              className={`rounded-2xl border bg-white/[0.02] overflow-hidden transition-all duration-200 ${
                hasImage
                  ? "border-white/5 hover:border-white/10"
                  : "border-dashed border-white/10 hover:border-white/20"
              } ${config.wide ? "md:col-span-2" : ""}`}
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white font-display text-sm">{config.label}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{config.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {hasImage ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      <Check className="h-3 w-3" />
                      Image assigned
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <X className="h-3 w-3" />
                      No image assigned
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div
                  className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
                    hasImage
                      ? "aspect-video border border-white/5 bg-white/[0.02]"
                      : "aspect-video border-2 border-dashed border-white/10 bg-white/[0.01]"
                  } ${isDragOver ? "border-brand-purple-400 bg-brand-purple-500/5 scale-[1.01]" : ""}`}
                  onDragOver={(e) => handleDragOver(photo.slug, e)}
                  onDragLeave={() => handleDragLeave(photo.slug)}
                  onDrop={(e) => handleDrop(photo.slug, e)}
                >
                  {hasImage ? (
                    <>
                      <img
                        src={photo.url!}
                        alt={photo.alt_text || config.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && handleUpload(photo.slug, e.target.files[0])}
                              disabled={isUploading}
                            />
                            <div className="flex items-center gap-2 rounded-lg bg-brand-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-purple-500 transition-colors shadow-lg">
                              <Upload className="h-3.5 w-3.5" />
                              Replace Image
                            </div>
                          </label>
                          <button
                            onClick={() => handleRemove(photo.slug)}
                            disabled={removing === photo.slug}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors shadow-lg disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUpload(photo.slug, e.target.files[0])}
                        disabled={isUploading}
                      />
                      <div className="text-center space-y-3 p-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragOver ? "bg-brand-purple-500/20" : "bg-white/5"}`}>
                          <Upload className={`h-8 w-8 transition-colors ${isDragOver ? "text-brand-purple-400" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300">No image assigned</p>
                          <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-lg border border-brand-purple-500/30 bg-brand-purple-500/10 px-4 py-2 text-xs font-medium text-brand-purple-400 hover:bg-brand-purple-500/20 transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          Add Image
                        </div>
                      </div>
                    </label>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center space-y-3 p-6">
                        <div className="relative w-16 h-16 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                          <div
                            className="absolute inset-0 rounded-full border-4 border-brand-purple-500 border-t-transparent animate-spin"
                            style={{ clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">{progress}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-white font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>

                {hasImage && !isUploading && (
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                            <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUpload(photo.slug, e.target.files[0])}
                        disabled={isUploading}
                      />
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-brand-purple-500/30 bg-brand-purple-500/10 px-4 py-2.5 text-xs font-medium text-brand-purple-400 hover:bg-brand-purple-500/20 transition-colors disabled:opacity-50">
                        <Upload className="h-3.5 w-3.5" />
                        Replace Image
                      </div>
                    </label>
                    <button
                      onClick={() => handleRemove(photo.slug)}
                      disabled={removing === photo.slug}
                      className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
