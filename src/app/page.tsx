import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
