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

export default function FeaturedWork() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch portfolio");
        return res.json();
      })
      .then((all: PortfolioItem[]) => {
        const featured = all.filter((item) => item.featured);
        setItems(featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || error || items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Featured Work
            </h2>
            <p className="text-gray-400 max-w-xl">
              Recent VRChat avatar work.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Full Portfolio
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/portfolio#${item.id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-purple-500/30"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-sm font-medium text-purple-400 mb-1">Featured</p>
                <p className="text-lg font-semibold text-white">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Full Portfolio
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
