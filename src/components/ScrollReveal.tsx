"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleChange = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", handleChange);

    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  const delayClass = delay > 0 ? `reveal-delay-${Math.min(delay, 4)}` : "";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${delayClass}`}
    >
      {children}
    </div>
  );
}

export function useParallax(speed = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - windowHeight / 2;
      setOffset(distanceFromCenter * speed);
    };

    const handleMotionPref = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setOffset(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", handleMotionPref);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      motionQuery.removeEventListener("change", handleMotionPref);
    };
  }, [speed]);

  const transform = `translateY(${offset}px)`;
  return { ref, transform };
}
