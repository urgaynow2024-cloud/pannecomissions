import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const display = reviews.slice(0, 3);
  const featured = display.filter((r) => r.image_url).slice(0, 2);
  const textOnly = display.filter((r) => !r.image_url).slice(0, 1);
  const arranged = [...featured, ...textOnly].slice(0, 3);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">
              Kind Words
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
              Reviews
            </h2>
          </div>
          <Link
            href="/reviews"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
          >
            Read All Reviews
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {arranged.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No reviews yet.</p>
          </div>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {arranged.map((review, i) => {
                const isLarge = review.image_url && i === 0;
                return (
                  <div
                    key={review.id}
                    className={`group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-brand-purple-500/20 hover:bg-white/[0.04] ${isLarge ? "md:col-span-2" : ""}`}
                  >
                    <div className="p-6 md:p-8">
                      {review.image_url && (
                        <div className={`mb-5 ${isLarge ? "-mx-6 md:-mx-8 -mt-6 md:-mt-8" : ""}`}>
                          <div className={`relative overflow-hidden ${isLarge ? "aspect-[2/1]" : "aspect-video"}`}>
                            <img
                              src={review.image_url}
                              alt={`Commission by ${review.display_name}`}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-brand-purple-400" : "text-white/10"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-300 leading-[1.75] text-[15px] mb-5">
                        &ldquo;{review.review_text}&rdquo;
                      </p>

                      <p className="text-sm font-medium text-brand-purple-400">
                        — {review.display_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {reviews.length > 3 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-purple-400 hover:text-brand-purple-300 transition-colors group"
            >
              Read All Reviews
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
