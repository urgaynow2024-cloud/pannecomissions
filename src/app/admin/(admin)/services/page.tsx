"use client";

import { useState, useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "", sort_order: 0, visible: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/services");
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
    try {
      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  }

  function handleEdit(item: Service) {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "", image_url: item.image_url || "", sort_order: item.sort_order, visible: item.visible });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", image_url: "", sort_order: 0, visible: true });
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Services</h1>
            <p className="text-gray-400 mt-1">Manage service offerings.</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Add Service
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">{editingId ? "Edit Service" : "New Service"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
              <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
              <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <input id="visible" type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} />
              <label htmlFor="visible" className="text-sm text-gray-300">Visible</label>
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
            <p className="text-gray-400 mb-4">No services yet.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">Add First Service</button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description || "No description"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
