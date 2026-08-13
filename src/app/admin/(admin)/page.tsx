import AdminLayout from "@/app/admin/(admin)/layout";
import prisma from "@/lib/prisma";
import { Image, Shield, Star, DollarSign, ClipboardList, HelpCircle, Upload, EyeOff, CheckSquare, AlertTriangle, CheckCircle } from "lucide-react";

async function safeCount(promise: Promise<any>): Promise<number> {
  try { const v = await promise; return typeof v === "number" ? v : 0; } catch { return 0; }
}

async function safeFindMany(promise: Promise<any[]>): Promise<any[]> {
  try { return await promise; } catch { return []; }
}

async function getHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/health`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  let health: any = null;
  try {
    health = await getHealth();
  } catch {
    health = null;
  }

  const hasSchemaIssue = health?.missing?.length > 0;

  let stats = [
    { label: "Portfolio", value: 0, subtitle: "SFW published", href: "/admin/portfolio", icon: Image },
    { label: "NSFW", value: 0, subtitle: "Adult published", href: "/admin/nsfw", icon: Shield },
    { label: "Reviews", value: 0, subtitle: "Pending approval", href: "/admin/reviews", icon: Star },
    { label: "Commissions", value: 0, subtitle: "Awaiting response", href: "/admin/commissions", icon: ClipboardList },
    { label: "Support", value: 0, subtitle: "Open requests", href: "/admin/support", icon: HelpCircle },
  ];

  let recentCommissions: any[] = [];
  let recentReviews: any[] = [];
  let recentSupport: any[] = [];

  try {
    const closedFilter = { status: { not: "CLOSED" } } as const;
    const [
      portfolioCount,
      nsfwCount,
      pendingReviews,
      pendingCommissions,
      openSupport,
      rc,
      rr,
      rs,
    ] = await Promise.all([
      safeCount(prisma.PortfolioItem.count({ where: { nsfw: false } })),
      safeCount(prisma.PortfolioItem.count({ where: { nsfw: true } })),
      safeCount(prisma.Review.count({ where: { status: "PENDING" } })),
      safeCount(prisma.CommissionSubmission.count({ where: { status: "PENDING" } })),
      safeCount(prisma.SupportRequest.count({ where: closedFilter })),
      safeFindMany(prisma.CommissionSubmission.findMany({ take: 5, orderBy: { created_at: "desc" } })),
      safeFindMany(prisma.Review.findMany({ take: 5, orderBy: { created_at: "desc" } })),
      safeFindMany(prisma.SupportRequest.findMany({ take: 5, orderBy: { created_at: "desc" } })),
    ]);

    stats = [
      { label: "Portfolio", value: portfolioCount, subtitle: "SFW published", href: "/admin/portfolio", icon: Image },
      { label: "NSFW", value: nsfwCount, subtitle: "Adult published", href: "/admin/nsfw", icon: Shield },
      { label: "Reviews", value: pendingReviews, subtitle: "Pending approval", href: "/admin/reviews", icon: Star },
      { label: "Commissions", value: pendingCommissions, subtitle: "Awaiting response", href: "/admin/commissions", icon: ClipboardList },
      { label: "Support", value: openSupport, subtitle: "Open requests", href: "/admin/support", icon: HelpCircle },
    ];
    recentCommissions = rc;
    recentReviews = rr;
    recentSupport = rs;
  } catch {
    // stats remain zeros
  }

  const quickActions = [
    { label: "Upload Portfolio Work", href: "/admin/portfolio", icon: Upload },
    { label: "Add NSFW Work", href: "/admin/nsfw", icon: EyeOff },
    { label: "Review Submissions", href: "/admin/reviews", icon: CheckSquare },
    { label: "Edit Pricing", href: "/admin/pricing", icon: DollarSign },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 animate-fade-in">
        {hasSchemaIssue && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white mb-1 font-display">Setup required before uploads work</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Your Supabase database/storage is missing required items. Follow these exact steps:
                </p>
                <div className="space-y-3">
                  {health.missing.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-brand-purple-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">How to fix:</p>
                  <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Open Supabase → <strong>SQL Editor</strong></li>
                    <li>Paste the entire contents of <code className="text-brand-purple-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code></li>
                    <li>Run it</li>
                    <li>Go to Supabase → <strong>Storage</strong> → create bucket named <code className="text-brand-purple-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">pannecomissions</code> (Public)</li>
                    <li>Redeploy on Vercel</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {health && !hasSchemaIssue && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
            <p className="text-sm text-green-300">All systems ready — uploads should work.</p>
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white font-display">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-brand-purple-300 to-brand-purple-500 bg-clip-text text-transparent">
              Panne.
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Here&apos;s what&apos;s happening with your studio.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="group relative flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-brand-purple-400/30 transition-all duration-200 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-purple-500/0 via-brand-purple-500 to-brand-purple-500/0 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="h-4 w-4 text-gray-500 group-hover:text-brand-purple-400 transition-colors" />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-4xl font-bold text-white font-display tracking-tight">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1.5">{stat.subtitle}</p>
            </a>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 font-display">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-brand-purple-400/30 hover:bg-brand-purple-500/5 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-purple-500/10 flex items-center justify-center text-brand-purple-400 group-hover:bg-brand-purple-500 group-hover:text-white transition-all duration-200 shrink-0">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 font-display">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ActivityTable
              title="Recent Commissions"
              items={recentCommissions}
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
              items={recentReviews}
              fields={[
                { key: "display_name", label: "Reviewer" },
                { key: "rating", label: "Rating" },
                { key: "status", label: "Status", isStatus: true },
                { key: "created_at", label: "Date", isDate: true },
              ]}
              href="/admin/reviews"
              emptyMessage="No reviews yet."
            />
            <ActivityTable
              title="Recent Support"
              items={recentSupport}
              fields={[
                { key: "client_name", label: "Client" },
                { key: "subject", label: "Subject" },
                { key: "status", label: "Status", isStatus: true },
                { key: "created_at", label: "Date", isDate: true },
              ]}
              href="/admin/support"
              emptyMessage="No support requests yet."
            />
          </div>
        </div>
      </div>
    </AdminLayout>
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
  fields: { key: string; label: string; isStatus?: boolean; isDate?: boolean }[];
  href: string;
  emptyMessage: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white font-display">{title}</h3>
        <a href={href} className="text-xs text-brand-purple-400 hover:text-brand-purple-300 transition-colors font-medium">
          View all
        </a>
      </div>
      <div className="divide-y divide-white/5 flex-1">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-3xl font-bold text-white/5 font-display mb-1">0</p>
            <p className="text-xs text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{String(item[fields[0].key])}</p>
                <p className="text-xs text-gray-500 truncate">{String(item[fields[1].key])}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <StatusBadge status={String(item[fields[2].key])} />
                <span className="text-xs text-gray-500 tabular-nums">
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
    PENDING: "bg-yellow-500/10 text-yellow-400",
    APPROVED: "bg-green-500/10 text-green-400",
    REJECTED: "bg-red-500/10 text-red-400",
    REVIEWING: "bg-blue-500/10 text-blue-400",
    ACCEPTED: "bg-green-500/10 text-green-400",
    IN_PROGRESS: "bg-purple-500/10 text-purple-400",
    WAITING: "bg-orange-500/10 text-orange-400",
    COMPLETED: "bg-emerald-500/10 text-emerald-400",
    DECLINED: "bg-red-500/10 text-red-400",
    RESOLVED: "bg-green-500/10 text-green-400",
    CLOSED: "bg-gray-500/10 text-gray-400",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>
      {String(status).replace(/_/g, " ")}
    </span>
  );
}
