import Link from "next/link";
import { getFeatured } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import { ArrowRight } from "./icons";
import StaggerGroup from "./StaggerGroup";

export default async function FeaturedProducts() {
  const featured = await getFeatured();
  return (
    <section className="container-x pb-4">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy">FEATURED PRODUCTS</h2>
        <Link href="/ppe" className="inline-flex items-center gap-1 text-sm font-semibold text-green hover:text-green-dark">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <StaggerGroup className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {featured.slice(0, 8).map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </StaggerGroup>
    </section>
  );
}
