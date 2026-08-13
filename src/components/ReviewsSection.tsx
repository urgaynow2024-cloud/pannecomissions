import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import SectionGlow from "./SectionGlow";
import SparkleField from "./SparkleField";
import { Star } from "lucide-react";

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
  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[700px] h-[500px] bg-brand-purple-500/8 rounded-full blur-[160px]" style={{ animation: "pulseGlow 7s ease-in-out infinite" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[400px] bg-brand-purple-600/6 rounded-full blur-[140px]" style={{ animation: "pulseGlow 7s ease-in-out infinite 3s" }} />
      </div>
      <SectionGlow intensity="subtle" />
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 md:mb-14 relative">
            <SparkleField count={6} minSize={4} maxSize={14} minOpacity={0.25} maxOpacity={0.55} className="-inset-6" glow />
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-[0.2em] mb-3">
                Kind Words
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
                Reviews <span className="text-brand-purple-400">✦</span>
              </h2>
            </div>
            {reviews.length > 0 && (
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
            )}
          </div>
        </ScrollReveal>

        {reviews.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-20 relative">
              <div className="space-y-4 relative z-10">
                <span className="text-4xl text-brand-purple-400/20 animate-sparkle-float inline-block">✦</span>
                <p className="text-2xl font-semibold text-white/10 font-display tracking-wider">
                  NO REVIEWS YET
                </p>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Be one of the first people to leave a little love for Panne.
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reviews.map((review, i) => {
                const isLarge = review.image_url && i === 0;
                return (
                    <div
                      key={review.id}
                      className={`group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-brand-purple-500/30 hover:shadow-[0_0_50px_rgba(168,85,247,0.08)] hover:bg-white/[0.04] ${isLarge ? "md:col-span-2" : ""}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="p-6 md:p-8 relative z-10">
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
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${idx < review.rating ? "text-brand-purple-400 fill-brand-purple-400" : "text-white/10"}`}
                          />
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
