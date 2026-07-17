import Image from "next/image";
import Link from "next/link";
import { Pin, Phone, Mail } from "./icons";
import { contact } from "@/lib/data";

const quick = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track" },
  { label: "Blog", href: "/blog" },
];
const cats = [
  { label: "PPE Products", href: "/ppe" },
  { label: "Uniforms", href: "/uniforms" },
  { label: "Safety Signs", href: "/safety-signs" },
  { label: "Branding Services", href: "/branding" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Image src="/logo.png" alt="NEO Safety Supplies Ltd" width={220} height={110} className="h-14 w-auto brightness-0 invert" />
          <p className="mt-4 font-display text-base font-bold text-green">
            Your safety, Our responsibility.
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            High-quality PPE, workwear and branded uniforms, delivered fast to industries across Kenya.
          </p>
        </div>
        <FooterCol title="Quick Links" links={quick} />
        <FooterCol title="Categories" links={cats} />
        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Pin className="h-4 w-4 text-green" /> {contact.location}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-green" /> {contact.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-green" /> {contact.email}</li>
          </ul>
        </div>
      </div>
      <div className="bg-green">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-3 text-sm font-display font-bold tracking-wide text-white sm:flex-row">
          <span>YOUR SAFETY, OUR RESPONSIBILITY.</span>
          <span className="font-normal text-white/90">© {new Date().getFullYear()} NEO Safety Supplies Ltd</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-green">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
