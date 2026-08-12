"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  status: string;
  hidden: boolean;
  rejection_reason: string | null;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ display_name: "", rating: 5, review_text: "", status: "PENDING", hidden: false, rejection_reason: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch");
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
      if (!res.ok) throw new Error("Save failed");
      await fetchItems();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusUpdate(id: string, status: string, hidden?: boolean) {
    const review = reviews.find((r) => r.id === id);
    const body: any = { status };
    if (hidden !== undefined) body.hidden = hidden;
    if (status === "REJECTED" && review && !review.rejection_reason) {
      const reason = prompt("Rejection reason (internal only):");
      if (!reason) return;
      body.rejection_reason = reason;
    }
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, ...body } : r)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) setReviews(reviews.filter((r) => r.id !== id));
  }

  function handleEdit(item: Review) {
    setEditingId(item.id);
    setFormData({ display_name: item.display_name, rating: item.rating, review_text: item.review_text, status: item.status, hidden: item.hidden, rejection_reason: item.rejection_reason || "", image_url: item.image_url || "" });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ display_name: "", rating: 5, review_text: "", status: "PENDING", hidden: false, rejection_reason: "", image_url: "" });
  }

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reviews</h1>
          <p className="text-gray-400 mt-1">Manage client reviews.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
          Add Review
        </button>
      </div>

      <div className="flex gap-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? "bg-purple-600 text-white" : "border border-white/10 text-gray-300 hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">{editingId ? "Edit Review" : "New Review"}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
            <input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
            <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white">
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Review Text</label>
            <textarea value={formData.review_text} onChange={(e) => setFormData({ ...formData, review_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
            <input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <input id="hidden" type="checkbox" checked={formData.hidden} onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })} />
            <label htmlFor="hidden" className="text-sm text-gray-300">Hidden</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white">
              {["PENDING", "APPROVED", "REJECTED"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {formData.status === "REJECTED" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rejection Reason (internal)</label>
              <textarea value={formData.rejection_reason} onChange={(e) => setFormData({ ...formData, rejection_reason: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white" rows={2} />
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No reviews found.</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">Add First Review</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="flex items-start justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div>
                <h3 className="font-semibold text-white">{review.display_name}</h3>
                <p className="text-sm text-gray-400">Rating: {review.rating}/5</p>
                <p className="text-sm text-gray-400 mt-1">{review.review_text}</p>
                {review.image_url && <p className="text-xs text-gray-500 mt-1">Has image</p>}
                {review.rejection_reason && <p className="text-xs text-red-400 mt-1">Reason: {review.rejection_reason}</p>}
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => handleEdit(review)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">Edit</button>
                {review.status === "APPROVED" ? (
                  <button onClick={() => handleStatusUpdate(review.id, review.status, true)} className="rounded-lg border border-yellow-500/30 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/5">Hide</button>
                ) : (
                  <button onClick={() => handleStatusUpdate(review.id, "APPROVED")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">Approve</button>
                )}
                <button onClick={() => handleStatusUpdate(review.id, "REJECTED")} className="rounded-lg border border-yellow-500/30 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/5">Reject</button>
                <button onClick={() => handleDelete(review.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/5">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
