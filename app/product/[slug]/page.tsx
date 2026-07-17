import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getProducts, getCategory, getProductsByCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  return {
    title: p ? `${p.name} | NEO Safety Supplies` : "Product",
    description: p ? `Buy ${p.name} at NEO Safety Supplies — certified ${p.category?.replace(/-/g, " ")} for teams across Kenya. In-house branding and fast delivery available.` : "Product",
    keywords: p ? [`${p.name} Kenya`, `${p.category?.replace(/-/g, " ")} Kenya`, `buy ${p.name}`, "NEO Safety Supplies"] : ["product"],
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const category = product.category ? await getCategory(product.category) : undefined;

  // Build a full row of recommendations: same category first, then top up
  // with other products so there's never an empty gap before the footer.
  const sameCat = (await getProductsByCategory(product.category ?? "")).filter((p) => p.slug !== product.slug);
  const seen = new Set([product.slug, ...sameCat.map((p) => p.slug)]);
  const others = (await getProducts()).filter((p) => !seen.has(p.slug));
  // featured/discounted first among the top-ups
  others.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const recommended = [...sameCat, ...others].slice(0, 4);

  return (
    <main>
      <ProductDetail product={product} categoryName={category?.name} categorySlug={category?.slug} />

      {recommended.length > 0 && (
        <section className="border-t border-slate-100 bg-[#f4f6f8]">
          <div className="container-x py-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-widest text-green">You may also like</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-navy md:text-3xl">Recommended for you</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {recommended.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
