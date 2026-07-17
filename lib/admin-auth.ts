import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "neo_admin";

export function sessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "neo-admin-session-token";
}
export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}
export function isAuthed() {
  return cookies().get(ADMIN_COOKIE)?.value === sessionToken();
}
