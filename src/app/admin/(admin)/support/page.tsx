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

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Support</h1>
        <p className="text-gray-400 mt-1">Manage support requests.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? "bg-purple-600 text-white" : "border border-white/10 text-gray-300 hover:text-white"}`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No support requests found.</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} onClick={() => setSelectedId(r.id)} className={`cursor-pointer rounded-xl border p-4 transition-colors ${selectedId === r.id ? "border-purple-500/50 bg-purple-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{r.subject}</h3>
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
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">{selected.subject}</h3>
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-white font-medium">{selected.client_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{selected.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Message</p>
              <p className="text-white whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white">
                {["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${selected.email}`} className="flex-1 text-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">Email Client</a>
              <button onClick={() => deleteRequest(selected.id)} className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/5">Delete</button>
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
  return <span className={`text-xs px-2 py-1 rounded ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>{status.replace("_", " ")}</span>;
}
