import Image from "next/image";

export default function HeroScene({ className }: { className?: string }) {
  return (
    <Image
      src="/images/hero.png"
      alt="PPE and workwear collage: hard hat, goggles, jacket, hi-vis vest, ear protection, safety boots, gloves and fire extinguisher"
      width={1520}
      height={1120}
      priority
      className={`h-auto w-full object-contain ${className ?? ""}`}
    />
  );
}
