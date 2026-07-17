"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, Star } from "lucide-react";
import type { AdminReview } from "@/lib/admin-api";
import { setApproved, removeReview } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ReviewsManager({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [delTarget, setDelTarget] = useState<AdminReview | null>(null);
  const [delBusy, setDelBusy] = useState(false);

  const shown = reviews.filter((r) => filter === "all" || (filter === "pending" ? !r.approved : r.approved));
  const pending = reviews.filter((r) => !r.approved).length;

  async function toggle(r: AdminReview) { setBusy(r.id); await setApproved(r.id, !r.approved); setBusy(null); router.refresh(); }
  async function confirmDelete() {
    if (!delTarget) return;
    setDelBusy(true);
    await removeReview(delTarget.id);
    setDelBusy(false); setDelTarget(null); router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        {[["all", "All"], ["pending", `Pending (${pending})`], ["approved", "Approved"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v as any)} className={`rounded-full px-3 py-1 text-sm ${filter === v ? "bg-navy text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}>{l}</button>
        ))}
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Reviewer</TableHead><TableHead>Product</TableHead><TableHead>Rating</TableHead><TableHead>Comment</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {shown.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No reviews.</TableCell></TableRow>}
            {shown.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}<div className="text-xs text-muted-foreground">{r.createdAt}</div></TableCell>
                <TableCell className="text-muted-foreground">{r.product || "—"}</TableCell>
                <TableCell><span className="inline-flex items-center gap-0.5 text-amber-500">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span></TableCell>
                <TableCell className="max-w-xs text-sm text-muted-foreground">{r.comment}</TableCell>
                <TableCell>{r.approved ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge>}</TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-1">
                  <Button size="sm" variant={r.approved ? "outline" : "default"} onClick={() => toggle(r)} disabled={busy === r.id}>
                    {r.approved ? <><X className="h-4 w-4" /> Unapprove</> : <><Check className="h-4 w-4" /> Approve</>}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDelTarget(r)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!delTarget} onOpenChange={(v) => !v && setDelTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete this review?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently removes the review by <span className="font-medium text-navy">{delTarget?.name}</span>
            {delTarget?.product ? <> on <span className="font-medium text-navy">{delTarget.product}</span></> : null}. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={delBusy}>{delBusy ? "Deleting…" : "Delete review"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
