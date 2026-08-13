import AdminLayout from "@/app/admin/(admin)/layout";
import prisma from "@/lib/prisma";
import { Image, Shield, Star, DollarSign, ClipboardList, HelpCircle, Upload, EyeOff, CheckSquare } from "lucide-react";

export default async function AdminDashboard() {
  try {
    const [
      portfolioCount,
      nsfwCount,
      pendingReviews,
      pendingCommissions,
      openSupport,
      recentCommissions,
      recentReviews,
      recentSupport,
    ] = await Promise.all([
      prisma.PortfolioItem.count({ where: { nsfw: false } }),
      prisma.PortfolioItem.count({ where: { nsfw: true } }),
      prisma.Review.count({ where: { status: "PENDING" } }),
      prisma.CommissionSubmission.count({ where: { status: "PENDING" } }),
      prisma.SupportRequest.count({ where: { status: { not: "CLOSED" } } }),
      prisma.CommissionSubmission.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
      }),
      prisma.Review.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
      }),
      prisma.SupportRequest.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
      }),
    ]);

    const stats = [
      { label: "Portfolio", value: portfolioCount, subtitle: "SFW published", href: "/admin/portfolio", icon: Image },
      { label: "NSFW", value: nsfwCount, subtitle: "Adult published", href: "/admin/nsfw", icon: Shield },
      { label: "Reviews", value: pendingReviews, subtitle: "Pending approval", href: "/admin/reviews", icon: Star },
      { label: "Commissions", value: pendingCommissions, subtitle: "Awaiting response", href: "/admin/commissions", icon: ClipboardList },
      { label: "Support", value: openSupport, subtitle: "Open requests", href: "/admin/support", icon: HelpCircle },
    ];

    const quickActions = [
      { label: "Upload Portfolio Work", href: "/admin/portfolio", icon: Upload },
      { label: "Add NSFW Work", href: "/admin/nsfw", icon: EyeOff },
      { label: "Review Submissions", href: "/admin/reviews", icon: CheckSquare },
      { label: "Edit Pricing", href: "/admin/pricing", icon: DollarSign },
    ];

    return (
      <AdminLayout>
        <div className="space-y-10 animate-fade-in">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight text-white font-display">
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-brand-purple-300 to-brand-purple-500 bg-clip-text text-transparent">
                Panne.
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Here&apos;s what&apos;s happening with your studio.</p>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-brand-purple-500/10 rounded-full blur-3xl pointer-events-none" />
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
  } catch (error) {
    console.error("[Dashboard] Failed to load data:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isSchemaIssue = errorMessage.includes("does not exist");
    
    return (
      <AdminLayout>
        <div className="space-y-10 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white font-display">
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-brand-purple-300 to-brand-purple-500 bg-clip-text text-transparent">
                Panne.
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Here&apos;s what&apos;s happening with your studio.</p>
          </div>
          
          {isSchemaIssue && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-lg">⚠</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1 font-display">Database setup required</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Your database is missing required columns/tables. This is why uploads and some admin features are failing.
                  </p>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 mb-4">
                    <p className="text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">Fix:</p>
                    <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                      <li>Go to Supabase → <strong>SQL Editor</strong></li>
                      <li>Open <code className="text-brand-purple-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">supabase/schema.sql</code> in your project</li>
                      <li>Paste the entire contents into the SQL Editor and run it</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                  <form method="GET" action="/admin">
                    <button type="submit" className="rounded-lg bg-brand-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
                      Refresh After Fix
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="text-base font-semibold text-white mb-2 font-display">Unable to load dashboard data</h3>
            <p className="text-sm text-gray-400 mb-4">
              {isSchemaIssue 
                ? "The database schema needs to be updated before the dashboard can load. Follow the instructions above."
                : "We couldn't retrieve the latest information. Please check your connection and try again."}
            </p>
            {!isSchemaIssue && (
              <form method="GET" action="/admin">
                <button type="submit" className="rounded-lg bg-brand-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-500 transition-colors">
                  Try Again
                </button>
              </form>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }
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
