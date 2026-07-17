"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = { slug: string; name: string; price: number; img: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: { slug: string; name: string; price: number; img: string }, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "neo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    }
  }, [items, ready]);

  const add = useCallback((p: { slug: string; name: string; price: number; img: string }, qty = 1) => {
    const n = Math.max(1, Math.floor(qty));
    setItems((prev) => {
      const found = prev.find((i) => i.slug === p.slug);
      if (found) return prev.map((i) => (i.slug === p.slug ? { ...i, qty: i.qty + n } : i));
      return [...prev, { ...p, qty: n }];
    });
  }, []);
  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const setQty = useCallback((slug: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)))), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, count, total, add, remove, setQty, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
