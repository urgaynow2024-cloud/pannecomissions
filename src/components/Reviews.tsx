"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  created_at?: string;
}

interface ReviewsProps {
  reviews: Review[];
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No reviews yet.</p>
      </div>
    );
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reviewImages = reviews.filter((r) => r.image_url);

  return (
    <div className="space-y-6 md:space-y-8">
      {reviews.map((review, i) => (
        <div
          key={review.id}
          className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-brand-purple-500/20 hover:bg-white/[0.04]"
        >
          <div className="p-6 md:p-8">
            {review.image_url && (
              <div className="mb-5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 relative">
                <button
                  onClick={() => {
                    const idx = reviewImages.findIndex((r) => r.id === review.id);
                    setLightboxIndex(idx >= 0 ? idx : 0);
                    setLightboxOpen(true);
                  }}
                  className="block w-full text-left"
                  aria-label={`View commission image from ${review.display_name}`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={review.image_url}
                      alt={`Commission by ${review.display_name}`}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-brand-purple-500/0 group-hover:bg-brand-purple-500/5 transition-colors duration-500" />
                    <div className="absolute bottom-4 left-4 md:left-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/80 group-hover:text-white transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        View Image
                      </span>
                    </div>
                  </div>
                </button>
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

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-brand-purple-400">
                — {review.display_name}
              </p>
              {review.created_at && (
                <p className="text-xs text-gray-600">
                  {formatDate(review.created_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {lightboxOpen && reviewImages.length > 0 && (
        <Lightbox
          items={reviewImages.map((r) => ({
            id: r.id,
            title: r.display_name,
            image_url: r.image_url!,
            description: r.review_text,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
