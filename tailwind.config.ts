import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#050505",
          dark: "#0a0a0a",
          panel: "#111111",
          purple: {
            300: "#c084fc",
            400: "#a855f7",
            500: "#9333ea",
            600: "#7e22ce",
            700: "#6b21a8",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-scale": "fadeInScale 0.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "scroll-strip": "scrollStrip 30s linear infinite",
        "gentle-float": "gentleFloat 4s ease-in-out infinite",
        "sparkle-float": "sparkleFloat 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(5px, -5px)" },
          "50%": { transform: "translate(-3px, -8px)" },
          "75%": { transform: "translate(-5px, 3px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.5)" },
        },
        scrollStrip: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sparkleFloat: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: "var(--base-opacity, 0.3)" },
          "25%": { transform: "translate3d(3px, -8px, 0) rotate(15deg)" },
          "50%": { transform: "translate3d(-2px, -4px, 0) rotate(-10deg)", opacity: "calc(var(--base-opacity, 0.3) * 1.3)" },
          "75%": { transform: "translate3d(4px, -12px, 0) rotate(25deg)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
