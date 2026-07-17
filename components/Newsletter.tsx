import Image from "next/image";
import { settingImg } from "@/lib/catalog";

export default async function Newsletter() {
  const img = await settingImg("newsletter_image", "/images/catalog/rack.jpg");
  return (
    <section className="relative overflow-hidden">
      <Image src={img} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-navy/90" />
      <div className="container-x relative py-8 text-center text-white">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Stay protected, stay informed</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">Safety tips, new arrivals and exclusive offers from NEO Safety Supplies.</p>
        <form className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
          <input type="email" required placeholder="Your email address" className="w-full rounded-md px-4 py-3 text-navy outline-none" />
          <button type="submit" className="btn-primary shrink-0 px-6 py-3 text-sm">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
