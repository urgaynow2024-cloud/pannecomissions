import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-purple-500/6 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-brand-purple-600/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-brand-purple-500/4 rounded-full blur-[80px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple-500/20 bg-brand-purple-500/5 px-4 py-1.5 backdrop-blur-sm mb-8">
          <Sparkles className="h-3.5 w-3.5 text-brand-purple-400" />
          <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
            Let&apos;s work together
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display mb-6 leading-[1.05]">
          WANT SOMETHING
          <br />
          <span className="text-brand-purple-400">MADE?</span>
        </h2>

        <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
          Tell me what you&apos;re thinking. No pressure, just a conversation about your avatar.
        </p>

        <Link
          href="/commission"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand-purple-500 px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-2">
            Commission Me
            <span className="text-brand-purple-200">✦</span>
            <Sparkles className="h-4 w-4 text-brand-purple-200" />
          </span>
        </Link>
      </div>
    </section>
  );
}
