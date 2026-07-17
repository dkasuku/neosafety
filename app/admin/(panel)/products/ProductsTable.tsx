"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { AdminProduct, AdminCategory } from "@/lib/admin-api";
import { ksh } from "@/lib/data";
import { deleteProduct } from "./actions";
import ProductForm from "./ProductForm";
import Pagination from "@/components/admin/Pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ProductsTable({ products, categories }: { products: AdminProduct[]; categories: AdminCategory[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [delTarget, setDelTarget] = useState<AdminProduct | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE));
  const cur = Math.min(page, pageCount);
  const paged = shown.slice((cur - 1) * PAGE, cur * PAGE);

  function add() { setEditing(null); setFormOpen(true); }
  function edit(p: AdminProduct) { setEditing(p); setFormOpen(true); }
  async function confirmDelete() {
    if (!delTarget) return;
    setBusy(true);
    await deleteProduct(delTarget.id);
    setBusy(false); setDelTarget(null); router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search products…" className="pl-9" />
        </div>
        <Button onClick={add}><Plus className="h-4 w-4" /> Add product</Button>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Product</TableHead><TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead><TableHead className="text-center">Stock</TableHead>
            <TableHead>Flags</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {shown.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No products found.</TableCell></TableRow>}
            {paged.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}<div className="font-mono text-xs text-muted-foreground">{p.slug}</div></TableCell>
                <TableCell className="text-muted-foreground">{p.categoryName || "—"}</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold">{ksh(p.price)}</span>
                  {p.oldPrice ? <div className="text-xs text-muted-foreground line-through">{ksh(p.oldPrice)}</div> : null}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={p.stock === 0 ? "destructive" : p.stock <= 10 ? "warning" : "muted"}>{p.stock}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.featured && <Badge variant="success">Featured</Badge>}
                    {p.tag && <Badge variant="outline">{p.tag}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => edit(p)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setDelTarget(p)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination page={cur} pageCount={pageCount} total={shown.length} pageSize={PAGE} onPage={setPage} />
      </Card>

      {formOpen && <ProductForm product={editing} categories={categories} open={formOpen} onClose={() => setFormOpen(false)} />}

      <Dialog open={!!delTarget} onOpenChange={(v) => !v && setDelTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete product?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove <span className="font-medium text-navy">{delTarget?.name}</span>. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={busy}>{busy ? "Deleting…" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
