"use client";

import { useState, useEffect } from "react";
import Lightbox from "./Lightbox";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description?: string | null;
  image_url: string;
}

interface PortfolioProps {
  items: PortfolioItem[];
  isAdmin?: boolean;
}

export default function Portfolio({ items, isAdmin }: PortfolioProps) {
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

  if (items.length === 0) {
    return (
      <div className="text-center py-24 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-brand-purple-500/8 rounded-full blur-[120px]" />
        </div>
        <div className="space-y-5 relative z-10">
          <span className="text-5xl text-brand-purple-400/30 animate-sparkle-float inline-block">✦</span>
          <p className="text-lg font-semibold text-white/50 font-display tracking-wider uppercase">
            Featured Work
          </p>
          <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
            Your latest work will live here once portfolio pieces are added.
          </p>
        </div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[600px] h-[500px] bg-brand-purple-500/6 rounded-full blur-[140px]" style={{ animation: "pulseGlow 7s ease-in-out infinite, ambient-drift 25s ease-in-out infinite" }} />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[400px] bg-brand-purple-600/5 rounded-full blur-[120px]" style={{ animation: "pulseGlow 7s ease-in-out infinite 3s, ambient-drift 30s ease-in-out infinite reverse" }} />
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative w-full break-inside-avoid text-left overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-brand-purple-500/35 hover:shadow-[0_0_50px_rgba(168,85,247,0.12)] mb-4 md:mb-6 artwork-glow"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.image_url}
                alt="Portfolio artwork"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/10 via-brand-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-3 right-3">
                <span className="text-brand-purple-400/40 text-sm animate-sparkle-float opacity-0 group-hover:opacity-100 transition-opacity duration-500">✦</span>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              {item.description && (
                <p className="mt-1.5 text-sm text-gray-300 line-clamp-2">{item.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
