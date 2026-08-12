"use client";

import { useState, useEffect } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  alt_text: string | null;
  image_url: string;
  featured: boolean;
  visible: boolean;
  sort_order: number;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", altText: "", featured: false });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/portfolio");
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
    fd.append("featured", String(formData.featured));
    if (file) fd.append("image", file);

    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : "/api/admin/portfolio";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Save failed");
      await fetchItems();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio image?")) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  }

  async function handleEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description || "", altText: item.alt_text || "", featured: item.featured });
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
        fetch(`/api/admin/portfolio/${item.id}`, {
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
    setFormData({ title: "", description: "", altText: "", featured: false });
    setFile(null);
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Portfolio</h1>
            <p className="text-gray-400 mt-1">Manage SFW portfolio images.</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Upload Image
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">{editingId ? "Edit Image" : "Upload Image"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Alt Text</label>
              <input value={formData.altText} onChange={(e) => setFormData({ ...formData, altText: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <input id="featured" type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
              <label htmlFor="featured" className="text-sm text-gray-300">Featured</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-400" required={!editingId} />
              {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Cancel</button>
            </div>
          </form>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No portfolio images yet.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">Upload First Image</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div key={item.id} draggable onDragOver={(e) => e.preventDefault()} onDragStart={() => setDragId(item.id)} onDrop={(e) => { e.preventDefault(); if (dragId) handleReorder(items.findIndex((i) => i.id === dragId), idx); }} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="aspect-[4/3] bg-black relative">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  {item.featured && <span className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded">Featured</span>}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-white truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400">Visible: {item.visible ? "Yes" : "No"}</p>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleEdit(item)} className="flex-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
