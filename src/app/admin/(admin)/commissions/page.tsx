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

const STATUS_TABS = [
  { value: "PENDING", label: "New" },
  { value: "REVIEWING", label: "In Review" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  REVIEWING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  WAITING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DECLINED: "bg-red-500/10 text-red-400 border-red-500/20",
};

function SkeletonRow() {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/5 rounded w-32" />
        <div className="h-3 bg-white/5 rounded w-48" />
        <div className="h-3 bg-white/5 rounded w-24" />
      </div>
      <div className="h-6 bg-white/5 rounded w-20" />
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: string }) {
  const label = STATUS_TABS.find((t) => t.value === activeTab)?.label || "all";
  return (
    <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">No {label.toLowerCase()} commissions.</p>
    </div>
  );
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("PENDING");
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
    }
  }

  async function deleteCommission(id: string) {
    if (!confirm("Delete this commission?")) return;
    const res = await fetch(`/api/admin/commissions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCommissions(commissions.filter((c) => c.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setStatusUpdate("");
      }
    }
  }

  const selected = commissions.find((c) => c.id === selectedId);
  const filtered = commissions.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-white/5 rounded w-40 animate-pulse mb-2" />
          <div className="h-4 bg-white/5 rounded w-56 animate-pulse" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STATUS_TABS.map((tab) => (
            <div key={tab.value} className="h-8 bg-white/5 rounded-lg animate-pulse w-20 shrink-0" />
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
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">Commissions</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage commission enquiries.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchCommissions}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">Commissions</h1>
        <p className="text-gray-400 mt-1 text-sm">Manage commission enquiries.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === tab.value
                ? "bg-brand-purple-600 text-white"
                : "border border-white/10 text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState activeTab={filter} />
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setStatusUpdate(c.status);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                  selectedId === c.id
                    ? "border-brand-purple-400/50 bg-brand-purple-400/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-white font-display">{c.client_name}</h3>
                      {c.nsfw && (
                        <span className="text-[10px] font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                          18+ NSFW
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{c.email}</p>
                    <p className="text-sm text-gray-300 mt-0.5">{c.service}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(c.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                      STATUS_COLORS[c.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                  >
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-5 h-fit lg:sticky lg:top-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white font-display">
                Commission #{selected.id.slice(0, 8)}
              </h3>
              <button
                onClick={() => {
                  setSelectedId(null);
                  setStatusUpdate("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selected.nsfw && (
              <span className="inline-block text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                18+ NSFW Commission
              </span>
            )}

            <div className="space-y-3">
              <DetailRow label="Client" value={selected.client_name} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Service" value={selected.service} />
              <DetailRow
                label="Submitted"
                value={new Date(selected.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              {selected.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-white whitespace-pre-wrap bg-white/5 rounded-lg p-3 border border-white/5">
                    {selected.description}
                  </p>
                </div>
              )}
              {selected.additional && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Additional Info</p>
                  <p className="text-sm text-white whitespace-pre-wrap bg-white/5 rounded-lg p-3 border border-white/5">
                    {selected.additional}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">Change Status</label>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white text-sm focus:border-brand-purple-400/50 focus:outline-none transition-colors"
              >
                {STATUS_TABS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(selected.id, statusUpdate)}
                className="flex-1 rounded-lg bg-brand-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors"
              >
                Update Status
              </button>
              <button
                onClick={() => deleteCommission(selected.id)}
                className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/5 transition-colors"
              >
                Delete
              </button>
            </div>

            <a
              href={`mailto:${selected.email}`}
              className="block text-center rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors"
            >
              Email Client
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
