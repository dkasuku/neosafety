import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const OK_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!OK_TYPES.includes(file.type)) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) return NextResponse.json({ error: "Image too large (max 6MB)" }, { status: 400 });

  const rawExt = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const ext = OK_EXT.includes(rawExt) ? rawExt : "jpg";
  const base = (file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image").slice(0, 40);
  const name = `${base}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` });
}
