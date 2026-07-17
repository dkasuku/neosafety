"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { Cart, Check } from "./icons";

type P = {
  product: { slug: string; name: string; price: number; img: string };
  className?: string;
  label?: string;
  showQuantity?: boolean;
  block?: boolean; // stacked layout for narrow cards
  disabled?: boolean;
};

export default function AddToCartButton({ product, className = "", label = "ADD TO CART", showQuantity = false, block = false, disabled = false }: P) {
  const { add } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handle = () => {
    add(product, qty);
    toast(qty > 1 ? `${qty} added to cart` : "Added to cart");
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (disabled) {
    return (
      <button type="button" disabled className={`btn cursor-not-allowed bg-slate-200 text-slate-500 ${className}`}>
        Out of Stock
      </button>
    );
  }

  const btn = (
    <button type="button" onClick={handle} className={`btn-primary ${className}`}>
      {added ? (<><Check className="h-4 w-4" /> Added</>) : (<><Cart className="h-4 w-4" /> {label}</>)}
    </button>
  );

  if (!showQuantity) return btn;

  const stepper = (
    <div className={`flex items-center rounded-md border border-slate-300 ${block ? "w-full justify-between" : ""}`}>
      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 py-2 text-lg leading-none text-navy hover:bg-slate-50" aria-label="Decrease quantity">−</button>
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
        className="w-10 [appearance:textfield] border-x border-slate-300 py-2 text-center text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3.5 py-2 text-lg leading-none text-navy hover:bg-slate-50" aria-label="Increase quantity">+</button>
    </div>
  );

  return (
    <div className={block ? "flex flex-col gap-2" : "flex items-stretch gap-3"}>
      {stepper}
      {btn}
    </div>
  );
}
