"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import type { AdminOrder } from "@/lib/admin-api";
import { ksh } from "@/lib/data";
import { updateOrder, deleteOrder } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const STATUSES = [
  { v: "new", l: "Received" }, { v: "confirmed", l: "Confirmed" },
  { v: "delivered", l: "Delivered" }, { v: "cancelled", l: "Cancelled" },
];

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("new");
  const [eta, setEta] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE = 10;
  const [delTarget, setDelTarget] = useState<AdminOrder | null>(null);
  const [delBusy, setDelBusy] = useState(false);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE));
  const cur = Math.min(page, pageCount);
  const paged = shown.slice((cur - 1) * PAGE, cur * PAGE);

  function edit(o: AdminOrder) {
    setOpen(o); setStatus(o.status); setEta(o.eta ? toISO(o.eta) : ""); setErr("");
  }
  async function save() {
    if (!open) return;
    setBusy(true); setErr("");
    const res = await updateOrder(open.id, { status, eta: eta || null });
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Failed"); return; }
    setOpen(null); router.refresh();
  }
  async function confirmDelete() {
    if (!delTarget) return;
    setDelBusy(true);
    await deleteOrder(delTarget.id);
    setDelBusy(false); setDelTarget(null); router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {[["all", "All"], ...STATUSES.map((s) => [s.v, s.l])].map(([v, l]) => (
          <button key={v as string} onClick={() => { setFilter(v as string); setPage(1); }}
            className={`rounded-full px-3 py-1 text-sm ${filter === v ? "bg-navy text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>
            {l} {v !== "all" && <span className="opacity-70">({orders.filter((o) => o.status === v).length})</span>}
          </button>
        ))}
      </div>

      <Card>
        {shown.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No orders here yet.</p>
        ) : (
          <>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Phone</TableHead>
              <TableHead>Placed</TableHead><TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {paged.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                  <TableCell className="font-medium">{o.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{o.createdAt}</TableCell>
                  <TableCell><StatusBadge status={o.status} />{o.eta && <span className="ml-2 text-xs text-muted-foreground">ETA {o.eta}</span>}</TableCell>
                  <TableCell className="text-right font-semibold">{ksh(o.total)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => edit(o)}><Eye className="h-4 w-4" /> Manage</Button>
                      <Button size="icon" variant="ghost" onClick={() => setDelTarget(o)} aria-label="Delete order"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={cur} pageCount={pageCount} total={shown.length} pageSize={PAGE} onPage={setPage} />
          </>
        )}
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader><DialogTitle>Order {open.orderNumber}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{open.customerName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{open.phone}</span></div>
                {open.email && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{open.email}</span></div>}
                {open.notes && <div className="rounded-lg bg-muted p-3 text-muted-foreground">{open.notes}</div>}
                <div className="rounded-lg border border-border">
                  {open.items.map((it, i) => (
                    <div key={i} className="flex justify-between border-b border-border px-3 py-2 last:border-0">
                      <span>{it.qty} × {it.name}</span><span className="font-medium">{ksh(it.price * it.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-2 font-bold"><span>Total</span><span>{ksh(open.total)}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Delivery ETA</Label>
                  <Input type="date" value={eta} onChange={(e) => setEta(e.target.value)} />
                </div>
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <DialogFooter>
                <a href={`https://wa.me/${open.phone.replace(/[^0-9]/g, "").replace(/^0/, "254")}`} target="_blank" rel="noreferrer"
                  className="mr-auto"><Badge variant="success">Message on WhatsApp</Badge></a>
                <Button variant="outline" onClick={() => setOpen(null)}>Close</Button>
                <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!delTarget} onOpenChange={(v) => !v && setDelTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete this order?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently deletes order <span className="font-mono font-medium text-navy">{delTarget?.orderNumber}</span> from
            <span className="font-medium text-navy"> {delTarget?.customerName}</span>. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={delBusy}>{delBusy ? "Deleting…" : "Delete order"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function toISO(dateStr: string) {
  const d = new Date(dateStr);
  return isNaN(+d) ? "" : d.toISOString().slice(0, 10);
}
