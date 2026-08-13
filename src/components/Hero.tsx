"use client";

import Link from "next/link";
import Image from "next/image";
import { useParallax } from "./ScrollReveal";
import { ArrowRight, Sparkles } from "lucide-react";
import SparkleField from "./SparkleField";

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
}

interface HeroProps {
  featuredItem: PortfolioItem | null;
}

export default function Hero({ featuredItem }: HeroProps) {
  const { ref: bgRef, transform: bgTransform } = useParallax(0.1);
  const { ref: imgRef, transform: imgTransform } = useParallax(0.05);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{ transform: bgTransform }}
      >
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-brand-purple-500/10 rounded-full blur-[160px]" style={{ animation: "pulseGlow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-brand-purple-600/8 rounded-full blur-[140px]" style={{ animation: "pulseGlow 8s ease-in-out infinite 3s" }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-purple-500/5 rounded-full blur-[200px]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-brand-purple-400/6 rounded-full blur-[100px]" style={{ animation: "pulseGlow 6s ease-in-out infinite 1.5s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-6 space-y-8 relative z-10">
            <div className="relative">
              <SparkleField count={8} minSize={4} maxSize={12} minOpacity={0.2} maxOpacity={0.6} className="-inset-6" glow />
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-purple-500/25 bg-brand-purple-500/8 px-4 py-1.5 backdrop-blur-sm relative z-10">
                <Sparkles className="h-3.5 w-3.5 text-brand-purple-400" />
                <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                  VRChat Avatar Creator
                </span>
              </div>
            </div>

            <div className="space-y-1 relative">
              <div className="absolute -inset-4 -z-10">
                <div className="absolute top-0 right-0">
                  <span className="text-brand-purple-400/30 text-2xl animate-sparkle-float heading-sparkle">✦</span>
                </div>
                <div className="absolute bottom-0 left-0">
                  <span className="text-brand-purple-400/25 text-xl animate-sparkle-float heading-sparkle" style={{ animationDelay: "-2s" }}>✧</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter text-white leading-[0.85] font-display relative">
                PANNE
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05] font-display">
                VRCHAT AVATAR
                <br />
                <span className="text-brand-purple-400 relative">
                  COMMISSIONS
                  <span className="absolute -right-6 top-0 text-brand-purple-400/40 text-xl animate-sparkle-pulse heading-sparkle">✦</span>
                </span>
              </h2>
            </div>

            <p className="text-base md:text-lg text-gray-400 max-w-md leading-relaxed relative z-10">
              Handmade VRChat avatars, outfits, textures, and toggles. Work you can feel in-game.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-brand-purple-500/40 bg-brand-purple-500/10 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-purple-400 hover:bg-brand-purple-500/15 hover:shadow-[0_0_40px_rgba(147,51,234,0.25)] hover:-translate-y-0.5 btn-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <span className="text-brand-purple-300 text-sm animate-sparkle-float inline-block" style={{ animationDuration: "3s" }}>✦</span>
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-brand-purple-500/40 hover:bg-white/5 hover:text-white hover:-translate-y-0.5"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div
            ref={imgRef}
            className="lg:col-span-6 relative -mt-4 lg:-mt-12"
            style={{ transform: imgTransform }}
          >
            <div className="relative lg:-mr-8 xl:-mr-16">
              <div className="absolute -inset-8 bg-gradient-to-br from-brand-purple-500/15 via-brand-purple-500/8 to-transparent rounded-3xl blur-3xl" />
              <div className="absolute -inset-4 bg-gradient-to-t from-brand-purple-500/6 via-transparent to-transparent rounded-2xl blur-xl" />

              <SparkleField count={8} minSize={3} maxSize={10} minOpacity={0.15} maxOpacity={0.4} className="absolute inset-0 z-20 pointer-events-none" glow />

              {featuredItem ? (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl border border-brand-purple-500/10 shadow-2xl artwork-glow">
                  <Image
                    src={featuredItem.image_url}
                    alt={featuredItem.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/6 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="text-brand-purple-400/60 text-2xl animate-sparkle-float">✦</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-brand-purple-400/50 text-lg animate-sparkle-float" style={{ animationDelay: "-3s" }}>✧</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-2">
                      Featured Work
                    </p>
                    <p className="text-xl font-semibold text-white font-display">{featuredItem.title}</p>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] border border-brand-purple-500/10 bg-white/[0.02] flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/10 via-brand-purple-500/4 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-500/6 via-transparent to-transparent" />
                  <div className="text-center space-y-5 relative z-10">
                    <span className="text-6xl text-brand-purple-400/25 animate-gentle-float inline-block">✦</span>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white/60 font-display tracking-widest uppercase">
                        Featured Work
                      </p>
                      <p className="text-sm text-gray-600 max-w-[220px] mx-auto leading-relaxed">
                        Your latest work will live here once portfolio pieces are added.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
