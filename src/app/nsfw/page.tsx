import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeVerifier from "@/components/AgeVerifier";
import NSFWPortfolio from "@/components/NSFWPortfolio";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: true, visible: true },
      orderBy: { sort_order: "asc" },
    });

    return items.map((item: { id: string; display_title: string | null; description: string | null; image_url: string }) => ({
      id: item.id,
      display_title: item.display_title,
      description: item.description || "",
      image_url: item.image_url,
    }));
  } catch {
    return [];
  }
}

export default async function NSFWPage() {
  const items = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <AgeVerifier />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-[10px] font-semibold text-red-300 uppercase tracking-widest">
              18+ Adults Only
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            NSFW Portfolio
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Adult VRChat avatar work. You must be 18 or older.
          </p>
        </div>
        <NSFWPortfolio items={items} />
      </div>
      <Footer />
    </main>
  );
}
