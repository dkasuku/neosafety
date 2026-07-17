import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ShopSidebar from "@/components/ShopSidebar";
import ProductGrid from "@/components/ProductGrid";
import { ArrowRight, Wrench } from "@/components/icons";
import { contact } from "@/lib/data";
import { getCategory, getCategories, getProductsByCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await getCategory(params.slug);
  return {
    title: c ? `${c.name} | NEO Safety Supplies` : "Category",
    description: c ? `Shop ${c.name} at NEO Safety Supplies — ${c.blurb}. Certified products, fast delivery and in-house branding across Kenya.` : "Product category",
    keywords: c ? [`${c.name} Kenya`, `${c.name} Nairobi`, `buy ${c.name}`, `NEO Safety ${c.name}`] : ["category"],
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  if (!category) notFound();
  const items = await getProductsByCategory(category.slug);
  return (
    <main>
      <PageHero title={category.name} subtitle={category.blurb} crumb={category.name} />
      <div className="container-x flex flex-col gap-8 py-10 lg:flex-row">
        <ShopSidebar active={category.slug} compact />
        <div className="flex-1">
          {items.length > 0 ? (
            <>
              <p className="mb-5 text-sm text-slate-brand">{items.length} products</p>
              <ProductGrid products={items} ads={[]} />
            </>
          ) : (
            <div className="grid items-center gap-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-card md:grid-cols-2">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green"><Wrench className="h-6 w-6" /></span>
                <h2 className="mt-4 font-display text-2xl font-bold text-navy">Made to order</h2>
                <p className="mt-3 text-slate-brand">
                  Our {category.name.toLowerCase()} are produced to your specification and branded with your
                  logo in-house. Tell us your quantities, sizes and colours and we&apos;ll send a quote.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-primary px-6 py-3 text-sm">Request a quote <ArrowRight className="h-4 w-4" /></Link>
                  <a href={contact.phoneHref} className="btn-outline px-6 py-3 text-sm">{contact.phone}</a>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-light p-10 text-center">
                <p className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-white">{category.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
