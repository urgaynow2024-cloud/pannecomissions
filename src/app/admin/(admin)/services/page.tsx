"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_fit: string;
  image_position: string;
  features: string | null;
  sort_order: number;
  visible: boolean;
  spare_parts: boolean;
  photos?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
}

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

interface PortfolioItem {
  id: string;
  display_title: string | null;
  image_url: string;
  category: string | null;
}

interface FormData {
  name: string;
  description: string;
  image_url: string;
  image_fit: string;
  image_position: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  sort_order: number;
  visible: boolean;
  spare_parts: boolean;
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

function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mediaItems,
  portfolioItems,
  onUpload,
  uploading,
  selectedUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  mediaItems: MediaItem[];
  portfolioItems: PortfolioItem[];
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  selectedUrl: string;
}) {
  const [activeTab, setActiveTab] = useState<"library" | "portfolio">("library");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl border border-white/10 bg-brand-dark shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white font-display">Select Image</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "library" ? "text-brand-purple-400 border-b-2 border-brand-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Media Library
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "portfolio" ? "text-brand-purple-400 border-b-2 border-brand-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Portfolio
          </button>
        </div>

        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {activeTab === "library"
              ? `${mediaItems.length} items in media library`
              : `${portfolioItems.length} portfolio images`}
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-brand-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? "Uploading..." : "Upload New"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "library" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {mediaItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      isSelected ? "border-brand-purple-400 ring-2 ring-brand-purple-400/30" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-brand-purple-500 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
              {mediaItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 text-sm">No images in media library</div>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {portfolioItems.map((item) => {
                const isSelected = selectedUrl === item.image_url;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.image_url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      isSelected ? "border-brand-purple-400 ring-2 ring-brand-purple-400/30" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <img src={item.image_url} alt={item.display_title || "Portfolio"} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-8 h-8 rounded-full bg-brand-purple-500 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
              {portfolioItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 text-sm">No portfolio images</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  dragHandlers,
  dragOverHandlers,
  dragIndex,
  dragOverIndex,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandlers: any;
  dragOverHandlers: any;
  dragIndex: number | null;
  dragOverIndex: number | null;
}) {
  const descriptionPreview = service.description
    ? service.description.length > 120
      ? service.description.slice(0, 120) + "..."
      : service.description
    : "No description";

  const featuresCount = service.features ? service.features.split("\n").filter((f) => f.trim()).length : 0;

  return (
    <>
      <div
        draggable="true"
        {...dragHandlers}
        {...dragOverHandlers}
        className={`rounded-xl border bg-white/[0.02] transition-all duration-200 ${
          dragIndex === dragOverIndex && dragIndex !== null
            ? "border-brand-purple-400/50 shadow-lg shadow-brand-purple-500/10 scale-[1.01]"
            : "border-white/5 hover:border-white/10"
        } ${dragIndex !== null ? "opacity-50" : "opacity-100"}`}
      >
        <div className="p-5 cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-3">
            <div
              {...dragHandlers}
              className="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>

            <div className="shrink-0">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate font-display text-sm">{service.name}</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">{descriptionPreview}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                #{service.sort_order}
              </span>
              {service.visible ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Visible</span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">Hidden</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onEdit}
                className="rounded-lg border border-white/10 p-2 text-gray-300 hover:text-white hover:border-white/20 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/5 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragError, setDragError] = useState<string | null>(null);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image_url: "",
    image_fit: "cover",
    image_position: "center",
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
    sort_order: 0,
    visible: true,
    spare_parts: false,
  });

  useEffect(() => {
    fetchServices();
    fetchMediaLibrary();
    fetchPortfolio();
  }, []);

  async function fetchServices() {
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

  async function fetchMediaLibrary() {
    try {
      const res = await fetch("/api/admin/media-library");
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data);
      }
    } catch {
      // silent
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const features = [formData.feature1, formData.feature2, formData.feature3, formData.feature4].filter((f) => f.trim()).join("\n");
      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          image_url: formData.image_url || null,
          image_fit: formData.image_fit,
          image_position: formData.image_position,
          features: features || null,
          sort_order: formData.sort_order,
          visible: formData.visible,
          spare_parts: formData.spare_parts,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      await fetchServices();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        if (editingId === id) resetForm();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(item: Service) {
    const features = (item.features || "").split("\n");
    setEditingId(item.id);
    setShowForm(true);
    setFormData({
      name: item.name,
      description: item.description || "",
      image_url: item.image_url || "",
      image_fit: item.image_fit || "cover",
      image_position: item.image_position || "center",
      feature1: features[0] || "",
      feature2: features[1] || "",
      feature3: features[2] || "",
      feature4: features[3] || "",
      sort_order: item.sort_order,
      visible: item.visible,
      spare_parts: item.spare_parts || false,
    });
  }

  async function handleMediaUpload(file: File) {
    setUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/media-library", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const item = await res.json();
      setMediaItems([item, ...mediaItems]);
      setFormData({ ...formData, image_url: item.url });
      setShowMediaPicker(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingMedia(false);
    }
  }

  function handleMediaSelect(url: string) {
    setFormData({ ...formData, image_url: url });
    setShowMediaPicker(false);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  }

  function handleDrop() {
    if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const previousItems = [...items];
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(dragOverIndex, 0, moved);

    const updates = newItems.map((item, idx) => ({
      id: item.id,
      sort_order: idx,
    }));

    setItems(newItems);
    setDragIndex(null);
    setDragOverIndex(null);
    setDragError(null);

    Promise.allSettled(
      updates.map((update) =>
        fetch(`/api/admin/services/${update.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: update.sort_order }),
        })
      )
    ).then((results) => {
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        setItems(previousItems);
        setDragError(`Reorder failed for ${failed.length} item(s). Please try again.`);
      }
    });
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      image_url: "",
      image_fit: "cover",
      image_position: "center",
      feature1: "",
      feature2: "",
      feature3: "",
      feature4: "",
      sort_order: 0,
      visible: true,
      spare_parts: false,
    });
  }

  const getImageSourceLabel = (url: string) => {
    const mediaItem = mediaItems.find((m) => m.url === url);
    if (mediaItem) return mediaItem.filename;
    const portfolioItem = portfolioItems.find((p) => p.image_url === url);
    if (portfolioItem) return portfolioItem.display_title || "Portfolio";
    return url.length > 40 ? url.slice(0, 40) + "..." : url;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/5 rounded w-32 animate-pulse mb-2" />
            <div className="h-4 bg-white/5 rounded w-48 animate-pulse" />
          </div>
          <div className="h-10 bg-white/5 rounded-lg w-32 animate-pulse" />
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
          <button onClick={fetchServices} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Services</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage service offerings. Drag to reorder.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {dragError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
          <p className="text-sm text-red-400">{dragError}</p>
          <button onClick={() => setDragError(null)} className="text-xs text-gray-400 hover:text-white transition-colors">Dismiss</button>
        </div>
      )}

      <div className="space-y-3">
        {showForm && editingId === null && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white font-display">New Service</h3>
                  <p className="text-xs text-gray-500 mt-1">Create a new service offering</p>
                </div>
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                      <div className="aspect-video rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden mb-3">
                        {formData.image_url ? (
                          <img
                            src={formData.image_url}
                            alt="Cover"
                            className="w-full h-full object-cover"
                            style={{ objectFit: formData.image_fit as any, objectPosition: formData.image_position }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setShowMediaPicker(true)}
                          className="flex-1 rounded-lg border border-brand-purple-500/30 bg-brand-purple-500/10 px-3 py-2 text-xs font-medium text-brand-purple-400 hover:bg-brand-purple-500/20 transition-colors"
                        >
                          Replace Image
                        </button>
                        {formData.image_url && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: "" })}
                            className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {formData.image_url && (
                        <div className="space-y-2 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Image Source</label>
                            <p className="text-xs text-gray-500 truncate">{getImageSourceLabel(formData.image_url)}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">Fit</label>
                              <select
                                value={formData.image_fit}
                                onChange={(e) => setFormData({ ...formData, image_fit: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                              >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">Position</label>
                              <select
                                value={formData.image_position}
                                onChange={(e) => setFormData({ ...formData, image_position: e.target.value })}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                              >
                                <option value="center">Center</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                        placeholder="e.g. Full Color Illustration"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors resize-none"
                        rows={3}
                        placeholder="Brief description of this service..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[1, 2, 3, 4].map((num) => (
                          <div key={num} className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                              {num}.
                            </span>
                            <input
                              value={(formData as any)[`feature${num}`]}
                              onChange={(e) => setFormData({ ...formData, [`feature${num}`]: e.target.value })}
                              className="w-full rounded-lg border border-white/10 bg-white/5 pl-7 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                              placeholder={`Feature ${num}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">Enter up to 4 features. These appear as checkmarks on the homepage.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Display Order</label>
                          <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white text-center focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.visible}
                              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-brand-purple-500 transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm" />
                          </div>
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Visible</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.spare_parts}
                              onChange={(e) => setFormData({ ...formData, spare_parts: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-brand-purple-500 transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm" />
                          </div>
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Spare Parts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3">
                <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-brand-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                  {saving && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {saving ? "Saving..." : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        )}
        {items.map((item, index) => (
          <div key={item.id}>
            <ServiceCard
              service={item}
              isExpanded={editingId === item.id && showForm}
              onToggle={() => handleEdit(item)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
              dragHandlers={{
                draggable: true,
                onDragStart: () => handleDragStart(index),
                onDragEnd: handleDragEnd,
              }}
              dragOverHandlers={{
                onDragOver: (e: React.DragEvent) => {
                  e.preventDefault();
                  handleDragOver(index);
                },
                onDragLeave: () => setDragOverIndex(null),
                onDrop: handleDrop,
              }}
              dragIndex={dragIndex}
              dragOverIndex={dragOverIndex}
            />
            {editingId === item.id && showForm && (
              <div className="mt-3 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 animate-fade-in-up">
                <form onSubmit={handleSubmit}>
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white font-display">Edit Service</h3>
                      <p className="text-xs text-gray-500 mt-1">Update service details below</p>
                    </div>
                    <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                          <div className="aspect-video rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden mb-3">
                            {formData.image_url ? (
                              <img
                                src={formData.image_url}
                                alt="Cover"
                                className="w-full h-full object-cover"
                                style={{ objectFit: formData.image_fit as any, objectPosition: formData.image_position }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mb-3">
                            <button
                              type="button"
                              onClick={() => setShowMediaPicker(true)}
                              className="flex-1 rounded-lg border border-brand-purple-500/30 bg-brand-purple-500/10 px-3 py-2 text-xs font-medium text-brand-purple-400 hover:bg-brand-purple-500/20 transition-colors"
                            >
                              Replace Image
                            </button>
                            {formData.image_url && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image_url: "" })}
                                className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          {formData.image_url && (
                            <div className="space-y-2 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Image Source</label>
                                <p className="text-xs text-gray-500 truncate">{getImageSourceLabel(formData.image_url)}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">Fit</label>
                                  <select
                                    value={formData.image_fit}
                                    onChange={(e) => setFormData({ ...formData, image_fit: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                                  >
                                    <option value="cover">Cover</option>
                                    <option value="contain">Contain</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">Position</label>
                                  <select
                                    value={formData.image_position}
                                    onChange={(e) => setFormData({ ...formData, image_position: e.target.value })}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                                  >
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                          <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                            placeholder="e.g. Full Color Illustration"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors resize-none"
                            rows={3}
                            placeholder="Brief description of this service..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[1, 2, 3, 4].map((num) => (
                              <div key={num} className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                                  {num}.
                                </span>
                                <input
                                  value={(formData as any)[`feature${num}`]}
                                  onChange={(e) => setFormData({ ...formData, [`feature${num}`]: e.target.value })}
                                  className="w-full rounded-lg border border-white/10 bg-white/5 pl-7 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                                  placeholder={`Feature ${num}`}
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">Enter up to 4 features. These appear as checkmarks on the homepage.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <div className="flex items-center gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">Display Order</label>
                              <input
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white text-center focus:border-brand-purple-400/50 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.visible}
                                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-brand-purple-500 transition-colors" />
                                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm" />
                              </div>
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Visible</span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.spare_parts}
                                  onChange={(e) => setFormData({ ...formData, spare_parts: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-brand-purple-500 transition-colors" />
                                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm" />
                              </div>
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Spare Parts</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3">
                    <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="rounded-lg bg-brand-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                      {saving && (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      {saving ? "Saving..." : "Save Service"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <EmptyState onAdd={() => { resetForm(); setShowForm(true); }} />
      )}

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        mediaItems={mediaItems}
        portfolioItems={portfolioItems}
        onUpload={handleMediaUpload}
        uploading={uploadingMedia}
        selectedUrl={formData.image_url}
      />
    </div>
  );
}
