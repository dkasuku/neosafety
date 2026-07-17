"use server";
import { revalidatePath } from "next/cache";
import { adminApi, type AdminAdvert } from "@/lib/admin-api";

export async function saveAdvert(id: number | null, data: Partial<AdminAdvert>) {
  try {
    if (id) await adminApi.updateAdvert(id, data); else await adminApi.createAdvert(data);
    revalidatePath("/admin/adverts"); return { ok: true };
  } catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function deleteAdvert(id: number) {
  try { await adminApi.deleteAdvert(id); revalidatePath("/admin/adverts"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
