export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type ApiReview = { id: number; name: string; rating: number; comment: string; createdAt: string };
export type ReviewsResponse = { average: number; count: number; reviews: ApiReview[] };

export async function getReviews(slug: string): Promise<ReviewsResponse | null> {
  try {
    const r = await fetch(`${API_URL}/api/products/${slug}/reviews`, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function postReview(slug: string, data: { name: string; rating: number; comment: string }): Promise<ApiReview | { error: string }> {
  try {
    const r = await fetch(`${API_URL}/api/products/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await r.json();
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }
}

export type OrderItemPayload = { slug: string; name: string; price: number; qty: number };
export async function createOrder(payload: {
  customerName: string; phone: string; email: string; notes: string; items: OrderItemPayload[];
}): Promise<{ orderNumber: string; total: number } | null> {
  try {
    const r = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}


export type TrackedOrder = {
  orderNumber: string; customerName: string; phone: string; email: string; notes: string;
  total: number; status: string; createdAt: string; eta?: string | null;
  items: { slug: string; name: string; price: number; qty: number }[];
};

export async function trackOrder(order: string, phone: string): Promise<TrackedOrder | { error: string }> {
  try {
    const r = await fetch(`${API_URL}/api/orders/track?order=${encodeURIComponent(order)}&phone=${encodeURIComponent(phone)}`, { cache: "no-store" });
    const data = await r.json();
    if (!r.ok) return { error: data.error || "Order not found." };
    return data;
  } catch {
    return { error: "Could not reach the server. Is the backend running?" };
  }
}
