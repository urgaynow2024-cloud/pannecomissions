"use client";

import ScrollReveal from "./ScrollReveal";

export default function AboutSection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                About
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[0.95]">
                HEY, I&apos;M PANNE.
                <span className="text-brand-purple-400"> ✦</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-md">
                I make VRChat avatars, outfits, textures and other projects people ask me to build.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Every piece is made to feel right in-game. I care about how things move, how textures read in lighting, and whether something actually feels good to use.
              </p>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/8 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <span className="text-6xl animate-gentle-float inline-block">✦</span>
                    <p className="text-sm text-gray-600 max-w-xs mx-auto">
                      Real artwork will appear here from the portfolio.
                    </p>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="text-brand-purple-400/30 text-2xl animate-sparkle-float">✦</span>
                </div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-brand-purple-400/20 text-xl animate-sparkle-float" style={{ animationDelay: "-2s" }}>✧</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
