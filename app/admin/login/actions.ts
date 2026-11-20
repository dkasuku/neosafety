"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, sessionToken, adminPassword } from "@/lib/admin-auth";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const pw = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");
  const expected = adminPassword();
  const token = sessionToken();
  if (!expected || !token) {
    return { error: "Admin login is not configured: set ADMIN_PASSWORD and ADMIN_SESSION_TOKEN on the server." };
  }
  if (pw !== expected) return { error: "Incorrect password. Try again." };
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true, sameSite: "lax", path: "/",
    secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12,
  });
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
