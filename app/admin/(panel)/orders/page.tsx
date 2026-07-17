import { adminApi } from "@/lib/admin-api";
import OrdersTable from "./OrdersTable";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  let orders;
  try { orders = await adminApi.orders(); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy">Orders</h1>
        <p className="text-sm text-muted-foreground">Update status and delivery ETA — customers see this on the Track page.</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
