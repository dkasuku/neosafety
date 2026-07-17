"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Tags, Star, Megaphone, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products & Stock", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/adverts", label: "Adverts", icon: Megaphone },
  { href: "/admin/content", label: "Site Content", icon: FileText },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-navy px-4 py-6 text-white lg:flex">
      <div className="mb-8 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="NEO Safety Supplies" className="h-10 w-auto brightness-0 invert" />
        <p className="mt-2 text-xs text-white/50">Store management</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-green text-white" : "text-white/70 hover:bg-white/10 hover:text-white")}>
              <Icon className="h-[18px] w-[18px]" /> {label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" target="_blank" className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white">
        <ExternalLink className="h-4 w-4" /> View store
      </Link>
    </aside>
  );
}
