import { adminApi } from "@/lib/admin-api";
import CategoriesManager from "./CategoriesManager";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories;
  try { categories = await adminApi.categories(); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-2xl font-extrabold text-navy">Categories</h1>
      <p className="text-sm text-muted-foreground">Organise products into PPE and uniform categories.</p></div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
