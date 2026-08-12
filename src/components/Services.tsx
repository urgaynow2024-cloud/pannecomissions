import Image from "next/image";

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
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Services</h2>
          <p className="text-gray-400">What I can do for your VRChat avatar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-purple-500/30"
            >
              {service.image_url && (
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black relative">
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{service.description || ""}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
