import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/data";
import { ArrowRight } from "@/components/icons";

export const metadata = {
  title: "Safety Blog | NEO Safety Supplies",
  description: "Read expert guides, workplace safety tips and product advice for PPE, workwear and uniforms in Kenya.",
  keywords: ["safety blog Kenya", "PPE tips", "workwear guide", "workplace safety Kenya", "uniforms advice"],
};

export default function BlogPage({ searchParams }: { searchParams: { tag?: string } }) {
  const tag = searchParams?.tag;
  const posts = tag ? blogPosts.filter((p) => p.tag === tag) : blogPosts;
  return (
    <main>
      <PageHero title="Safety Blog" subtitle="Guides, compliance tips and product advice for safer, sharper worksites." />
      <section className="container-x grid gap-6 py-12 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-float">
            <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
              <Image src={post.img} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded bg-green px-2 py-0.5 text-xs font-bold text-white">{post.tag}</span>
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-brand">{post.date}</span>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy">
                <Link href={`/blog/${post.slug}`} className="hover:text-green">{post.title}</Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-brand">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green">Read more <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
