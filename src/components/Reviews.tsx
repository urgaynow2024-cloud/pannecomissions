"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

interface Review {
  id: string;
  display_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
}

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reviewImages = reviews.filter((r) => r.image_url);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 transition-all duration-300 hover:border-brand-purple-500/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "text-brand-purple-400" : "text-gray-700"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-[15px]">
              &ldquo;{review.review_text}&rdquo;
            </p>
            <p className="text-sm font-medium text-brand-purple-400">— {review.display_name}</p>
            {review.image_url && (
              <button
                onClick={() => {
                  setLightboxIndex(reviewImages.indexOf(reviews.find((r) => r.id === review.id)!));
                  setLightboxOpen(true);
                }}
                className="mt-4 block w-full"
              >
                <img
                  src={review.image_url}
                  alt={`Review by ${review.display_name}`}
                  className="w-full h-48 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && reviewImages.length > 0 && (
        <Lightbox
          items={reviewImages.map((r) => ({ id: r.id, title: r.display_name, image_url: r.image_url!, description: r.review_text }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
