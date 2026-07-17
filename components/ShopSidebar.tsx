import Link from "next/link";
import { getCategories, getAdverts } from "@/lib/catalog";
import { contact } from "@/lib/data";
import { AdCard } from "./AdvertStrip";

export default async function ShopSidebar({ active }: { active?: string }) {
  const [categories, ads] = await Promise.all([getCategories(), getAdverts("shop_side")]);
  return (
    <aside className="w-full shrink-0 space-y-5 lg:w-64">
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Categories</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/ppe" className={`block rounded-md px-3 py-2 ${!active ? "bg-green/10 font-semibold text-green" : "text-navy/80 hover:bg-slate-50"}`}>All Products</Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className={`block rounded-md px-3 py-2 ${active === c.slug ? "bg-green/10 font-semibold text-green" : "text-navy/80 hover:bg-slate-50"}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-navy p-5 text-white">
        <h4 className="font-display text-sm font-bold">Need help choosing?</h4>
        <p className="mt-1 text-sm text-white/70">Talk to our safety experts.</p>
        <a href={contact.phoneHref} className="mt-3 block font-display text-lg font-bold text-green-light">{contact.phone}</a>
      </div>

      {ads.map((a, i) => <AdCard key={i} ad={a} />)}
    </aside>
  );
}
