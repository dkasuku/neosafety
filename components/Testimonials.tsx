"use client";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import { ChevronRight } from "./icons";

const testimonials = [
  { name: "Wanjiru Kamau", role: "Site Manager, Skyline Construction", initials: "WK", rating: 5,
    quote: "NEO Safety kitted out our entire crew — helmets, hi-vis and boots — and delivered to site the same week. Quality is solid and the reflective gear has held up on every shift." },
  { name: "David Otieno", role: "Safety Officer, Rift Valley Millers", initials: "DO", rating: 5,
    quote: "We rely on them for PPE compliance across the plant. Consistent stock, fair pricing, and they branded all our overalls with our logo. Easily our most dependable supplier." },
  { name: "Aisha Mohamed", role: "Procurement Lead, Coastal Logistics", initials: "AM", rating: 5,
    quote: "Ordering is simple and the team actually advises you on the right gear for the job. Fast delivery to Mombasa and everything arrived exactly as described." },
  { name: "Peter Mwangi", role: "Operations Director, Nairobi Steel Works", initials: "PM", rating: 5,
    quote: "From gloves to fire extinguishers, NEO Safety keeps our site inspection-ready. Their branded workwear also made our team look sharp on client visits." },
  { name: "Grace Achieng", role: "HR Manager, Lakeside Hospitality", initials: "GA", rating: 4,
    quote: "They supplied uniforms for our kitchen and service staff and handled the embroidery in-house. Great finish, and repeat orders are always quick." },
  { name: "Samuel Kiptoo", role: "Foreman, Highland Roads Ltd", initials: "SK", rating: 5,
    quote: "The hi-vis jackets and safety boots are genuinely tough. We've ordered three times now and the service and quality never drop." },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  const t = testimonials[i];

  return (
    <section className="bg-[#f4f6f8] py-11">
      <div className="container-x">
        <div className="mb-9 text-center">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-green">Testimonials</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">What our clients say</h2>
          <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-green" />
        </div>

        <div className="relative mx-auto max-w-3xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-card sm:p-12">
            <span className="font-display text-6xl leading-none text-green/30">&ldquo;</span>
            <blockquote key={i} className="animate-[toastIn_0.4s_ease] -mt-4 text-lg leading-relaxed text-slate-700 sm:text-xl">
              {t.quote}
            </blockquote>
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">{t.initials}</span>
              <div className="mt-1"><RatingStars value={t.rating} /></div>
              <p className="font-display text-base font-bold text-navy">{t.name}</p>
              <p className="text-sm text-slate-brand">{t.role}</p>
            </div>
          </div>

          {/* arrows */}
          <button onClick={() => go(-1)} aria-label="Previous" className="absolute -left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white sm:-left-5">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <button onClick={() => go(1)} aria-label="Next" className="absolute -right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white sm:-right-5">
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* dots */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, d) => (
              <button key={d} onClick={() => setI(d)} aria-label={`Go to testimonial ${d + 1}`}
                className={`h-2.5 rounded-full transition-all ${d === i ? "w-6 bg-green" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
