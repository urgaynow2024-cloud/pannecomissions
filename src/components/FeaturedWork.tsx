"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lightbox from "./Lightbox";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight } from "lucide-react";
import SparkleField from "./SparkleField";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description: string | null;
  image_url: string;
}

interface FeaturedWorkProps {
  items: PortfolioItem[];
}

export default function FeaturedWork({ items }: FeaturedWorkProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev + 1) % items.length);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, items.length]);

  if (items.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[500px] bg-brand-purple-500/10 rounded-full blur-[140px]" style={{ animation: "pulseGlow 7s ease-in-out infinite, ambient-drift 25s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[400px] bg-brand-purple-600/8 rounded-full blur-[120px]" style={{ animation: "pulseGlow 7s ease-in-out infinite 3s, ambient-drift 30s ease-in-out infinite reverse" }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple-500/6 rounded-full blur-[180px]" style={{ animation: "ambient-drift 28s ease-in-out infinite" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 md:mb-14 relative">
            <SparkleField count={6} minSize={4} maxSize={14} minOpacity={0.25} maxOpacity={0.55} className="-inset-6" glow />
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-3">
                Selected Work
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display heading-pop">
                Featured <span className="text-brand-purple-400">✦</span>
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
            >
              View Full Portfolio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {items.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <ScrollReveal delay={0}>
              <button
                onClick={() => openLightbox(0)}
                 className="group relative lg:col-span-7 aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/35 text-left w-full artwork-glow"
              >
                 <img
                   src={items[0].image_url}
                    alt="Artwork"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                    }}
                  />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/10 via-brand-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <span className="text-brand-purple-400/50 text-sm animate-sparkle-float">✦</span>
                 </div>
               </button>
             </ScrollReveal>

             <div className="lg:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
               {items.slice(1, 3).map((item, i) => (
                 <ScrollReveal key={item.id} delay={(i + 1) * 120}>
                   <button
                     onClick={() => openLightbox(i + 1)}
                     className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/35 text-left w-full artwork-glow"
                   >
                      <img
                        src={item.image_url}
                        alt="Artwork"
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       loading="lazy"
                       onError={(e) => {
                         (e.target as HTMLImageElement).src =
                           "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                       }}
                     />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-brand-purple-400/50 text-sm animate-sparkle-float" style={{ animationDelay: "-1s" }}>✦</span>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {items.length < 2 && (
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(i)}
                   className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/35 text-left w-full artwork-glow"
                >
                   <img
                     src={item.image_url}
                     alt="Artwork"
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     loading="lazy"
                     onError={(e) => {
                       (e.target as HTMLImageElement).src =
                         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                     }}
                   />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {items.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
            >
              View Full Portfolio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
