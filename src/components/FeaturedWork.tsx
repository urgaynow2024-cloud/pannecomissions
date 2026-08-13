"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lightbox from "./Lightbox";
import ScrollReveal from "./ScrollReveal";

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

  return (
    <section className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
                Selected Work
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
                Featured
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
            >
              View Full Portfolio
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
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 100}>
              <button
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 text-left w-full"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-1.5">
                    Featured
                  </p>
                  <p className="text-lg font-semibold text-white font-display">{item.title}</p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
          >
            View Full Portfolio
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
