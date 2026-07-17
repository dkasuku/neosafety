import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import TrustTicker from "@/components/TrustTicker";
import Overview from "@/components/Overview";
import AdvertBanners from "@/components/AdvertBanners";
import BrandingServices from "@/components/BrandingServices";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Industries from "@/components/Industries";
import Sustainability from "@/components/Sustainability";
import BrandValues from "@/components/BrandValues";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import Newsletter from "@/components/Newsletter";

export const metadata = {
  title: "NEO Safety Supplies Ltd | PPE, Workwear & Uniforms in Kenya",
  description: "Shop certified PPE, workwear, branded uniforms, safety signs and printing services in Kenya. Quality products, in-house branding and fast nationwide delivery.",
  keywords: ["PPE Kenya", "workwear Kenya", "uniforms Kenya", "safety signs Kenya", "branded uniforms Nairobi", "embroidery Kenya", "NEO Safety Supplies"],
};


export default function Home() {
  return (
    <main>
      <Reveal><Hero /></Reveal>
      <Reveal><TrustBar /></Reveal>
      <Reveal><TrustTicker /></Reveal>
      <Reveal><AdvertBanners /></Reveal>
      <Reveal><Overview /></Reveal>
      <Reveal><ClientLogos /></Reveal>
      <Reveal><Sustainability /></Reveal>
      <Reveal><CategoryGrid /></Reveal>
      <Reveal><FeaturedProducts /></Reveal>
      <Reveal><Industries /></Reveal>
      <Reveal><BrandingServices /></Reveal>
      <Reveal><BrandValues /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><Newsletter /></Reveal>
    </main>
  );
}
