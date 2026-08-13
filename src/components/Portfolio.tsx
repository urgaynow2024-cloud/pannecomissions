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

const Sparkle = () => (
  <svg
    className="absolute w-3 h-3 text-brand-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    style={{ top: "20%", right: "15%" }}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

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
      <div className="text-center py-24">
        <p className="text-gray-500 text-lg mb-4">No portfolio work yet.</p>
        {isAdmin && (
          <button className="text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors border border-brand-purple-500/30 rounded-lg px-4 py-2 hover:bg-brand-purple-500/5">
            Upload Work
          </button>
        )}
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getItemClasses = (index: number) => {
    const base = "group relative w-full break-inside-avoid text-left overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-brand-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]";
    const variations = [
      "mb-4 md:mb-6",
      "mb-8 md:mb-12 -mt-2 md:-mt-4",
      "mb-6 md:mb-10 mt-4 md:mt-8",
      "mb-10 md:mb-16",
      "mb-4 md:mb-8 -mt-4 md:-mt-8",
    ];
    return `${base} ${variations[index % variations.length]}`;
  };

  return (
    <div className="relative">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className={getItemClasses(index)}
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
              <Sparkle />
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
