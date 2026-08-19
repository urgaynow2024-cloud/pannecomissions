"use client";

import { useState, useEffect } from "react";

interface PricingItem {
  id: string;
  name: string;
  min_price: number | null;
  max_price: number | null;
  description: string | null;
  visible: boolean;
  sort_order: number;
  category: string;
}

const PRESET_TIERS = [
  { label: "Custom Textures", min: 5, max: 25 },
  { label: "Complete Avatars", min: 55, max: 100 },
  { label: "Models", min: 65, max: 150 },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="h-5 bg-white/5 rounded animate-pulse w-32" />
      <div className="h-4 bg-white/5 rounded animate-pulse w-24" />
      <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-400 mb-4 text-sm">No pricing tiers yet.</p>
      <button onClick={onAdd} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
        Add First Tier
      </button>
    </div>
  );
}

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", min_price: "", max_price: "", description: "", visible: true, sort_order: 0, category: "sfw" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})${data.diagnosticId ? ` [ID: ${data.diagnosticId}]` : ""}`);
      }
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
      const url = editingId ? `/api/admin/pricing/${editingId}` : "/api/admin/pricing";
      const method = editingId ? "PUT" : "POST";
      const body = {
        ...formData,
        min_price: formData.min_price ? parseFloat(formData.min_price) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        sort_order: parseInt(String(formData.sort_order), 10) || 0,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
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
    if (!confirm("Delete this pricing tier?")) return;
    const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
  }

  function handleEdit(item: PricingItem) {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      min_price: item.min_price?.toString() || "",
      max_price: item.max_price?.toString() || "",
      description: item.description || "",
      visible: item.visible,
      sort_order: item.sort_order,
      category: item.category,
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", min_price: "", max_price: "", description: "", visible: true, sort_order: 0, category: "sfw" });
  }

  function applyPreset(min: number, max: number) {
    setFormData((prev) => ({ ...prev, min_price: min.toString(), max_price: max.toString() }));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-28 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-40 animate-pulse" />
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Pricing</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage pricing tiers.</p>
        </div>
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
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Pricing</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage pricing tiers.</p>
      </div>

      {!showForm && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">Quick add:</span>
          {PRESET_TIERS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setEditingId(null);
                setFormData({ name: preset.label, min_price: preset.min.toString(), max_price: preset.max.toString(), description: "", visible: true, sort_order: items.length, category: "sfw" });
                setShowForm(true);
              }}
              className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-brand-purple-500/30 hover:bg-brand-purple-500/5 transition-all"
            >
              {preset.label} (${preset.min}–${preset.max})
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-brand-purple-500/20 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white font-display">{editingId ? "Edit Pricing" : "New Pricing Tier"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. Textures, Model" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Price ($)</label>
              <input type="number" value={formData.min_price} onChange={(e) => setFormData({ ...formData, min_price: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Price ($)</label>
              <input type="number" value={formData.max_price} onChange={(e) => setFormData({ ...formData, max_price: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="25" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={2} placeholder="Optional description" />
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
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-white font-display">{item.name}</h3>
                  <p className="text-[10px] font-medium text-brand-purple-400 mt-0.5 uppercase tracking-wider">{item.category}</p>
                </div>
                {item.visible ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">Visible</span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 shrink-0">Hidden</span>
                )}
              </div>
              <div className="mb-3">
                <span className="text-2xl font-bold text-white font-display">
                  {item.min_price !== null && item.max_price !== null ? `$${item.min_price.toFixed(2)} – $${item.max_price.toFixed(2)}` : item.min_price !== null ? `From $${item.min_price.toFixed(2)}` : item.max_price !== null ? `Up to $${item.max_price.toFixed(2)}` : "No price"}
                </span>
              </div>
              {item.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>}
              <div className="flex gap-2 pt-3 border-t border-white/5">
                <button onClick={() => handleEdit(item)} className="flex-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
