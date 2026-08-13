"use client";

export default function HorizontalStrip() {
  const items = [
    "VRCHAT AVATARS",
    "CUSTOM TEXTURES",
    "TOGGLES",
    "CLOTHING",
    "MODELS",
    "AVATARS",
  ];

  const content = [...items, ...items].join(" ✦ ");

  return (
    <div className="relative py-6 md:py-8 overflow-hidden border-y border-white/5">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple-500/20 to-transparent" />
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-purple-500/20 to-transparent" />
      <div className="flex whitespace-nowrap animate-scroll-strip">
        <span className="text-[11px] md:text-xs font-semibold text-gray-600 uppercase tracking-[0.3em] px-4">
          {content}
        </span>
        <span className="text-[11px] md:text-xs font-semibold text-gray-600 uppercase tracking-[0.3em] px-4">
          {content}
        </span>
      </div>
    </div>
  );
}
