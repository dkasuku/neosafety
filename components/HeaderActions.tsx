"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { Truck, Heart, Cart } from "./icons";

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-green px-1 text-[10px] font-bold text-white">{n}</span>
  );
}

export default function HeaderActions() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  return (
    <div className="ml-auto flex items-center gap-5 md:gap-7">
      <Link href="/track" className="hidden items-center gap-2 text-navy sm:flex">
        <Truck className="h-6 w-6" />
        <span className="leading-tight text-[13px]">Track<br /><span className="font-semibold">Order</span></span>
      </Link>
      <Link href="/wishlist" className="relative flex items-center gap-2 text-navy">
        <span className="relative"><Heart className="h-6 w-6" /><Badge n={wishCount} /></span>
        <span className="hidden text-[13px] lg:inline">Wishlist</span>
      </Link>
      <Link href="/cart" className="relative flex items-center gap-2 text-navy">
        <span className="relative"><Cart className="h-6 w-6" /><Badge n={count} /></span>
        <span className="hidden text-[13px] lg:inline">Cart</span>
      </Link>
    </div>
  );
}
