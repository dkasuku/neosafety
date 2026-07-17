"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { ksh, contact } from "@/lib/data";
import { createOrder } from "@/lib/api";
import { Cart, Check, ArrowRight } from "@/components/icons";

function localOrderNo() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `NEO-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [placed, setPlaced] = useState<{ no: string; saved: boolean } | null>(null);
  const [lastMsg, setLastMsg] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError("Please enter your name and phone number."); return; }
    setError(""); setBusy(true);

    // Save order to the backend (retry once). WhatsApp still works if it fails.
    const payload = {
      customerName: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), notes: form.notes.trim(),
      items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty })),
    };
    let res = await createOrder(payload);
    if (!res) res = await createOrder(payload);
    const saved = !!res;
    const orderNo = res?.orderNumber ?? localOrderNo();

    // Build the WhatsApp order message
    const lines = [
      "*NEO Safety Supplies — New Order*",
      `Order No: ${orderNo}`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : "",
      "",
      "*Items:*",
      ...items.map((i) => `• ${i.qty} × ${i.name} — ${ksh(i.price * i.qty)}`),
      `*Total: ${ksh(total)}*`,
      form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : "",
    ].filter(Boolean);
    const msg = lines.join("\n");
    setLastMsg(msg);
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`;

    setBusy(false);
    setPlaced({ no: orderNo, saved });
    clear();
    window.open(url, "_blank");
  };

  const Banner = (
    <section className="border-b border-slate-100 bg-[#f4f6f8]">
      <div className="container-x py-6">
        <nav className="mb-2 text-sm text-slate-brand"><Link href="/" className="hover:text-green">Home</Link><span className="mx-2">/</span><span className="text-navy">Cart</span></nav>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">Your Cart</h1>
      </div>
    </section>
  );

  if (placed) {
    return (
      <main>
        {Banner}
        <section className="container-x py-16 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green/10 text-green"><Check className="h-9 w-9" /></span>
          <h2 className="mt-6 font-display text-2xl font-bold text-navy">Order sent to WhatsApp</h2>

          {placed.saved ? (
            <>
              <p className="mx-auto mt-2 max-w-md text-slate-brand">Keep this order number — you can track your order with it and your phone number.</p>
              <div className="mx-auto mt-4 inline-block rounded-lg border border-slate-200 bg-slate-50 px-6 py-3 font-display text-2xl font-extrabold tracking-wide text-navy">{placed.no}</div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href={`/track?order=${encodeURIComponent(placed.no)}`} className="btn-primary px-6 py-3 text-sm">Track this order <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/ppe" className="btn-outline px-6 py-3 text-sm">Continue shopping</Link>
              </div>
              <p className="mx-auto mt-4 max-w-md text-xs text-slate-brand">
                If WhatsApp didn&apos;t open,{" "}
                <a className="font-semibold text-green" target="_blank" rel="noopener noreferrer"
                   href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(lastMsg)}`}>tap here to send it</a>.
              </p>
            </>
          ) : (
            <>
              <p className="mx-auto mt-2 max-w-md text-slate-brand">We&apos;ve prepared your order for WhatsApp — our team will confirm it and arrange delivery.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a className="btn-primary px-6 py-3 text-sm" target="_blank" rel="noopener noreferrer"
                   href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(lastMsg)}`}>Send on WhatsApp</a>
                <Link href="/ppe" className="btn-outline px-6 py-3 text-sm">Continue shopping</Link>
              </div>
            </>
          )}
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        {Banner}
        <section className="container-x py-16 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green/10 text-green"><Cart className="h-9 w-9" /></span>
          <h2 className="mt-6 font-display text-2xl font-bold text-navy">Your cart is empty</h2>
          <p className="mt-2 text-slate-brand">Browse our PPE and uniforms to get started.</p>
          <Link href="/ppe" className="btn-primary mt-6 px-8 py-3.5 text-sm">Shop products</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      {Banner}
      <section className="container-x grid gap-8 py-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-card">
            {items.map((i) => (
              <div key={i.slug} className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white">
                  <Image src={i.img} alt={i.name} width={120} height={120} className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-navy">{i.name}</h3>
                  <p className="font-display text-sm font-bold text-green">{ksh(i.price)}</p>
                </div>
                <div className="flex items-center rounded-md border border-slate-200">
                  <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-3 py-1.5 text-navy hover:bg-slate-50" aria-label="Decrease">−</button>
                  <span className="w-8 text-center text-sm">{i.qty}</span>
                  <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-3 py-1.5 text-navy hover:bg-slate-50" aria-label="Increase">+</button>
                </div>
                <div className="hidden w-24 text-right font-display font-bold text-navy sm:block">{ksh(i.price * i.qty)}</div>
                <button onClick={() => remove(i.slug)} className="text-sm text-slate-400 hover:text-red-500" aria-label="Remove">✕</button>
              </div>
            ))}
          </div>
          <button onClick={clear} className="mt-4 text-sm text-slate-brand hover:text-navy">Clear cart</button>
        </div>

        {/* Checkout form + summary */}
        <aside className="h-fit rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-navy">Checkout</h2>
          <div className="mt-4 space-y-2 border-b border-slate-100 pb-4 text-sm">
            <div className="flex justify-between text-slate-brand"><span>Subtotal ({items.reduce((n, i) => n + i.qty, 0)} items)</span><span className="font-semibold text-navy">{ksh(total)}</span></div>
            <div className="flex justify-between text-slate-brand"><span>Delivery</span><span className="font-semibold text-navy">Confirmed on WhatsApp</span></div>
            <div className="flex justify-between font-display text-base font-bold text-navy"><span>Total</span><span>{ksh(total)}</span></div>
          </div>

          <form onSubmit={placeOrder} className="mt-4 space-y-3">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Full name *" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="Phone number *" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" placeholder="Email (optional)" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Delivery address / notes (optional)" className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-green" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 text-sm disabled:opacity-60">
              {busy ? "Placing order…" : "Place Order via WhatsApp"}
            </button>
            <p className="text-center text-xs text-slate-brand">Your order details will open in WhatsApp to confirm with our team.</p>
          </form>
        </aside>
      </section>
    </main>
  );
}
