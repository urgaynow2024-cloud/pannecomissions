"use client";

import { useState, useEffect } from "react";
import Lightbox from "./Lightbox";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface NSFWPortfolioProps {
  items: PortfolioItem[];
}

export default function NSFWPortfolio({ items }: NSFWPortfolioProps) {
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
      <div className="text-center py-20">
        <p className="text-gray-500">No NSFW portfolio items yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
            className="group relative w-full overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-brand-purple-500/30 break-inside-avoid text-left"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
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
