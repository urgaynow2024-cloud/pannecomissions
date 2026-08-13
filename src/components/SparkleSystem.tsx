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
  { count: 25, minSize: 3, maxSize: 12, minOpacity: 0.12, maxOpacity: 0.3, minDuration: 6, maxDuration: 18, zIndex: 0 },
  { count: 18, minSize: 6, maxSize: 16, minOpacity: 0.2, maxOpacity: 0.45, minDuration: 4, maxDuration: 12, zIndex: 1 },
  { count: 12, minSize: 10, maxSize: 24, minOpacity: 0.3, maxOpacity: 0.6, minDuration: 2, maxDuration: 8, zIndex: 2 },
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
        const hasGlow = Math.random() > 0.4;
        const top = rand(0, 100);
        const left = rand(0, 100);
        const rotation = rand(0, 360);

        el.textContent = pick(CHARS);
        el.style.position = "absolute";
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
          el.style.textShadow = `0 0 ${rand(10, 24)}px ${pick(GLOW_COLORS)}`;
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
