"use server";
import { revalidatePath } from "next/cache";
import { adminApi, type AdminCategory } from "@/lib/admin-api";

export async function saveCategory(id: number | null, data: Partial<AdminCategory>) {
  try {
    if (id) await adminApi.updateCategory(id, data);
    else await adminApi.createCategory(data);
    revalidatePath("/admin/categories");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function deleteCategory(id: number) {
  try { await adminApi.deleteCategory(id); revalidatePath("/admin/categories"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
