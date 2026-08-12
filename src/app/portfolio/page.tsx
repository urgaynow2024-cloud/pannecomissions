import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Portfolio
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            VRChat avatar work.
          </p>
        </div>
        <Portfolio items={items} />
      </div>
      <Footer />
    </main>
  );
}
