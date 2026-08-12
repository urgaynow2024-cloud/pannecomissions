import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Reviews
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            What clients have said about working with me.
          </p>
        </div>
        <Reviews />
      </div>
      <Footer />
    </main>
  );
}
