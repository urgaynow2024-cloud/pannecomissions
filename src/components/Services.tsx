"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ServicesProps {
  services: Service[];
}

const SERVICE_FEATURES: Record<string, string[]> = {
  "Clothing Add-ons": [
    "Clothing fitting",
    "Accessory additions",
    "Custom adjustments",
    "Avatar integration",
  ],
  "Complete Avatars": [
    "Full avatar setup",
    "Materials and textures",
    "PhysBones configuration",
    "Expressions and toggles",
  ],
  "Entire Avatars": [
    "Full avatar setup",
    "Materials and textures",
    "PhysBones configuration",
    "Expressions and toggles",
  ],
  Toggles: [
    "Avatar toggles",
    "Visibility switching",
    "State management",
    "Performance optimized",
  ],
  "Custom Textures": [
    "Custom texture creation",
    "Material tweaks",
    "Full repaints",
    "PBR ready",
  ],
  Models: [
    "3D modelling",
    "Custom parts",
    "Avatar accessories",
    "Game-ready assets",
  ],
};

function getServiceImage(service: Service): string | null {
  return service.image_url;
}

function getServiceFeatures(name: string): string[] {
  return (
    SERVICE_FEATURES[name] ||
    SERVICE_FEATURES[name.replace(/^Custom /, "").replace(/^Complete /, "")] || [
      "Custom work",
      "Quality assured",
      "Fast turnaround",
      "Direct communication",
    ]
  );
}

export default function Services({ services }: ServicesProps) {
  const uniqueServices = services.filter(
    (service, index, self) => index === self.findIndex((s) => s.name === service.name)
  );
  const displayServices = uniqueServices.length > 0 ? uniqueServices : [];

  if (displayServices.length === 0) return null;

  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-175 h-150 bg-brand-purple-500/10 rounded-full blur-[160px]" style={{ animation: "pulseGlow 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[5%] w-150 h-125 bg-brand-purple-600/8 rounded-full blur-[140px]" style={{ animation: "pulseGlow 8s ease-in-out infinite 4s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal>
          <div className="mb-16 md:mb-24 relative">
            <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-4">
              What I Do
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
              Services <span className="text-brand-purple-400">✦</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl text-base md:text-lg leading-relaxed">
              From full avatars to small add-ons, every service is built to feel right in-game.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {displayServices.map((service, i) => {
            const isEven = i % 2 === 0;
            const imageSrc = getServiceImage(service);
            const features = getServiceFeatures(service.name);

            return (
              <ScrollReveal key={service.id} delay={i * 100}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  <div
                    className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] aspect-[4/3] lg:aspect-[4/3] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <span className="text-5xl text-brand-purple-400/20">✦</span>
                            <p className="text-sm text-gray-600 font-display tracking-wide">
                              {service.name}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div className="flex flex-col justify-center">
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight heading-pop">
                        {service.name}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-base md:text-lg mt-4 max-w-lg">
                        {service.description || ""}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-gray-300 text-sm md:text-base"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-purple-500/10 text-brand-purple-400">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/commission"
                        className="group/btn mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors"
                      >
                        Ask about this
                        <svg
                          className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
