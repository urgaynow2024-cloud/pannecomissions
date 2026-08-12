"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  created_at: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then(setReviews)
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Reviews</h2>
              <p className="text-gray-400 max-w-xl">What clients have said.</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Reviews</h2>
              <p className="text-gray-400 max-w-xl">What clients have said.</p>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
            <p className="text-red-400">Reviews are temporarily unavailable.</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Reviews</h2>
              <p className="text-gray-400 max-w-xl">What clients have said.</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const display = reviews.slice(0, 3);

  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Reviews
            </h2>
            <p className="text-gray-400 max-w-xl">
              What clients have said.
            </p>
          </div>
          <Link
            href="/reviews"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Read All Reviews
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {display.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-purple-400" : "text-gray-700"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed italic">&ldquo;{review.review_text}&rdquo;</p>
              <p className="text-sm font-medium text-purple-400">— {review.display_name}</p>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Read All Reviews
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
