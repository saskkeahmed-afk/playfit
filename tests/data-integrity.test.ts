import { describe, expect, it } from "vitest";
import { games } from "@/data/games";
import { gpus, gpuById } from "@/data/gpus";
import { cpus, cpuById } from "@/data/cpus";
import { guides, guideBySlug } from "@/data/guides";
import { isValidSlug } from "@/lib/slug";
import { benchmarkObservations } from "@/data/benchmarks";

describe("سلامة البيانات", () => {
  it("المعرّفات فريدة", () => {
    for (const list of [games.map((g) => g.slug), gpus.map((g) => g.id), cpus.map((c) => c.id), guides.map((g) => g.slug)]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
  it("كل slug صالح للـ URL", () => {
    for (const g of games) expect(isValidSlug(g.slug), g.slug).toBe(true);
    for (const g of gpus) expect(isValidSlug(g.id), g.id).toBe(true);
    for (const c of cpus) expect(isValidSlug(c.id), c.id).toBe(true);
  });
  it("كل مرجع معالج/كرت في المتطلبات موجود في قاعدة العتاد", () => {
    for (const g of games) {
      for (const tier of [g.min, g.recommended]) {
        if (!tier) continue;
        for (const id of tier.cpuRefs) expect(cpuById.has(id), `${g.slug}: cpu ${id}`).toBe(true);
        for (const id of tier.gpuRefs) expect(gpuById.has(id), `${g.slug}: gpu ${id}`).toBe(true);
      }
    }
  });
  it("الألعاب المشابهة والأدلة المرتبطة موجودة", () => {
    const slugs = new Set(games.map((g) => g.slug));
    for (const g of games) {
      for (const s of g.similar) expect(slugs.has(s), `${g.slug} -> ${s}`).toBe(true);
      for (const s of g.guides) expect(guideBySlug.has(s), `${g.slug} guide ${s}`).toBe(true);
      expect(g.requirementsSource.url.startsWith("https://")).toBe(true);
    }
  });
  it("القياسات (إن وُجدت) تشير لألعاب وعتاد موجود ولها مصدر", () => {
    const slugs = new Set(games.map((g) => g.slug));
    for (const o of benchmarkObservations) {
      expect(slugs.has(o.gameSlug)).toBe(true);
      expect(gpuById.has(o.gpuId)).toBe(true);
      expect(cpuById.has(o.cpuId)).toBe(true);
      expect(o.source.url.startsWith("https://")).toBe(true);
    }
  });
});
