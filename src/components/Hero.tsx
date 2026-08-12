"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  featured: boolean;
}

export default function Hero() {
  const [featured, setFeatured] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((items: PortfolioItem[]) => {
        const featuredItem = items.find((item) => item.featured) || items[0];
        setFeatured(featuredItem || null);
      })
      .catch(() => {
        setFeatured(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">
                Panne Commissions
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              VRChat Avatar <span className="text-purple-400">Commissions</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Avatars, outfits, toggles and custom work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 hover:text-white"
              >
                View Portfolio
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              </div>
            ) : featured ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 group">
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-medium text-purple-400 mb-1">Featured Work</p>
                  <p className="text-lg font-semibold text-white">{featured.title}</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <p className="text-sm text-gray-500">Featured work will appear here once portfolio items are added.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
