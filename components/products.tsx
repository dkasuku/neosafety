/* Branded product imagery (raster PNGs in /public/images/products).
   Each mockup has the NEO hand logo composited onto the merchandise. */
import Image from "next/image";
import * as React from "react";

type Props = { className?: string };

const labels: Record<string, string> = {
  hardhat: "Safety hard hat with NEO logo",
  gloves: "Work gloves with NEO logo",
  hivis: "Hi-vis reflective vest with NEO logo",
  boots: "Steel-toe safety boot",
  respirator: "Half-mask respirator",
  fire: "Fire extinguisher",
  workwear: "Workwear jacket with NEO logo",
  branding: "Branding thread spool",
  earmuffs: "Ear protection muffs",
  goggles: "Safety goggles",
};

export function ProductImage({ art, className }: { art: string; className?: string }) {
  const key = labels[art] ? art : "hardhat";
  return (
    <Image
      src={`/images/products/${key}.png`}
      alt={labels[key]}
      width={600}
      height={600}
      className={`object-contain ${className ?? ""}`}
    />
  );
}

const make = (art: string) => {
  const C = ({ className }: Props) => <ProductImage art={art} className={className} />;
  C.displayName = art;
  return C;
};

export const HardHat = make("hardhat");
export const Gloves = make("gloves");
export const HiVisVest = make("hivis");
export const Boots = make("boots");
export const Respirator = make("respirator");
export const Extinguisher = make("fire");
export const WorkwearJacket = make("workwear");
export const ThreadSpool = make("branding");
export const EarMuffs = make("earmuffs");
export const Goggles = make("goggles");

export const productArt: Record<string, React.FC<Props>> = {
  hardhat: HardHat,
  gloves: Gloves,
  hivis: HiVisVest,
  boots: Boots,
  respirator: Respirator,
  fire: Extinguisher,
  workwear: WorkwearJacket,
  branding: ThreadSpool,
  earmuffs: EarMuffs,
  goggles: Goggles,
};

export function Media({ img, art, alt, className }: { img?: string; art?: string; alt: string; className?: string }) {
  if (img) {
    return <Image src={img} alt={alt} width={800} height={800} className={`object-contain ${className ?? ""}`} />;
  }
  const Art = (art && productArt[art]) || productArt.hardhat;
  return <Art className={className} />;
}
