"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Image as ImageIcon, Search, Upload, Trash2, Copy, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  alt_text: string | null;
  filename: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  image_url: string | null;
}

interface ContentData {
  hero_image_url: string;
  about_image_url: string;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<ContentData | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }, []);

  async function fetchMedia() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media-library");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load media");
      }
      const json = await res.json();
      setItems(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsage() {
    try {
      const [servicesRes, contentRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/content"),
      ]);
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data);
      }
      if (contentRes.ok) {
        const data = await contentRes.json();
        setContent({ hero_image_url: data.hero_image_url || "", about_image_url: data.about_image_url || "" });
      }
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchMedia();
    fetchUsage();
  }, []);

  function getUsageForUrl(url: string): { type: "service" | "hero" | "about"; label: string }[] {
    const usages: { type: "service" | "hero" | "about"; label: string }[] = [];
    services.forEach((s) => {
      if (s.image_url === url) {
        usages.push({ type: "service", label: s.name });
      }
    });
    if (content?.hero_image_url === url) {
      usages.push({ type: "hero", label: "Hero Section" });
    }
    if (content?.about_image_url === url) {
      usages.push({ type: "about", label: "About Section" });
    }
    return usages;
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      showToast("error", "Only image files are allowed");
      return;
    }
    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/media-library", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      showToast("success", "Image uploaded successfully");
      await fetchMedia();
      await fetchUsage();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  async function handleDelete(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const usages = getUsageForUrl(item.url);
    if (usages.length > 0) {
      const usageList = usages.map((u) => `• ${u.label}`).join("\n");
      const proceed = confirm(
        `This image is currently used in:\n\n${usageList}\n\nDeleting it will leave these areas with a broken image. Do you want to continue?`
      );
      if (!proceed) return;
    }

    if (!confirm("Delete this image? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/media-library/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      showToast("success", "Image deleted");
      await fetchMedia();
      await fetchUsage();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("success", "URL copied to clipboard");
    } catch {
      showToast("error", "Failed to copy URL");
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (item.filename || "").toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-72 animate-pulse" />
        </div>
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] h-40 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <div className="aspect-square bg-white/5 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-white/5 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Media Library</h1>
          <p className="text-gray-400 mt-1 text-sm">Upload and manage reusable images for your website.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
          <button onClick={() => { fetchMedia(); fetchUsage(); }} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Media Library</h1>
        <p className="text-gray-400 mt-1 text-sm">Upload and manage reusable images for your website.</p>
      </div>

      <div
        className={`relative rounded-xl border-2 border-dashed transition-colors duration-200 ${
          dragOver ? "border-brand-purple-400 bg-brand-purple-500/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${dragOver ? "bg-brand-purple-500/20" : "bg-white/5"}`}>
            <Upload className={`h-6 w-6 ${dragOver ? "text-brand-purple-400" : "text-gray-500"}`} />
          </div>
          <p className="text-sm font-medium text-white mb-1">
            {uploading ? uploadProgress : "Click to browse or drag and drop files here"}
          </p>
          <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, WEBP (max 20MB)</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or URL..."
            className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white text-sm focus:border-brand-purple-400/50 focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => { fetchMedia(); fetchUsage(); }}
          className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
            <ImageIcon className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-1 text-sm font-medium">No images uploaded yet</p>
          <p className="text-gray-500 text-xs mb-4">Upload your first image using the dropzone above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const usages = getUsageForUrl(item.url);
            return (
              <div key={item.id} className="group relative rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-200">
                <div className="aspect-square bg-black relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt_text || item.filename || "Media"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23111'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {usages.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {usages.map((u, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            u.type === "hero"
                              ? "bg-green-500/80 text-white"
                              : u.type === "about"
                              ? "bg-blue-500/80 text-white"
                              : "bg-brand-purple-500/80 text-white"
                          }`}
                        >
                          {u.type === "hero" ? "Hero" : u.type === "about" ? "About" : u.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                      className="rounded-lg bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-white truncate font-mono" title={item.filename || item.url}>
                    {item.filename || item.url.split("/").pop()}
                  </p>
                  <p className="text-[10px] text-gray-500">{formatBytes(item.file_size)}</p>
                  <p className="text-[10px] text-gray-500">{formatDate(item.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="text-xs text-gray-500">
          Showing {filteredItems.length} of {items.length} images
          {search && ` matching "${search}"`}
        </div>
      )}

      {items.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white font-display mb-4">Current Usage</h3>
          <div className="space-y-3">
            {items.map((item) => {
              const usages = getUsageForUrl(item.url);
              if (usages.length === 0) return null;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] shrink-0 flex items-center justify-center">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.filename || item.url.split("/").pop()}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {usages.map((u, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            u.type === "hero"
                              ? "bg-green-500/10 text-green-400"
                              : u.type === "about"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-brand-purple-500/10 text-brand-purple-400"
                          }`}
                        >
                          {u.type === "hero" ? "Hero" : u.type === "about" ? "About" : u.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
          <button onClick={() => setToast(null)} className="ml-1 opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
