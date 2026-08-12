"use client";

import { useState, useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Service[]) => setServices(data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Services</h2>
            <p className="text-gray-400">What I can do for your VRChat avatar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Services</h2>
          <p className="text-gray-400">What I can do for your VRChat avatar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-purple-500/30"
            >
              {service.image_url && (
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black">
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
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
