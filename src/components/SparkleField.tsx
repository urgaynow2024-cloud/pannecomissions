"use client";

import { useEffect, useRef, useCallback } from "react";

const SPARKLE_CHARS = ["✦", "✧", "⋆", "·", "•", "∘"];
const TINTS = ["#a855f7", "#c084fc", "#d8b4fe", "#7e22ce", "#ffffff", "#e9d5ff", "#f3e8ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#ffffff"];
const GLOW_COLORS = [
  "rgba(168, 85, 247, 0.4)",
  "rgba(192, 132, 252, 0.35)",
  "rgba(216, 180, 254, 0.3)",
  "rgba(126, 34, 206, 0.35)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(233, 213, 255, 0.3)",
  "rgba(199, 210, 254, 0.25)",
  "rgba(165, 180, 252, 0.2)",
];

const ANIMATIONS = [
  "anim-drift-right",
  "anim-drift-up",
  "anim-drift-diagonal",
  "anim-appear-fade",
  "anim-rotate-drift",
  "anim-gentle-pulse",
];

interface LayerConfig {
  count: number;
  minSize: number;
  maxSize: number;
  minOpacity: number;
  maxOpacity: number;
  minDuration: number;
  maxDuration: number;
  zIndex: number;
  glowChance: number;
}

const LAYERS: LayerConfig[] = [
  { count: 18, minSize: 2, maxSize: 6, minOpacity: 0.08, maxOpacity: 0.2, minDuration: 8, maxDuration: 20, zIndex: 0, glowChance: 0.15 },
  { count: 14, minSize: 4, maxSize: 10, minOpacity: 0.12, maxOpacity: 0.3, minDuration: 6, maxDuration: 14, zIndex: 1, glowChance: 0.25 },
  { count: 8, minSize: 8, maxSize: 16, minOpacity: 0.18, maxOpacity: 0.4, minDuration: 4, maxDuration: 10, zIndex: 2, glowChance: 0.35 },
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
  layers?: "single" | "auto";
}

export default function SparkleField({
  count = 10,
  minSize = 6,
  maxSize = 18,
  minOpacity = 0.15,
  maxOpacity = 0.45,
  className = "",
  glow = true,
  layers = "single",
}: SparkleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  const handleMotionChange = useCallback(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    handleMotionChange();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", handleMotionChange);
    return () => mq.removeEventListener("change", handleMotionChange);
  }, [handleMotionChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();

    if (layers === "auto") {
      LAYERS.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          const el = document.createElement("span");
          el.setAttribute("aria-hidden", "true");

          const size = rand(layer.minSize, layer.maxSize);
          const opacity = rand(layer.minOpacity, layer.maxOpacity);
          const duration = rand(layer.minDuration, layer.maxDuration);
          const delay = rand(0, layer.maxDuration);
          const top = rand(-5, 105);
          const left = rand(-5, 105);
          const rotation = rand(0, 360);
          const char = pick(SPARKLE_CHARS);
          const anim = reducedMotion.current ? "anim-gentle-pulse" : pick(ANIMATIONS);
          const hasGlow = glow && Math.random() < layer.glowChance;

          el.textContent = char;
          el.style.top = `${top}%`;
          el.style.left = `${left}%`;
          el.style.fontSize = `${size}px`;
          el.style.color = pick(TINTS);
          el.style.zIndex = String(layer.zIndex);
          el.style.setProperty("--base-opacity", String(opacity));
          el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
          el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
          el.style.setProperty("--drift-x", `${rand(-40, 40).toFixed(0)}px`);
          el.style.setProperty("--drift-y", `${rand(-50, 20).toFixed(0)}px`);
          el.style.setProperty("--drift-rotate", `${rand(-180, 180).toFixed(0)}deg`);
          el.style.transform = `rotate(${rotation}deg)`;
          el.classList.add(anim);

          if (hasGlow) {
            el.classList.add("has-glow");
            el.style.textShadow = `0 0 ${rand(8, 20)}px ${pick(GLOW_COLORS)}`;
          }

          fragment.appendChild(el);
        }
      });
    } else {
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        const size = rand(minSize, maxSize);
        const opacity = rand(minOpacity, maxOpacity);
        const duration = rand(4, 10);
        const delay = rand(0, 10);
        const top = rand(-5, 105);
        const left = rand(-5, 105);
        const rotation = rand(0, 360);
        const char = pick(SPARKLE_CHARS);
        const anim = reducedMotion.current ? "anim-gentle-pulse" : pick(ANIMATIONS);
        const hasGlow = glow && Math.random() > 0.5;

        el.textContent = char;
        el.style.top = `${top}%`;
        el.style.left = `${left}%`;
        el.style.fontSize = `${size}px`;
        el.style.color = pick(TINTS);
        el.style.setProperty("--base-opacity", String(opacity));
        el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
        el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
        el.style.setProperty("--drift-x", `${rand(-40, 40).toFixed(0)}px`);
        el.style.setProperty("--drift-y", `${rand(-50, 20).toFixed(0)}px`);
        el.style.setProperty("--drift-rotate", `${rand(-180, 180).toFixed(0)}deg`);
        el.style.transform = `rotate(${rotation}deg)`;
        el.classList.add(anim);

        if (hasGlow) {
          el.classList.add("has-glow");
          el.style.textShadow = `0 0 ${rand(6, 16)}px ${pick(GLOW_COLORS)}`;
        }

        fragment.appendChild(el);
      }
    }

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, [count, minSize, maxSize, minOpacity, maxOpacity, className, glow, layers]);

  return (
    <div
      ref={containerRef}
      className={`sparkle-field ${className}`}
      aria-hidden="true"
    />
  );
}
