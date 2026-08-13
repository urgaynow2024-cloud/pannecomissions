"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lightbox from "./Lightbox";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
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
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-3">
                Selected Work
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
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
                className="group relative lg:col-span-7 aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 text-left w-full"
              >
                <img
                  src={items[0].image_url}
                  alt={items[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1.5">
                    Featured
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-white font-display">{items[0].title}</p>
                </div>
              </button>
            </ScrollReveal>

            <div className="lg:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
              {items.slice(1, 3).map((item, i) => (
                <ScrollReveal key={item.id} delay={(i + 1) * 120}>
                  <button
                    onClick={() => openLightbox(i + 1)}
                    className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 text-left w-full"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1">
                        Featured
                      </p>
                      <p className="text-base font-semibold text-white font-display">{item.title}</p>
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
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 text-left w-full"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1.5">
                      Featured
                    </p>
                    <p className="text-lg font-semibold text-white font-display">{item.title}</p>
                  </div>
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
