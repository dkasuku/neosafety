"use server";
import { revalidatePath } from "next/cache";
import { adminApi, type AdminStat, type AdminSetting } from "@/lib/admin-api";

export async function saveStat(id: number | null, data: Partial<AdminStat>) {
  try {
    if (id) await adminApi.updateStat(id, data); else await adminApi.createStat(data);
    revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true };
  } catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function deleteStat(id: number) {
  try { await adminApi.deleteStat(id); revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function saveSetting(id: number, data: Partial<AdminSetting>) {
  try { await adminApi.updateSetting(id, data); revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function createSetting(data: Partial<AdminSetting>) {
  try { await adminApi.createSetting(data); revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function deleteSetting(id: number) {
  try { await adminApi.deleteSetting(id); revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}
export async function seedSettings() {
  try { const res = await adminApi.seedSettings(); revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/branding"); return { ok: true, data: res }; }
  catch (e: any) { return { ok: false, error: e.message as string }; }
}