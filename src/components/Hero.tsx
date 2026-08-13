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
  const { ref: bgRef, transform: bgTransform } = useParallax(0.15);
  const { ref: imgRef, transform: imgTransform } = useParallax(0.08);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{ transform: bgTransform }}
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-purple-500/8 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-purple-600/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple-500/3 rounded-full blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-purple-500/20 bg-brand-purple-500/5 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-purple-400" />
              <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                Panne Commissions
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95] font-display">
                PANNE
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display">
                VRCHAT AVATAR
                <br />
                <span className="text-brand-purple-400">COMMISSIONS</span>
              </h2>
            </div>

            <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
              Avatars, outfits, textures, toggles and custom work. Crafted with care for the VRChat community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-purple-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <span className="text-brand-purple-200">✦</span>
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
            className="lg:col-span-5 relative"
            style={{ transform: imgTransform }}
          >
            <div className="relative">
              {featuredItem ? (
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                  <Image
                    src={featuredItem.image_url}
                    alt={featuredItem.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/5 to-transparent" />
                  <div className="absolute top-4 right-4 w-24 h-24 border-t border-r border-brand-purple-500/20 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-2">
                      Featured Work
                    </p>
                    <p className="text-xl font-semibold text-white font-display">{featuredItem.title}</p>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[3/4] md:aspect-[4/5] border border-white/5 bg-white/[0.02] flex items-center justify-center">
                  <p className="text-sm text-gray-600 text-center px-6">
                    Featured work will appear here once portfolio items are added.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
