import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommissionForm from "@/components/CommissionForm";

export default function NSFWPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-xs font-medium text-red-300 uppercase tracking-wider">
              18+ Adults Only
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            NSFW Commissions
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            You must be 18 or older to view this content. All work here is intended for mature audiences only.
          </p>
        </div>
        <CommissionForm nsfw={true} />
      </div>
      <Footer />
    </main>
  );
}
