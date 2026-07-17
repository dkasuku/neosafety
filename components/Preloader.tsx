"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 2000);
    const t2 = setTimeout(() => setGone(true), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy transition-opacity duration-700 ${hiding ? "opacity-0" : "opacity-100"}`}
      aria-hidden={hiding}
    >
      <div className="relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
        <span className="absolute inset-0 animate-spin rounded-full border-[6px] border-white/10 border-t-green [animation-duration:1s]" />
        <span className="absolute inset-3 rounded-full border border-white/5" />
        <Image src="/logo.png" alt="NEO Safety Supplies Ltd" width={260} height={130} priority className="h-12 w-auto px-6 brightness-0 invert md:h-16" />
      </div>
    </div>
  );
}
