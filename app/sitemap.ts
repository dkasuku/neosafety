import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://neosafetysupplies.com";
  const staticRoutes = ["", "/ppe", "/uniforms", "/workwear", "/safety-signs", "/branding", "/about", "/contact", "/blog", "/track"];
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);
  const now = new Date();
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r}`, lastModified: now })),
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: now })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: now })),
  ];
}
