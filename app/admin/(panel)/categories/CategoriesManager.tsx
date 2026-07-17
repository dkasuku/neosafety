"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminCategory } from "@/lib/admin-api";
import { saveCategory, deleteCategory } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const empty = { name: "", slug: "", blurb: "", img: "", group: "uniform" };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function CategoriesManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [f, setF] = useState<any>(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [del, setDel] = useState<AdminCategory | null>(null);
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  function add() { setEditing(null); setF(empty); setErr(""); setOpen(true); }
  function edit(c: AdminCategory) { setEditing(c); setF({ ...c }); setErr(""); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await saveCategory(editing?.id ?? null, { name: f.name, slug: f.slug || slugify(f.name), blurb: f.blurb, img: f.img, group: f.group });
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Failed"); return; }
    setOpen(false); router.refresh();
  }
  async function confirmDel() { if (!del) return; setBusy(true); await deleteCategory(del.id); setBusy(false); setDel(null); router.refresh(); }

  return (
    <>
      <div className="mb-4 flex justify-end"><Button onClick={add}><Plus className="h-4 w-4" /> Add category</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Group</TableHead><TableHead>Products</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}<div className="font-mono text-xs text-muted-foreground">{c.slug}</div></TableCell>
                <TableCell><Badge variant={c.group === "ppe" ? "default" : "muted"}>{c.group}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{c.productCount}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => edit(c)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDel(c)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input value={f.name} onChange={(e) => { set("name", e.target.value); if (!editing) set("slug", slugify(e.target.value)); }} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Slug</Label><Input value={f.slug} onChange={(e) => set("slug", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Group</Label>
                <select value={f.group} onChange={(e) => set("group", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="ppe">PPE</option><option value="uniform">Uniform</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Blurb</Label><Textarea value={f.blurb} onChange={(e) => set("blurb", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Image</Label><ImageUpload value={f.img} onChange={(v) => set("img", v)} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(v) => !v && setDel(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete category?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Remove <span className="font-medium text-navy">{del?.name}</span>? Products in it will become uncategorised.</p>
          <DialogFooter><Button variant="outline" onClick={() => setDel(null)}>Cancel</Button><Button variant="destructive" onClick={confirmDel} disabled={busy}>{busy ? "Deleting…" : "Delete"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
