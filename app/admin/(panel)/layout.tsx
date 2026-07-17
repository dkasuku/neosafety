import { LogOut } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import MobileNav from "@/components/admin/MobileNav";
import { logout } from "../login/actions";

export const metadata = { title: "Admin | NEO Safety Supplies" };
export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8] text-navy">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NEO Safety Supplies" className="h-8 w-auto lg:hidden" />
          <div className="hidden lg:block" />
          <form action={logout}>
            <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-navy">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </header>
        <MobileNav />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
