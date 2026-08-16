"use client";

import { useState, useEffect, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";

interface AboutSectionProps {
  aboutText?: string;
  aboutImageUrl?: string | null;
  imageFit?: string;
  imagePosition?: string;
  portfolioItems?: Array<{ id: string; image_url: string; display_title: string | null }>;
}

export default function AboutSection({ aboutText, aboutImageUrl, imageFit = "cover", imagePosition = "center", portfolioItems = [] }: AboutSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const visiblePortfolio = portfolioItems.filter((item) => item.image_url);
  const hasCarousel = visiblePortfolio.length > 1;

  const nextSlide = useCallback(() => {
    if (isAnimating || !hasCarousel) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % visiblePortfolio.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, hasCarousel, visiblePortfolio.length]);

  useEffect(() => {
    if (!hasCarousel) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [hasCarousel, nextSlide]);

  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[5%] w-[700px] h-[600px] bg-brand-purple-500/10 rounded-full blur-[160px]" style={{ animation: "pulseGlow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[400px] bg-brand-purple-600/6 rounded-full blur-[140px]" style={{ animation: "pulseGlow 8s ease-in-out infinite 4s" }} />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em]">
                About
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[0.95] heading-pop">
                HEY, I&apos;M PANNE.
                <span className="text-brand-purple-400"> ✦</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-md">
                {aboutText || "I make VRChat avatars, outfits, textures and other projects people ask me to build."}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Every piece is made to feel right in-game. I care about how things move, how textures read in lighting, and whether something actually feels good to use.
              </p>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
                {aboutImageUrl ? (
                  <img
                    src={aboutImageUrl}
                    alt="About Panne"
                    className="w-full h-full object-cover"
                    style={{ objectFit: imageFit === "contain" ? "contain" : "cover", objectPosition: imagePosition }}
                    loading="lazy"
                  />
                ) : hasCarousel ? (
                  <div className="relative w-full h-full overflow-hidden">
                    {visiblePortfolio.map((item, index) => (
                      <div
                        key={item.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentIndex
                            ? "opacity-100 scale-100"
                            : index === (currentIndex - 1 + visiblePortfolio.length) % visiblePortfolio.length
                            ? "opacity-0 scale-105 -translate-x-full"
                            : "opacity-0 scale-105 translate-x-full"
                        }`}
                      >
                        <img
                          src={item.image_url}
                          alt={item.display_title || `Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {visiblePortfolio.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (isAnimating) return;
                              setIsAnimating(true);
                              setCurrentIndex(index);
                              setTimeout(() => setIsAnimating(false), 600);
                            }}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                      <span className="text-white/40 text-xs font-mono">
                        {currentIndex + 1} / {visiblePortfolio.length}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/15 via-brand-purple-500/5 to-transparent" />
                )}
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
