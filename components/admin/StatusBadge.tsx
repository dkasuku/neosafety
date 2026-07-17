import { Badge } from "@/components/ui/badge";

const MAP: Record<string, { label: string; variant: "success" | "warning" | "muted" | "destructive" | "default" }> = {
  new: { label: "Received", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] || { label: status, variant: "muted" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
