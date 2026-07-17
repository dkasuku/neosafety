import Image from "next/image";
import Link from "next/link";
import { settingImg } from "@/lib/catalog";
import { ArrowRight } from "./icons";

const points = [
  {
    title: "Environmental Responsibility",
    copy: "We choose sustainable sourcing and production practices that reduce pollution, lower carbon emissions and protect Kenya's natural resources for future generations.",
  },
  {
    title: "Women Empowerment",
    copy: "Our supply chain creates meaningful employment and skills training for women in tailoring, quality control and operations, helping build stronger communities.",
  },
  {
    title: "Waste Management by Recycling",
    copy: "Textile offcuts and discarded fabrics are collected, sorted and upcycled into durable products instead of ending up in landfills.",
  },
];

export default async function Sustainability() {
  const sectionImg = await settingImg("sustainability_image", "/neorecycle.jpeg");
  return (
    <section className="overflow-hidden bg-[#f4f6f8] py-14">
      <div className="container-x">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-float">
              <Image
                src={sectionImg}
                alt="Environmental conservation and textile recycling"
                fill
                sizes="(max-width:768px) 90vw, 44vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-green">Sustainability</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
              Environmental Conservation
            </h2>
            <p className="mt-4 text-slate-brand">
              At NEO Safety Supplies, we believe protecting people and protecting the planet go hand in hand. Through
              responsible sourcing, recycling and community empowerment, we are working to reduce our environmental
              footprint while delivering the safety products Kenyan teams rely on every day.
            </p>

            <ul className="mt-7 space-y-5">
              {points.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-brand">{p.copy}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/ppe" className="btn-primary mt-8 px-6 py-3 text-sm">
              Explore Our Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
