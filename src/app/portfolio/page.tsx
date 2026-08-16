import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import Portfolio from "@/components/Portfolio";
import prisma from "@/lib/prisma";

export const revalidate = 30;

const CATEGORIES = [
  "All",
  "Clothing Add-ons",
  "Complete Avatars",
  "Toggles",
  "Custom Textures",
  "Models",
];

async function getData(category?: string) {
  try {
    const where: any = { nsfw: false, visible: true };
    if (category && category !== "All") {
      where.category = category;
    }

    const items = await prisma.PortfolioItem.findMany({
      where,
      orderBy: { sort_order: "asc" },
    });

    return items.map((item: { id: string; display_title: string | null; description: string | null; image_url: string; category: string | null }) => ({
      id: item.id,
      display_title: item.display_title,
      description: item.description || "",
      image_url: item.image_url,
      category: item.category,
    }));
  } catch {
    return [];
  }
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const items = await getData(params.category);
  const activeCategory = params.category || "All";

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            Gallery
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
            Portfolio
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Some of the avatars and work I&apos;ve made.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const href = cat === "All" ? "/portfolio" : `/portfolio?category=${encodeURIComponent(cat)}`;
            const isActive = activeCategory === cat;
            return (
              <a
                key={cat}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-purple-500 text-white"
                    : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>

        <Portfolio items={items} />
      </div>
      <Footer />
    </main>
  );
}
