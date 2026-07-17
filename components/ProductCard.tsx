import Link from "next/link";
import { Media } from "./products";
import RatingStars from "./RatingStars";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { ksh, type Product } from "@/lib/data";

export default function ProductCard({ p }: { p: Product }) {
  const out = p.stock === 0;
  const low = typeof p.stock === "number" && p.stock > 0 && p.stock <= 5;
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-float">
      <div className="relative aspect-square overflow-hidden bg-white">
        {p.tag && !out && (
          <span className="absolute left-3 top-3 z-10 rounded bg-green px-2 py-0.5 text-xs font-bold text-white">{p.tag}</span>
        )}
        {out && (
          <span className="absolute left-3 top-3 z-10 rounded bg-slate-700 px-2 py-0.5 text-xs font-bold text-white">Out of Stock</span>
        )}
        <WishlistButton product={{ slug: p.slug, name: p.name, price: p.price, img: p.img }} className="absolute right-2.5 top-2.5 z-10" />
        <Link href={`/product/${p.slug}`} className="block h-full w-full">
          <Media img={p.img} alt={p.name} className={`h-full w-full p-3 transition-transform duration-300 group-hover:scale-105 ${out ? "opacity-50" : ""}`} />
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <RatingStars value={Math.round(p.rating ?? 5)} />
        <h3 className="mt-2 text-sm font-semibold leading-snug text-navy">
          <Link href={`/product/${p.slug}`} className="hover:text-green">{p.name}</Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-green">{ksh(p.price)}</span>
          {p.oldPrice && <span className="text-sm text-slate-400 line-through">{ksh(p.oldPrice)}</span>}
          {low && <span className="ml-auto text-xs font-semibold text-amber-600">Low stock</span>}
        </div>
        <div className="mt-4">
          <AddToCartButton
            product={{ slug: p.slug, name: p.name, price: p.price, img: p.img }}
            showQuantity block disabled={out}
            className="w-full py-2.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
