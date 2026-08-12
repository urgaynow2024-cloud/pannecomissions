import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-gray-400">Admin functionality coming soon.</p>
      </div>
      <Footer />
    </main>
  );
}
