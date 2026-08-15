"use client";

import { useState, useEffect } from "react";
import {
  Image,
  Shield,
  Star,
  DollarSign,
  ClipboardList,
  HelpCircle,
  Upload,
  EyeOff,
  CheckSquare,
  HardDrive,
  Database,
  Activity,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Clock,
} from "lucide-react";

interface DashboardStats {
  portfolioStats: { total: number; published: number; hidden: number; featured: number; deleted: number };
  nsfw: number;
  pendingReviews: number;
  pendingCommissions: number;
  openSupport: number;
  totalServices: number;
  totalPricing: number;
  storageEstimate: string;
  recentCommissions: any[];
  recentReviews: any[];
  recentSupport: any[];
}

interface HealthData {
  ok: boolean;
  checks: Record<string, boolean>;
  missing: string[];
  details: Record<string, string>;
  fix: string | null;
  diagnosticId?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
      <div className="h-8 bg-white/5 rounded animate-pulse w-1/3" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/5 rounded animate-pulse w-32" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-48" />
      </div>
      <div className="h-5 bg-white/5 rounded animate-pulse w-16" />
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [retrying, setRetrying] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    setRetrying(false);

    try {
      const [healthRes, statsRes] = await Promise.all([
        fetch("/api/admin/health", { cache: "no-store" }),
        fetch("/api/admin/dashboard-stats", { cache: "no-store" }),
      ]);

      if (healthRes.ok) {
        setHealth(await healthRes.json());
      } else {
        const err = await healthRes.json().catch(() => ({ error: "Health check failed" }));
        setHealth({
          ok: false,
          checks: {},
          missing: [],
          details: { _error: err.error || "Health endpoint returned an error" },
          fix: "Check the system status page for details",
        });
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      } else {
        const err = await statsRes.json().catch(() => ({ error: "Failed to load dashboard stats" }));
        setError(err.error || "Failed to load dashboard data");
      }
    } catch {
      setError("Something went wrong. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    await loadData();
  }

  const systemChecks = [
    { key: "database", label: "Database", check: health?.checks.database },
    { key: "storage", label: "Storage", check: health?.checks.storage },
    { key: "api", label: "API", check: health?.checks.database && health?.checks.storage },
  ];

  const systemOk = health?.checks.database && health?.checks.storage;

  const statCards = stats
    ? [
        { label: "Portfolio", value: stats.portfolioStats?.total || 0, subtitle: "Published works", href: "/admin/portfolio", icon: Image, color: "text-blue-400" },
        { label: "NSFW", value: stats.nsfw || 0, subtitle: "Adult published", href: "/admin/nsfw", icon: Shield, color: "text-pink-400" },
        { label: "Reviews", value: stats.pendingReviews || 0, subtitle: "Pending approval", href: "/admin/reviews", icon: Star, color: "text-yellow-400" },
        { label: "Commissions", value: stats.pendingCommissions || 0, subtitle: "Awaiting response", href: "/admin/commissions", icon: ClipboardList, color: "text-purple-400" },
        { label: "Support", value: stats.openSupport || 0, subtitle: "Open requests", href: "/admin/support", icon: HelpCircle, color: "text-green-400" },
      ]
    : [];

  const quickActions = [
    { label: "Upload Portfolio Work", description: "Add new artwork to your portfolio", href: "/admin/portfolio", icon: Upload },
    { label: "Add NSFW Work", description: "Upload adult content portfolio items", href: "/admin/nsfw", icon: EyeOff },
    { label: "Review Submissions", description: "Approve or reject pending reviews", href: "/admin/reviews", icon: CheckSquare },
    { label: "Edit Pricing", description: "Update commission pricing tiers", href: "/admin/pricing", icon: DollarSign },
  ];

  const pendingActions: { label: string; count: number; href: string }[] = [];
  if (stats?.pendingCommissions) pendingActions.push({ label: "Commissions awaiting response", count: stats.pendingCommissions, href: "/admin/commissions" });
  if (stats?.pendingReviews) pendingActions.push({ label: "Reviews awaiting approval", count: stats.pendingReviews, href: "/admin/reviews" });
  if (stats?.openSupport) pendingActions.push({ label: "Open support requests", count: stats.openSupport, href: "/admin/support" });

  return (
    <div className="space-y-8 animate-fade-in">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300 font-medium">Dashboard data unavailable</p>
            <p className="text-xs text-red-400/80 mt-1">{error}</p>
          </div>
          <button onClick={handleRetry} disabled={retrying} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:text-white hover:border-red-400/50 transition-colors shrink-0 disabled:opacity-50">
            {retrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-2">Admin</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display heading-pop">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">Studio overview and system health.</p>
        </div>
        <button
          onClick={handleRetry}
          disabled={retrying || loading}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${systemOk ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <Activity className={`h-5 w-5 ${systemOk ? "text-green-400" : "text-red-400"}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white font-display">System Status</h3>
                <p className="text-xs text-gray-500">
                  {systemOk ? "All systems operational" : "Issues detected"}
                </p>
              </div>
            </div>
            <a
              href="/admin/system"
              className="text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors font-medium flex items-center gap-1"
            >
              Details
              <ChevronRight className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {systemChecks.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-xs font-medium text-gray-400">{item.label}</span>
                {item.check === true ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Connected
                  </span>
                ) : item.check === false ? (
                  <span className="flex items-center gap-1.5 text-xs text-red-400">
                    <XCircle className="h-3.5 w-3.5" />
                    Error
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Unknown
                  </span>
                )}
              </div>
            ))}
          </div>

          {health?.details && Object.keys(health.details).length > 0 && (
            <details className="mt-4">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors select-none">
                Technical details
              </summary>
              <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-4 space-y-2">
                {Object.entries(health.details).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-gray-500 font-mono shrink-0">{key}</span>
                    <span className="text-xs text-red-400/90 break-all text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-500/10 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-brand-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-display">Storage</h3>
              <p className="text-xs text-gray-500">Media usage</p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-6 bg-white/5 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-white font-display tracking-tight">
                {stats?.storageEstimate || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Estimated media usage</p>
              {(!stats?.storageEstimate || stats.storageEstimate === "Unknown") && (
                <p className="text-xs text-gray-600 mt-2">Upload photos to see storage estimates.</p>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-display">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <a
                    key={stat.label}
                    href={stat.href}
                    className="group relative flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-brand-purple-400/30 hover:bg-brand-purple-500/5 transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-purple-500/0 via-brand-purple-500 to-brand-purple-500/0 opacity-0 group-hover:opacity-60 transition-opacity" />
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                    <p className="text-3xl font-bold text-white font-display tracking-tight">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1.5">{stat.subtitle}</p>
                  </a>
                );
              })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-4 w-4 text-brand-purple-400" />
            <h3 className="text-xs font-semibold text-white font-display uppercase tracking-wider">Portfolio Breakdown</h3>
          </div>
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 bg-white/5 rounded animate-pulse w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              {[
                { label: "Total", value: stats?.portfolioStats?.total || 0, href: "/admin/portfolio", color: "text-gray-300" },
                { label: "Published", value: stats?.portfolioStats?.published || 0, href: "/admin/portfolio", color: "text-green-400" },
                { label: "Hidden", value: stats?.portfolioStats?.hidden || 0, href: "/admin/portfolio", color: "text-yellow-400" },
                { label: "Featured", value: stats?.portfolioStats?.featured || 0, href: "/admin/portfolio", color: "text-brand-purple-400" },
                { label: "Deleted", value: stats?.portfolioStats?.deleted || 0, href: "/admin/trash", color: "text-red-400" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded transition-colors group"
                >
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{item.label}</span>
                  <span className={`font-mono text-sm tabular-nums ${item.color}`}>{item.value}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-brand-purple-400" />
            <h3 className="text-xs font-semibold text-white font-display uppercase tracking-wider">Database</h3>
          </div>
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 bg-white/5 rounded animate-pulse w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              {[
                { label: "Portfolio", value: stats?.portfolioStats?.total || 0 },
                { label: "Services", value: stats?.totalServices || 0 },
                { label: "Pricing", value: stats?.totalPricing || 0 },
                { label: "Photos", value: stats?.totalPricing || 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-mono text-sm tabular-nums text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-4 w-4 text-brand-purple-400" />
            <h3 className="text-xs font-semibold text-white font-display uppercase tracking-wider">Pending Actions</h3>
          </div>
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-white/5 rounded animate-pulse w-full" />
              ))}
            </div>
          ) : pendingActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-400/50 mb-2" />
              <p className="text-xs text-gray-500">All caught up</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-brand-purple-400/30 hover:bg-brand-purple-500/5 transition-all group"
                >
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{action.label}</span>
                  <span className="text-xs font-mono font-semibold text-brand-purple-400">{action.count}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-display">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-brand-purple-400/30 hover:bg-brand-purple-500/5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-purple-500/10 flex items-center justify-center text-brand-purple-400 group-hover:bg-brand-purple-500 group-hover:text-white transition-all duration-200 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-brand-purple-300 transition-colors">{action.label}</p>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">{action.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-brand-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Go
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-display">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            <>
              <ActivityTable
                title="Recent Commissions"
                items={stats?.recentCommissions || []}
                fields={[
                  { key: "client_name", label: "Client" },
                  { key: "service", label: "Service" },
                  { key: "status", label: "Status", isStatus: true },
                  { key: "created_at", label: "Date", isDate: true },
                ]}
                href="/admin/commissions"
                emptyMessage="No commissions yet."
              />
              <ActivityTable
                title="Recent Reviews"
                items={stats?.recentReviews || []}
                fields={[
                  { key: "display_name", label: "Reviewer" },
                  { key: "rating", label: "Rating", isRating: true },
                  { key: "status", label: "Status", isStatus: true },
                  { key: "created_at", label: "Date", isDate: true },
                ]}
                href="/admin/reviews"
                emptyMessage="No reviews yet."
              />
              <ActivityTable
                title="Recent Support"
                items={stats?.recentSupport || []}
                fields={[
                  { key: "client_name", label: "Client" },
                  { key: "subject", label: "Subject" },
                  { key: "status", label: "Status", isStatus: true },
                  { key: "created_at", label: "Date", isDate: true },
                ]}
                href="/admin/support"
                emptyMessage="No support requests yet."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityTable({
  title,
  items,
  fields,
  href,
  emptyMessage,
}: {
  title: string;
  items: any[];
  fields: { key: string; label: string; isStatus?: boolean; isDate?: boolean; isRating?: boolean }[];
  href: string;
  emptyMessage: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-xs font-semibold text-white font-display uppercase tracking-wider">{title}</h3>
        <a href={href} className="text-[11px] text-brand-purple-400 hover:text-brand-purple-300 transition-colors font-medium flex items-center gap-0.5">
          View all
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
      <div className="divide-y divide-white/5 flex-1">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-2xl font-bold text-white/5 font-display mb-1">0</p>
            <p className="text-[11px] text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{String(item[fields[0].key])}</p>
                <p className="text-xs text-gray-500 truncate">
                  {fields[1].isRating ? (
                    <span className="text-yellow-400">{"★".repeat(item[fields[1].key])}</span>
                  ) : (
                    String(item[fields[1].key])
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                {fields[2].isStatus && <StatusBadge status={String(item[fields[2].key])} />}
                <span className="text-[11px] text-gray-500 tabular-nums">
                  {fields[3].isDate ? new Date(item[fields[3].key]).toLocaleDateString() : String(item[fields[3].key])}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    REVIEWING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ACCEPTED: "bg-green-500/10 text-green-400 border-green-500/20",
    IN_PROGRESS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    WAITING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DECLINED: "bg-red-500/10 text-red-400 border-red-500/20",
    RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
    CLOSED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
      {String(status).replace(/_/g, " ")}
    </span>
  );
}
