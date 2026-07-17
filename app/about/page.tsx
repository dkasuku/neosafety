import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Shield, Star, Check, ArrowRight } from "@/components/icons";
import { getStats, getSettings } from "@/lib/catalog";

export const metadata = {
  title: "About Us | NEO Safety Supplies",
  description: "Learn about NEO Safety Supplies Ltd — Kenya's trusted supplier of certified PPE, workwear, branded uniforms, safety signs and in-house embroidery/printing services.",
  keywords: ["about NEO Safety Supplies", "PPE supplier Kenya", "workwear supplier Kenya", "uniforms supplier Nairobi", "safety company Kenya"],
};

const pillars = [
  { Icon: Shield, title: "Our Mission", copy: "To equip every Kenyan worker with certified, affordable protection and professional workwear — delivered fast and backed by expert advice." },
  { Icon: Star, title: "Our Vision", copy: "To be East Africa's most trusted name in safety, workwear and branded uniforms." },
  { Icon: Check, title: "Our Values", copy: "Safety, quality, reliability and integrity in everything we supply and every team we serve." },
];

const clients = [
  { name: "Bonfire", img: "/images/clients/bonfire.jpg" },
  { name: "SOS Children's Villages", img: "/images/clients/sos-village.jpg" },
  { name: "Giza Systems", img: "/images/clients/giza-systems.jpg" },
  { name: "Gulf Tanks", img: "/images/clients/gulf-tanks.jpg" },
];

export default async function AboutPage() {
  const [stats, settings] = await Promise.all([getStats(), getSettings()]);
  const img = (k: string, fb: string) => settings[k]?.img || fb;
  return (
    <main>
      {/* Title + hero image */}
      <Reveal>
        <section className="container-x pt-8 pb-6">
          <div className="mb-4">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-green">About Us</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              About NEO Safety Supplies
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-brand">
              Nairobi&apos;s trusted supplier of PPE, workwear and branded uniforms — protecting teams across Kenya, head to toe.
            </p>
          </div>
          <div className="relative h-40 w-full overflow-hidden rounded-2xl shadow-card sm:h-52 md:h-64">
            <Image src={img("about_hero", "/images/catalog/coveralls-set.jpg")} alt="NEO Safety workwear range" fill priority sizes="100vw" className="object-cover" />
          </div>
        </section>
      </Reveal>

      {/* Story + mission/vision/values + collage */}
      <Reveal>
        <section className="container-x py-12">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
                For over five years, we&apos;ve kept Kenyan teams protected and looking professional.
              </h2>
              <p className="mt-4 text-slate-brand">
                NEO Safety Supplies Ltd began by supplying certified personal protective equipment to Nairobi&apos;s
                construction and industrial sites. Today we are a full head-to-toe partner — PPE, hard-wearing
                workwear and made-to-measure uniforms — and we brand it all with your logo through our in-house
                embroidery and printing. From a single site kit to a nationwide rollout, we deliver quickly and
                stand behind every product we sell.
              </p>
              <div className="mt-8 space-y-6">
                {pillars.map(({ Icon, title, copy }) => (
                  <div key={title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green"><Icon className="h-6 w-6" /></span>
                    <div>
                      <h3 className="font-display text-base font-bold text-navy">{title}</h3>
                      <p className="mt-1 text-sm text-slate-brand">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-2xl shadow-card">
                <Image src={img("about_collage1", "/images/catalog/shirts-rack.jpg")} alt="Corporate shirts" width={720} height={405} className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl shadow-card">
                <Image src={img("about_collage2", "/images/catalog/worker-hivis.jpg")} alt="Worker in branded PPE" width={400} height={400} className="h-full w-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl shadow-card">
                <Image src={img("about_collage3", "/images/catalog/nurse-female.jpg")} alt="Healthcare uniform" width={400} height={400} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Stats band */}
      <Reveal>
        <section className="relative overflow-hidden py-14">
          <Image src={img("about_stats_bg", "/images/catalog/suits-rack.jpg")} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-navy/85" />
          <div className="container-x relative">
            <h2 className="text-center font-display text-2xl font-extrabold text-white md:text-3xl">Trusted across Kenya</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 text-center text-white lg:grid-cols-4">
              {stats.map((st) => (
                <div key={st.label}>
                  <p className="font-display text-4xl font-extrabold text-green-light">{st.value}</p>
                  <p className="mt-1 text-sm text-white/75">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* We love our clients */}
      <Reveal>
        <section className="container-x py-14 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">We Love Our Clients</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-brand">We are proud to have formed lasting partnerships with organisations across Kenya.</p>
          <div className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
            {clients.map((c) => (
              <div key={c.name} className="flex items-center justify-center rounded-xl border border-slate-100 bg-white p-6 shadow-card">
                <Image src={c.img} alt={c.name} width={200} height={70} className="h-12 w-auto object-contain grayscale transition hover:grayscale-0" />
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-10 px-7 py-3.5 text-sm">Work with us <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </Reveal>
    </main>
  );
}
