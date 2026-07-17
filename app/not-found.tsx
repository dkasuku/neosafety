import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-green">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 text-slate-brand">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-6 px-8 py-3.5 text-sm">Back to home</Link>
    </main>
  );
}
