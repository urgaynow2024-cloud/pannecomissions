"use client";

import { useEffect, useRef } from "react";

const CHARS = ["✦", "✧", "⋆", "·"];
const TINTS = ["#a855f7", "#c084fc", "#d8b4fe", "#7e22ce", "#ffffff", "#e9d5ff", "#f3e8ff"];
const GLOW_COLORS = [
  "rgba(168, 85, 247, 0.35)",
  "rgba(192, 132, 252, 0.3)",
  "rgba(216, 180, 254, 0.25)",
  "rgba(126, 34, 206, 0.3)",
  "rgba(255, 255, 255, 0.15)",
  "rgba(233, 213, 255, 0.2)",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface SparkleFieldProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  className?: string;
  glow?: boolean;
}

export default function SparkleField({
  count = 10,
  minSize = 6,
  maxSize = 18,
  minOpacity = 0.15,
  maxOpacity = 0.45,
  className = "",
  glow = true,
}: SparkleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const size = rand(minSize, maxSize);
      const opacity = rand(minOpacity, maxOpacity);
      const duration = rand(4, 9);
      const delay = rand(0, 8);
      const top = rand(0, 100);
      const left = rand(0, 100);
      const rotation = rand(0, 360);
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      el.textContent = char;
      el.style.top = `${top}%`;
      el.style.left = `${left}%`;
      el.style.fontSize = `${size}px`;
      el.style.setProperty("--base-opacity", String(opacity));
      el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
      el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
      el.style.transform = `rotate(${rotation}deg)`;

      if (glow && Math.random() > 0.4) {
        el.classList.add("has-glow");
        el.style.textShadow = `0 0 ${rand(6, 14)}px ${pick(GLOW_COLORS)}`;
      }

      fragment.appendChild(el);
    }

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, [count, minSize, maxSize, minOpacity, maxOpacity, glow]);

  return (
    <div
      ref={containerRef}
      className={`sparkle-field ${className}`}
      aria-hidden="true"
    />
  );
}
