import Image from "next/image";
import { industries } from "@/lib/data";
import { settingImg } from "@/lib/catalog";
import { Check } from "./icons";
import StaggerGroup from "./StaggerGroup";

export default async function Industries() {
  const img = await settingImg("industries_image", "/images/catalog/scene.jpg");
  
  return (
    <section className="relative overflow-hidden bg-navy py-11 text-white">
      <Image src={img} alt="" aria-hidden fill sizes="100vw" data-speed="0.9" className="scale-110 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/55 to-navy/85" />
      <div className="container-x relative">
        <div className="mb-9 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">INDUSTRIES WE SERVE</h2>
          <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-green" />
          <p className="mx-auto mt-3 max-w-xl text-white/70">From construction sites to corporate offices, we kit out teams across every sector in Kenya.</p>
        </div>
        <StaggerGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((name) => (
            <div key={name} className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-sm backdrop-blur-sm">
              <Check className="h-4 w-4 shrink-0 text-green-light" /> {name}
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
