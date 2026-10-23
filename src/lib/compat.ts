import type { Cpu, Game, Gpu, RequirementTier } from "./types";
import { cpuById } from "@/data/cpus";
import { gpuById } from "@/data/gpus";

export type PartStatus = "below" | "meets" | "unknown";
export type Verdict = "below-minimum" | "meets-minimum" | "meets-recommended" | "unknown";

export interface PartResult {
  status: PartStatus;
  detail: string;
}

export interface TierCheck {
  cpu: PartResult;
  gpu: PartResult;
  ram: PartResult;
  storageNote?: string;
}

export interface CompatibilityResult {
  verdict: Verdict;
  min: TierCheck;
  recommended?: TierCheck;
  notes: string[];
}

export interface UserHardware {
  cpu?: Cpu | null;
  gpu?: Gpu | null;
  ramGb?: number | null;
}

/** أقل فئة بين البدائل المعروفة (يكفي بلوغ أي بديل رسمي). null إن لم يُعرف أي بديل. */
function requiredClass(refs: string[], lookup: (id: string) => { perfClass: number } | undefined): number | null {
  const classes = refs.map((r) => lookup(r)?.perfClass).filter((c): c is number => typeof c === "number");
  return classes.length ? Math.min(...classes) : null;
}

function comparePart(userClass: number | undefined, required: number | null, label: string): PartResult {
  if (required === null) return { status: "unknown", detail: `لا تتوفر لدينا فئة مقارنة للـ${label} المذكور رسمياً.` };
  if (userClass === undefined) return { status: "unknown", detail: `لم تحدد ${label} بعد.` };
  return userClass >= required
    ? { status: "meets", detail: `${label} لديك في فئة المتطلب الرسمي أو أعلى (مقارنة تقريبية).` }
    : { status: "below", detail: `${label} لديك أقل من فئة المتطلب الرسمي (مقارنة تقريبية).` };
}

function checkTier(tier: RequirementTier, hw: UserHardware): TierCheck {
  const cpu = comparePart(hw.cpu?.perfClass, requiredClass(tier.cpuRefs, (id) => cpuById.get(id)), "المعالج");
  const gpu = comparePart(hw.gpu?.perfClass, requiredClass(tier.gpuRefs, (id) => gpuById.get(id)), "كرت الشاشة");
  let ram: PartResult;
  if (hw.ramGb == null) ram = { status: "unknown", detail: "لم تحدد حجم الرام بعد." };
  else if (hw.ramGb >= tier.ramGb) ram = { status: "meets", detail: `الرام ${hw.ramGb}GB يحقق المطلوب (${tier.ramGb}GB).` };
  else ram = { status: "below", detail: `الرام ${hw.ramGb}GB أقل من المطلوب (${tier.ramGb}GB).` };
  const storageNote = tier.storageGb
    ? `المساحة المطلوبة ${tier.storageGb}GB${tier.storageType ? ` (${tier.storageType})` : ""}.`
    : undefined;
  return { cpu, gpu, ram, storageNote };
}

function tierVerdict(c: TierCheck): "below" | "meets" | "unknown" {
  const parts = [c.cpu.status, c.gpu.status, c.ram.status];
  if (parts.includes("below")) return "below";
  if (parts.every((p) => p === "unknown")) return "unknown";
  // نعتبر "يحقق" فقط إن كان كرت الشاشة معروفاً ومحققاً؛ الباقي المجهول يُذكر في الملاحظات.
  return c.gpu.status === "meets" ? "meets" : "unknown";
}

export function checkCompatibility(game: Game, hw: UserHardware): CompatibilityResult {
  const min = checkTier(game.min, hw);
  const rec = game.recommended ? checkTier(game.recommended, hw) : undefined;
  const notes: string[] = [];

  const minV = tierVerdict(min);
  const recV = rec ? tierVerdict(rec) : undefined;
  let verdict: Verdict;
  if (minV === "below") verdict = "below-minimum";
  else if (minV === "unknown") verdict = "unknown";
  else verdict = recV === "meets" ? "meets-recommended" : "meets-minimum";

  if (hw.gpu?.deviceType === "laptop") notes.push("كروت اللابتوب تتأثر بحد الطاقة والتبريد، لذا قد يختلف الأداء عن كرت مكتبي بنفس الاسم.");
  if (hw.gpu?.deviceType === "integrated") notes.push("الكروت المدمجة تحتاج غالباً إلى إعدادات ودقة منخفضة.");
  if (!game.recommended) notes.push("لا تتوفر متطلبات موصى بها لهذه اللعبة في بياناتنا.");
  if (game.verification === "needs-review") notes.push("بيانات المتطلبات بانتظار المراجعة النهائية من المصدر الرسمي.");
  if (verdict === "meets-minimum" || verdict === "meets-recommended")
    notes.push("تحقيق المتطلبات الرسمية لا يعني فريمات محددة؛ استخدم قسم تقدير الأداء.");

  return { verdict, min, recommended: rec, notes };
}

export type PartVerdict = "meets-recommended" | "meets-minimum" | "below-minimum" | "unknown";

function partOnly(userClass: number, minReq: number | null, recReq: number | null): PartVerdict {
  if (minReq === null) return "unknown";
  if (userClass < minReq) return "below-minimum";
  if (recReq !== null && userClass >= recReq) return "meets-recommended";
  return "meets-minimum";
}

/** مقارنة كرت الشاشة وحده بمتطلبات اللعبة الرسمية (لصفحات الكروت). */
export function gpuVsGame(game: Game, gpu: Gpu): PartVerdict {
  const min = requiredClass(game.min.gpuRefs, (id) => gpuById.get(id));
  const rec = game.recommended ? requiredClass(game.recommended.gpuRefs, (id) => gpuById.get(id)) : null;
  return partOnly(gpu.perfClass, min, rec);
}

/** مقارنة المعالج وحده بمتطلبات اللعبة الرسمية (لصفحات المعالجات). */
export function cpuVsGame(game: Game, cpu: Cpu): PartVerdict {
  const min = requiredClass(game.min.cpuRefs, (id) => cpuById.get(id));
  const rec = game.recommended ? requiredClass(game.recommended.cpuRefs, (id) => cpuById.get(id)) : null;
  return partOnly(cpu.perfClass, min, rec);
}
