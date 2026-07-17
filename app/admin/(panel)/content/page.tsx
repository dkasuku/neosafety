import { adminApi } from "@/lib/admin-api";
import ContentManager from "./ContentManager";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  let stats, settings;
  try { [stats, settings] = await Promise.all([adminApi.stats(), adminApi.settings()]); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }
  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-2xl font-extrabold text-navy">Site Content</h1>
      <p className="text-sm text-muted-foreground">Manage the About-page stats and every editable section image across the site. Use **Section images** to upload images used on the homepage, about and branding pages.</p></div>
      <ContentManager stats={stats} settings={settings} />
    </div>
  );
}
