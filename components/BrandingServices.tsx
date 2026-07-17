import Image from "next/image";
import Link from "next/link";
import { settingImg } from "@/lib/catalog";
import { brandingServices } from "@/lib/data";
import { ArrowRight, Check } from "./icons";
import StaggerGroup from "./StaggerGroup";

export default async function BrandingServices() {
  const sectionImg = await settingImg("branding_services_image", "/neo2.jpeg");
  return (
    <section className="py-14">
      <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-float">
              <Image src={sectionImg} alt="NEO Safety branded garments" fill sizes="(max-width:768px) 90vw, 44vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display text-lg font-bold text-white">Your logo, expertly applied</p>
                <p className="text-sm text-white/80">Embroidery &amp; print on any garment we supply.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-green">Branding Services</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
            Your brand on every garment
          </h2>
          <p className="mt-4 text-slate-brand">
            We brand any garment we supply &mdash; or bring your own &mdash; in-house, using the method best
            suited to your artwork, fabric and budget for a fast, consistent, wash-proof finish.
          </p>
          <StaggerGroup className="mt-6 space-y-4">
            {brandingServices.map((s, i) => (
              <div key={s.title} className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 font-display text-sm font-bold text-green">{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">{s.title} <Check className="h-4 w-4 text-green" /></h3>
                  <p className="mt-0.5 text-sm text-slate-brand">{s.desc}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
          <Link href="/branding" className="btn-primary mt-7 px-6 py-3 text-sm">Explore branding <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
