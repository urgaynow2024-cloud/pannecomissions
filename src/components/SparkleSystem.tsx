"use client";

import { useEffect, useRef } from "react";

const SPARKLE_COUNT = 40;
const SPARKLE_CHARS = ["✦", "✧", "⋆"];
const TINTS = ["#a855f7", "#c084fc", "#d8b4fe", "#7e22ce"];

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
      el.className = "sparkle";
      el.setAttribute("aria-hidden", "true");

      const size = Math.random() < 0.65 ? random(8, 14) : random(14, 20);
      const opacity = Math.random() < 0.7 ? random(0.1, 0.3) : random(0.3, 0.6);
      const duration = random(4, 12);
      const delay = random(0, 8);
      const hasGlow = Math.random() > 0.65;

      el.textContent = pick(SPARKLE_CHARS);
      el.style.left = `${random(0, 100)}%`;
      el.style.top = `${random(0, 100)}%`;
      el.style.fontSize = `${size}px`;
      el.style.color = pick(TINTS);
      el.style.setProperty("--duration", `${duration.toFixed(2)}s`);
      el.style.setProperty("--delay", `${delay.toFixed(2)}s`);
      el.style.setProperty("--base-opacity", String(opacity));

      if (hasGlow) {
        el.style.textShadow = "0 0 6px rgba(168, 85, 247, 0.45)";
      }

      fragment.appendChild(el);
    }

    container.appendChild(fragment);
  }, []);

  return (
    <>
      <div ref={containerRef} className="sparkle-system" aria-hidden="true" />
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
    opacity: var(--base-opacity, 0.3);
    animation: sparkle-drift var(--duration, 8s) ease-in-out var(--delay, 0s) infinite;
    transform: translate3d(0, 0, 0);
  }

  @keyframes sparkle-drift {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
    33% {
      transform: translate3d(6px, -10px, 0) rotate(40deg) scale(1.05);
    }
    66% {
      transform: translate3d(-4px, -14px, 0) rotate(-20deg) scale(0.95);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sparkle {
      animation: none;
      opacity: 0;
    }
  }
`;
