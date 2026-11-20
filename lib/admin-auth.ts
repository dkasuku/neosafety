import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "neo_admin";

// No hardcoded fallbacks: if a secret is missing, admin access is refused
// (fail closed) rather than falling back to a guessable default.
export function sessionToken(): string | null {
  return process.env.ADMIN_SESSION_TOKEN || null;
}
export function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}
export function isAuthed() {
  const t = sessionToken();
  return !!t && cookies().get(ADMIN_COOKIE)?.value === t;
}
