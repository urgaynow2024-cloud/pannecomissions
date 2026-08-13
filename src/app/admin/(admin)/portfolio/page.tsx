"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description: string | null;
  alt_text: string | null;
  image_url: string;
  category: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  photos: { id: string; url: string; alt_text: string | null; sort_order: number }[];
}

interface UploadQueueItem {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="aspect-[4/3] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-400 mb-4 text-sm">No portfolio work yet.</p>
      <button onClick={onUpload} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
        Upload Work
      </button>
    </div>
  );
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ displayTitle: "", description: "", category: "", featured: false, visible: true });
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const handleFiles = useCallback(async (files: FileList) => {
    const accepted = Array.from(files).filter((f) => /\.(png|jpe?g|webp)$/i.test(f.name));
    if (accepted.length === 0) return;

    const queue: UploadQueueItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
      progress: 0,
    }));

    setUploadQueue((prev) => [...prev, ...queue]);

    for (const item of queue) {
      try {
        const fd = new FormData();
        fd.append("image", item.file);
        fd.append("displayTitle", "");
        fd.append("description", "");
        fd.append("category", "");
        fd.append("featured", "false");
        fd.append("visible", "true");

        const xhr = new XMLHttpRequest();
        await new Promise<void>((resolve, reject) => {
          xhr.open("POST", "/api/admin/portfolio");
          xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) return resolve();
            let message = "Upload failed";
            try {
              const data = JSON.parse(xhr.responseText);
              message = data.error || data.message || message;
            } catch {
              message = xhr.statusText || message;
            }
            reject(new Error(message));
          };
          xhr.onerror = () => reject(new Error("Network error — check your connection"));
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploadQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, progress: pct } : q))
              );
            }
          };
          xhr.send(fd);
        });

        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "uploaded", progress: 100 } : q))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        console.error("Upload error:", message);
        alert(`UPLOAD FAILED:\n\n${message}\n\nCheck the browser console (F12) for more details.`);
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "error", error: message } : q))
        );
      }
    }

    await fetchItems();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("displayTitle", formData.displayTitle);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("featured", String(formData.featured));
    fd.append("visible", String(formData.visible));

    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : "/api/admin/portfolio";
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
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter((i) => i.id !== id));
      setDeleteId(null);
    }
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
      fd.append("portfolioItemId", editingId);

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

    await fetchItems();
    setPhotoUploading(false);
    e.target.value = "";
  }

  async function handlePhotoDelete(photoId: string) {
    const res = await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" });
    if (res.ok && editingId) {
      setItems(items.map((item) => item.id === editingId ? { ...item, photos: item.photos.filter((p) => p.id !== photoId) } : item));
    }
  }

  function handleEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setFormData({ displayTitle: item.display_title || "", description: item.description || "", category: item.category || "", featured: item.featured, visible: item.visible });
    setShowForm(true);
  }

  async function handleToggleFeatured(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    if (res.ok) setItems(items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));
  }

  async function handleToggleVisibility(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    if (res.ok) setItems(items.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)));
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
    setFormData({ displayTitle: "", description: "", category: "", featured: false, visible: true });
  }

  function removeFromQueue(id: string) {
    setUploadQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((q) => q.id !== id);
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-64 animate-pulse" />
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Portfolio</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your portfolio work.</p>
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Portfolio</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your portfolio work.</p>
        </div>
      </div>

      <div
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${dragOver ? "border-brand-purple-400 bg-brand-purple-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}
        onClick={() => dropInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={dropInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }}
        />
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
          <svg className="w-6 h-6 text-brand-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <p className="text-white font-medium mb-1">DROP YOUR ARTWORK HERE</p>
        <p className="text-gray-500 text-sm">or click to browse</p>
        <p className="text-gray-600 text-xs mt-2">PNG, JPG, WEBP</p>
      </div>

      {uploadQueue.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Upload Queue</h3>
          {uploadQueue.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4">
              <img src={item.preview} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.file.name}</p>
                <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${item.status === "error" ? "bg-red-500" : "bg-brand-purple-500"}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.status === "uploading" && `Uploading... ${item.progress}%`}
                  {item.status === "uploaded" && "Uploaded"}
                  {item.status === "error" && (item.error || "Error")}
                </p>
              </div>
              <button onClick={() => removeFromQueue(item.id)} className="text-gray-400 hover:text-white transition-colors p-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white font-display">{editingId ? "Edit Work" : "Add New Work"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Display Title <span className="text-gray-500 text-xs">(optional)</span></label>
            <input value={formData.displayTitle} onChange={(e) => setFormData({ ...formData, displayTitle: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="Leave empty to show artwork only" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category <span className="text-gray-500 text-xs">(optional)</span></label>
            <input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="e.g. Avatar, Outfit, Texture" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-300">Visible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
          {editingId && (() => {
            const item = items.find((i) => i.id === editingId);
            if (!item) return null;
            return (
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm font-medium text-gray-300 mb-3">Additional Photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {item.photos?.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => handlePhotoDelete(photo.id)} className="absolute top-1 right-1 p-1 rounded bg-black/60 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <input ref={photoInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            );
          })()}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState onUpload={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragOver={(e) => { e.preventDefault(); }}
              onDragStart={() => setDragId(item.id)}
              onDrop={(e) => { e.preventDefault(); if (dragId) handleReorder(items.findIndex((i) => i.id === dragId), idx); setDragId(null); }}
              className={`group relative rounded-xl border bg-white/[0.02] overflow-hidden transition-all duration-200 ${dragOver ? "border-brand-purple-400/50 scale-[1.02]" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="aspect-[4/3] bg-black relative overflow-hidden">
                <img src={item.image_url} alt={item.display_title || "Portfolio artwork"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {item.featured && <span className="bg-brand-purple-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">Featured</span>}
                  {!item.visible && <span className="bg-black/60 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onMouseDown={(e) => { e.preventDefault(); }}
                    onDragStart={(e) => { e.preventDefault(); setDragId(item.id); }}
                    className="p-1.5 rounded-lg bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={() => handleEdit(item)} className="px-3 py-1.5 rounded-lg bg-black/40 text-xs font-medium text-gray-200 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-colors">Edit</button>
                  <button onClick={() => handleToggleVisibility(item.id)} className="px-3 py-1.5 rounded-lg bg-black/40 text-xs font-medium text-gray-200 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-colors">
                    {item.visible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => handleToggleFeatured(item.id)} className="px-3 py-1.5 rounded-lg bg-black/40 text-xs font-medium text-gray-200 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-colors">
                    {item.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="px-3 py-1.5 rounded-lg bg-black/40 text-xs font-medium text-red-300 hover:text-red-100 hover:bg-black/60 backdrop-blur-sm transition-colors">Delete</button>
                </div>
              </div>
              <div className="p-4 space-y-1">
                {item.display_title && <h3 className="font-semibold text-white truncate">{item.display_title}</h3>}
                <p className="text-xs text-gray-500 truncate">{item.alt_text || item.category || "No details"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white font-display text-center mb-2">DELETE THIS WORK?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
