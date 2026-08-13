"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(147,51,234,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-tight text-white font-display group"
          >
            PANNE
            <span className="text-brand-purple-400 group-hover:text-brand-purple-300 transition-colors duration-300">
              {" "}Commissions
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm tracking-wide transition-colors duration-200 py-1 group ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-brand-purple-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="/nsfw"
              className="text-sm text-gray-500 hover:text-red-400 transition-colors duration-200"
            >
              18+ NSFW
            </Link>
            <Link
              href="/commission"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-purple-400 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Commission Me
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/commission"
              className="text-sm font-semibold text-brand-purple-400 hover:text-brand-purple-300 transition-colors"
            >
              Commission Me
            </Link>
            <button
              className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl animate-fade-in-up">
          <div className="px-6 py-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 text-base transition-colors border-b border-white/5 last:border-0 ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/nsfw"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base text-gray-500 hover:text-red-400 transition-colors border-b border-white/5"
            >
              18+ NSFW
            </Link>
            <div className="pt-4">
              <Link
                href="/commission"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-brand-purple-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-purple-400 transition-colors"
              >
                Commission Me
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
