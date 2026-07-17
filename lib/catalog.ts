// Server-side catalog data access: reads live from the Flask API, and falls back
// to the static catalog in lib/data.ts if the API is unavailable.
import { API_URL } from "./api";
import { products as STATIC_PRODUCTS, categories as STATIC_CATEGORIES, adverts as STATIC_ADVERTS, type Product, type Category, type Advert } from "./data";

const REVALIDATE = 20;

function normImg(img?: string): string {
  if (!img) return "/images/catalog/hivis.jpg";
  if (img.startsWith("http") || img.startsWith("/")) return img;
  return "/" + img; // e.g. admin upload stored as "uploads/photo.jpg"
}
 // seconds — admin edits appear on the site within this window

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiGet<Category[]>("/api/categories");
  const list = Array.isArray(data) && data.length ? data : STATIC_CATEGORIES;
  return list.map((c) => ({ ...c, img: normImg(c.img) }));
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiGet<Product[]>("/api/products");
  const list = Array.isArray(data) && data.length ? data : STATIC_PRODUCTS;
  return list.map((p) => ({ ...p, img: normImg(p.img) }));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const data = await apiGet<Product & { slug?: string }>(`/api/products/${slug}`);
  if (data && data.slug) return { ...data, img: normImg(data.img) };
  return STATIC_PRODUCTS.find((p) => p.slug === slug);
}

export async function getFeatured(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.category === slug);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getUniformCategories(): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.group === "uniform");
}


export async function getAdverts(placement?: string): Promise<Advert[]> {
  const data = await apiGet<Advert[]>(`/api/adverts${placement ? `?placement=${placement}` : ""}`);
  const list = Array.isArray(data) ? data : STATIC_ADVERTS.filter((a) => !placement || a.placement === placement);
  return list.map((a) => ({ ...a, img: normImg(a.img) }));
}


export type Stat = { value: string; label: string };
const FALLBACK_STATS: Stat[] = [
  { value: "5+", label: "Years of experience" },
  { value: "500+", label: "Products in our range" },
  { value: "47", label: "Counties reached" },
  { value: "12+", label: "Industries served" },
];

export async function getStats(): Promise<Stat[]> {
  const d = await apiGet<Stat[]>("/api/stats");
  return Array.isArray(d) && d.length ? d : FALLBACK_STATS;
}

type Settings = Record<string, { value: string; img: string }>;
export async function getSettings(): Promise<Settings> {
  const d = await apiGet<Settings>("/api/settings");
  return d && typeof d === "object" ? d : {};
}

export async function settingImg(key: string, fallback: string): Promise<string> {
  const s = await getSettings();
  const img = s[key]?.img;
  return img ? normImg(img) : fallback;
}
