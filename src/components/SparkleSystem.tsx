"use client";

import { useEffect, useRef, useCallback } from "react";

const SPARKLE_COUNT = 35;
const SPARKLE_CHARS = ["✦", "✧", "⋆", "·", "✶"];

interface Sparkle {
  x: number;
  y: number;
  char: string;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  type: "fade" | "drift" | "pulse";
}

export default function SparkleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const reducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const initSparkles = useCallback(() => {
    const sparkles: Sparkle[] = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push(createSparkle(true));
    }
    sparklesRef.current = sparkles;
  }, []);

  const createSparkle = (randomY = false): Sparkle => {
    const types: Sparkle["type"][] = ["fade", "drift", "pulse"];
    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 20,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      size: 8 + Math.random() * 14,
      opacity: 0.1 + Math.random() * 0.4,
      speed: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: 200 + Math.random() * 400,
      type: types[Math.floor(Math.random() * types.length)],
    };
  };

  useEffect(() => {
    if (reducedMotion.current) return;

    initSparkles();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current.forEach((s, i) => {
        s.life += 1;
        s.y -= s.speed;
        s.x += s.drift;
        s.rotation += s.rotationSpeed;

        let alpha = s.opacity;
        const lifeRatio = s.life / s.maxLife;

        if (s.type === "fade") {
          alpha = s.opacity * (lifeRatio < 0.5 ? lifeRatio * 2 : 2 - lifeRatio * 2);
        } else if (s.type === "pulse") {
          alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.life * 0.05));
        }

        const mouseDist = Math.hypot(s.x - mouseRef.current.x, s.y - mouseRef.current.y);
        if (mouseDist < 120) {
          alpha = Math.min(1, alpha + 0.4 * (1 - mouseDist / 120));
        }

        if (s.life >= s.maxLife || s.y < -20 || s.x < -20 || s.x > canvas.width + 20) {
          sparklesRef.current[i] = createSparkle();
          return;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate((s.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.font = `${s.size}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#a855f7";
        ctx.shadowColor = "rgba(168, 85, 247, 0.6)";
        ctx.shadowBlur = 8;
        ctx.fillText(s.char, 0, 0);
        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(frameRef.current);
    };
  }, [initSparkles]);

  if (reducedMotion.current) return null;

  return (
    <canvas
      ref={canvasRef}
      className="sparkle-canvas"
      aria-hidden="true"
    />
  );
}
