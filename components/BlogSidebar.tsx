import Image from "next/image";
import Link from "next/link";
import { blogPosts, blogCategories } from "@/lib/data";
import { Search, ChevronRight } from "./icons";

export default function BlogSidebar() {
  const latest = blogPosts.slice(0, 5);
  return (
    <aside className="space-y-8 lg:w-72 lg:shrink-0">
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Search</h3>
        <form action="/search" className="flex items-stretch overflow-hidden rounded-md border border-slate-300 focus-within:border-green">
          <input name="q" placeholder="Search…" className="min-w-0 flex-1 px-3 py-2 text-sm outline-none" />
          <button className="flex items-center bg-green px-3 text-white"><Search className="h-4 w-4" /></button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Blog Categories</h3>
        <ul className="space-y-1 text-sm">
          {blogCategories.map((t) => (
            <li key={t}>
              <Link href={`/blog?tag=${encodeURIComponent(t)}`} className="flex items-center gap-1.5 rounded px-2 py-2 text-navy/80 hover:bg-slate-50 hover:text-green">
                <ChevronRight className="h-4 w-4 text-green" /> {t}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-navy">Latest Posts</h3>
        <div className="space-y-4">
          {latest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3">
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-md">
                <Image src={p.img} alt={p.title} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-snug text-navy group-hover:text-green">{p.title}</p>
                <span className="text-xs text-slate-brand">{p.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
