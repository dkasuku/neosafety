"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { AdminStat, AdminSetting } from "@/lib/admin-api";
import { saveStat, deleteStat, saveSetting, seedSettings } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ContentManager({ stats, settings }: { stats: AdminStat[]; settings: AdminSetting[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminStat | null>(null);
  const [sf, setSf] = useState<any>({ value: "", label: "", sort: 0 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [del, setDel] = useState<AdminStat | null>(null);
  const [setOpenS, setSetOpenS] = useState<AdminSetting | null>(null);
  const [ef, setEf] = useState<any>({ value: "", img: "" });

  function addStat() { setEditing(null); setSf({ value: "", label: "", sort: 0 }); setErr(""); setOpen(true); }
  function editStat(s: AdminStat) { setEditing(s); setSf({ ...s }); setErr(""); setOpen(true); }
  async function submitStat(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await saveStat(editing?.id ?? null, { value: sf.value, label: sf.label, sort: Number(sf.sort) || 0 });
    setBusy(false); if (!res.ok) { setErr(res.error || "Failed"); return; }
    setOpen(false); router.refresh();
  }
  async function confirmDel() { if (!del) return; setBusy(true); await deleteStat(del.id); setBusy(false); setDel(null); router.refresh(); }

  function editSetting(s: AdminSetting) { setSetOpenS(s); setEf({ value: s.value, img: s.img }); setErr(""); }
  async function submitSetting(e: React.FormEvent) {
    e.preventDefault(); if (!setOpenS) return; setBusy(true); setErr("");
    const res = await saveSetting(setOpenS.id, { value: ef.value, img: ef.img });
    setBusy(false); if (!res.ok) { setErr(res.error || "Failed"); return; }
    setSetOpenS(null); router.refresh();
  }

  return (
    <Tabs defaultValue="stats">
      <TabsList>
        <TabsTrigger value="stats">About stats</TabsTrigger>
        <TabsTrigger value="images">Section images</TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <div className="mb-4 flex justify-end"><Button onClick={addStat}><Plus className="h-4 w-4" /> Add stat</Button></div>
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Value</TableHead><TableHead>Label</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {stats.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-display text-lg font-bold text-navy">{s.value}</TableCell>
                  <TableCell>{s.label}</TableCell>
                  <TableCell className="text-right"><div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => editStat(s)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setDel(s)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="images">
        <div className="mb-4 flex justify-end">
          <Button variant="outline" onClick={async () => { setBusy(true); const r = await seedSettings(); setBusy(false); if (!r.ok) setErr(r.error || "Seed failed"); else router.refresh(); }}>
            <Plus className="h-4 w-4" /> Seed default section images
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Section</TableHead><TableHead>Text value</TableHead><TableHead>Image</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {settings.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.label || s.key}<div className="font-mono text-xs text-muted-foreground">{s.key}</div></TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{s.value || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.img || "—"}</TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => editSetting(s)}><Pencil className="h-4 w-4" /> Edit</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit stat" : "Add stat"}</DialogTitle></DialogHeader>
          <form onSubmit={submitStat} className="space-y-4">
            <div className="space-y-1.5"><Label>Value</Label><Input value={sf.value} onChange={(e) => setSf({ ...sf, value: e.target.value })} placeholder="10+" required /></div>
            <div className="space-y-1.5"><Label>Label</Label><Input value={sf.label} onChange={(e) => setSf({ ...sf, label: e.target.value })} placeholder="Years of experience" required /></div>
            <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={sf.sort} onChange={(e) => setSf({ ...sf, sort: e.target.value })} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!setOpenS} onOpenChange={(v) => !v && setSetOpenS(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{setOpenS?.label || setOpenS?.key}</DialogTitle></DialogHeader>
          <form onSubmit={submitSetting} className="space-y-4">
            <div className="space-y-1.5"><Label>Text value (optional)</Label><Input value={ef.value} onChange={(e) => setEf({ ...ef, value: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Image</Label><ImageUpload value={ef.img} onChange={(v) => setEf({ ...ef, img: v })} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setSetOpenS(null)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(v) => !v && setDel(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete stat?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Remove <span className="font-medium text-navy">{del?.value} {del?.label}</span>?</p>
          <DialogFooter><Button variant="outline" onClick={() => setDel(null)}>Cancel</Button><Button variant="destructive" onClick={confirmDel} disabled={busy}>{busy ? "Deleting..." : "Delete"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}