import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogSidebar from "@/components/BlogSidebar";
import { ArrowRight } from "@/components/icons";
import { blogPosts, findPost } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = findPost(params.slug);
  return {
    title: p ? `${p.title} | NEO Safety Supplies` : "Blog",
    description: p ? `${p.excerpt} Read more safety tips and product advice on the NEO Safety Supplies blog.` : "Safety blog",
    keywords: p ? [p.tag, "safety tips Kenya", "PPE advice", "workwear guide", "NEO Safety blog"] : ["blog"],
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = findPost(params.slug);
  if (!post) notFound();

  return (
    <main className="container-x py-10">
      <nav className="mb-6 text-sm text-slate-brand">
        <Link href="/" className="hover:text-green">Home</Link><span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-green">Blog</Link><span className="mx-2">/</span>
        <span className="text-navy">{post.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="order-2 lg:order-1"><BlogSidebar /></div>

        <article className="order-1 lg:order-2 min-w-0">
          <span className="inline-block rounded bg-navy px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">{post.tag}</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-slate-brand">By NEO Safety Team · {post.date}</p>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card">
            <Image src={post.img} alt={post.title} fill sizes="(max-width:1024px) 100vw, 800px" priority className="object-cover" />
          </div>

          <p className="mt-8 text-lg leading-relaxed text-navy">{post.body[0]}</p>

          {post.body.length > 2 && (
            <h2 className="mt-8 font-display text-2xl font-bold text-navy">What to look for</h2>
          )}
          <div className="mt-4 space-y-5 text-lg leading-relaxed text-slate-700">
            {post.body.slice(1, -1).map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <blockquote className="my-8 rounded-2xl bg-navy p-8 text-white">
            <p className="font-display text-xl font-bold leading-snug">&ldquo;{post.excerpt}&rdquo;</p>
            <p className="mt-3 text-sm text-white/70">NEO Safety Supplies</p>
          </blockquote>

          <p className="text-lg leading-relaxed text-slate-700">{post.body[post.body.length - 1]}</p>

          <div className="mt-10 flex items-center justify-between rounded-2xl bg-[#f4f6f8] p-6">
            <div>
              <h3 className="font-display text-lg font-bold text-navy">Need PPE, workwear or uniforms?</h3>
              <p className="text-sm text-slate-brand">Talk to our team for advice and a fast quote.</p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0 px-6 py-3 text-sm">Get in touch <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </article>
      </div>
    </main>
  );
}
