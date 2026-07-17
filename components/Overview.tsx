import Image from "next/image";
import Link from "next/link";
import { settingImg } from "@/lib/catalog";
import { Shield, Shirt, Wrench, ArrowRight, Check } from "./icons";

const points = [
  { Icon: Shield, title: "Certified PPE", copy: "Head-to-toe protection that meets Kenyan workplace safety standards." },
  { Icon: Shirt, title: "Custom Uniforms", copy: "Made-to-order corporate, industrial and sector uniforms — branded to you." },
  { Icon: Wrench, title: "In-house Branding", copy: "Embroidery, DTF, screen and digital printing done under our own roof." },
];

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`absolute z-20 inline-flex animate-wobble items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy shadow-float will-change-transform sm:text-sm ${className}`}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-white"><Check className="h-3 w-3" /></span>
      {children}
    </span>
  );
}

export default async function Overview() {
  const mainImg = await settingImg("overview_image", "/neo1.jpeg");
  return (
    <section className="bg-[#f4f6f8] py-14">
      <div className="container-x grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Left: intro + steps */}
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-green">Who we are</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
            Nairobi&apos;s safety, workwear &amp; uniform partner
          </h2>
          <p className="mt-4 max-w-md text-slate-brand">
            NEO Safety Supplies Ltd equips Kenyan teams from head to toe — certified PPE, hard-wearing
            workwear and made-to-measure uniforms, branded with your logo in-house and delivered nationwide.
          </p>

          <div className="mt-8 space-y-2.5">
            {points.map(({ Icon, title, copy }, i) => {
              const active = i === 1;
              return (
                <div key={title}
                  className={`flex gap-4 rounded-2xl p-4 transition-shadow ${active ? "bg-white shadow-card" : "hover:bg-white/60"}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green"><Icon className="h-6 w-6" /></span>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-brand">{copy}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/about" className="btn-primary mt-8 px-6 py-3 text-sm">More about us <ArrowRight className="h-4 w-4" /></Link>
        </div>

        {/* Right: main image */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-float">
            <Image src={mainImg} alt="NEO Safety workwear and team" fill sizes="(max-width:768px) 90vw, 44vw" className="object-cover" />
          </div>

          <Pill className="left-3 top-3 [animation-delay:0s] [animation-duration:2s]">5+ Years of expertise</Pill>
          <Pill className="right-3 top-3 hidden [animation-delay:0.9s] [animation-duration:2.4s] sm:inline-flex">47 Counties reached</Pill>
          <Pill className="bottom-3 right-3 [animation-delay:1.6s] [animation-duration:2.2s]">Certified &amp; tested</Pill>
        </div>
      </div>
    </section>
  );
}
