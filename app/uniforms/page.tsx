import PageHero from "@/components/PageHero";
import CategoryGrid from "@/components/CategoryGrid";
import { getUniformCategories } from "@/lib/catalog";

export const metadata = {
  title: "Uniforms & Workwear | NEO Safety Supplies",
  description: "Shop made-to-order uniforms and workwear in Kenya — corporate, industrial, security, school, hospitality and medical uniforms branded with your logo.",
  keywords: ["uniforms Kenya", "workwear Kenya", "corporate uniforms Kenya", "industrial uniforms Kenya", "security uniforms Kenya", "school uniforms Kenya", "medical scrubs Kenya"],
};

export default async function UniformsPage() {
  const items = await getUniformCategories();
  return (
    <main>
      <PageHero title="Uniforms & Workwear" subtitle="Made-to-order uniforms for every sector — branded with your logo in-house." />
      <CategoryGrid items={items} heading="Uniform Ranges" viewAllHref="/ppe" />
    </main>
  );
}
