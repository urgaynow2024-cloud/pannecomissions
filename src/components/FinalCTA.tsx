import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple-500/6 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-4">
          Ready?
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display mb-6">
          WANT SOMETHING<br />MADE?
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
          Tell me what you&apos;re thinking. No pressure, just a conversation about your avatar.
        </p>
        <Link
          href="/commission"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand-purple-500 px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-xl hover:shadow-brand-purple-500/20 hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-2">
            Commission Me
            <span className="text-brand-purple-200">✦</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
