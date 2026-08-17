"use client";

import { useState, useCallback } from "react";
import { Star, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { compressImage, isVideo } from "@/lib/compress-image";

export default function SubmitReviewPage() {
  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleImageChange = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setMessage({ type: "error", text: "Please select an image or video file" });
      return;
    }
    const compressed = await compressImage(file);
    setImageFile(compressed);
    if (isVideo(compressed)) {
      setImagePreview(URL.createObjectURL(compressed));
    } else {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(compressed);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageChange(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !reviewText.trim()) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("display_name", displayName.trim());
      fd.append("rating", String(rating));
      fd.append("review_text", reviewText.trim());
      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setMessage({ type: "success", text: "Review submitted! It will appear after admin approval." });
      setDisplayName("");
      setRating(5);
      setReviewText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-black text-white antialiased relative">
      <div className="mx-auto max-w-2xl px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="mb-10">
          <p className="text-[10px] font-semibold text-brand-purple-300 uppercase tracking-widest mb-3">Reviews</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display heading-pop">Submit a Review</h1>
          <p className="text-lg text-gray-400 mt-4">Share your experience working with Panne.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-xl border p-4 flex items-center gap-3 ${
            message.type === "success" ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors" placeholder="VRChat username" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                  <Star className={`h-8 w-8 ${star <= rating ? "text-brand-purple-400" : "text-white/10"}`} fill={star <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Review *</label>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-purple-400/50 focus:outline-none transition-colors resize-none" placeholder="Tell us about your experience..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Commission Image (optional)</label>
            <p className="text-xs text-gray-500 mb-2">You can submit a review without an image, or attach one if you have it.</p>
            <div
              className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${dragOver ? "border-brand-purple-400 bg-brand-purple-500/5" : "border-white/10 hover:border-white/20"} ${imagePreview ? "p-3" : "p-10"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("review-image-upload")?.click()}
            >
              <input id="review-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])} />

              {imagePreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                  {imageFile && isVideo(imageFile) ? (
                    <video src={imagePreview} className="w-full h-full object-contain" controls autoPlay muted loop />
                  ) : (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-sm text-white font-medium">Click or drop to replace</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Upload className="h-10 w-10 text-gray-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Drop an image or video here or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Large files are automatically compressed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-brand-purple-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-purple-500 disabled:opacity-50 transition-colors btn-glow">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </main>
  );
}
