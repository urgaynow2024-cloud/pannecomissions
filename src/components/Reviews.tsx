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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-purple-500/30"
        >
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-5 w-5 ${i < review.rating ? "text-purple-400" : "text-gray-700"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed italic">&ldquo;{review.review_text}&rdquo;</p>
          <p className="text-sm font-medium text-purple-400">— {review.display_name}</p>
        </div>
      ))}
    </div>
  );
}
