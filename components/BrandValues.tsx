import Image from "next/image";
import { Shield, Tag, Truck, Headset } from "./icons";
import StaggerGroup from "./StaggerGroup";

const values = [
  { Icon: Shield, title: "Safety", copy: "Certified protection you can trust on every job.", img: "/images/catalog/worker-hivis.jpg" },
  { Icon: Tag, title: "Quality", copy: "Durable gear built to perform and last.", img: "/images/catalog/coveralls-set.jpg" },
  { Icon: Truck, title: "Reliability", copy: "In stock and delivered across Kenya, on time.", img: "/images/catalog/scene.jpg" },
  { Icon: Headset, title: "Integrity", copy: "Honest advice and fair, transparent pricing.", img: "/images/catalog/corporate-suit.jpg" },
];

export default function BrandValues() {
  return (
    <section className="bg-[#f4f6f8] py-11">
      <div className="container-x">
        <div className="mb-9 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy">OUR BRAND VALUES</h2>
          <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-green" />
        </div>
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, copy, img }) => (
            <div key={title} className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card">
              <Image src={img} alt={title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 p-6 text-white">
                <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-green text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="text-sm text-white/80">{copy}</p>
              </div>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
