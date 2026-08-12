import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getData() {
  try {
    const reviews = await prisma.Review.findMany({
      where: { status: "APPROVED", hidden: false },
      orderBy: { created_at: "desc" },
    });

    return reviews.map((review: { id: string; display_name: string; rating: number; review_text: string; image_url: string | null }) => ({
      id: review.id,
      display_name: review.display_name,
      rating: review.rating,
      review_text: review.review_text,
      image_url: review.image_url,
    }));
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getData();

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Reviews
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            What clients have said.
          </p>
        </div>
        <Reviews reviews={reviews} />
      </div>
      <Footer />
    </main>
  );
}
