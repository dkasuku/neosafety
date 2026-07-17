import { adminApi } from "@/lib/admin-api";
import ReviewsManager from "./ReviewsManager";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  let reviews;
  try { reviews = await adminApi.reviews(); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-2xl font-extrabold text-navy">Reviews</h1>
      <p className="text-sm text-muted-foreground">Approve reviews to show them on product pages.</p></div>
      <ReviewsManager reviews={reviews} />
    </div>
  );
}
