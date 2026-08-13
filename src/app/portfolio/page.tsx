import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SparkleSystem from "@/components/SparkleSystem";
import Portfolio from "@/components/Portfolio";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const items = await prisma.PortfolioItem.findMany({
      where: { nsfw: false, visible: true },
      orderBy: { sort_order: "asc" },
    });

    return items.map((item: { id: string; title: string; description: string | null; image_url: string }) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      image_url: item.image_url,
    }));
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const items = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <SparkleSystem />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-12 md:mb-16">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
            Gallery
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
            Portfolio
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mt-4">
            Some of the avatars and work I&apos;ve made.
          </p>
        </div>
        <Portfolio items={items} />
      </div>
      <Footer />
    </main>
  );
}
