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

interface Layer {
  count: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
  minDuration: number;
  maxDuration: number;
  zIndex: number;
}

const LAYERS: Layer[] = [
  { count: 15, minSize: 4, maxSize: 10, minOpacity: 0.1, maxOpacity: 0.25, minDuration: 8, maxDuration: 16, zIndex: 0 },
  { count: 10, minSize: 6, maxSize: 14, minOpacity: 0.18, maxOpacity: 0.4, minDuration: 5, maxDuration: 10, zIndex: 1 },
  { count: 6, minSize: 8, maxSize: 18, minOpacity: 0.28, maxOpacity: 0.55, minDuration: 3, maxDuration: 7, zIndex: 2 },
];

export default function SparkleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();

    LAYERS.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const el = document.createElement("span");
        el.setAttribute("aria-hidden", "true");

        const size = rand(layer.minSize, layer.maxSize);
        const opacity = rand(layer.minOpacity, layer.maxOpacity);
        const duration = rand(layer.minDuration, layer.maxDuration);
        const delay = rand(0, layer.maxDuration);
        const hasGlow = Math.random() > 0.5;
        const top = rand(0, 100);
        const left = rand(0, 100);
        const rotation = rand(0, 360);

        el.textContent = pick(CHARS);
        el.style.top = `${top}%`;
        el.style.left = `${left}%`;
        el.style.fontSize = `${size}px`;
        el.style.color = pick(TINTS);
        el.style.zIndex = String(layer.zIndex);
        el.style.setProperty("--base-opacity", String(opacity));
        el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
        el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
        el.style.transform = `rotate(${rotation}deg)`;

        if (hasGlow) {
          el.style.textShadow = `0 0 ${rand(8, 18)}px ${pick(GLOW_COLORS)}`;
        }

        fragment.appendChild(el);
      }
    });

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sparkle-system"
      aria-hidden="true"
    />
  );
}
