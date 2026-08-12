"use client";

import { useState, useEffect } from "react";

interface SupportRequest {
  id: string;
  client_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

function SkeletonRow() {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/5 rounded animate-pulse w-48" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-32" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-24" />
      </div>
      <div className="h-6 bg-white/5 rounded animate-pulse w-20" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">No support requests found.</p>
    </div>
  );
}

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/support/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  async function deleteRequest(id: string) {
    if (!confirm("Delete this support request?")) return;
    const res = await fetch(`/api/admin/support/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRequests(requests.filter((r) => r.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  const selected = requests.find((r) => r.id === selectedId);
  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-28 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-48 animate-pulse" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse w-20 shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Support</h1>
          <p className="text-gray-400 mt-1">Manage support requests.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={fetchRequests} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Support</h1>
        <p className="text-gray-400 mt-1">Manage support requests.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-purple-600 text-white" : "border border-white/10 text-gray-300 hover:text-white"}`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((r) => (
              <div key={r.id} onClick={() => setSelectedId(r.id)} className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${selectedId === r.id ? "border-purple-500/50 bg-purple-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{r.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{r.client_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4 h-fit lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{selected.subject}</h3>
              <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <DetailRow label="Name" value={selected.client_name} />
              <DetailRow label="Email" value={selected.email} />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
                <p className="text-sm text-white whitespace-pre-wrap bg-white/5 rounded-lg p-3">{selected.message}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">Status</label>
              <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-purple-500/50 focus:outline-none transition-colors">
                {["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${selected.email}`} className="flex-1 text-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">Email Client</a>
              <button onClick={() => deleteRequest(selected.id)} className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/5 transition-colors">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    RESOLVED: "bg-green-500/10 text-green-400",
    CLOSED: "bg-gray-500/10 text-gray-400",
  };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>{status.replace("_", " ")}</span>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
