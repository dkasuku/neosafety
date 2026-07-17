"use client";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { trackOrder, type TrackedOrder } from "@/lib/api";
import { ksh } from "@/lib/data";

const STEPS = ["Received", "Confirmed", "Delivered"];
const STEP_INDEX: Record<string, number> = { new: 0, confirmed: 1, delivered: 2 };

export default function TrackPage() {
  const [order, setOrder] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Pre-fill the order number when arriving from the checkout confirmation (?order=NEO-...)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("order");
    if (q) setOrder(q);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setResult(null); setBusy(true);
    const res = await trackOrder(order.trim(), phone.trim());
    setBusy(false);
    if ("error" in res) { setError(res.error); return; }
    setResult(res);
  };

  const idx = result ? (STEP_INDEX[result.status] ?? 0) : 0;
  const cancelled = result?.status === "cancelled";

  return (
    <main>
      <section className="border-b border-slate-100 bg-[#f4f6f8]">
        <div className="container-x py-6">
          <nav className="mb-2 text-sm text-slate-brand"><Link href="/" className="hover:text-green">Home</Link><span className="mx-2">/</span><span className="text-navy">Track Order</span></nav>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy md:text-3xl">Track Your Order</h1>
          <p className="mt-1 text-sm text-slate-brand">Enter your order number and the phone number you used to check its status.</p>
        </div>
      </section>

      <section className="container-x max-w-xl py-12">
        <form onSubmit={submit} className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <label className="text-sm font-semibold text-navy">Order number</label>
          <input value={order} onChange={(e) => setOrder(e.target.value)} required placeholder="e.g. NEO-260706-4821" className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
          <label className="mt-4 block text-sm font-semibold text-navy">Phone number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Used at checkout" className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
          <button disabled={busy} className="btn-primary mt-6 w-full py-3.5 text-sm disabled:opacity-60">{busy ? "Checking..." : "Track order"}</button>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </form>

        {result && (
          <div className="mt-6 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-brand">Order</p>
                <p className="font-display text-lg font-bold text-navy">{result.orderNumber}</p>
              </div>
              <p className="text-sm text-slate-brand">Placed {result.createdAt}</p>
            </div>

            {cancelled ? (
              <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">This order was cancelled. Contact us if this is unexpected.</div>
            ) : (
              <>
              {result.eta && <p className="mt-4 text-sm font-semibold text-navy">Estimated delivery: <span className="text-green">{result.eta}</span></p>}
              <div className="mt-4 flex items-center">
                {STEPS.map((label, i) => (
                  <Fragment key={label}>
                    <div className="flex flex-col items-center">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i <= idx ? "bg-green text-white" : "bg-slate-200 text-slate-500"}`}>
                        {i < idx ? "✓" : i + 1}
                      </span>
                      <span className={`mt-1.5 text-xs font-semibold ${i <= idx ? "text-navy" : "text-slate-400"}`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`mx-2 mb-5 h-1 flex-1 rounded ${i < idx ? "bg-green" : "bg-slate-200"}`} />}
                  </Fragment>
                ))}
              </div>
              </>
            )}

            <div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
              {result.items.map((it, i) => (
                <div key={i} className="flex justify-between py-2 text-sm">
                  <span className="text-navy">{it.qty} × {it.name}</span>
                  <span className="font-semibold text-navy">{ksh(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 font-display font-bold text-navy">
              <span>Total</span><span>{ksh(result.total)}</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
