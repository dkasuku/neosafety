import { Shield, Truck, Tag, Headset } from "./icons";

const items = [
  { Icon: Shield, title: "QUALITY PRODUCTS", sub: "Tested & certified" },
  { Icon: Truck, title: "FAST DELIVERY", sub: "Across Kenya" },
  { Icon: Tag, title: "COMPETITIVE PRICES", sub: "Best value guarantee" },
  { Icon: Headset, title: "EXPERT SUPPORT", sub: "We are here to help" },
];

export default function TrustBar() {
  return (
    <div className="container-x relative z-10 -mt-8">
      <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-6 shadow-float sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
        {items.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-4 lg:justify-center lg:px-4">
            <Icon className="h-9 w-9 shrink-0 text-green" />
            <div>
              <p className="font-display text-sm font-bold text-navy">{title}</p>
              <p className="text-sm text-slate-brand">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
