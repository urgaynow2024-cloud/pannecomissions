"use client";

import { useState, useEffect, useCallback } from "react";

interface LightboxProps {
  items: { id: string; title: string; image_url: string; description?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ items, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goTo = useCallback((newIndex: number) => {
    setIndex((prev) => {
      const wrapped = ((newIndex % items.length) + items.length) % items.length;
      return wrapped;
    });
  }, [items.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goTo, index]);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  const item = items[index];

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 shrink-0">
          <p className="text-sm font-medium text-white truncate">{item.title}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(index - 1)}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-white/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Previous"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-white/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Next"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-white/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-4 pb-4 flex items-center justify-center">
          <img
            src={item.image_url}
            alt={item.title}
            className="max-w-full max-h-[75vh] object-contain rounded-lg"
          />
        </div>
        {item.description && (
          <div className="p-6 pt-2 border-t border-white/5 shrink-0">
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
