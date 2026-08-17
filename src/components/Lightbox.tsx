"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface LightboxItem {
  id: string;
  image_url: string;
  description?: string | null;
}

interface LightboxProps {
  items: LightboxItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const goTo = useCallback(
    (newIndex: number) => {
      const wrapped = ((newIndex % items.length) + items.length) % items.length;
      setIndex(wrapped);
    },
    [items.length]
  );

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsOpen(true);
    } else {
      const raf = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(raf);
    }

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goTo, index]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(index + 1);
      else goTo(index - 1);
    }
  };

  const item = items[index];
  if (!item) return null;

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url) || url.startsWith("data:video");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full max-h-[90vh] flex flex-col ${
          isOpen ? "animate-fade-in" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 shrink-0">
          <div className="w-8" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(index - 1)}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-purple-500/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Previous"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-purple-500/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Next"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white hover:bg-purple-500/10 transition-all duration-200 hover:border-purple-500/30"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="flex-1 overflow-auto px-4 pb-4 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isVideo(item.image_url) ? (
            <video
              src={item.image_url}
              controls
              autoPlay
              className="max-w-full max-h-[75vh] rounded-lg"
            />
          ) : (
            <img
              src={item.image_url}
              alt="Artwork"
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
          )}
        </div>
        {item.description && (
          <div className="p-6 pt-2 border-t border-white/5 shrink-0">
            <p className="text-sm text-gray-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
