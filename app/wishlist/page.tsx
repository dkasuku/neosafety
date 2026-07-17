"use client";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { type Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Heart } from "@/components/icons";

export default function WishlistPage() {
  const { items, clear } = useWishlist();

  const Banner = (
    <section className="border-b border-slate-100 bg-[#f4f6f8]">
      <div className="container-x py-6">
        <nav className="mb-2 text-sm text-slate-brand"><Link href="/" className="hover:text-green">Home</Link><span className="mx-2">/</span><span className="text-navy">Wishlist</span></nav>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">Your Wishlist</h1>
      </div>
    </section>
  );

  if (items.length === 0) {
    return (
      <main>
        {Banner}
        <section className="container-x py-16 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green/10 text-green"><Heart className="h-9 w-9" /></span>
          <h2 className="mt-6 font-display text-2xl font-bold text-navy">No saved items yet</h2>
          <p className="mt-2 text-slate-brand">Tap the heart on any product to save it here for later.</p>
          <Link href="/ppe" className="btn-primary mt-6 px-8 py-3.5 text-sm">Browse products</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      {Banner}
      <section className="container-x py-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-brand">{items.length} saved item{items.length === 1 ? "" : "s"}</p>
          <button onClick={clear} className="text-sm text-slate-brand hover:text-navy">Clear wishlist</button>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((i) => {
            const p: Product = { slug: i.slug, name: i.name, price: i.price, img: i.img, category: "" };
            return <ProductCard key={i.slug} p={p} />;
          })}
        </div>
      </section>
    </main>
  );
}
