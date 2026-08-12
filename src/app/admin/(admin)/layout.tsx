import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
  } catch (error) {
    console.error("Admin auth error:", error);
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
