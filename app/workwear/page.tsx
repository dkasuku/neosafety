import PageHero from "@/components/PageHero";
import ShopSidebar from "@/components/ShopSidebar";
import ProductGrid from "@/components/ProductGrid";
import { productsByCategory } from "@/lib/data";
import { getAdverts } from "@/lib/catalog";

export const metadata = {
  title: "Workwear | NEO Safety Supplies",
  description: "Durable workwear in Kenya — coveralls, jackets, trousers and vests built for tough sites and brandable with your company logo.",
  keywords: ["workwear Kenya", "coveralls Kenya", "work jackets Kenya", "industrial trousers Kenya", "branded workwear Kenya"],
};

export default async function WorkwearPage() {
  const items = productsByCategory("workwear");
  const [topAds, sideAds] = await Promise.all([getAdverts("shop_top"), getAdverts("shop_side")]);
  return (
    <main>
      <PageHero title="Workwear" subtitle="Coveralls, jackets and trousers built to perform — brandable with your logo." />
      <div className="container-x flex flex-col gap-8 py-10 lg:flex-row">
        <ShopSidebar active="workwear" />
        <div className="flex-1">
          <p className="mb-5 text-sm text-slate-brand">{items.length} products</p>
          <ProductGrid products={items} ads={[...topAds, ...sideAds]} />
        </div>
      </div>
    </main>
  );
}
