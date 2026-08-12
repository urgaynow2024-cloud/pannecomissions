"use client";

import { useState, useEffect } from "react";

interface Commission {
  id: string;
  client_name: string;
  email: string;
  service: string;
  description: string | null;
  additional: string | null;
  status: string;
  nsfw: boolean;
  created_at: string;
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    fetchCommissions();
  }, []);

  async function fetchCommissions() {
    try {
      const res = await fetch("/api/admin/commissions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCommissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/commissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setCommissions(commissions.map((c) => (c.id === id ? { ...c, status } : c)));
      setStatusUpdate("");
    }
  }

  async function deleteCommission(id: string) {
    if (!confirm("Delete this commission?")) return;
    const res = await fetch(`/api/admin/commissions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCommissions(commissions.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  const selected = commissions.find((c) => c.id === selectedId);
  const filtered = filter === "ALL" ? commissions : commissions.filter((c) => c.status === filter);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Commissions</h1>
          <p className="text-gray-400 mt-1">Manage commission enquiries.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["ALL", "PENDING", "REVIEWING", "ACCEPTED", "IN_PROGRESS", "WAITING", "COMPLETED", "DECLINED"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? "bg-purple-600 text-white" : "border border-white/10 text-gray-300 hover:text-white"}`}>
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400">No commissions found.</p>
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} onClick={() => { setSelectedId(c.id); setStatusUpdate(c.status); }} className={`cursor-pointer rounded-xl border p-4 transition-colors ${selectedId === c.id ? "border-purple-500/50 bg-purple-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{c.client_name}</h3>
                        {c.nsfw && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">18+ NSFW</span>}
                      </div>
                      <p className="text-sm text-gray-400">{c.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {selected && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Commission #{selected.id.slice(0, 8)}</h3>
              {selected.nsfw && <span className="inline-block text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">18+ NSFW COMMISSION</span>}
              <div>
                <p className="text-sm text-gray-400">Client</p>
                <p className="text-white font-medium">{selected.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{selected.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Service</p>
                <p className="text-white font-medium">{selected.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Submitted</p>
                <p className="text-white font-medium">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-white whitespace-pre-wrap">{selected.description || "No description"}</p>
              </div>
              {selected.additional && (
                <div>
                  <p className="text-sm text-gray-400">Additional Info</p>
                  <p className="text-white whitespace-pre-wrap">{selected.additional}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Change Status</label>
                <select value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white">
                  {["PENDING", "REVIEWING", "ACCEPTED", "IN_PROGRESS", "WAITING", "COMPLETED", "DECLINED"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(selected.id, statusUpdate)} className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500">Update Status</button>
                <button onClick={() => deleteCommission(selected.id)} className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/5">Delete</button>
              </div>
              <a href={`mailto:${selected.email}`} className="block text-center rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Email Client</a>
            </div>
          )}
        </div>
      </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    REVIEWING: "bg-blue-500/10 text-blue-400",
    ACCEPTED: "bg-green-500/10 text-green-400",
    IN_PROGRESS: "bg-purple-500/10 text-purple-400",
    WAITING: "bg-orange-500/10 text-orange-400",
    COMPLETED: "bg-emerald-500/10 text-emerald-400",
    DECLINED: "bg-red-500/10 text-red-400",
  };
  return <span className={`text-xs px-2 py-1 rounded ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>{status.replace("_", " ")}</span>;
}
