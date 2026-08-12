"use client";

import { useState, useEffect } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  featured: boolean;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No portfolio items yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-gray-900 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-gray-300 line-clamp-2">{item.description}</p>
              )}
            </div>
            {item.featured && (
              <div className="absolute top-4 right-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                Featured
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedItem.image_url}
              alt={selectedItem.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="mt-2 text-gray-400">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
