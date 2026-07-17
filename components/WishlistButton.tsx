"use client";
import { useWishlist, type WishItem } from "@/lib/wishlist";
import { useToast } from "@/lib/toast";
import { Heart } from "./icons";

export default function WishlistButton({
  product,
  className = "",
  variant = "icon",
}: {
  product: WishItem;
  className?: string;
  variant?: "icon" | "button";
}) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const active = has(product.slug);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast(active ? "Removed from wishlist" : "Saved to wishlist");
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`btn border-2 ${active ? "border-red-400 text-red-500" : "border-navy/20 text-navy hover:border-navy/40"} ${className}`}
      >
        <Heart fill={active ? "currentColor" : "none"} className="h-5 w-5" /> {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur transition hover:scale-110 ${className}`}
    >
      <Heart fill={active ? "currentColor" : "none"} className={`h-5 w-5 transition-colors ${active ? "text-red-500" : "text-slate-400"}`} />
    </button>
  );
}
