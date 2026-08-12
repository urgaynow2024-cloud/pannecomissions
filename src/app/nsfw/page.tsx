import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeVerifier from "@/components/AgeVerifier";

export default function NSFWPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <AgeVerifier />
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
            Adult VRChat avatar work. You must be 18 or older.
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <p className="text-gray-400">NSFW portfolio and commission form coming soon.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
