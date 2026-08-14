import Link from "next/link";

const footerLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/support", label: "Support" },
  { href: "/nsfw", label: "18+ NSFW" },
];

interface FooterProps {
  portfolioItems?: { image_url: string }[];
}

export default function Footer({ portfolioItems = [] }: FooterProps) {
  const displayItems = portfolioItems.slice(0, 6);

  return (
    <footer className="relative border-t border-white/5 bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[500px] h-[400px] bg-brand-purple-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[600px] h-[200px] bg-brand-purple-500/8 rounded-full blur-[140px]" />
      </div>

      {displayItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {displayItems.map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] opacity-50 hover:opacity-100 transition-opacity duration-300 hover:border-brand-purple-500/20"
              >
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight text-white font-display group">
              PANNE
              <span className="text-brand-purple-400 group-hover:text-brand-purple-300 transition-colors duration-300 animate-sparkle-float inline-block">
                {" "}✦
              </span>
            </Link>
            <p className="mt-2 text-xs text-gray-600">
              VRCHAT COMMISSIONS
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Panne. All rights reserved.
          </p>
          <Link
            href="/commission"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-brand-purple-500/40 bg-brand-purple-500/10 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-purple-400 hover:bg-brand-purple-500/15 hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] hover:-translate-y-0.5 btn-glow active:scale-[0.97] active:translate-y-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Commission Me
              <span className="text-brand-purple-300 text-xs animate-sparkle-float inline-block">✦</span>
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
