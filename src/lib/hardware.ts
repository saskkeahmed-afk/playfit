import { games } from "@/data/games";
import type { Cpu, Game, Gpu } from "./types";
import { cpuVsGame, gpuVsGame, type PartVerdict } from "./compat";

/** ألعاب تذكر هذا الكرت/المعالج صراحةً في متطلباتها الرسمية. */
export function gamesMentioningGpu(id: string): { game: Game; tier: "min" | "recommended" }[] {
  return games.flatMap((g) => (["min", "recommended"] as const).flatMap((tier) => (g[tier]?.gpuRefs.includes(id) ? [{ game: g, tier }] : [])));
}
export function gamesMentioningCpu(id: string): { game: Game; tier: "min" | "recommended" }[] {
  return games.flatMap((g) => (["min", "recommended"] as const).flatMap((tier) => (g[tier]?.cpuRefs.includes(id) ? [{ game: g, tier }] : [])));
}
export interface VerdictGroups {
  rec: Game[];
  min: Game[];
  below: Game[];
  unknown: Game[];
}

function group(fn: (g: Game) => PartVerdict): VerdictGroups {
  const out: VerdictGroups = { rec: [], min: [], below: [], unknown: [] };
  for (const g of games) {
    const v = fn(g);
    (v === "meets-recommended" ? out.rec : v === "meets-minimum" ? out.min : v === "below-minimum" ? out.below : out.unknown).push(g);
  }
  return out;
}
export const gpuVerdicts = (gpu: Gpu): VerdictGroups => group((g) => gpuVsGame(g, gpu));
export const cpuVerdicts = (cpu: Cpu): VerdictGroups => group((g) => cpuVsGame(g, cpu));

/** صفحة العتاد لها محتوى فريد ما دام فيها حكم معروف مع لعبة واحدة على الأقل. */
export const gpuIsIndexable = (gpu: Gpu) => { const v = gpuVerdicts(gpu); return v.rec.length + v.min.length + v.below.length > 0; };
export const cpuIsIndexable = (cpu: Cpu) => { const v = cpuVerdicts(cpu); return v.rec.length + v.min.length + v.below.length > 0; };
