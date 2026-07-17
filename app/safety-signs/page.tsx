import PageHero from "@/components/PageHero";
import { safetySigns } from "@/lib/data";
import { getAdverts } from "@/lib/catalog";
import { AdStrip } from "@/components/AdvertStrip";

export const metadata = {
  title: "Safety Signs | NEO Safety Supplies",
  description: "Buy compliant workplace safety signs in Kenya — off-the-shelf and custom signage for construction, industrial and commercial sites.",
  keywords: ["safety signs Kenya", "workplace signage Kenya", "custom safety signs", "construction signs Kenya", "industrial safety signs"],
};

export default async function SafetySignsPage() {
  const ads = [...(await getAdverts("shop_top")), ...(await getAdverts("shop_side"))];
  return (
    <main>
      <PageHero title="Safety Signs" subtitle="Compliant signage for every workplace — off-the-shelf or custom to your site." />
      {ads.length > 0 && (
        <div className="container-x pt-8">
          <AdStrip ad={ads[0]} />
        </div>
      )}
      <section className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {safetySigns.map((s) => (
          <div key={s} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-float">
            <span className="font-display text-lg font-bold text-navy">{s}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 font-bold text-green">!</span>
          </div>
        ))}
      </section>
    </main>
  );
}
