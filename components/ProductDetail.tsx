"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { ksh, type Product } from "@/lib/data";
import RatingStars from "./RatingStars";
import ProductReviews from "./ProductReviews";
import WishlistButton from "./WishlistButton";
import { Cart, Shield, Truck, Check } from "./icons";

const TABS = ["Description", "Additional information", "Reviews", "Vendor info"] as const;

export default function ProductDetail({
  product, categoryName, categorySlug,
}: {
  product: Product; categoryName?: string; categorySlug?: string;
}) {
  const gallery = Array.from(new Set([product.img, ...(product.images ?? [])].filter(Boolean))).slice(0, 7);
  const [mainIdx, setMainIdx] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Description");
  const { add } = useCart();
  const { toast } = useToast();
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => { if (typeof window !== "undefined") setShareUrl(window.location.href); }, []);

  const out = product.stock === 0;
  const low = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;
  const sku = "NS-" + product.slug.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();

  const addToCart = () => {
    const variant = [color, size].filter(Boolean).join(", ");
    add({
      slug: variant ? `${product.slug}::${variant}` : product.slug,
      name: variant ? `${product.name} (${variant})` : product.name,
      price: product.price, img: product.img,
    }, qty);
    toast(qty > 1 ? `${qty} added to cart` : "Added to cart");
  };

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-sm text-slate-brand">
        <Link href="/" className="hover:text-green">Home</Link><span className="mx-2">/</span>
        {categorySlug ? <><Link href={`/category/${categorySlug}`} className="hover:text-green">{categoryName}</Link><span className="mx-2">/</span></> : null}
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="flex w-20 shrink-0 flex-col gap-3">
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setMainIdx(i)}
                className={`aspect-square overflow-hidden rounded-lg border bg-white p-1 ${i === mainIdx ? "border-green" : "border-slate-200 hover:border-slate-300"}`}>
                <Image src={src} alt="" width={80} height={80} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-8">
              <Image src={gallery[mainIdx]} alt={product.name} width={600} height={600} className="h-full w-full object-contain" priority />
            </div>
            <WishlistButton product={{ slug: product.slug, name: product.name, price: product.price, img: product.img }} className="absolute right-4 top-4" />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            {out ? <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">Out of Stock</span>
                 : <span className="rounded bg-green/10 px-2 py-0.5 text-xs font-bold text-green">In Stock</span>}
            {product.tag && <span className="rounded bg-navy px-2 py-0.5 text-xs font-bold text-white">{product.tag}</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-brand">
            Brand: <span className="font-semibold text-navy">NEO Safety</span> &nbsp;·&nbsp; SKU: <span className="font-semibold text-navy">{sku}</span>
          </p>

          <div className="mt-4 flex items-center gap-2">
            <RatingStars value={Math.round(product.rating ?? 5)} />
            <span className="text-sm text-slate-brand">({product.reviewsCount ?? 0} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-green">{ksh(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-slate-400 line-through">{ksh(product.oldPrice)}</span>}
            {product.discount ? <span className="rounded bg-green/10 px-2 py-0.5 text-sm font-bold text-green">-{product.discount}%</span> : null}
          </div>

          <p className="mt-4 text-slate-brand">
            Certified, durable and built for the job. The {product.name.toLowerCase()} meets Kenyan workplace
            safety standards and can be branded with your company logo on request.
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-navy">Colour: <span className="font-normal text-slate-brand">{color}</span></p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                    className={`h-8 w-8 rounded-full border-2 ${color === c.name ? "border-green ring-2 ring-green/30" : "border-slate-200"}`}
                    style={{ backgroundColor: c.hex }} aria-label={c.name} />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-navy">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`min-w-10 rounded-md border px-3 py-1.5 text-sm ${size === s ? "border-green bg-green/10 font-semibold text-green" : "border-slate-300 text-navy/80 hover:border-slate-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-slate-300">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 py-2.5 text-lg text-navy hover:bg-slate-50">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3.5 py-2.5 text-lg text-navy hover:bg-slate-50">+</button>
            </div>
            <button onClick={addToCart} disabled={out}
              className={`btn-primary px-8 py-3.5 text-sm ${out ? "cursor-not-allowed opacity-60" : ""}`}>
              <Cart className="h-5 w-5" /> {out ? "Out of Stock" : "Add to Cart"}
            </button>
            <WishlistButton product={{ slug: product.slug, name: product.name, price: product.price, img: product.img }} variant="button" className="px-6 py-3.5 text-sm" />
          </div>

          {!out && (
            low ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <Cart className="h-5 w-5" /> Hurry — only <strong>{product.stock}</strong> left in stock.
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-green/30 bg-green/5 px-4 py-3 text-sm text-green-dark">
                <Check className="h-5 w-5" /> In stock and ready to ship across Kenya.
              </div>
            )
          )}

          <div className="mt-6 space-y-1 border-t border-slate-100 pt-5 text-sm text-slate-brand">
            {categoryName && <p>Category: <Link href={`/category/${categorySlug}`} className="font-semibold text-navy hover:text-green">{categoryName}</Link></p>}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="font-semibold text-navy">Share:</span>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-green" href={`https://wa.me/?text=${encodeURIComponent(product.name + " — " + shareUrl)}`}>WhatsApp</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-green" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>Facebook</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-green" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(product.name)}`}>X</a>
              <button type="button" onClick={() => { if (shareUrl) { navigator.clipboard?.writeText(shareUrl); toast("Link copied"); } }} className="hover:text-green">Copy link</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex flex-wrap gap-6 border-b border-slate-200">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 text-sm font-display font-bold ${tab === t ? "border-green text-navy" : "border-transparent text-slate-brand hover:text-navy"}`}>
              {t}{t === "Reviews" ? ` (${product.reviewsCount ?? 0})` : ""}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "Description" && (
            <div className="max-w-3xl space-y-4 text-slate-700">
              <p>The {product.name} is part of NEO Safety Supplies&apos; certified range, built to protect your crew and perform on the toughest Kenyan worksites.</p>
              <p>Every item is quality-checked and can be branded with your company logo through our in-house embroidery and printing. Available for single orders or nationwide rollouts, with volume pricing on request.</p>
            </div>
          )}
          {tab === "Additional information" && (
            <table className="w-full max-w-2xl text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr><td className="py-3 font-semibold text-navy">Brand</td><td className="py-3 text-slate-brand">NEO Safety Supplies</td></tr>
                <tr><td className="py-3 font-semibold text-navy">SKU</td><td className="py-3 text-slate-brand">{sku}</td></tr>
                {categoryName && <tr><td className="py-3 font-semibold text-navy">Category</td><td className="py-3 text-slate-brand">{categoryName}</td></tr>}
                {product.material && <tr><td className="py-3 font-semibold text-navy">Material</td><td className="py-3 text-slate-brand">{product.material}</td></tr>}
                {product.colors && product.colors.length > 0 && <tr><td className="py-3 font-semibold text-navy">Colours</td><td className="py-3 text-slate-brand">{product.colors.map((c) => c.name).join(", ")}</td></tr>}
                {product.sizes && product.sizes.length > 0 && <tr><td className="py-3 font-semibold text-navy">Sizes</td><td className="py-3 text-slate-brand">{product.sizes.join(", ")}</td></tr>}
                <tr><td className="py-3 font-semibold text-navy">Branding</td><td className="py-3 text-slate-brand">Embroidery, DTF, screen &amp; digital printing available</td></tr>
              </tbody>
            </table>
          )}
          {tab === "Reviews" && <ProductReviews slug={product.slug} fallbackRating={product.rating ?? 5} />}
          {tab === "Vendor info" && (
            <div className="max-w-2xl space-y-3 text-slate-700">
              <h3 className="font-display text-lg font-bold text-navy">NEO Safety Supplies Ltd</h3>
              <p>Nairobi&apos;s trusted supplier of PPE, workwear and branded uniforms. Delivering safety across Kenya.</p>
              <p className="flex items-center gap-2"><Shield className="h-5 w-5 text-green" /> Certified &amp; tested products</p>
              <p className="flex items-center gap-2"><Truck className="h-5 w-5 text-green" /> Fast nationwide delivery</p>
              <p className="flex items-center gap-2"><Check className="h-5 w-5 text-green" /> +254 707 866 446 · info@neosafetysupplies.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
