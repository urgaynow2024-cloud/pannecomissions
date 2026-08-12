import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const services = await prisma.Service.findMany({
      where: { visible: true },
      orderBy: { sort_order: "asc" },
    });

    return services.map((service: { id: string; name: string; description: string | null; image_url: string | null }) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      image_url: service.image_url,
    }));
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getData();

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Services
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            What I can do for your VRChat avatar.
          </p>
        </div>
        <Services services={services} />
      </div>
      <Footer />
    </main>
  );
}
