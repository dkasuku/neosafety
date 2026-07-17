import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";

export default function AdvertBanners() {
  return (
    <section className="w-full mt-6">
      <div className="grid gap-1 lg:grid-cols-3 lg:grid-rows-2">
        {/* Big banner */}
        <div className="relative flex min-h-[320px] flex-col justify-center overflow-hidden p-8 lg:col-span-2 lg:row-span-2">
          <Image src="/images/catalog/scene.jpg" alt="" aria-hidden fill sizes="(max-width:1024px) 100vw, 66vw" data-speed="0.92" className="scale-110 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/30" />
          <div className="relative max-w-sm">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-green-light">NEO Safety Supplies</p>
            <h3 className="mt-2 font-display text-3xl font-bold leading-tight text-white md:text-4xl">Full Safety Kits, Delivered Daily</h3>
            <p className="mt-3 text-white/75">Premium PPE, workwear and branded uniforms — kitted for your crew and delivered across Kenya.</p>
            <Link href="/ppe" className="btn-primary mt-5 px-6 py-3 text-sm">SHOP NOW <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        {/* Side card 1 */}
        <Link href="/category/reflector-jackets" className="group relative flex min-h-[150px] items-end overflow-hidden p-6">
          <Image src="/images/catalog/hivis.jpg" alt="" aria-hidden fill sizes="33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
          <div className="relative">
            <h4 className="font-display text-xl font-bold text-white">Reflective Range</h4>
            <p className="mt-1 text-sm text-white/75">Hi-vis vests & jackets, always in stock.</p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-green-light">Explore <ArrowRight className="h-4 w-4" /></span>
          </div>
        </Link>

        {/* Side card 2 */}
        <Link href="/category/overalls" className="group relative flex min-h-[150px] items-end overflow-hidden p-6">
          <Image src="/images/catalog/coveralls.jpg" alt="" aria-hidden fill sizes="33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
          <div className="relative">
            <h4 className="font-display text-xl font-bold text-white">Overalls &amp; Coveralls</h4>
            <p className="mt-1 text-sm text-white/75">Durable boiler suits, branded to order.</p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-green-light">Explore <ArrowRight className="h-4 w-4" /></span>
          </div>
        </Link>
      </div>
    </section>
  );
}
