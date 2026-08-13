"use client";

import { useEffect, useRef } from "react";

const CHARS = ["✦", "✧", "⋆", "·"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
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
  minOpacity = 0.08,
  maxOpacity = 0.35,
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

      if (glow && Math.random() > 0.6) {
        el.classList.add("has-glow");
        el.style.textShadow = `0 0 ${rand(4, 10)}px rgba(168, 85, 247, ${rand(0.2, 0.5).toFixed(2)})`;
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
