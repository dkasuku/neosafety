import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { brandingServices } from "@/lib/data";
import { getSettings } from "@/lib/catalog";
import { Check, ArrowRight } from "@/components/icons";

export const metadata = {
  title: "Branding & Printing | NEO Safety Supplies",
  description: "Professional branding and printing services in Kenya — embroidery, DTF, screen and digital printing on workwear, uniforms and promotional items.",
  keywords: ["branding Kenya", "embroidery Kenya", "DTF printing Kenya", "screen printing Kenya", "digital printing Kenya", "logo printing on uniforms Kenya"],
};

export default async function BrandingPage() {
  const settings = await getSettings();
  const img = (k: string, fb: string) => settings[k]?.img || fb;

  return (
    <main>
      {/* 1. Hero */}
      <Reveal>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image src={img("branding_hero", "/neo2.jpeg")} alt="Branded workwear" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-navy/75" />
          <div className="container-x relative flex min-h-[260px] flex-col items-center justify-center py-12 text-center text-white md:min-h-[320px] md:py-16">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-green-light">Branding Services</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Branding &amp; Printing
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/85">
              Put your logo on every garment — embroidery, DTF, screen and digital printing, all done in-house for a fast, consistent, wash-proof finish.
            </p>
            <Link href="/contact" className="btn-primary mt-6 px-7 py-3 text-sm">
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* 2. Methods + collage */}
      <Reveal>
        <section className="container-x py-12">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
                Your brand, expertly applied
              </h2>
              <p className="mt-4 text-slate-brand">
                A consistent, logo&apos;d team looks professional and builds trust on site. We brand any garment we
                supply — or bring your own — using the method best suited to your artwork, fabric and budget.
              </p>
              <div className="mt-8 space-y-5">
                {brandingServices.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green/10 font-display text-sm font-bold text-green">{i + 1}</span>
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">{s.title} <Check className="h-4 w-4 text-green" /></h3>
                      <p className="mt-1 text-sm text-slate-brand">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary mt-8 px-7 py-3.5 text-sm">Request a quote <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-card">
                <Image src="/images/catalog/suits-rack.jpg" alt="Branded corporate wear" width={720} height={405} className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl shadow-card">
                <Image src="/images/catalog/security.jpg" alt="Printed logo on a vest" width={400} height={400} className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl shadow-card">
                <Image src="/images/catalog/worker-hivis.jpg" alt="Branded workwear on site" width={400} height={400} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3. CTA band */}
      <Reveal>
        <section className="relative overflow-hidden py-16">
          <Image src={img("branding_image", "/images/catalog/security.jpg")} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-navy/85" />
          <div className="container-x relative text-center text-white">
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">Ready to brand your team?</h2>
            <p className="mx-auto mt-2 max-w-xl text-white/75">Send us your logo and quantities — we&apos;ll recommend the best method and send a quote.</p>
            <Link href="/contact" className="btn-primary mt-6 px-8 py-3.5 text-sm">Get in touch <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
