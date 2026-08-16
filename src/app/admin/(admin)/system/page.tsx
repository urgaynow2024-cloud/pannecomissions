"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, HardDrive, Database, Image, Shield } from "lucide-react";

interface SystemStatus {
  checks: Record<string, boolean>;
  counts: Record<string, number>;
  storage: Record<string, any>;
  errors: { db: string | null; storage: string | null };
  ok: boolean;
  timestamp: string;
  healthDetails?: {
    ok: boolean;
    checks: Record<string, boolean>;
    missing: string[];
    details: Record<string, string>;
  };
}

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-red-400" />;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "0 B";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/system");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load system status");
      }
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">System Status</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
              <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">System Status</h1>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={fetchStatus} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display">System Status</h1>
        <p className="text-gray-400 mt-1 text-sm">Diagnostics and connectivity checks.</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          {status.ok ? <CheckCircle className="h-6 w-6 text-green-400" /> : <AlertTriangle className="h-6 w-6 text-yellow-400" />}
          <div>
            <h3 className="text-base font-semibold text-white font-display">{status.ok ? "All systems operational" : "Some systems need attention"}</h3>
            <p className="text-xs text-gray-500">Last checked: {new Date(status.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-brand-purple-400" />
            <h3 className="text-sm font-semibold text-white font-display">Database</h3>
            <StatusIcon ok={status.checks.database} />
          </div>
          {status.errors.db && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-3">
              <p className="text-xs text-red-400">{status.errors.db}</p>
            </div>
          )}
          <div className="space-y-2 text-xs text-gray-400">
            {Object.entries(status.counts).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span className="tabular-nums text-gray-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="h-5 w-5 text-brand-purple-400" />
            <h3 className="text-sm font-semibold text-white font-display">Storage</h3>
            <StatusIcon ok={status.checks.storage} />
          </div>
          {status.errors.storage && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-3">
              <p className="text-xs text-red-400">{status.errors.storage}</p>
            </div>
          )}
          {status.storage && !status.errors.storage && (
            <div className="text-xs text-gray-400">
              <p>Bucket: pannecomissions</p>
              <p>Status: Connected</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-brand-purple-400" />
            <h3 className="text-sm font-semibold text-white font-display">Schema Health</h3>
            <StatusIcon ok={status.checks.healthPhotos && status.checks.healthCommissionColumn && status.checks.healthStorage} />
          </div>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between items-center">
              <span>Photos table</span>
              {status.checks.healthPhotos ? <span className="text-green-400">OK</span> : <span className="text-red-400">Missing</span>}
            </div>
            <div className="flex justify-between items-center">
              <span>Commission column</span>
              {status.checks.healthCommissionColumn ? <span className="text-green-400">OK</span> : <span className="text-red-400">Missing</span>}
            </div>
            <div className="flex justify-between items-center">
              <span>Storage bucket</span>
              {status.checks.healthStorage ? <span className="text-green-400">OK</span> : <span className="text-red-400">Missing</span>}
            </div>
          </div>
          {status.healthDetails?.missing && status.healthDetails.missing.length > 0 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mt-3">
              <p className="text-xs text-red-400">{status.healthDetails.missing.join(", ")}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-4">
            <Image className="h-5 w-5 text-brand-purple-400" />
            <h3 className="text-sm font-semibold text-white font-display">Portfolio API</h3>
            <StatusIcon ok={status.checks.database && status.checks.storage && status.checks.healthPhotos} />
          </div>
          <p className="text-xs text-gray-400">
            {status.checks.database && status.checks.storage && status.checks.healthPhotos ? "Uploads should work." : "Uploads may fail due to missing database, storage, or schema."}
          </p>
        </div>
      </div>
    </div>
  );
}
