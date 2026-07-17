import PageHero from "@/components/PageHero";
import ShopSidebar from "@/components/ShopSidebar";
import ProductGrid from "@/components/ProductGrid";
import { getProducts, getAdverts } from "@/lib/catalog";

export const metadata = {
  title: "PPE Products | NEO Safety Supplies",
  description: "Buy certified PPE in Kenya — hard hats, safety gloves, goggles, boots, hi-vis vests, fire safety and more. Fast delivery and bulk pricing available.",
  keywords: ["PPE Kenya", "personal protective equipment Kenya", "safety gloves Kenya", "hard hats Kenya", "safety boots Kenya", "hi-vis vests Kenya", "fire safety Kenya"],
};

export default async function PPEPage() {
  const [products, topAds, sideAds] = await Promise.all([getProducts(), getAdverts("shop_top"), getAdverts("shop_side")]);
  return (
    <main>
      <PageHero title="PPE Products" subtitle="Personal protective equipment tested, certified and ready to ship across Kenya." />
      <div className="container-x flex flex-col gap-8 py-10 lg:flex-row">
        <ShopSidebar />
        <div className="flex-1">
          <p className="mb-5 text-sm text-slate-brand">{products.length} products</p>
          <ProductGrid products={products} ads={[...topAds, ...sideAds]} />
        </div>
      </div>
    </main>
  );
}
