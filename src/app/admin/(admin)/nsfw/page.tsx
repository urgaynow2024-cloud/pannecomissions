"use client";

import { useState, useEffect } from "react";

interface NSFWItem {
  id: string;
  title: string;
  description: string | null;
  alt_text: string | null;
  image_url: string;
  visible: boolean;
  sort_order: number;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="aspect-[4/3] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-white/5 rounded animate-pulse flex-1" />
          <div className="h-8 bg-white/5 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-gray-400 mb-4 text-sm">No NSFW images yet.</p>
      <button onClick={onUpload} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
        Upload First Image
      </button>
    </div>
  );
}

export default function NSFWPortfolioPage() {
  const [items, setItems] = useState<NSFWItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", altText: "", visible: true });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/nsfw");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("altText", formData.altText);
    fd.append("visible", String(formData.visible));
    if (file) fd.append("image", file);

    try {
      const url = editingId ? `/api/admin/nsfw/${editingId}` : "/api/admin/nsfw";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      await fetchItems();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this NSFW image?")) return;
    const res = await fetch(`/api/admin/nsfw/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  }

  function handleEdit(item: NSFWItem) {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description || "", altText: item.alt_text || "", visible: item.visible });
    setFile(null);
    setShowForm(true);
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);

    await Promise.all(
      newItems.map((item, idx) =>
        fetch(`/api/admin/nsfw/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: idx }),
        })
      )
    );
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", description: "", altText: "", visible: true });
    setFile(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/5 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-white/5 rounded w-72 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">NSFW Portfolio</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage NSFW portfolio images separately.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={fetchItems} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">NSFW Portfolio</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage NSFW portfolio images separately.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
          Upload Image
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white font-display">{editingId ? "Edit Image" : "Upload Image"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alt Text</label>
              <input value={formData.altText} onChange={(e) => setFormData({ ...formData, altText: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-purple-600 file:text-white hover:file:bg-brand-purple-500 file:cursor-pointer" required={!editingId} />
              {file && <span className="text-xs text-gray-500">{file.name}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
            <span className="text-sm text-gray-300">Visible</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState onUpload={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDragStart={() => setDragId(item.id)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (dragId) handleReorder(items.findIndex((i) => i.id === dragId), idx); }}
              className={`group rounded-xl border bg-white/[0.02] overflow-hidden transition-all duration-200 ${dragOver ? "border-brand-purple-400/50 scale-[1.02]" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="aspect-[4/3] bg-black relative overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {!item.visible && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/60 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-white truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 truncate">{item.alt_text || "No alt text"}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleEdit(item)} className="flex-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
