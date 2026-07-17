import Link from "next/link";

export default function PageHero({ title, subtitle, crumb }: { title: string; subtitle?: string; crumb?: string }) {
  return (
    <section className="border-b border-slate-100 bg-[#f4f6f8]">
      <div className="container-x py-7">
        <nav className="mb-2 text-sm text-slate-brand">
          <Link href="/" className="hover:text-green">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">{crumb ?? title}</span>
        </nav>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-brand">{subtitle}</p>}
      </div>
    </section>
  );
}
