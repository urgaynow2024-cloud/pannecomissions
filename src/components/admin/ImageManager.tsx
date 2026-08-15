"use client";

import { useState, useEffect, useCallback } from "react";
import { Image as ImageIcon, Search, X, Check, Upload, RefreshCw, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  display_title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  photos?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  photos?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
}

interface PhotoWithParent {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  parent_portfolio_id: string;
  parent_title: string | null;
  parent_category: string | null;
}

interface ImageManagerProps {
  initialSettings?: { about_image_url?: string };
}

const SERVICE_CATEGORIES = ["Clothing Add-ons", "Complete Avatars", "Toggles", "Custom Textures", "Models"];

function isPortfolioItem(item: PortfolioItem | PhotoWithParent): item is PortfolioItem {
  return "category" in item && "image_url" in item;
}

function getImageUrl(item: PortfolioItem | PhotoWithParent): string {
  return isPortfolioItem(item) ? item.image_url : item.url;
}

function getDisplayTitle(item: PortfolioItem | PhotoWithParent): string | null {
  return isPortfolioItem(item) ? item.display_title : item.parent_title;
}

function getCategory(item: PortfolioItem | PhotoWithParent): string | null {
  return isPortfolioItem(item) ? item.category : item.parent_category;
}

export default function ImageManager({ initialSettings = {} }: ImageManagerProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const aboutImage = initialSettings.about_image_url || "";
  const setAboutImage = useCallback((url: string) => {
    fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about_image_url: url }),
    }).then(() => {
      if (initialSettings) {
        initialSettings.about_image_url = url;
      }
    });
  }, [initialSettings]);

  const setServiceImage = useCallback(
    async (serviceId: string, imageUrl: string) => {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl }),
      });
      if (res.ok) {
        const updated = await res.json();
        setServices((prev) => prev.map((s) => (s.id === serviceId ? updated : s)));
      }
      return res.ok;
    },
    []
  );

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [portfolioRes, servicesRes] = await Promise.all([
        fetch("/api/admin/portfolio"),
        fetch("/api/admin/services"),
      ]);

      if (portfolioRes.ok) {
        const data = await portfolioRes.json();
        setPortfolioItems(data);
      } else if (!portfolioRes.ok) {
        const err = await portfolioRes.json().catch(() => ({}));
        if (portfolioRes.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setError(err.error || "Failed to load portfolio");
      }

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data);
      } else {
        const err = await servicesRes.json().catch(() => ({}));
        setError(err.error || "Failed to load services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const allPhotos: PhotoWithParent[] = portfolioItems
    .filter((p) => p.photos && p.photos.length > 0)
    .flatMap((p) =>
      p.photos!.map((photo) => ({
        ...photo,
        parent_portfolio_id: p.id,
        parent_title: p.display_title,
        parent_category: p.category,
      }))
    );

  const allItems: (PortfolioItem | PhotoWithParent)[] = [...portfolioItems, ...allPhotos];

  const filteredItems = allItems.filter((item) => {
    const title = getDisplayTitle(item);
    const desc = isPortfolioItem(item) ? item.description : null;
    const cat = getCategory(item);
    const imgUrl = getImageUrl(item).toLowerCase();

    if (
      imgUrl.includes(searchQuery.toLowerCase()) ||
      (title && title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (desc && desc.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      if (activeCategory && cat !== activeCategory) return false;
      return true;
    }
    return false;
  });

  function getServiceByImage(imageUrl: string): Service | null {
    return services.find((s) => s.image_url === imageUrl) || null;
  }

  function isAboutImage(imageUrl: string): boolean {
    return aboutImage === imageUrl;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No portfolio images found.</p>
        <p className="text-xs text-gray-600 mt-1">Upload work in the Portfolio section first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white font-display">Image Manager</h2>
          <p className="text-xs text-gray-400 mt-0.5">Assign portfolio artwork to services and the About section</p>
        </div>
        <button
          onClick={fetchAll}
          className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors"
            placeholder="Search artwork..."
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !activeCategory ? "bg-brand-purple-500/20 text-brand-purple-300" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            All
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat ? "bg-brand-purple-500/20 text-brand-purple-300" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredItems.map((item) => {
          const imageUrl = getImageUrl(item);
          const displayTitle = getDisplayTitle(item);
          const category = getCategory(item);
          const service = getServiceByImage(imageUrl);
          const isAbout = isAboutImage(imageUrl);

          return (
            <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] hover:border-brand-purple-400/30 transition-all duration-200">
              <img
                src={imageUrl}
                alt={displayTitle || "Portfolio artwork"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {(service || isAbout) && (
                <div className="absolute top-1 left-1">
                  <div className="flex gap-1">
                    {isAbout && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 font-medium">
                        About
                      </span>
                    )}
                    {service && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-purple-500/20 text-brand-purple-300 font-medium">
                        {service.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-1.5">
                  {isAbout ? (
                    <button
                      onClick={() => setAboutImage(imageUrl)}
                      className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-xs font-medium hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      About (set)
                    </button>
                  ) : (
                    <button
                      onClick={() => setAboutImage(imageUrl)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                    >
                      <ImageIcon className="h-3 w-3" />
                      Set as About
                    </button>
                  )}

                  {service ? (
                    <button
                      onClick={async () => {
                        if (confirm(`Remove from "${service.name}"?`)) {
                          await setServiceImage(service.id, "");
                          setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, image_url: null } : s)));
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Remove from {service.name}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setServiceImage(s.id, imageUrl)}
                          className="px-3 py-1.5 rounded-lg bg-brand-purple-500/20 text-brand-purple-300 text-xs font-medium hover:bg-brand-purple-500/30 transition-colors"
                        >
                          Assign to {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {services.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white font-display mb-4">Current Assignments</h3>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-white/[0.02] shrink-0 flex items-center justify-center">
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-600 text-xs">none</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  {service.image_url ? (
                    <p className="text-xs text-gray-500 truncate">{service.image_url}</p>
                  ) : (
                    <p className="text-xs text-gray-500">No image assigned</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}