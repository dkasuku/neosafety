import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import ShopSidebar from "@/components/ShopSidebar";
import { Search } from "@/components/icons";
import { getProducts, getCategory, getAdverts } from "@/lib/catalog";

export const metadata = {
  title: "Search | NEO Safety Supplies",
  description: "Search NEO Safety Supplies for PPE, workwear, uniforms, safety signs and branding services in Kenya.",
  keywords: ["search PPE Kenya", "search workwear Kenya", "search uniforms Kenya", "NEO Safety Supplies products"],
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const cat = searchParams.cat ?? "";
  const ql = q.toLowerCase();
  const category = cat ? await getCategory(cat) : undefined;
  const [topAds, sideAds] = await Promise.all([getAdverts("shop_top"), getAdverts("shop_side")]);

  let results = await getProducts();
  if (cat) results = results.filter((p) => p.category === cat);
  if (ql) results = results.filter((p) => p.name.toLowerCase().includes(ql) || (p.category ?? "").replace(/-/g, " ").includes(ql));

  const label = q ? `Search results for “${q}”` : category ? category.name : "All products";

  return (
    <main>
      <PageHero title={label} crumb="Search" subtitle={`${results.length} product${results.length === 1 ? "" : "s"} found${category ? ` in ${category.name}` : ""}.`} />
      <div className="container-x flex flex-col gap-8 py-10 lg:flex-row">
        <ShopSidebar active={cat || undefined} />
        <div className="flex-1">
          {results.length > 0 ? (
            <ProductGrid products={results} ads={[...topAds, ...sideAds]} />
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-card">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green"><Search className="h-8 w-8" /></span>
              <h2 className="mt-4 font-display text-xl font-bold text-navy">No products found</h2>
              <p className="mt-2 text-slate-brand">Try a different keyword or browse our categories.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
