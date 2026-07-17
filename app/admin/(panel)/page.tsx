import Link from "next/link";
import { ShoppingBag, Banknote, Package, AlertTriangle, Star, ArrowRight } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ksh } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

function Metric({ icon: Icon, label, value, tint }: { icon: any; label: string; value: string; tint: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}><Icon className="h-[18px] w-[18px]" /></span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-navy">{value}</p>
    </Card>
  );
}

export default async function DashboardPage() {
  let data;
  try {
    data = await adminApi.dashboard();
  } catch (e: any) {
    return (
      <Card className="p-6">
        <h1 className="font-display text-xl font-bold text-navy">Dashboard</h1>
        <p className="mt-2 text-sm text-destructive">{e.message}</p>
        <p className="mt-1 text-sm text-muted-foreground">Start the Flask backend (flask --app app run) and reload.</p>
      </Card>
    );
  }
  const s = data.orders.byStatus;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ShoppingBag} label="Total orders" value={String(data.orders.total)} tint="bg-green/10 text-green" />
        <Metric icon={Banknote} label="Revenue" value={ksh(data.orders.revenue)} tint="bg-blue-100 text-blue-600" />
        <Metric icon={Package} label="Products" value={String(data.products.total)} tint="bg-navy/10 text-navy" />
        <Metric icon={AlertTriangle} label="Low stock" value={String(data.products.lowStockCount)} tint="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["New", s.new || 0], ["Confirmed", s.confirmed || 0], ["Delivered", s.delivered || 0], ["Cancelled", s.cancelled || 0]].map(([label, n]) => (
          <Card key={label as string} className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="font-display text-xl font-bold text-navy">{n as number}</span>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-base font-bold text-navy">Recent orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-green hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.recentOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-right font-semibold">{ksh(o.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-base font-bold text-navy">Low stock alerts</h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-sm text-green hover:underline">Manage <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">All products are well stocked.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Stock</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.lowStock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.categoryName || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={p.stock === 0 ? "destructive" : "warning"}>{p.stock} left</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
