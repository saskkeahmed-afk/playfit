import { z } from "zod";
import type { PcProfile } from "./types";
import { cpuById } from "@/data/cpus";
import { gpuById } from "@/data/gpus";

export const STORAGE_KEY = "playfit:pc-profile:v1";
export const CONSENT_KEY = "playfit:storage-consent:v1";

export const RESOLUTIONS = ["720p", "1080p", "1440p", "4k"] as const;
export const PRESETS = ["low", "medium", "high", "ultra"] as const;

export const resolutionLabel: Record<(typeof RESOLUTIONS)[number], string> = {
  "720p": "720p (HD)",
  "1080p": "1080p (Full HD)",
  "1440p": "1440p (2K)",
  "4k": "4K (Ultra HD)",
};
export const presetLabel: Record<(typeof PRESETS)[number], string> = {
  low: "منخفض (Low)",
  medium: "متوسط (Medium)",
  high: "عالٍ (High)",
  ultra: "فائق (Ultra)",
};
export const osLabel: Record<PcProfile["os"], string> = {
  windows11: "Windows 11",
  windows10: "Windows 10",
  "windows-old": "Windows 8.1 أو أقدم",
  other: "نظام آخر",
};

export const profileSchema = z.object({
  cpuId: z.string().max(80).nullable().refine((v) => v === null || cpuById.has(v), "معالج غير معروف"),
  gpuId: z.string().max(80).nullable().refine((v) => v === null || gpuById.has(v), "كرت شاشة غير معروف"),
  ramGb: z.number().int().min(1, "الرام يجب ألا يقل عن 1GB").max(256, "القيمة كبيرة جداً").nullable(),
  resolution: z.enum(RESOLUTIONS),
  os: z.enum(["windows11", "windows10", "windows-old", "other"]),
});

export const DEFAULT_PROFILE: PcProfile = { cpuId: null, gpuId: null, ramGb: null, resolution: "1080p", os: "windows11" };

/** يقرأ نصاً خاماً (من التخزين المحلي مثلاً) ويعيد ملفاً صالحاً أو null. لا يرمي أخطاء. */
export function parseStoredProfile(raw: string | null): PcProfile | null {
  if (!raw) return null;
  try {
    const parsed = profileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** يحوّل نص إدخال الرام إلى رقم صحيح صالح أو رسالة خطأ بالعربية. */
export function parseRamInput(text: string): { ok: true; value: number | null } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: true, value: null };
  if (!/^\d{1,3}$/.test(trimmed)) return { ok: false, error: "أدخل رقماً صحيحاً فقط، مثل 16." };
  const n = Number(trimmed);
  if (n < 1) return { ok: false, error: "الرام يجب ألا يقل عن 1GB." };
  if (n > 256) return { ok: false, error: "القيمة كبيرة جداً. أدخل حجم الرام بالجيجابايت." };
  return { ok: true, value: n };
}
