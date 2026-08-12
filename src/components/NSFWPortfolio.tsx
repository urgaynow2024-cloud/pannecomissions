"use client";

import { useState, useEffect } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  featured: boolean;
  nsfw: boolean;
}

export default function NSFWPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/portfolio/nsfw")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : prev));
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : prev));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No NSFW portfolio items yet.</p>
      </div>
    );
  }

  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative w-full overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-purple-500/30 break-inside-avoid"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-base font-semibold text-white">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm text-gray-300 line-clamp-2">{item.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4">
              <p className="text-sm font-medium text-white">{selected.title}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : prev));
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : prev));
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 pb-4">
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>
            {selected.description && (
              <div className="p-6 border-t border-white/5">
                <p className="text-sm text-gray-400">{selected.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
