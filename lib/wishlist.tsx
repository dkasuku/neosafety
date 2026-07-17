"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type WishItem = { slug: string; name: string; price: number; img: string };
type WishCtx = {
  items: WishItem[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (p: WishItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "neo-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([]);
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

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);
  const toggle = useCallback((p: WishItem) => {
    setItems((prev) => (prev.some((i) => i.slug === p.slug) ? prev.filter((i) => i.slug !== p.slug) : [...prev, p]));
  }, []);
  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  return <Ctx.Provider value={{ items, count: items.length, has, toggle, remove, clear }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
