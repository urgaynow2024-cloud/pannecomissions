"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  spare_parts: boolean;
  sort_order: number;
  visible: boolean;
  photos?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
}

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="h-5 bg-white/5 rounded animate-pulse w-32" />
      <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
      <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p className="text-gray-400 mb-4 text-sm">No services yet.</p>
      <button onClick={onAdd} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
        Add First Service
      </button>
    </div>
  );
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image_url: "", sort_order: 0, visible: true, spare_parts: false });
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [servicePhotos, setServicePhotos] = useState<{ id: string; url: string; alt_text: string | null }[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
    fetchPortfolio();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/services");
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

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolioItems(data);
      }
    } catch {
      // silent
    }
  }

  async function fetchServicePhotos(serviceId: string) {
    setLoadingPhotos(true);
    try {
      const res = await fetch(`/api/admin/photos?serviceId=${serviceId}`);
      if (res.ok) {
        const data = await res.json();
        setServicePhotos(data);
      }
    } catch {
      // silent
    } finally {
      setLoadingPhotos(false);
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      const saved = await res.json();
      await fetchItems();
      setEditingId(saved.id);
      await fetchServicePhotos(saved.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
      if (editingId === id) resetForm();
    }
  }

function handleEdit(item: Service) {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description || "", image_url: item.image_url || "", sort_order: item.sort_order, visible: item.visible, spare_parts: item.spare_parts || false });
    setShowForm(true);
    setServicePhotos(item.photos || []);
}

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !editingId) return;

    setPhotoUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const fd = new FormData();
      fd.append("image", file);
      fd.append("altText", "");
      fd.append("serviceId", editingId);

      try {
        const res = await fetch("/api/admin/photos", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Upload failed (${res.status})`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Photo upload failed";
        console.error("Photo upload error:", message);
        alert(message);
      }
    }

    await fetchServicePhotos(editingId);
    setPhotoUploading(false);
    e.target.value = "";
  }

  async function handlePhotoDelete(photoId: string) {
    const res = await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" });
    if (res.ok && editingId) {
      setServicePhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  }

function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", image_url: "", sort_order: 0, visible: true, spare_parts: false });
    setServicePhotos([]);
}

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-32 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-48 animate-pulse" />
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Services</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage service offerings.</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Services</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage service offerings.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
          Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white font-display">{editingId ? "Edit Service" : "New Service"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image URL</label>
            <input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">Paste a URL or select from portfolio below.</p>
          </div>

          {portfolioItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Choose Cover from Portfolio</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {portfolioItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: item.image_url })}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      formData.image_url === item.image_url
                        ? "border-brand-purple-400 ring-2 ring-brand-purple-400/30"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <img src={item.image_url} alt={item.display_title || "Portfolio"} className="w-full h-full object-cover" />
                    {item.category && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-medium px-1.5 py-0.5 rounded bg-black/70 text-gray-200 truncate max-w-[calc(100%-0.5rem)]">
                        {item.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editingId && (
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm font-medium text-gray-300 mb-3">Service Photos</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
                {servicePhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group">
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo.id)}
                      className="absolute top-1 right-1 p-1 rounded bg-black/60 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {photoUploading ? "Uploading..." : "Add Photos"}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
              <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" />
            </div>
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
                <span className="text-sm text-gray-300">Visible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.spare_parts} onChange={(e) => setFormData({ ...formData, spare_parts: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
                <span className="text-sm text-gray-300">Spare parts available</span>
              </label>
            </div>
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
        <EmptyState onAdd={() => { resetForm(); setShowForm(true); }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-white truncate font-display">{item.name}</h3>
                </div>
                {item.visible ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">Visible</span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 shrink-0">Hidden</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description || "No description"}</p>
              {item.photos && item.photos.length > 0 && (
                <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                  {item.photos.slice(0, 4).map((photo) => (
                    <img key={photo.id} src={photo.url} alt="" className="h-10 w-10 rounded object-cover border border-white/5 shrink-0" />
                  ))}
                  {item.photos.length > 4 && (
                    <div className="h-10 w-10 rounded bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                      +{item.photos.length - 4}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-gray-500">Order: {item.sort_order}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">Edit</button>
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
