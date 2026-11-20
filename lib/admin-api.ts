import "server-only";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN = process.env.ADMIN_API_TOKEN || "";

async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  if (!TOKEN) throw new Error("ADMIN_API_TOKEN is not set on the frontend. It must match the backend's ADMIN_API_TOKEN.");
  let r: Response;
  try {
    r = await fetch(`${API}/api/admin${path}`, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}`, ...(opts.headers || {}) },
      cache: "no-store",
    });
  } catch {
    throw new Error(`Could not reach the backend at ${API}. Is the Flask server running and NEXT_PUBLIC_API_URL correct?`);
  }
  if (!r.ok) {
    let body: any = null;
    try { body = await r.json(); } catch {}
    if (r.status === 401) {
      throw new Error("Backend rejected the admin token. Set the same ADMIN_API_TOKEN on the frontend and backend services.");
    }
    if (r.status === 404 && !(body && body.error)) {
      // Not a Flask "record not found" -- the host has no admin API at all
      // (e.g. Railway "Application not found" for a dead/renamed domain).
      throw new Error(`No backend found at ${API} (404${body?.message ? `: ${body.message}` : ""}). Update NEXT_PUBLIC_API_URL on the frontend to the backend's current public URL and redeploy.`);
    }
    throw new Error((body && body.error) || `Request failed (${r.status})`);
  }
  if (r.status === 204) return null as T;
  return r.json();
}

export interface AdminProduct {
  id: number; slug: string; name: string; price: number; oldPrice: number | null;
  img: string; tag: string | null; featured: boolean; stock: number;
  colors: string; sizes: string; images: string; category: string | null; categoryName: string | null;
  material: string; supplier: string; supplierContact: string; rawMaterials: string;
}
export interface AdminCategory { id: number; slug: string; name: string; blurb: string; img: string; group: string; productCount: number; }
export interface AdminReview { id: number; name: string; rating: number; comment: string; approved: boolean; product: string | null; productSlug: string | null; createdAt: string; }
export interface AdminOrderItem { slug: string; name: string; price: number; qty: number; }
export interface AdminOrder { id: number; orderNumber: string; customerName: string; phone: string; email: string; notes: string; total: number; status: string; eta: string | null; createdAt: string; items: AdminOrderItem[]; }
export interface AdminAdvert { id: number; title: string; subtitle: string; priceLabel: string; ctaLabel: string; href: string; img: string; placement: string; active: boolean; sort: number; }
export interface AdminStat { id: number; value: string; label: string; sort: number; }
export interface AdminSetting { id: number; key: string; label: string; value: string; img: string; }

export interface AnalyticsRow { label: string; count: number; }
export interface Analytics {
  days: number;
  today: { views: number; visitors: number };
  last7: { views: number; visitors: number };
  period: { views: number; visitors: number };
  allTime: { views: number };
  daily: { date: string; views: number; visitors: number }[];
  topPages: AnalyticsRow[];
  referrers: AnalyticsRow[];
  devices: AnalyticsRow[];
}

export interface Dashboard {
  orders: { total: number; byStatus: Record<string, number>; revenue: number };
  products: { total: number; lowStockCount: number };
  reviews: { pending: number };
  lowStock: AdminProduct[];
  recentOrders: AdminOrder[];
}

export const adminApi = {
  dashboard: () => req<Dashboard>("/dashboard"),
  analytics: (days = 30) => req<Analytics>(`/analytics?days=${days}`),

  products: () => req<AdminProduct[]>("/products"),
  createProduct: (d: Partial<AdminProduct>) => req("/products", { method: "POST", body: JSON.stringify(d) }),
  updateProduct: (id: number, d: Partial<AdminProduct>) => req(`/products/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteProduct: (id: number) => req(`/products/${id}`, { method: "DELETE" }),

  categories: () => req<AdminCategory[]>("/categories"),
  createCategory: (d: Partial<AdminCategory>) => req("/categories", { method: "POST", body: JSON.stringify(d) }),
  updateCategory: (id: number, d: Partial<AdminCategory>) => req(`/categories/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteCategory: (id: number) => req(`/categories/${id}`, { method: "DELETE" }),

  reviews: () => req<AdminReview[]>("/reviews"),
  updateReview: (id: number, d: Partial<AdminReview>) => req(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteReview: (id: number) => req(`/reviews/${id}`, { method: "DELETE" }),

  orders: () => req<AdminOrder[]>("/orders"),
  updateOrder: (id: number, d: { status?: string; eta?: string | null }) => req(`/orders/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteOrder: (id: number) => req(`/orders/${id}`, { method: "DELETE" }),

  adverts: () => req<AdminAdvert[]>("/adverts"),
  createAdvert: (d: Partial<AdminAdvert>) => req("/adverts", { method: "POST", body: JSON.stringify(d) }),
  updateAdvert: (id: number, d: Partial<AdminAdvert>) => req(`/adverts/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteAdvert: (id: number) => req(`/adverts/${id}`, { method: "DELETE" }),

  stats: () => req<AdminStat[]>("/stats"),
  createStat: (d: Partial<AdminStat>) => req("/stats", { method: "POST", body: JSON.stringify(d) }),
  updateStat: (id: number, d: Partial<AdminStat>) => req(`/stats/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteStat: (id: number) => req(`/stats/${id}`, { method: "DELETE" }),

  settings: () => req<AdminSetting[]>("/settings"),
  createSetting: (d: Partial<AdminSetting>) => req("/settings", { method: "POST", body: JSON.stringify(d) }),
  updateSetting: (id: number, d: Partial<AdminSetting>) => req(`/settings/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteSetting: (id: number) => req(`/settings/${id}`, { method: "DELETE" }),
  seedSettings: () => req<{ created: number; total: number }>("/settings/seed", { method: "POST" }),
};
