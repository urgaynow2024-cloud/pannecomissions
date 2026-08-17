"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  status: string;
  hidden: boolean;
  nsfw: boolean;
  rejection_reason: string | null;
  created_at: string;
}

const TABS = ["PENDING", "APPROVED", "HIDDEN", "REJECTED"] as const;

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-white/5 rounded animate-pulse w-32" />
        <div className="h-6 bg-white/5 rounded animate-pulse w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="text-center py-16 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-3.8-.6L3 21l1.4-5.2A9.94 9.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">No {tab.toLowerCase()} reviews.</p>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ status, hidden }: { status: string; hidden: boolean }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
        {status}
      </span>
      {hidden && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">Hidden</span>}
    </div>
  );
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url) || url.startsWith("data:video");
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh]">
        {isVideo(src) ? (
          <video src={src} controls autoPlay className="rounded-xl max-h-[85vh] max-w-full" />
        ) : (
          <img src={src} alt="Review" className="rounded-xl max-h-[85vh] object-contain" />
        )}
        <button onClick={onClose} className="absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("PENDING");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ display_name: "", rating: 5, review_text: "", status: "PENDING", hidden: false, nsfw: false, rejection_reason: "", image_url: "" });
  const [saving, setSaving] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})${data.diagnosticId ? ` [ID: ${data.diagnosticId}]` : ""}`);
      }
      const data = await res.json();
      setReviews(data);
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
      const url = editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews";
      const method = editingId ? "PUT" : "POST";
      const body = { ...formData, image_url: formData.image_url || null, rejection_reason: formData.rejection_reason || null };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.diagnosticId ? `Save failed (${res.status}) [ID: ${data.diagnosticId}]` : `Save failed (${res.status})`);
      }
      await fetchItems();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusUpdate(id: string, status: string, hidden?: boolean) {
    setActionError(null);
    const review = reviews.find((r) => r.id === id);
    const body: any = { status };
    if (hidden !== undefined) body.hidden = hidden;
    if (status === "REJECTED" && review && !review.rejection_reason) {
      const reason = prompt("Rejection reason (internal only):");
      if (!reason) return;
      body.rejection_reason = reason;
    }
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.diagnosticId ? `Failed (${res.status}) [ID: ${data.diagnosticId}]` : `Failed (${res.status})`);
      }
      setReviews(reviews.map((r) => (r.id === id ? { ...r, ...body } : r)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Action failed";
      setActionError(message);
      setTimeout(() => setActionError(null), 5000);
    }
  }

  async function handleDelete(id: string) {
    setActionError(null);
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.diagnosticId ? `Delete failed (${res.status}) [ID: ${data.diagnosticId}]` : `Delete failed (${res.status})`);
      }
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setActionError(message);
      setTimeout(() => setActionError(null), 5000);
    }
  }

  function handleEdit(item: Review) {
    setEditingId(item.id);
    setFormData({ display_name: item.display_name, rating: item.rating, review_text: item.review_text, status: item.status, hidden: item.hidden, nsfw: item.nsfw, rejection_reason: item.rejection_reason || "", image_url: item.image_url || "" });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ display_name: "", rating: 5, review_text: "", status: "PENDING", hidden: false, nsfw: false, rejection_reason: "", image_url: "" });
  }

  function getFiltered() {
    if (filter === "ALL") return reviews;
    return reviews.filter((r) => {
      if (filter === "HIDDEN") return r.hidden;
      return r.status === filter;
    });
  }

  const filtered = getFiltered();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-24 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-40 animate-pulse" />
        </div>
        <div className="space-y-3">
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Reviews</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage client reviews.</p>
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
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Reviews</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage client reviews.</p>
      </div>

      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {TABS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? "bg-brand-purple-600 text-white shadow-lg shadow-brand-purple-600/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{actionError}</p>
          <button onClick={() => setActionError(null)} className="ml-auto text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white font-display">{editingId ? "Edit Review" : "New Review"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
              <input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
              <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Review Text</label>
            <textarea value={formData.review_text} onChange={(e) => setFormData({ ...formData, review_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Commission Image URL</label>
            <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors">
              {TABS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {formData.status === "REJECTED" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rejection Reason (internal)</label>
              <textarea value={formData.rejection_reason} onChange={(e) => setFormData({ ...formData, rejection_reason: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" rows={2} />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.hidden} onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })} className="rounded border-white/20 bg-white/5 text-brand-purple-600 focus:ring-brand-purple-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-300">Hidden</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.nsfw} onChange={(e) => setFormData({ ...formData, nsfw: e.target.checked })} className="rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-300">NSFW</span>
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

      {filtered.length === 0 ? (
        <EmptyState tab={filter} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <div key={review.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition-colors flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-white font-display truncate">{review.display_name}</h3>
                </div>
                <StatusBadge status={review.status} hidden={review.hidden} />
              </div>

              <div className="mb-3">
                <Stars rating={review.rating} />
              </div>

              <p className="text-sm text-gray-400 mb-3 flex-1 line-clamp-3">{review.review_text}</p>

              {review.image_url && (
                <button
                  onClick={() => setLightboxUrl(review.image_url)}
                  className="mb-3 rounded-lg overflow-hidden border border-white/5 hover:border-brand-purple-500/30 transition-colors"
                >
                  {isVideo(review.image_url) ? (
                    <video src={review.image_url} className="w-full h-40 object-cover" muted loop playsInline />
                  ) : (
                    <img src={review.image_url} alt="Commission" className="w-full h-40 object-cover" />
                  )}
                </button>
              )}

              {review.rejection_reason && (
                <p className="text-xs text-red-400 mb-3 px-2 py-1.5 rounded bg-red-500/5 border border-red-500/10">Reason: {review.rejection_reason}</p>
              )}

              <p className="text-xs text-gray-500 mb-4">{new Date(review.created_at).toLocaleDateString()}</p>

              <div className="flex gap-2 pt-3 border-t border-white/5">
                {review.status === "PENDING" && (
                  <button onClick={() => handleStatusUpdate(review.id, "APPROVED")} className="flex-1 rounded-lg border border-green-500/30 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/5 transition-colors">Approve</button>
                )}
                {review.status === "APPROVED" && !review.hidden && (
                  <button onClick={() => handleStatusUpdate(review.id, review.status, true)} className="flex-1 rounded-lg border border-yellow-500/30 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/5 transition-colors">Hide</button>
                )}
                {review.status !== "REJECTED" && (
                  <button onClick={() => handleStatusUpdate(review.id, "REJECTED")} className="flex-1 rounded-lg border border-orange-500/30 px-3 py-1.5 text-xs font-medium text-orange-400 hover:bg-orange-500/5 transition-colors">Reject</button>
                )}
                {review.status === "REJECTED" && (
                  <button onClick={() => handleStatusUpdate(review.id, "PENDING")} className="flex-1 rounded-lg border border-green-500/30 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/5 transition-colors">Restore</button>
                )}
                <button onClick={() => handleEdit(review)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors">Edit</button>
                <button onClick={() => handleDelete(review.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxUrl && <Lightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
}
