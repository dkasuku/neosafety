import Image from "next/image";
import Link from "next/link";
import { getAdverts } from "@/lib/catalog";
import { type Advert } from "@/lib/data";
import { ArrowRight } from "./icons";

export function AdStrip({ ad }: { ad: Advert }) {
  return (
    <Link href={ad.href} className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-[#e8eef4] px-6 py-6 shadow-card sm:gap-6 sm:px-10">
      <Image src={ad.img} alt="" aria-hidden width={500} height={500}
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-15 md:block" />
      <div className="relative flex-1">
        <h3 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{ad.title}</h3>
        {ad.subtitle && <p className="mt-1 text-sm text-slate-brand sm:text-base">{ad.subtitle}</p>}
      </div>
      {ad.priceLabel && (
        <div className="relative hidden text-right sm:block">
          <p className="font-display text-xl font-bold text-green">{ad.priceLabel}</p>
        </div>
      )}
      <span className="btn-primary relative shrink-0 px-6 py-3 text-sm">{ad.ctaLabel} <ArrowRight className="h-4 w-4" /></span>
    </Link>
  );
}

export function AdCard({ ad }: { ad: Advert }) {
  return (
    <Link href={ad.href} className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl p-5 shadow-card">
      <Image src={ad.img} alt="" aria-hidden fill sizes="300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
      <div className="relative">
        <h3 className="font-display text-lg font-bold text-white">{ad.title}</h3>
        {ad.subtitle && <p className="mt-1 text-sm text-white/75">{ad.subtitle}</p>}
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-light">{ad.ctaLabel} <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

export default async function AdvertStrip({ placement = "home", className = "" }: { placement?: string; className?: string }) {
  const ads = await getAdverts(placement);
  if (!ads.length) return null;
  return (
    <section className={`container-x space-y-5 ${className}`}>
      {ads.map((ad, i) => <AdStrip key={ad.id ?? i} ad={ad} />)}
    </section>
  );
}
