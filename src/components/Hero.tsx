"use client";

import Link from "next/link";
import CommissionForm from "@/components/CommissionForm";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black" />

      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">
            VRChat Avatar Commissions
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Custom Avatars,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Crafted For You
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-12 leading-relaxed">
          Professional avatar customisation, clothing additions, complete setups, toggles, and custom textures.
          Bring your VRChat avatar to the next level.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
          <Link
            href="/portfolio"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
          >
            View Portfolio
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white rounded-lg font-semibold transition-all duration-200 hover:bg-white/5"
          >
            Get in Touch
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Start a Commission
            </h2>
            <p className="text-gray-400 mb-8">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
            <CommissionForm />
          </div>
        </div>
      </div>
    </section>
  );
}
