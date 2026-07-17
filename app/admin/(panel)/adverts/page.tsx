import { adminApi } from "@/lib/admin-api";
import AdvertsManager from "./AdvertsManager";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdvertsPage() {
  let adverts;
  try { adverts = await adminApi.adverts(); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-2xl font-extrabold text-navy">Adverts</h1>
      <p className="text-sm text-muted-foreground">Promotional banners shown on the homepage and shop pages.</p></div>
      <AdvertsManager adverts={adverts} />
    </div>
  );
}
