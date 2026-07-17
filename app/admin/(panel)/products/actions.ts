"use server";
import { revalidatePath } from "next/cache";
import { adminApi, type AdminProduct } from "@/lib/admin-api";

export async function saveProduct(id: number | null, data: Partial<AdminProduct>) {
  try {
    if (id) await adminApi.updateProduct(id, data);
    else await adminApi.createProduct(data);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e.message as string }; }
}

export async function deleteProduct(id: number) {
  try {
    await adminApi.deleteProduct(id);
    revalidatePath("/admin/products");
    return { ok: true };
  } catch (e: any) { return { ok: false, error: e.message as string }; }
}
