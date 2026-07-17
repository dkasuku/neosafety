import PageHero from "@/components/PageHero";
import CategoryGrid from "@/components/CategoryGrid";
import { getUniformCategories, getAdverts } from "@/lib/catalog";
import { AdCard } from "@/components/AdvertStrip";

export const metadata = {
  title: "Uniforms & Workwear | NEO Safety Supplies",
  description: "Shop made-to-order uniforms and workwear in Kenya — corporate, industrial, security, school, hospitality and medical uniforms branded with your logo.",
  keywords: ["uniforms Kenya", "workwear Kenya", "corporate uniforms Kenya", "industrial uniforms Kenya", "security uniforms Kenya", "school uniforms Kenya", "medical scrubs Kenya"],
};

export default async function UniformsPage() {
  const [items, ads] = await Promise.all([getUniformCategories(), getAdverts("shop_side")]);
  return (
    <main>
      <PageHero title="Uniforms & Workwear" subtitle="Made-to-order uniforms for every sector — branded with your logo in-house." />
      <CategoryGrid items={items} heading="Uniform Ranges" viewAllHref="/ppe" />
      {ads.length > 0 && (
        <section className="container-x pb-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((a, i) => <AdCard key={i} ad={a} />)}
          </div>
        </section>
      )}
    </main>
  );
}
