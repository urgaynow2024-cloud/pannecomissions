"use client";

import { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
  spare_parts: boolean;
}

interface Photo {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export default function ServicePhotosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      fetchPhotos(selectedServiceId);
    }
  }, [selectedServiceId]);

  async function fetchServices() {
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
      if (data.length > 0 && !selectedServiceId) {
        setSelectedServiceId(data[0].id);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function fetchPhotos(serviceId: string) {
    try {
      const res = await fetch(`/api/admin/photos?serviceId=${serviceId}`);
      if (!res.ok) throw new Error("Failed to load photos");
      const data = await res.json();
      setPhotos(data);
    } catch {
      // silent
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedServiceId) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const fd = new FormData();
        fd.append("image", file);
        fd.append("altText", "");
        fd.append("serviceId", selectedServiceId);

        const res = await fetch("/api/admin/photos", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Upload failed (${res.status})`);
        }
      }
      await fetchPhotos(selectedServiceId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" });
    if (res.ok && selectedServiceId) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  }

  async function handleSetCover(photoUrl: string) {
    if (!selectedServiceId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${selectedServiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: photoUrl }),
      });
      if (!res.ok) throw new Error("Failed to update cover");
      await fetchServices();
      alert("Cover image updated.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const selectedService = services.find((s) => s.id === selectedServiceId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Service Photos</h1>
        <p className="text-gray-400 mt-1 text-sm">Upload and manage photos for each service.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <label className="block text-sm font-medium text-gray-300 mb-1">Select Service</label>
          <select
            value={selectedServiceId || ""}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="cursor-pointer rounded-lg border border-dashed border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            {uploading ? "Uploading..." : "Upload Photos"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {selectedService && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display">{selectedService.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
                {selectedService.image_url && " • 1 cover set"}
              </p>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-16 rounded-lg border border-dashed border-white/10">
              <p className="text-sm text-gray-500">No photos yet.</p>
              <p className="text-xs text-gray-600 mt-1">Upload images using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] group">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleSetCover(photo.url)}
                      disabled={saving}
                      className="rounded-lg bg-brand-purple-600 px-2 py-1 text-xs font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors"
                    >
                      Set Cover
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
