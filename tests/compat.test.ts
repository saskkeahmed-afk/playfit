import { describe, expect, it } from "vitest";
import { checkCompatibility } from "@/lib/compat";
import { getGame } from "@/data/games";
import { getCpu } from "@/data/cpus";
import { getGpu } from "@/data/gpus";
import type { Game } from "@/lib/types";

const rdr2 = getGame("red-dead-redemption-2") as Game;

describe("مقارنة المتطلبات الرسمية", () => {
  it("جهاز قوي يحقق الموصى به", () => {
    const r = checkCompatibility(rdr2, { cpu: getCpu("ryzen-5-5600x"), gpu: getGpu("geforce-rtx-3060-12gb"), ramGb: 16 });
    expect(r.verdict).toBe("meets-recommended");
  });
  it("جهاز ضعيف أقل من الحد الأدنى", () => {
    const r = checkCompatibility(rdr2, { cpu: getCpu("core-i3-3210"), gpu: getGpu("intel-hd-graphics-4000"), ramGb: 4 });
    expect(r.verdict).toBe("below-minimum");
  });
  it("جهاز بين الحدين يحقق الأدنى فقط", () => {
    const r = checkCompatibility(rdr2, { cpu: getCpu("core-i5-2500k"), gpu: getGpu("geforce-gtx-770"), ramGb: 8 });
    expect(r.verdict).toBe("meets-minimum");
  });
  it("رام أقل من المطلوب يمنع تحقيق الحد الأدنى", () => {
    const r = checkCompatibility(rdr2, { cpu: getCpu("ryzen-5-5600x"), gpu: getGpu("geforce-rtx-3060-12gb"), ramGb: 4 });
    expect(r.verdict).toBe("below-minimum");
  });
  it("بدون عتاد النتيجة غير معروفة وليست نجاحاً", () => {
    expect(checkCompatibility(rdr2, {}).verdict).toBe("unknown");
  });
  it("لعبة بلا موصى به لا تعيد meets-recommended", () => {
    const cs2 = getGame("counter-strike-2") as Game;
    const r = checkCompatibility(cs2, { cpu: getCpu("ryzen-7-7800x3d"), gpu: getGpu("geforce-rtx-4070"), ramGb: 32 });
    expect(r.verdict).not.toBe("meets-recommended");
    expect(r.notes.join(" ")).toContain("لا تتوفر متطلبات موصى بها");
  });
  it("متطلب بلا مرجع كرت معروف لا يُعتبر نجاحاً مؤكداً", () => {
    const cs2 = getGame("counter-strike-2") as Game;
    const r = checkCompatibility(cs2, { cpu: getCpu("ryzen-7-7800x3d"), gpu: getGpu("geforce-rtx-4070"), ramGb: 32 });
    expect(r.verdict).toBe("unknown");
  });
});

import { cpuVsGame, gpuVsGame } from "@/lib/compat";

describe("مقارنة قطعة واحدة بلعبة", () => {
  it("كرت قوي يحقق الموصى به لـ RDR2", () => {
    expect(gpuVsGame(rdr2, getGpu("geforce-rtx-3060-12gb") as never)).toBe("meets-recommended");
  });
  it("كرت مدمج أقل من الحد الأدنى", () => {
    expect(gpuVsGame(rdr2, getGpu("intel-hd-graphics-4000") as never)).toBe("below-minimum");
  });
  it("متطلب بلا مرجع معروف = غير محدد", () => {
    const cs2 = getGame("counter-strike-2") as Game;
    expect(gpuVsGame(cs2, getGpu("geforce-rtx-4070") as never)).toBe("unknown");
  });
  it("معالج بين الحدين يحقق الأدنى فقط", () => {
    expect(cpuVsGame(rdr2, getCpu("core-i5-2500k") as never)).toBe("meets-minimum");
    expect(cpuVsGame(rdr2, getCpu("ryzen-5-5600x") as never)).toBe("meets-recommended");
    expect(cpuVsGame(rdr2, getCpu("core-2-duo-e8400") as never)).toBe("below-minimum");
  });
});
