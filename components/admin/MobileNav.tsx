"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Tags, Star, Megaphone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/adverts", label: "Adverts", icon: Megaphone },
  { href: "/admin/content", label: "Content", icon: FileText },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border bg-white px-2 py-2 lg:hidden">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href}
            className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              active ? "bg-green text-white" : "text-muted-foreground hover:bg-muted")}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </div>
  );
}
