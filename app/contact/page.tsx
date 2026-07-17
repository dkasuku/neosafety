import PageHero from "@/components/PageHero";
import { Pin, Phone, Mail } from "@/components/icons";
import { contact } from "@/lib/data";

export const metadata = {
  title: "Contact Us | NEO Safety Supplies",
  description: "Contact NEO Safety Supplies Ltd for PPE, workwear, uniforms, safety signs and branding services. Get a quote or bulk order support across Kenya.",
  keywords: ["contact NEO Safety Supplies", "PPE quote Kenya", "uniforms quote Nairobi", "safety supplier contact"],
};

export default function ContactPage() {
  return (
    <main>
      <PageHero title="Contact Us" subtitle="Questions, quotes or bulk orders — our team is here to help." />
      <section className="container-x grid gap-10 py-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">Get in touch</h2>
          <ul className="mt-6 space-y-4 text-navy/80">
            <li className="flex items-center gap-3"><Pin className="h-5 w-5 text-green" /> {contact.location}</li>
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-green" /> {contact.phone}</li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-green" /> {contact.email}</li>
          </ul>
          <div className="mt-8 rounded-xl bg-[#f4f6f8] p-6 text-sm text-slate-brand">
            <p className="font-display font-bold text-navy">Business hours</p>
            <p className="mt-2">Mon – Fri: 8:00am – 6:00pm</p>
            <p>Sat: 9:00am – 2:00pm</p>
          </div>
        </div>
        <form className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <div className="grid gap-4">
            <input required placeholder="Your name" className="rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
            <input required type="email" placeholder="Email address" className="rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
            <input placeholder="Phone number" className="rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
            <textarea required rows={5} placeholder="How can we help?" className="rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green" />
            <button type="submit" className="btn-primary py-3.5 text-sm">Send message</button>
          </div>
        </form>
      </section>
      <section className="pt-4">
        <div className="container-x mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Find us</h2>
          <a href="https://maps.app.goo.gl/n82VmR5f6NJEvGNu5" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-green hover:text-green-dark">Get directions →</a>
        </div>
        <iframe
          title="NEO Safety Supplies location"
          src="https://www.google.com/maps?q=Nairobi,+Kenya&z=14&output=embed"
          className="h-[380px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
}
