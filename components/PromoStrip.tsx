import Link from "next/link";
import { ArrowRight } from "./icons";
import { WorkwearJacket, ThreadSpool } from "./products";

export default function PromoStrip() {
  return (
    <section className="container-x grid gap-5 pb-14 md:grid-cols-2">
      <div className="relative flex items-center gap-4 overflow-hidden rounded-xl bg-navy p-7 text-white">
        <div className="flex-1">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-green-light">Bulk & Site Orders</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Kitting out a crew?</h3>
          <p className="mt-2 text-sm text-white/70">Volume pricing on PPE and workwear for teams and worksites.</p>
          <Link href="/contact" className="btn-primary mt-4 px-5 py-2.5 text-xs">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <WorkwearJacket className="h-32 w-32 shrink-0" />
      </div>
      <div className="relative flex items-center gap-4 overflow-hidden rounded-xl bg-green p-7 text-white">
        <div className="flex-1">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-white/80">Branding Services</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Add your logo</h3>
          <p className="mt-2 text-sm text-white/85">Embroidery &amp; print on workwear, vests and caps — your brand, our gear.</p>
          <Link href="/branding" className="btn mt-4 bg-white px-5 py-2.5 text-xs text-green hover:bg-white/90">
            Explore branding <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ThreadSpool className="h-32 w-32 shrink-0" />
      </div>
    </section>
  );
}
