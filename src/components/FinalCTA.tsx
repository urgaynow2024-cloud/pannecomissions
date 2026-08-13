import Link from "next/link";
import SectionGlow from "./SectionGlow";
import SparkleField from "./SparkleField";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-brand-purple-500/10 rounded-full blur-[180px]" style={{ animation: "pulseGlow 7s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-brand-purple-600/8 rounded-full blur-[160px]" style={{ animation: "pulseGlow 7s ease-in-out infinite 3s" }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-purple-500/6 rounded-full blur-[200px]" />
      </div>
      <SectionGlow intensity="strong" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border border-brand-purple-500/10 bg-white/[0.02] artwork-glow">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple-500/15 via-brand-purple-500/6 to-transparent rounded-3xl blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/12 via-brand-purple-500/4 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-500/8 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-5">
                  <span className="text-7xl animate-gentle-float inline-block text-brand-purple-400/30">✦</span>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Your next avatar starts here.
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-brand-purple-400/40 text-2xl animate-sparkle-float">✦</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-brand-purple-400/30 text-xl animate-sparkle-float" style={{ animationDelay: "-2s" }}>✧</span>
              </div>
              <div className="absolute top-1/2 left-4">
                <span className="text-brand-purple-400/20 text-lg animate-sparkle-float" style={{ animationDelay: "-4s" }}>⋆</span>
              </div>
            </div>
            <SparkleField count={8} minSize={2} maxSize={10} minOpacity={0.2} maxOpacity={0.5} className="absolute inset-0 z-20 pointer-events-none" glow />
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple-500/20 bg-brand-purple-500/5 px-4 py-1.5 backdrop-blur-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 text-brand-purple-400" />
              <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                Let&apos;s work together
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display mb-6 leading-[1.05] relative">
              <SparkleField count={6} minSize={4} maxSize={12} minOpacity={0.2} maxOpacity={0.5} className="-inset-6" glow />
              <span className="relative z-10">
                WANT SOMETHING
                <br />
                <span className="text-brand-purple-400">MADE?</span>
              </span>
            </h2>

            <p className="text-gray-400 max-w-lg mx-auto lg:mx-0 mb-10 text-lg leading-relaxed">
              Tell Panne what you&apos;re thinking. No pressure, just a conversation about your avatar.
            </p>

            <Link
              href="/commission"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-brand-purple-500/40 bg-brand-purple-500/10 px-10 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-purple-400 hover:bg-brand-purple-500/15 hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 btn-glow"
            >
              <span className="relative z-10 flex items-center gap-2">
                Commission Me
                <span className="text-brand-purple-300 animate-sparkle-float inline-block" style={{ animationDuration: "3s" }}>✦</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
