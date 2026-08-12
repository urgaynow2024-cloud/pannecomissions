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

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((items: PortfolioItem[]) => {
        const featuredItem = items.find((item) => item.featured) || items[0];
        setFeatured(featuredItem || null);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              VRChat Avatar <span className="text-purple-400">Commissions</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Custom avatar work for VRChat. Clothing, textures, complete avatars, toggles, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors"
              >
                View My Work
              </Link>
              <Link
                href="/commission"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white rounded-lg font-semibold transition-colors"
              >
                Commission Me
              </Link>
            </div>
          </div>

          <div className="relative">
            {featured ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5">
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-medium text-purple-400 mb-1">Featured Work</p>
                  <p className="text-lg font-semibold text-white">{featured.title}</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <p className="text-sm text-gray-500">Featured work will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
