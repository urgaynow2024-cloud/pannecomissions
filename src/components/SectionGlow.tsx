"use client";

interface SectionGlowProps {
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

export default function SectionGlow({ intensity = "subtle", className = "" }: SectionGlowProps) {
  const opacityMap = {
    subtle: "opacity-[0.08]",
    medium: "opacity-[0.12]",
    strong: "opacity-[0.18]",
  };

  const blurMap = {
    subtle: "blur-[120px]",
    medium: "blur-[140px]",
    strong: "blur-[160px]",
  };

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`absolute top-[-15%] left-[15%] w-[55%] h-[55%] rounded-full bg-brand-purple-500 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 7s ease-in-out infinite, ambient-drift 25s ease-in-out infinite" }}
      />
      <div
        className={`absolute bottom-[-15%] right-[10%] w-[45%] h-[45%] rounded-full bg-brand-purple-600 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 7s ease-in-out infinite 3s, ambient-drift 30s ease-in-out infinite reverse" }}
      />
      <div
        className={`absolute top-[35%] left-[50%] -translate-x-1/2 w-[65%] h-[35%] rounded-full bg-brand-purple-500 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 9s ease-in-out infinite 1.5s, ambient-drift 28s ease-in-out infinite" }}
      />
    </div>
  );
}
