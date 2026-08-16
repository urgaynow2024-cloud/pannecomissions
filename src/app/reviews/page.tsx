import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import Reviews from "@/components/Reviews";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const revalidate = 0;

async function getData() {
  try {
    const reviews = await prisma.Review.findMany({
      where: { status: "APPROVED", hidden: false },
      orderBy: { created_at: "desc" },
    });

    return reviews.map((review: { id: string; display_name: string; rating: number; review_text: string; image_url: string | null; created_at: Date }) => ({
      id: review.id,
      display_name: review.display_name,
      rating: review.rating,
      review_text: review.review_text,
      image_url: review.image_url,
      created_at: review.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getData();

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <NoiseOverlay />
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-12 md:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
              Kind Words
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display heading-pop">
              Reviews
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mt-4">
              What clients have said about working with me.
            </p>
          </div>
          <Link
            href="/reviews/submit"
            className="inline-flex items-center gap-2 rounded-full border border-brand-purple-500/40 bg-brand-purple-500/10 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-purple-500/15 hover:border-brand-purple-400 transition-colors btn-glow whitespace-nowrap"
          >
            Write a Review
          </Link>
        </div>
        <Reviews reviews={reviews} />
      </div>
      <Footer />
    </main>
  );
}
