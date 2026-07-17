import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";
import TypedHeadline from "./TypedHeadline";
import { settingImg } from "@/lib/catalog";

export default async function Hero() {
  const [heroImg, heroProductsImg] = await Promise.all([
    settingImg("hero_image", "/images/hero-bg.png"),
    settingImg("hero_products_image", "/images/hero-products.png"),
  ]);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eef1f4] via-[#f3f5f7] to-[#e7ebee]">
      <div className="absolute inset-0">
        <Image src={heroImg} alt="" aria-hidden fill priority sizes="100vw" data-speed="0.9" className="scale-125 object-cover blur-[2px]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/80 to-white/55" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-12 sm:px-6 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <h1 className="min-h-[2.2em] font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <TypedHeadline />
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-navy/70">
            High-quality PPE, workwear and branded uniforms, delivered fast to industries across Kenya.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/ppe" className="btn-primary px-7 py-3.5 text-sm">SHOP PPE <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/uniforms" className="btn-outline bg-white/60 px-7 py-3.5 text-sm">SHOP UNIFORMS <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="md:col-span-7">
          
        <Image
            src={heroProductsImg}
            alt="NEO Safety PPE and workwear: hard hat, jacket, hi-vis vest, ear protection, boots, gloves and fire extinguisher"
            width={1200}
            height={514}
            priority
            data-lag="0.15" className="h-auto w-full scale-105 object-contain drop-shadow-2xl md:scale-110"
          />
        </div>
      </div>
    </section>
  );
}
