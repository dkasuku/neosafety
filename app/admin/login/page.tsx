import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | NEO Safety" };

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams?.next || "/admin";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
      <LoginForm next={next} />
    </main>
  );
}
