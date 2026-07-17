"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { AdminProduct, AdminCategory } from "@/lib/admin-api";
import { saveProduct } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const MAX_IMAGES = 7;
const empty = { name: "", slug: "", price: 0, oldPrice: null as number | null, stock: 0, category: "", tag: "", colors: "", sizes: "", material: "", supplier: "", supplierContact: "", rawMaterials: "", featured: false };
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function initialImages(p: AdminProduct | null): string[] {
  if (!p) return [""];
  const list = [p.img, ...(p.images ? p.images.split(",") : [])].map((s) => s.trim()).filter(Boolean);
  const uniq = Array.from(new Set(list)).slice(0, MAX_IMAGES);
  return uniq.length ? uniq : [""];
}

export default function ProductForm({ product, categories, open, onClose }: {
  product: AdminProduct | null; categories: AdminCategory[]; open: boolean; onClose: () => void;
}) {
  const router = useRouter();
  const [f, setF] = useState<any>(product ? { ...product } : empty);
  const [imgs, setImgs] = useState<string[]>(initialImages(product));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const setImg = (i: number, v: string) => setImgs((a) => a.map((x, idx) => (idx === i ? v : x)));
  const addImg = () => setImgs((a) => (a.length < MAX_IMAGES ? [...a, ""] : a));
  const removeImg = (i: number) => setImgs((a) => (a.length > 1 ? a.filter((_, idx) => idx !== i) : a));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const clean = imgs.map((s) => s.trim()).filter(Boolean).slice(0, MAX_IMAGES);
    const payload = {
      name: f.name, slug: f.slug || slugify(f.name), price: Number(f.price) || 0,
      oldPrice: f.oldPrice ? Number(f.oldPrice) : null, stock: Number(f.stock) || 0,
      category: f.category || null, tag: f.tag || null,
      img: clean[0] || "", images: clean.slice(1).join(","),
      colors: f.colors, sizes: f.sizes, featured: !!f.featured,
      material: f.material, supplier: f.supplier, supplierContact: f.supplierContact, rawMaterials: f.rawMaterials,
    };
    const res = await saveProduct(product?.id ?? null, payload);
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Failed to save"); return; }
    onClose(); router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" className="sm:col-span-2"><Input value={f.name} onChange={(e) => { set("name", e.target.value); if (!product && !f.slug) set("slug", slugify(e.target.value)); }} required /></Field>
            <Field label="Slug (URL)"><Input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" /></Field>
            <Field label="Category">
              <select value={f.category || ""} onChange={(e) => set("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">— none —</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Price (KSh)"><Input type="number" value={f.price} onChange={(e) => set("price", e.target.value)} required /></Field>
            <Field label="Old price (optional)"><Input type="number" value={f.oldPrice ?? ""} onChange={(e) => set("oldPrice", e.target.value)} placeholder="for discounts" /></Field>
            <Field label="Stock quantity"><Input type="number" value={f.stock} onChange={(e) => set("stock", e.target.value)} /></Field>
            <Field label="Tag (optional)"><Input value={f.tag ?? ""} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. -20% or New" /></Field>
            <Field label="Colours (Name:#hex, comma-sep)"><Input value={f.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Navy:#0C192B, Orange:#F26A21" /></Field>
            <Field label="Sizes (comma-separated)"><Input value={f.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL" /></Field>
            <Field label="Material"><Input value={f.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. 100% cotton drill" /></Field>
            <Field label="Supplier"><Input value={f.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="Supplier / vendor name" /></Field>
            <Field label="Supplier contact"><Input value={f.supplierContact} onChange={(e) => set("supplierContact", e.target.value)} placeholder="Phone or email" /></Field>
            <Field label="Raw materials (internal only)" className="sm:col-span-2"><Textarea value={f.rawMaterials} onChange={(e) => set("rawMaterials", e.target.value)} placeholder="Components / raw materials used — kept private, not shown on the website" /></Field>
          </div>

          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <Label>Product images <span className="font-normal text-muted-foreground">(up to {MAX_IMAGES} — the first is the main image)</span></Label>
              <span className="text-xs text-muted-foreground">{imgs.filter((x) => x.trim()).length}/{MAX_IMAGES}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imgs.map((src, i) => (
                <div key={i} className="relative">
                  <span className="absolute -top-2 left-2 z-10 rounded bg-navy px-1.5 py-0.5 text-[10px] font-bold text-white">{i === 0 ? "★ Main" : `#${i + 1}`}</span>
                  <ImageUpload value={src} onChange={(v) => setImg(i, v)} />
                  {imgs.length > 1 && (
                    <button type="button" onClick={() => removeImg(i)} className="mt-1 text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  )}
                </div>
              ))}
              {imgs.length < MAX_IMAGES && (
                <button type="button" onClick={addImg} className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground hover:border-green/50">
                  <Plus className="h-5 w-5" /> Add slot
                </button>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-green" />
            Feature this product on the homepage
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : product ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className}`}><Label>{label}</Label>{children}</div>;
}
