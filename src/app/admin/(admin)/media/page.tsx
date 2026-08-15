"use client";

import { useState, useEffect } from "react";

interface Photo {
  id: string;
  url: string;
  alt_text: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  portfolioItem?: { id: string; display_title: string | null } | null;
  service?: { id: string; name: string } | null;
  review?: { id: string; display_name: string } | null;
}

interface MediaData {
  photos: Photo[];
  total: number;
  counts: { portfolio: number; service: number; review: number };
  orphaned: boolean;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getUsageLabel(photo: Photo) {
  if (photo.portfolioItem) return `Portfolio: ${photo.portfolioItem.display_title || "Untitled"}`;
  if (photo.service) return `Service: ${photo.service.name}`;
  if (photo.review) return `Review: ${photo.review.display_name}`;
  return "Orphaned";
}

function getUsageType(photo: Photo) {
  if (photo.portfolioItem) return "portfolio";
  if (photo.service) return "service";
  if (photo.review) return "review";
  return "orphaned";
}

export default function MediaLibraryPage() {
  const [data, setData] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function fetchMedia() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("filter", filter);
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load media");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedia();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Media Library</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Media Library</h1>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={fetchMedia} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Media Library</h1>
        <p className="text-gray-400 mt-1 text-sm">All uploaded images and their usage.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or URL..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-brand-purple-400/50 focus:outline-none transition-colors"
          />
        </form>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          {["all", "portfolio", "service", "review", "orphaned"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? "bg-brand-purple-600 text-white shadow-lg shadow-brand-purple-600/20" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {f === "all" ? "All" : f === "orphaned" ? "Orphaned" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.photos.map((photo) => (
          <div key={photo.id} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors">
            <div className="aspect-square bg-black relative overflow-hidden">
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23111'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E"; }} />
              {getUsageType(photo) === "orphaned" && (
                <span className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">Orphaned</span>
              )}
            </div>
            <div className="p-3 space-y-1">
              <p className="text-xs text-white truncate font-mono">{photo.url.split("/").pop()}</p>
              <p className="text-[10px] text-gray-500">{formatBytes(photo.file_size)}</p>
              <p className="text-[10px] text-gray-500 truncate">{getUsageLabel(photo)}</p>
            </div>
          </div>
        ))}
      </div>

      {data && data.photos.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-dashed border-white/10">
          <p className="text-gray-400 text-sm">No images found.</p>
        </div>
      )}

      {data && (
        <div className="text-xs text-gray-500">
          Showing {data.total} images {data.orphaned ? `(${data.photos.length} orphaned)` : ""}
          {!data.orphaned && ` — Portfolio: ${data.counts.portfolio}, Services: ${data.counts.service}, Reviews: ${data.counts.review}`}
        </div>
      )}
    </div>
  );
}
