import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ServicesProps {
  services: Service[];
}

const DEFAULT_SERVICES: Service[] = [
  { id: "clothing", name: "Clothing Add-ons", description: "Adding clothing pieces, accessories, and outfit options to existing avatars.", image_url: null },
  { id: "complete-avatars", name: "Complete Avatars", description: "Full avatar assemblies from premade assets, tailored to your needs.", image_url: null },
  { id: "toggles", name: "Toggles", description: "Avatar toggles and options for switching between different looks or states.", image_url: null },
  { id: "custom-textures", name: "Custom Textures", description: "Custom texture work for your avatar, from subtle tweaks to full repaints.", image_url: null },
  { id: "models", name: "Models", description: "3D modelling work for avatars, accessories, and custom parts.", image_url: null },
];

export default function Services({ services }: ServicesProps) {
  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            What I Do
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
            Services
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl text-lg">
            Work tailored to your VRChat avatar needs.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {displayServices.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? "" : "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"}`}
              >
                <div className={`${isEven ? "lg:order-1" : "lg:order-2"} group`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                    {service.image_url ? (
                      <>
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-sm text-gray-600">Image coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`${isEven ? "lg:order-2" : "lg:order-1"} space-y-4`}>
                  <p className="text-5xl md:text-6xl font-bold text-white/5 font-display leading-none">
                    0{i + 1}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white font-display">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed max-w-lg text-lg">
                    {service.description || ""}
                  </p>
                  <Link
                    href="/commission"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors mt-2"
                  >
                    Ask about this
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
