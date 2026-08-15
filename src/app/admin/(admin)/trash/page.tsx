"use client";

import { useState, useEffect } from "react";

interface TrashItem {
  id: string;
  display_title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  featured: boolean;
  visible: boolean;
  nsfw: boolean;
  deleted_at: string;
  photos: { id: string; url: string }[];
}

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"restore" | "permanent" | null>(null);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/trash");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load trash");
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleRestore(id: string) {
    const res = await fetch(`/api/admin/trash?action=restore&id=${id}`, { method: "GET" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
    setActionId(null);
    setActionType(null);
  }

  async function handlePermanentDelete(id: string) {
    const res = await fetch(`/api/admin/trash?action=permanent-delete&id=${id}`, { method: "GET" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
    }
    setActionId(null);
    setActionType(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Trash</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/5 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-white/5 rounded animate-pulse w-1/4" />
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
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Trash</h1>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={fetchItems} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Trash</h1>
        <p className="text-gray-400 mt-1 text-sm">Deleted items. Restore or permanently delete.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-white/10">
          <p className="text-gray-400 text-sm">Trash is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4">
              <img src={item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">{item.display_title || "Untitled"}</p>
                <p className="text-xs text-gray-500 truncate">{item.category || "No category"} • Deleted {new Date(item.deleted_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setActionId(item.id); setActionType("restore"); }} className="rounded-lg border border-green-500/30 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/5 transition-colors">Restore</button>
                <button onClick={() => { setActionId(item.id); setActionType("permanent"); }} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5 transition-colors">Delete Forever</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {actionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white font-display text-center mb-2">
              {actionType === "restore" ? "RESTORE THIS ITEM?" : "PERMANENTLY DELETE?"}
            </h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              {actionType === "restore" ? "This will move the item back to its original location." : "This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setActionId(null); setActionType(null); }} className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
              {actionType === "restore" ? (
                <button onClick={() => handleRestore(actionId)} className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors">Restore</button>
              ) : (
                <button onClick={() => handlePermanentDelete(actionId)} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors">Delete Forever</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
