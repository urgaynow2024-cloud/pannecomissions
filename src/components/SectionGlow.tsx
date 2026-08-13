"use client";

interface SectionGlowProps {
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

export default function SectionGlow({ intensity = "subtle", className = "" }: SectionGlowProps) {
  const opacityMap = {
    subtle: "opacity-[0.03]",
    medium: "opacity-[0.05]",
    strong: "opacity-[0.07]",
  };

  const blurMap = {
    subtle: "blur-[100px]",
    medium: "blur-[120px]",
    strong: "blur-[140px]",
  };

  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-brand-purple-500 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 6s ease-in-out infinite" }}
      />
      <div
        className={`absolute bottom-[-10%] right-[15%] w-[40%] h-[40%] rounded-full bg-brand-purple-600 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 6s ease-in-out infinite 3s" }}
      />
      <div
        className={`absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] rounded-full bg-brand-purple-500 ${blurMap[intensity]} ${opacityMap[intensity]}`}
        style={{ animation: "ambient-pulse 8s ease-in-out infinite 1.5s" }}
      />
    </div>
  );
}
