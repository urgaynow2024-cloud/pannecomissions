import AdminLayout from "@/app/admin/(admin)/layout";
import prisma from "@/lib/prisma";

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

    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of Panne Commissions.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard title="Portfolio" value={portfolioCount.toString()} subtitle="SFW items" href="/admin/portfolio" />
            <StatCard title="NSFW" value={nsfwCount.toString()} subtitle="NSFW items" href="/admin/nsfw" />
            <StatCard title="Reviews" value={pendingReviews.toString()} subtitle="Pending approval" href="/admin/reviews" />
            <StatCard title="Commissions" value={pendingCommissions.toString()} subtitle="New enquiries" href="/admin/commissions" />
            <StatCard title="Support" value={openSupport.toString()} subtitle="Open requests" href="/admin/support" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentTable title="Recent Commissions" items={recentCommissions} fields={["client_name", "service", "status", "created_at"]} href="/admin/commissions" />
            <RecentTable title="Recent Reviews" items={recentReviews} fields={["display_name", "rating", "status", "created_at"]} href="/admin/reviews" />
            <RecentTable title="Recent Support" items={recentSupport} fields={["client_name", "subject", "status", "created_at"]} href="/admin/support" />
          </div>
        </div>
      </AdminLayout>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of Panne Commissions.</p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Database Connection Error</h3>
            <p className="text-sm text-gray-400 mb-4">
              Could not connect to the database. Please make sure:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
              <li>Your Supabase project is not paused</li>
              <li>The DATABASE_URL is correct in your environment variables</li>
              <li>You have run the schema.sql in Supabase SQL Editor</li>
              <li>Your database tables exist</li>
            </ul>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

function StatCard({ title, value, subtitle, href }: { title: string; value: string; subtitle: string; href: string }) {
  return (
    <a href={href} className="group block rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 transition-all duration-200">
      <div className="h-1 w-8 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all duration-200 mb-3" />
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </a>
  );
}

function RecentTable({
  title,
  items,
  fields,
  href,
}: {
  title: string;
  items: any[];
  fields: string[];
  href: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <a href={href} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-white/5">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-500">No entries yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{item[fields[0]]}</p>
                <p className="text-xs text-gray-500 truncate">{item[fields[1]]}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <StatusBadge status={item[fields[2]]} />
                <span className="text-xs text-gray-500">{new Date(item[fields[3]]).toLocaleDateString()}</span>
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
