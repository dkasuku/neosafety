"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminAdvert } from "@/lib/admin-api";
import { saveAdvert, deleteAdvert } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/admin/ImageUpload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const empty = { title: "", subtitle: "", priceLabel: "", ctaLabel: "Shop Now", href: "/ppe", img: "", placement: "home", active: true, sort: 0 };
const PLACEMENTS = [{ v: "home", l: "Homepage" }, { v: "shop_top", l: "Shop — top banner" }, { v: "shop_side", l: "Shop — sidebar" }];

export default function AdvertsManager({ adverts }: { adverts: AdminAdvert[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAdvert | null>(null);
  const [f, setF] = useState<any>(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [del, setDel] = useState<AdminAdvert | null>(null);
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  function add() { setEditing(null); setF(empty); setErr(""); setOpen(true); }
  function edit(a: AdminAdvert) { setEditing(a); setF({ ...a }); setErr(""); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await saveAdvert(editing?.id ?? null, { ...f, sort: Number(f.sort) || 0 });
    setBusy(false); if (!res.ok) { setErr(res.error || "Failed"); return; }
    setOpen(false); router.refresh();
  }
  async function confirmDel() { if (!del) return; setBusy(true); await deleteAdvert(del.id); setBusy(false); setDel(null); router.refresh(); }

  return (
    <>
      <div className="mb-4 flex justify-end"><Button onClick={add}><Plus className="h-4 w-4" /> Add advert</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Placement</TableHead><TableHead>Link</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {adverts.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No adverts yet.</TableCell></TableRow>}
            {adverts.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}{a.subtitle && <div className="text-xs text-muted-foreground">{a.subtitle}</div>}</TableCell>
                <TableCell><Badge variant="muted">{PLACEMENTS.find((p) => p.v === a.placement)?.l || a.placement}</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{a.href}</TableCell>
                <TableCell>{a.active ? <Badge variant="success">Active</Badge> : <Badge variant="muted">Hidden</Badge>}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => edit(a)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDel(a)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit advert" : "Add advert"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2"><Label>Title</Label><Input value={f.title} onChange={(e) => set("title", e.target.value)} required /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Subtitle</Label><Input value={f.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Price label</Label><Input value={f.priceLabel} onChange={(e) => set("priceLabel", e.target.value)} placeholder="From KSh 720" /></div>
              <div className="space-y-1.5"><Label>Button label</Label><Input value={f.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Link (href)</Label><Input value={f.href} onChange={(e) => set("href", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Placement</Label>
                <select value={f.placement} onChange={(e) => set("placement", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {PLACEMENTS.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Image</Label><ImageUpload value={f.img} onChange={(v) => set("img", v)} /></div>
              <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={f.sort} onChange={(e) => set("sort", e.target.value)} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-green" /> Active (visible on the site)</label>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(v) => !v && setDel(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete advert?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Remove <span className="font-medium text-navy">{del?.title}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDel(null)}>Cancel</Button><Button variant="destructive" onClick={confirmDel} disabled={busy}>{busy ? "Deleting…" : "Delete"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
