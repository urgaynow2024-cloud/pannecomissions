"use client";

import Link from "next/link";
import Image from "next/image";
import { useParallax } from "./ScrollReveal";
import { ArrowRight, Sparkles } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
}

interface HeroProps {
  featuredItem: PortfolioItem | null;
}

export default function Hero({ featuredItem }: HeroProps) {
  const { ref: bgRef, transform: bgTransform } = useParallax(0.12);
  const { ref: imgRef, transform: imgTransform } = useParallax(0.06);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{ transform: bgTransform }}
      >
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-brand-purple-500/6 rounded-full blur-[140px]" style={{ animation: "pulseGlow 6s ease-in-out infinite" }} />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-brand-purple-600/4 rounded-full blur-[120px]" style={{ animation: "pulseGlow 6s ease-in-out infinite 2s" }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple-500/3 rounded-full blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-6 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-purple-500/20 bg-brand-purple-500/5 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-purple-400" />
              <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                VRChat Avatar Creator
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-6xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tighter text-white leading-[0.9] font-display">
                PANNE
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05] font-display">
                VRCHAT AVATAR
                <br />
                <span className="text-brand-purple-400">COMMISSIONS</span>
              </h2>
            </div>

            <p className="text-base md:text-lg text-gray-400 max-w-md leading-relaxed">
              Handmade VRChat avatars, outfits, textures, and toggles. Work you can feel in-game.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-purple-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-[0_0_35px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <span className="text-brand-purple-200 text-sm">✦</span>
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
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple-500/10 via-brand-purple-500/5 to-transparent rounded-3xl blur-2xl" />

              {featuredItem ? (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                  <Image
                    src={featuredItem.image_url}
                    alt={featuredItem.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/5 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="text-brand-purple-400/40 text-2xl animate-sparkle-float">✦</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-brand-purple-400/30 text-lg animate-sparkle-float" style={{ animationDelay: "-3s" }}>✧</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-2">
                      Featured Work
                    </p>
                    <p className="text-xl font-semibold text-white font-display">{featuredItem.title}</p>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] border border-white/5 bg-white/[0.02] flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/8 via-transparent to-transparent" />
                  <div className="text-center space-y-4 relative z-10">
                    <span className="text-5xl text-brand-purple-400/20 animate-gentle-float inline-block">✦</span>
                    <p className="text-sm text-gray-600 px-6">
                      Featured work will appear here once portfolio items are added.
                    </p>
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
