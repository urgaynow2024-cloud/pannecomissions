"use client";

import { useEffect, useRef } from "react";

const SPARKLE_COUNT = 25;
const SPARKLE_CHARS = ["✦", "✧", "⋆"];
const TINTS = ["#a855f7", "#c084fc", "#7e22ce"];

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SparkleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");

      const size = Math.random() < 0.7 ? random(8, 12) : random(12, 18);
      const opacity = random(0.08, 0.2);
      const duration = random(5, 10);
      const delay = random(0, 6);
      const hasGlow = Math.random() > 0.75;

      el.textContent = pick(SPARKLE_CHARS);
      el.style.left = `${random(0, 100)}%`;
      el.style.top = `${random(0, 100)}%`;
      el.style.fontSize = `${size}px`;
      el.style.color = pick(TINTS);
      el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
      el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
      el.style.setProperty("--base-opacity", String(opacity));

      if (hasGlow) {
        el.style.textShadow = "0 0 8px rgba(168, 85, 247, 0.35)";
      }

      fragment.appendChild(el);
    }

    container.appendChild(fragment);
  }, []);

  return (
    <>
      <div ref={containerRef} aria-hidden="true" />
      <style>{css}</style>
    </>
  );
}

const css = `
  .sparkle-system {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .sparkle {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1;
    opacity: var(--base-opacity, 0.15);
    animation: sparkle-float var(--duration, 7s) ease-in-out var(--delay, 0s) infinite;
    transform: translate3d(0, 0, 0);
  }

  @keyframes sparkle-float {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      opacity: var(--base-opacity, 0.15);
    }
    33% {
      transform: translate3d(4px, -8px, 0) rotate(30deg) scale(1.05);
      opacity: calc(var(--base-opacity, 0.15) * 1.4);
    }
    66% {
      transform: translate3d(-3px, -12px, 0) rotate(-15deg) scale(0.95);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sparkle {
      animation: none;
      display: none;
    }
  }
`;
