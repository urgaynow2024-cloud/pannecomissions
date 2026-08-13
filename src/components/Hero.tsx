"use client";

import Link from "next/link";
import Image from "next/image";
import { useParallax } from "./ScrollReveal";

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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple-500/8 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-brand-purple-600/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-purple-500/20 bg-brand-purple-500/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest">
                Panne Commissions
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] font-display">
              VRCHAT AVATAR
              <br />
              <span className="text-brand-purple-400">COMMISSIONS</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
              Avatars, outfits, textures, toggles and custom work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-purple-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-xl hover:shadow-brand-purple-500/20 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-brand-purple-500/40 hover:bg-white/5 hover:text-white hover:-translate-y-0.5"
              >
                View My Work
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div
            ref={imgRef}
            className="lg:col-span-5 relative"
            style={{ transform: imgTransform }}
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 group">
              {featuredItem ? (
                <>
                  <Image
                    src={featuredItem.image_url}
                    alt={featuredItem.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-2">
                      Featured Work
                    </p>
                    <p className="text-xl font-semibold text-white font-display">{featuredItem.title}</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
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
