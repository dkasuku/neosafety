import ProductCard from "./ProductCard";
import { AdStrip } from "./AdvertStrip";
import { Box } from "./icons";
import type { Product, Advert } from "@/lib/data";

const INTERVAL = 8;

export default function ProductGrid({ products, ads = [] }: { products: Product[]; ads?: Advert[] }) {
  if (!products.length) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green"><Box className="h-8 w-8" /></span>
        <h3 className="mt-4 font-display text-lg font-bold text-navy">No products yet</h3>
        <p className="mt-1 text-sm text-slate-brand">Nothing in this category yet — check back soon.</p>
      </div>
    );
  }
  const nodes: React.ReactNode[] = [];
  products.forEach((p, idx) => {
    nodes.push(<ProductCard key={p.slug} p={p} />);
    if (ads.length && (idx + 1) % INTERVAL === 0 && idx + 1 < products.length) {
      const ad = ads[Math.floor(idx / INTERVAL) % ads.length];
      nodes.push(<div key={`ad-${idx}`} className="col-span-full"><AdStrip ad={ad} /></div>);
    }
  });
  return <div className="grid grid-cols-2 gap-5 md:grid-cols-3">{nodes}</div>;
}
