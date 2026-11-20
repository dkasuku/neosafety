import Link from "next/link";
import { adminApi, type AnalyticsRow } from "@/lib/admin-api";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90, 365];
const nf = new Intl.NumberFormat("en-KE");

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-navy">{nf.format(value)}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}

function TopList({ title, rows, empty }: { title: string; rows: AnalyticsRow[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-semibold text-navy">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="relative overflow-hidden rounded-md px-3 py-1.5 text-sm">
              <div className="absolute inset-y-0 left-0 rounded-md bg-green/15" style={{ width: `${(r.count / max) * 100}%` }} />
              <div className="relative flex items-center justify-between gap-3">
                <span className="truncate" title={r.label}>{r.label}</span>
                <span className="shrink-0 font-semibold tabular-nums">{nf.format(r.count)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default async function AnalyticsPage({ searchParams }: { searchParams: { days?: string } }) {
  const days = RANGES.includes(Number(searchParams.days)) ? Number(searchParams.days) : 30;
  let a;
  try { a = await adminApi.analytics(days); }
  catch (e: any) { return <Card className="p-6 text-sm text-destructive">{e.message}</Card>; }

  const max = Math.max(1, ...a.daily.map((d) => d.views));
  const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy">Website visits</h1>
          <p className="text-sm text-muted-foreground">Storefront page views and unique visitors. Bots and admin pages are excluded.</p>
        </div>
        <div className="flex rounded-lg border border-border bg-white p-1 text-sm">
          {RANGES.map((r) => (
            <Link key={r} href={`/admin/analytics?days=${r}`}
              className={cn("rounded-md px-3 py-1 font-medium", r === days ? "bg-navy text-white" : "text-muted-foreground hover:text-navy")}>
              {r === 365 ? "1y" : `${r}d`}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Visitors today" value={a.today.visitors} sub={`${nf.format(a.today.views)} page views`} />
        <Stat label="Visitors · 7 days" value={a.last7.visitors} sub={`${nf.format(a.last7.views)} page views`} />
        <Stat label={`Visitors · ${days === 365 ? "1 year" : `${days} days`}`} value={a.period.visitors} sub={`${nf.format(a.period.views)} page views`} />
        <Stat label="Page views · all time" value={a.allTime.views} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-navy">Page views per day</h2>
          <span className="text-xs text-muted-foreground">Hover a bar for details · dates in UTC</span>
        </div>
        <div className="flex h-48 items-end gap-[2px]">
          {a.daily.map((d) => (
            <div key={d.date} className="group relative flex h-full flex-1 items-end"
              title={`${fmt(d.date)}: ${d.views} views, ${d.visitors} visitors`}>
              <div className="w-full rounded-t-sm bg-green/80 transition-colors group-hover:bg-navy"
                style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views ? 2 : 0 }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{fmt(a.daily[0].date)}</span>
          <span>{fmt(a.daily[a.daily.length - 1].date)}</span>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <TopList title="Top pages" rows={a.topPages} empty="No visits recorded yet." />
        <TopList title="Where visitors came from" rows={a.referrers} empty="No external referrers yet. Direct visits aren't listed." />
        <TopList title="Devices" rows={a.devices} empty="No visits recorded yet." />
      </div>
    </div>
  );
}
