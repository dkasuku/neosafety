"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ksh } from "@/lib/data";
import { Cart } from "./icons";

export default function FloatingCart() {
  const { count, total } = useCart();
  if (count === 0) return null;
  return (
    <Link
      href="/cart"
      aria-label={`View cart, ${count} item${count === 1 ? "" : "s"}, total ${ksh(total)}`}
      className="fixed bottom-5 left-5 z-[90] flex items-center gap-3 rounded-full bg-navy py-2.5 pl-3 pr-5 text-white shadow-[0_8px_24px_rgba(12,25,43,0.4)] transition-transform duration-200 hover:scale-105"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green">
        <Cart className="h-5 w-5" />
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-navy shadow">
          {count}
        </span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase tracking-wide text-white/60">View cart</span>
        <span className="font-display text-sm font-bold text-green-light">{ksh(total)}</span>
      </span>
    </Link>
  );
}
