import Image from "next/image";

const clients = [
  { name: "Bonfire", img: "/images/clients/bonfire.jpg" },
  { name: "SOS Children's Villages", img: "/images/clients/sos-village.jpg" },
  { name: "Giza Systems", img: "/images/clients/giza-systems.jpg" },
  { name: "Gulf Tanks", img: "/images/clients/gulf-tanks.jpg" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  const set = [...clients, ...clients, ...clients];
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {set.map((c, i) => (
        <li key={`${c.name}-${i}`} className="flex min-w-[190px] items-center justify-center px-10">
          <Image src={c.img} alt={c.name} width={200} height={70}
            className="h-12 w-auto object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
        </li>
      ))}
    </ul>
  );
}

export default function ClientLogos() {
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <p className="container-x mb-7 text-center text-sm font-semibold uppercase tracking-widest text-slate-brand">
        Trusted by leading organisations
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
