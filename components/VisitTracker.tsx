"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/api";

// Anonymous, first-party page-view tracking. Stores only a random visitor id
// in localStorage (no cookies, no IPs, no third parties).
function visitorId(): string {
  try {
    let id = localStorage.getItem("neo_vid");
    if (!id) {
      id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9-]/g, "");
      localStorage.setItem("neo_vid", id);
    }
    return id;
  } catch {
    return "";
  }
}

export default function VisitTracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;
    try {
      const body = JSON.stringify({ path, referrer: document.referrer, visitor: visitorId() });
      const url = `${API_URL}/api/track`;
      // text/plain keeps this a CORS "simple" request (no preflight).
      const blob = new Blob([body], { type: "text/plain" });
      if (!navigator.sendBeacon?.(url, blob)) {
        fetch(url, { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true, mode: "no-cors" }).catch(() => {});
      }
    } catch {}
  }, [path]);
  return null;
}
