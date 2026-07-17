import { adminApi } from "@/lib/admin-api";
import ProductsTable from "./ProductsTable";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products, categories;
  try { [products, categories] = await Promise.all([adminApi.products(), adminApi.categories()]); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy">Products &amp; Stock</h1>
        <p className="text-sm text-muted-foreground">Add, edit and remove products. Stock badges turn amber under 10 and red at 0.</p>
      </div>
      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
