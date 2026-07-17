import Link from "next/link";
import { Pin, Phone, Mail } from "./icons";
import { contact } from "@/lib/data";

export default function TopBar() {
  return (
    <div className="hidden border-b border-slate-200 bg-[#f4f6f8] text-[13px] md:block">
      <div className="container-x flex h-10 items-center justify-between">
        <div className="flex items-center gap-7 text-navy/80">
          <span className="flex items-center gap-2"><Pin className="h-4 w-4 text-green" /> {contact.location}</span>
          <a href={contact.phoneHref} className="flex items-center gap-2 hover:text-green"><Phone className="h-4 w-4 text-green" /> {contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-green"><Mail className="h-4 w-4 text-green" /> {contact.email}</a>
        </div>
        <div className="flex items-center gap-7">
          <Link href="/about" className="link-quiet">About Us</Link>
          <Link href="/contact" className="link-quiet">Contact Us</Link>
          <Link href="/track" className="link-quiet">Track Order</Link>
        </div>
      </div>
    </div>
  );
}
