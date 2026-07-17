"use server";
import { revalidatePath } from "next/cache";
import { adminApi } from "@/lib/admin-api";

export async function updateOrder(id: number, data: { status?: string; eta?: string | null }) {
  try {
    await adminApi.updateOrder(id, data);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message as string };
  }
}

export async function deleteOrder(id: number) {
  try {
    await adminApi.deleteOrder(id);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message as string };
  }
}
