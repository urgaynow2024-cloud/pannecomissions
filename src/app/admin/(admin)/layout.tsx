import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const admin = await verifySession();
    if (!admin) {
      redirect("/admin/login");
    }

    return (
      <div className="min-h-screen bg-brand-dark text-white antialiased flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen flex flex-col">
          <AdminTopBar username={admin.username} />
          <main className="flex-1 p-4 md:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    );
  } catch {
    redirect("/admin/login");
  }
}
