"use server";
import { revalidatePath } from "next/cache";
import { adminApi } from "@/lib/admin-api";

export async function setApproved(id: number, approved: boolean) {
  try { await adminApi.updateReview(id, { approved }); revalidatePath("/admin/reviews"); revalidatePath("/admin"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function removeReview(id: number) {
  try { await adminApi.deleteReview(id); revalidatePath("/admin/reviews"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
