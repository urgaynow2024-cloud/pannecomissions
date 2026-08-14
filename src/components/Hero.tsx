"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParallax } from "./ScrollReveal";
import { ArrowRight } from "lucide-react";
import SparkleField from "./SparkleField";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  image_url: string;
}

interface HeroProps {
  featuredItem: PortfolioItem | null;
}

export default function Hero({ featuredItem }: HeroProps) {
  const { ref: bgRef, transform: bgTransform } = useParallax(0.1);
  const { ref: imgRef, transform: imgTransform } = useParallax(0.05);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const bgParallax = isMobile ? bgTransform : `${bgTransform} translate3d(${mousePos.x * -4}px, ${mousePos.y * -3}px, 0)`;
  const imgParallax = isMobile ? imgTransform : `${imgTransform} translate3d(${mousePos.x * 6}px, ${mousePos.y * 4}px, 0)`;
  const artworkParallax = isMobile ? "" : `translate3d(${mousePos.x * 3}px, ${mousePos.y * 2}px, 0)`;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transform: bgParallax }}
      >
        <div className="absolute top-[-10%] left-[10%] w-[900px] h-[700px] bg-brand-purple-500/15 rounded-full blur-[180px]" style={{ animation: "pulseGlow 8s ease-in-out infinite, ambient-drift 25s ease-in-out infinite" }} />
        <div className="absolute bottom-[-5%] right-[5%] w-[800px] h-[600px] bg-brand-purple-600/12 rounded-full blur-[160px]" style={{ animation: "pulseGlow 8s ease-in-out infinite 3s, ambient-drift 30s ease-in-out infinite reverse" }} />
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-brand-purple-500/10 rounded-full blur-[200px]" style={{ animation: "ambient-drift 28s ease-in-out infinite" }} />
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[400px] bg-brand-purple-400/10 rounded-full blur-[140px]" style={{ animation: "pulseGlow 6s ease-in-out infinite 1.5s, ambient-drift 22s ease-in-out infinite 2s" }} />
        <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[500px] bg-brand-purple-700/8 rounded-full blur-[180px]" style={{ animation: "pulseGlow 10s ease-in-out infinite 2s, ambient-drift 35s ease-in-out infinite 1s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-6 space-y-8 relative z-10">
            <div className="relative">
              <SparkleField count={6} minSize={4} maxSize={14} minOpacity={0.15} maxOpacity={0.4} className="-inset-8" glow layers="single" />
              <div className="relative z-10 space-y-1">
                <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter text-white leading-[0.85] font-display relative heading-pop">
                  PANNE
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.05] font-display heading-pop">
                  VRCHAT AVATAR
                  <br />
                  <span className="text-brand-purple-400">COMMISSIONS</span>
                </h2>
              </div>

              <p className="text-base md:text-lg text-gray-400 max-w-md leading-relaxed relative z-10 text-pop">
                Handmade VRChat avatars, outfits, textures, and toggles. Work you can feel in-game.
              </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/commission"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-brand-purple-500/40 bg-brand-purple-500/10 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-purple-400 hover:bg-brand-purple-500/15 hover:shadow-[0_0_60px_rgba(147,51,234,0.35)] hover:-translate-y-0.5 btn-glow active:scale-[0.97] active:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commission Me
                  <span className="text-brand-purple-300 text-sm animate-sparkle-float inline-block" style={{ animationDuration: "3s" }}>✦</span>
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-brand-purple-500/40 hover:bg-white/5 hover:text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] hover:-translate-y-0.5 btn-glow active:scale-[0.97] active:translate-y-0"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          </div>

          <div
            ref={imgRef}
            className="lg:col-span-6 relative -mt-4 lg:-mt-12"
            style={{ transform: imgParallax }}
          >
            <div className="relative lg:-mr-8 xl:-mr-16" style={!isMobile ? { transform: artworkParallax } : undefined}>
              <div className="absolute -inset-12 bg-gradient-to-br from-brand-purple-500/20 via-brand-purple-500/10 to-transparent rounded-[3rem] blur-3xl" />
              <div className="absolute -inset-6 bg-gradient-to-t from-brand-purple-500/10 via-transparent to-transparent rounded-2xl blur-2xl" />

              <SparkleField count={10} minSize={3} maxSize={12} minOpacity={0.2} maxOpacity={0.5} className="absolute inset-0 z-20 pointer-events-none" glow layers="single" />

              {featuredItem ? (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl border border-brand-purple-500/15 shadow-2xl artwork-glow">
                  <Image
                    src={featuredItem.image_url}
                     alt="Featured artwork"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23111'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/15 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/10 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="text-brand-purple-400/70 text-2xl animate-sparkle-float">✦</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-brand-purple-400/60 text-lg animate-sparkle-float" style={{ animationDelay: "-3s" }}>✧</span>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] border border-brand-purple-500/15 bg-white/[0.02] flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/15 via-brand-purple-500/6 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-500/10 via-transparent to-transparent" />
                  <div className="text-center space-y-5 relative z-10">
                    <span className="text-6xl text-brand-purple-400/30 animate-gentle-float inline-block">✦</span>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white/60 font-display tracking-widest uppercase">
                        Featured Work
                      </p>
                      <p className="text-sm text-gray-600 max-w-[220px] mx-auto leading-relaxed">
                        Your latest work will live here once portfolio pieces are added.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
