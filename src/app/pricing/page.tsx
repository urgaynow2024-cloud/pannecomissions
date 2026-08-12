import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const pricing = await prisma.Pricing.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return pricing
      .filter((p: { category: string }) => p.category === "sfw")
      .map((item: { id: string; name: string; min_price: number | null; max_price: number | null; description: string | null }) => ({
        id: item.id,
        name: item.name,
        min_price: item.min_price,
        max_price: item.max_price,
        description: item.description,
      }));
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const pricing = await getData();

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Pricing
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Starting ranges. Final price depends on the work involved.
          </p>
        </div>
        <PricingSection pricing={pricing} />
      </div>
      <Footer />
    </main>
  );
}
