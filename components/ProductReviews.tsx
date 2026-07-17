"use client";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import { getReviews, postReview, type ApiReview } from "@/lib/api";

export default function ProductReviews({ slug, fallbackRating = 5 }: { slug: string; fallbackRating?: number }) {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [avg, setAvg] = useState(fallbackRating);
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const data = await getReviews(slug);
    if (data) { setReviews(data.reviews); setAvg(data.average); setCount(data.count); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) { setMsg("Please add your name and a comment."); return; }
    setSubmitting(true); setMsg("");
    const res = await postReview(slug, { name: name.trim(), rating, comment: comment.trim() });
    setSubmitting(false);
    if ("error" in res) { setMsg(res.error); return; }
    setName(""); setComment(""); setRating(5);
    setMsg("Thanks! Your review has been posted.");
    load();
  };

  return (
    <section className="container-x border-t border-slate-100 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Existing reviews */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-extrabold text-navy">Reviews</h2>
            <span className="flex items-center gap-2 text-sm text-slate-brand">
              <RatingStars value={Math.round(avg)} /> {avg.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {reviews.length === 0 && <p className="text-slate-brand">No reviews yet — be the first to review this product.</p>}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy">{r.name}</span>
                  <span className="text-xs text-slate-brand">{r.createdAt}</span>
                </div>
                <div className="mt-1"><RatingStars value={r.rating} /></div>
                <p className="mt-2 text-sm text-slate-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Write a review */}
        <div>
          <h3 className="font-display text-xl font-bold text-navy">Write a review</h3>
          <form onSubmit={submit} className="mt-4 space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
            <div>
              <label className="text-sm font-semibold text-navy">Your rating</label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}
                    className={n <= rating ? "text-green" : "text-slate-300"}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17l-6.9 3.6 1.6-6.9L1.4 9.1l7-.6L12 2Z" /></svg>
                  </button>
                ))}
              </div>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Share your experience with this product…" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
              {submitting ? "Posting…" : "Submit review"}
            </button>
            {msg && <p className="text-sm text-slate-brand">{msg}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
