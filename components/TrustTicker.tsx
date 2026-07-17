import { Check, Truck, Lock, Star, Wrench } from "./icons";

const items = [
  { Icon: Check, label: "Genuine Products" },
  { Icon: Truck, label: "Same Day Delivery Nairobi" },
  { Icon: Lock, label: "Secure Payments" },
  { Icon: Star, label: "5000+ Customers" },
  { Icon: Wrench, label: "PPE Experts" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map(({ Icon, label }, i) => (
        <li key={`${label}-${i}`} className="flex items-center">
          <span className="flex items-center gap-2.5 px-8 py-4 text-sm font-display font-medium uppercase tracking-wide">
            <Icon className="h-5 w-5 text-green-light" />
            {label}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-green-light/60" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export default function TrustTicker() {
  return (
    <section className="marquee-mask overflow-hidden border-y border-white/10 bg-navy text-white">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
