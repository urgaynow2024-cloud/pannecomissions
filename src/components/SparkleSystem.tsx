"use client";

import { useEffect, useRef, useCallback } from "react";

const SPARKLE_CHARS = ["✦", "✧", "⋆", "·", "•", "∘"];
const TINTS = ["#a855f7", "#c084fc", "#d8b4fe", "#7e22ce", "#ffffff", "#e9d5ff", "#f3e8ff", "#e0e7ff"];
const GLOW_COLORS = [
  "rgba(168, 85, 247, 0.4)",
  "rgba(192, 132, 252, 0.35)",
  "rgba(216, 180, 254, 0.3)",
  "rgba(126, 34, 206, 0.35)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(233, 213, 255, 0.3)",
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
  parallaxStrength: number;
}

const LAYERS: LayerConfig[] = [
  { count: 20, minSize: 2, maxSize: 6, minOpacity: 0.06, maxOpacity: 0.18, minDuration: 10, maxDuration: 24, zIndex: 0, glowChance: 0.12, parallaxStrength: 0.5 },
  { count: 15, minSize: 4, maxSize: 10, minOpacity: 0.1, maxOpacity: 0.25, minDuration: 7, maxDuration: 16, zIndex: 1, glowChance: 0.22, parallaxStrength: 1.5 },
  { count: 10, minSize: 8, maxSize: 18, minOpacity: 0.15, maxOpacity: 0.35, minDuration: 5, maxDuration: 12, zIndex: 2, glowChance: 0.3, parallaxStrength: 3 },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SparkleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkleRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const reducedMotion = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

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
    const handleMouse = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();
    let sparkleIndex = 0;

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
        const hasGlow = Math.random() < layer.glowChance;

        el.textContent = char;
        el.style.top = `${top}%`;
        el.style.left = `${left}%`;
        el.style.fontSize = `${size}px`;
        el.style.color = pick(TINTS);
        el.style.zIndex = String(layer.zIndex);
        el.style.setProperty("--base-opacity", String(opacity));
        el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
        el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
        el.style.setProperty("--drift-x", `${rand(-50, 50).toFixed(0)}px`);
        el.style.setProperty("--drift-y", `${rand(-60, 20).toFixed(0)}px`);
        el.style.setProperty("--drift-rotate", `${rand(-180, 180).toFixed(0)}deg`);
        el.style.transform = `rotate(${rotation}deg)`;
        el.classList.add(anim);

        if (hasGlow) {
          el.classList.add("has-glow");
          el.style.textShadow = `0 0 ${rand(10, 24)}px ${pick(GLOW_COLORS)}`;
        }

        fragment.appendChild(el);
        sparkleRefs.current.set(sparkleIndex, el);
        sparkleIndex++;
      }
    });

    container.appendChild(fragment);

    const updateParallax = () => {
      if (reducedMotion.current) return;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      let idx = 0;
      LAYERS.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          const el = sparkleRefs.current.get(idx);
          if (el) {
            const strength = layer.parallaxStrength;
            const tx = mx * strength;
            const ty = my * strength;
            el.style.marginLeft = `${tx}px`;
            el.style.marginTop = `${ty}px`;
          }
          idx++;
        }
      });
      rafId.current = requestAnimationFrame(updateParallax);
    };

    if (!reducedMotion.current) {
      rafId.current = requestAnimationFrame(updateParallax);
    }

    return () => {
      container.innerHTML = "";
      sparkleRefs.current.clear();
      if (rafId.current) cancelAnimationFrame(rafId.current);
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
