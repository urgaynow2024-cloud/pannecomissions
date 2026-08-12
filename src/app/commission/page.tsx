import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommissionForm from "@/components/CommissionForm";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const services = await prisma.Service.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return services.map((service: { id: string; name: string }) => ({
      id: service.id,
      name: service.name,
    }));
  } catch {
    return [];
  }
}

export default async function CommissionPage() {
  const services = await getData();

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Commission
          </h1>
          <p className="text-lg text-gray-400">
            Fill out the form below and I&apos;ll get back to you.
          </p>
        </div>
        <CommissionForm services={services} />
      </div>
      <Footer />
    </main>
  );
}
