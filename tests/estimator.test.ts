import { describe, expect, it } from "vitest";
import { estimateFps } from "@/lib/estimator";
import type { BenchmarkObservation, Game } from "@/lib/types";
import { getCpu } from "@/data/cpus";
import { getGpu } from "@/data/gpus";
import { getGame, games } from "@/data/games";

// بيانات اختبار فقط؛ ليست قياسات حقيقية ولا تُستخدم في الموقع.
const FIXTURE: BenchmarkObservation[] = [
  { id: "t1", gameSlug: "cyberpunk-2077", cpuId: "core-i5-12400f", gpuId: "geforce-rtx-3060-12gb", ramGb: 16, resolution: "1080p", preset: "high", upscaling: "none", avgFps: 80, source: { label: "fixture", url: "https://example.com", retrievedAt: "2026-01-01" } },
  { id: "t2", gameSlug: "cyberpunk-2077", cpuId: "core-i5-12400f", gpuId: "geforce-rtx-3060-12gb", ramGb: 16, resolution: "1080p", preset: "high", upscaling: "none", avgFps: 90, source: { label: "fixture", url: "https://example.com", retrievedAt: "2026-01-01" } },
];
const lookup = { cpu: getCpu, gpu: getGpu };
const game = getGame("cyberpunk-2077") as Game;
const base = () => ({
  game,
  cpu: getCpu("core-i5-12400f"),
  gpu: getGpu("geforce-rtx-3060-12gb"),
  ramGb: 16,
  resolution: "1080p" as const,
  preset: "high" as const,
  upscaling: "none" as const,
});

describe("محرك تقدير الفريمات", () => {
  it("عند غياب القياسات يعطي تقديراً نموذجياً موسوماً بثقة منخفضة (لا رسالة نقص بيانات)", () => {
    const r = estimateFps(base(), [], lookup);
    expect(r.status).toBe("estimated");
    if (r.status !== "estimated") return;
    expect(r.basis).toBe("model-approx");
    expect(r.confidence).toBe("low");
    expect(r.fpsHigh).toBeGreaterThan(r.fpsLow);
    expect(r.usedObservations).toEqual([]);
    expect(r.caveats.join(" ")).toContain("تقدير تقريبي");
  });
  it("يعطي نطاقاً (لا رقماً واحداً) ويحيط بالقياسات عند تطابق الكرت والإعدادات", () => {
    const r = estimateFps(base(), FIXTURE, lookup);
    expect(r.status).toBe("estimated");
    if (r.status !== "estimated") return;
    expect(r.basis).toBe("exact-gpu-measured");
    expect(r.fpsLow).toBeLessThan(80);
    expect(r.fpsHigh).toBeGreaterThan(90);
    expect(r.confidence).toBe("high");
  });
  it("عند اختلاف الدقة لا يحوّل القياس بل يستخدم النموذج الموسوم", () => {
    const r = estimateFps({ ...base(), resolution: "4k" }, FIXTURE, lookup);
    expect(r.status === "estimated" && r.basis).toBe("model-approx");
  });
  it("عند اختلاف الإعدادات المسبقة يستخدم النموذج الموسوم", () => {
    const r = estimateFps({ ...base(), preset: "ultra" }, FIXTURE, lookup);
    expect(r.status === "estimated" && r.basis).toBe("model-approx");
  });
  it("يحجّم من كرت قريب بثقة منخفضة وبشكل غير خطي", () => {
    const gpu = getGpu("radeon-rx-6600"); // فئة 175 مقابل 190 للقياس
    const r = estimateFps({ ...base(), gpu }, FIXTURE, lookup);
    expect(r.status).toBe("estimated");
    if (r.status !== "estimated") return;
    expect(r.basis).toBe("scaled-from-similar-gpu");
    expect(r.confidence).toBe("low");
    const linear = 85 * (175 / 190);
    const mid = (r.fpsLow + r.fpsHigh) / 2;
    expect(mid).toBeGreaterThan(linear); // أس 0.7 أقل صرامة من الخطي
  });
  it("كرت بعيد في الفئة عن القياسات: نموذج لا تحجيم", () => {
    const r = estimateFps({ ...base(), gpu: getGpu("geforce-rtx-4070") }, FIXTURE, lookup);
    expect(r.status === "estimated" && r.basis).toBe("model-approx");
  });
  it("يشير لاختناق المعالج ويخفض الثقة عند معالج أضعف بوضوح", () => {
    const r = estimateFps({ ...base(), cpu: getCpu("core-i5-3470") }, FIXTURE, lookup);
    expect(r.status).toBe("estimated");
    if (r.status !== "estimated") return;
    expect(r.likelyBottleneck).toBe("cpu");
    expect(r.confidence).not.toBe("high");
    expect(r.fpsLow).toBeLessThan(80 * 0.92);
  });
  it("يخفض الثقة عند رام أقل من الحد الأدنى الرسمي", () => {
    const r = estimateFps({ ...base(), ramGb: 8 }, FIXTURE, lookup);
    expect(r.status).toBe("estimated");
    if (r.status === "estimated") expect(r.confidence).not.toBe("high");
  });
  it("يرفض تقنية رفع غير مدعومة في اللعبة", () => {
    const g = getGame("elden-ring") as Game;
    const r = estimateFps({ ...base(), game: g, upscaling: "fsr" }, FIXTURE, lookup);
    expect(r.status === "insufficient" && r.code).toBe("upscaling-unsupported-game");
  });
  it("يرفض DLSS على كرت غير RTX", () => {
    const r = estimateFps({ ...base(), gpu: getGpu("radeon-rx-6600"), upscaling: "dlss" }, FIXTURE, lookup);
    expect(r.status === "insufficient" && r.code).toBe("upscaling-unsupported-gpu");
  });
  it("لا يخلط لابتوب بمكتبي: يستخدم النموذج ولا قياسات المكتبي", () => {
    const r = estimateFps({ ...base(), gpu: getGpu("geforce-rtx-3060-laptop") }, FIXTURE, lookup);
    expect(r.status === "estimated" && r.basis).toBe("model-approx");
  });
  it("يطلب إكمال العتاد عند نقصه", () => {
    const r = estimateFps({ ...base(), cpu: undefined }, FIXTURE, lookup);
    expect(r.status === "insufficient" && r.code).toBe("missing-hardware");
  });
});

describe("النموذج التقريبي (بدون قياسات)", () => {
  const est = (over: Record<string, unknown> = {}) => {
    const r = estimateFps({ ...base(), ...over } as never, [], lookup);
    if (r.status !== "estimated") throw new Error("expected estimate");
    return (r.fpsLow + r.fpsHigh) / 2;
  };
  it("كرت أقوى = فريمات أعلى", () => {
    expect(est({ gpu: getGpu("geforce-rtx-4070") })).toBeGreaterThan(est({ gpu: getGpu("geforce-gtx-1650") }));
  });
  it("دقة أقل = فريمات أعلى، و4K أقل من 1080p", () => {
    expect(est({ resolution: "720p" })).toBeGreaterThan(est());
    expect(est({ resolution: "4k" })).toBeLessThan(est({ resolution: "1440p" }));
    expect(est({ resolution: "1440p" })).toBeLessThan(est());
  });
  it("إعدادات أقل = فريمات أعلى", () => {
    expect(est({ preset: "low" })).toBeGreaterThan(est({ preset: "ultra" }));
  });
  it("معالج ضعيف يخفض النتيجة ويظهر كاختناق", () => {
    const weak = estimateFps({ ...base(), cpu: getCpu("core-i3-3210") } as never, [], lookup);
    expect(est({ cpu: getCpu("core-i3-3210") })).toBeLessThan(est());
    expect(weak.status === "estimated" && weak.likelyBottleneck).toBe("cpu");
  });
  it("تقنية الرفع ترفع الفريمات", () => {
    expect(est({ upscaling: "fsr" })).toBeGreaterThan(est());
  });
  it("الألعاب التنافسية الخفيفة أعلى من الثقيلة على نفس الجهاز", () => {
    expect(est({ game: getGame("counter-strike-2") })).toBeGreaterThan(est());
  });
  it("يعمل لكل لعبة في القاعدة ولكل دقة/إعداد بلا NaN ولا قيم غير منطقية", () => {
    for (const g of games) {
      for (const resolution of ["720p", "1080p", "1440p", "4k"] as const) {
        for (const preset of ["low", "medium", "high", "ultra"] as const) {
          const r = estimateFps({ ...base(), game: g, resolution, preset } as never, [], lookup);
          expect(r.status, g.slug).toBe("estimated");
          if (r.status === "estimated") {
            expect(Number.isFinite(r.fpsLow) && Number.isFinite(r.fpsHigh)).toBe(true);
            expect(r.fpsLow).toBeGreaterThanOrEqual(1);
            expect(r.fpsHigh).toBeLessThanOrEqual(500);
          }
        }
      }
    }
  });
  it("كرت مدمج يعطي رقماً منخفضاً لا رسالة رفض", () => {
    const r = estimateFps({ ...base(), gpu: getGpu("intel-uhd-graphics-620") } as never, [], lookup);
    expect(r.status).toBe("estimated");
    expect(est({ gpu: getGpu("intel-uhd-graphics-620") })).toBeLessThan(est());
  });
});
