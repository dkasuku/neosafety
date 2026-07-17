import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { type Category } from "@/lib/data";
import { ArrowRight } from "./icons";
import CategoryScroller from "./CategoryScroller";

export default async function CategoryGrid({
  items,
  heading = "SHOP BY CATEGORY",
  viewAllHref = "/uniforms",
}: {
  items?: Category[];
  heading?: string;
  viewAllHref?: string;
}) {
  const list = items ?? (await getCategories());
  return (
    <section className="container-x py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy">{heading}</h2>
          <span className="mt-3 block h-1 w-14 rounded-full bg-green" />
        </div>
        <Link href={viewAllHref} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-green hover:text-green-dark">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <CategoryScroller>
        {list.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} title={c.name}
            className="group flex w-[124px] shrink-0 flex-col rounded-lg border border-slate-100 bg-white p-2.5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-green/40 hover:shadow-float sm:w-[132px]">
            <div className="mb-2 aspect-square w-full overflow-hidden rounded-md bg-white">
              <Image src={c.img} alt={c.name} width={300} height={300} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <p className="w-full truncate text-center text-[12.5px] font-semibold text-navy">{c.name}</p>
          </Link>
        ))}
        <Link href={viewAllHref} className="flex w-[124px] shrink-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-green/40 bg-green/5 p-2.5 text-center text-green transition-colors hover:bg-green/10 sm:w-[132px]">
          <ArrowRight className="h-6 w-6" />
          <span className="text-[12.5px] font-semibold">View All</span>
        </Link>
      </CategoryScroller>
    </section>
  );
}
