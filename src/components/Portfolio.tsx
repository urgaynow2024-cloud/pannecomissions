"use client";

import { useState, useEffect } from "react";
import Lightbox from "./Lightbox";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
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
        <div className="space-y-4 relative z-10">
          <span className="text-4xl text-brand-purple-400/20 animate-sparkle-float inline-block">✦</span>
          <p className="text-gray-500 text-lg">No portfolio work yet.</p>
          {isAdmin && (
            <button className="text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors border border-brand-purple-500/30 rounded-lg px-4 py-2 hover:bg-brand-purple-500/5">
              Upload Work
            </button>
          )}
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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative w-full break-inside-avoid text-left overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-brand-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)] mb-4 md:mb-6 artwork-glow"
          >
            <div className="relative overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
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
              <p className="text-base font-semibold text-white font-display">{item.title}</p>
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
