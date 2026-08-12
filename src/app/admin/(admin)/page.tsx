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
            <p className="text-gray-400 mt-1">Overview of your website activity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Portfolio" value={portfolioCount.toString()} subtitle="SFW items" href="/admin/portfolio" />
            <StatCard title="NSFW" value={nsfwCount.toString()} subtitle="NSFW items" href="/admin/nsfw" />
            <StatCard title="Reviews" value={pendingReviews.toString()} subtitle="Pending approval" href="/admin/reviews" />
            <StatCard title="Commissions" value={pendingCommissions.toString()} subtitle="New enquiries" href="/admin/commissions" />
            <StatCard title="Support" value={openSupport.toString()} subtitle="Open requests" href="/admin/support" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentTable title="Recent Commissions" items={recentCommissions} fields={["client_name", "service", "status", "created_at"]} href="/admin/commissions" />
            <RecentTable title="Recent Reviews" items={recentReviews} fields={["client_name", "rating", "status", "created_at"]} href="/admin/reviews" />
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
            <p className="text-gray-400 mt-1">Overview of your website activity.</p>
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
    <a href={href} className="block rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:border-purple-500/30 transition-colors">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
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
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <a href={href} className="text-xs text-purple-400 hover:text-purple-300">View all</a>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No entries yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="min-w-0">
                <p className="text-white truncate">{item[fields[0]]}</p>
                <p className="text-gray-500 truncate">{item[fields[1]]}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">{new Date(item[fields[3]]).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
