import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "neo_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } });

  if (pathname.startsWith("/admin/login")) return pass();

  const token = req.cookies.get(COOKIE)?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN || "neo-admin-session-token";
  if (token !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return pass();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
