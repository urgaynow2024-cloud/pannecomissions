"use client";

import { useState } from "react";
import FeaturedWork from "@/components/FeaturedWork";
import Lightbox from "@/components/Lightbox";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description: string | null;
  image_url: string;
  visible: boolean;
}

interface HomepagePreviewProps {
  items: PortfolioItem[];
}

export default function HomepagePreview({ items }: HomepagePreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const visibleItems = items.filter((p) => p.visible !== false).slice(0, 6);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-1">Homepage Preview</p>
          <h3 className="text-lg font-semibold text-white font-display">Show Us What You Have</h3>
        </div>
        <Link href="/portfolio" className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors">
          View Full Portfolio
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {visibleItems.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
          <p className="text-gray-400 text-sm">No visible portfolio items to preview.</p>
          <p className="text-gray-500 text-xs mt-1">Publish items to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          {visibleItems.length >= 2 && (
            <button
              onClick={() => openLightbox(0)}
              className="group relative lg:col-span-7 aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] text-left w-full"
            >
              <img src={visibleItems[0].image_url} alt="Artwork" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          )}

          <div className={visibleItems.length >= 2 ? "lg:col-span-5 grid grid-cols-1 gap-3 md:gap-4" : "lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"}>
            {visibleItems.length >= 2
              ? visibleItems.slice(1, 3).map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => openLightbox(i + 1)}
                    className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] text-left w-full"
                  >
                    <img src={item.image_url} alt="Artwork" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                ))
              : visibleItems.slice(1).map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => openLightbox(i + 1)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] text-left w-full"
                  >
                    <img src={item.image_url} alt="Artwork" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                ))}
          </div>
        </div>
      )}

      {visibleItems.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          Showing {visibleItems.length} of {items.filter((p) => p.visible !== false).length} visible items
          {visibleItems.length < 3 && " — add more items for a fuller preview"}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          items={visibleItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
