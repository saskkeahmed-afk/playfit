import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "@/lib/slug";
import { DEFAULT_PROFILE, parseRamInput, parseStoredProfile } from "@/lib/profile";
import { coverAlt, coverTheme, resolveCover } from "@/lib/cover";
import { getGame } from "@/data/games";
import { games } from "@/data/games";
import { safeJsonLd, videoGameJsonLd, faqJsonLd } from "@/lib/seo";
import type { Game } from "@/lib/types";

describe("slug", () => {
  it("يحوّل العناوين لـ slug نظيف", () => {
    expect(slugify("Marvel's Spider-Man Remastered")).toBe("marvels-spider-man-remastered");
    expect(slugify("PUBG: Battlegrounds")).toBe("pubg-battlegrounds");
    expect(slugify("  --Hello   World!! ")).toBe("hello-world");
    expect(slugify("Tom & Jerry")).toBe("tom-and-jerry");
    expect(slugify("لعبة")).toBe("");
  });
  it("التحقق من الصلاحية", () => {
    expect(isValidSlug("god-of-war")).toBe(true);
    expect(isValidSlug("God Of War")).toBe(false);
    expect(isValidSlug("../etc/passwd")).toBe(false);
    expect(isValidSlug("a--b")).toBe(false);
  });
});

describe("إعدادات الجهاز", () => {
  it("إدخال الرام", () => {
    expect(parseRamInput("16")).toEqual({ ok: true, value: 16 });
    expect(parseRamInput("")).toEqual({ ok: true, value: null });
    expect(parseRamInput("abc").ok).toBe(false);
    expect(parseRamInput("0").ok).toBe(false);
    expect(parseRamInput("9999").ok).toBe(false);
    expect(parseRamInput("1.5").ok).toBe(false);
  });
  it("قراءة ملف محفوظ تالف لا ترمي خطأ وتعيد null", () => {
    expect(parseStoredProfile(null)).toBeNull();
    expect(parseStoredProfile("{not json")).toBeNull();
    expect(parseStoredProfile(JSON.stringify({ ...DEFAULT_PROFILE, cpuId: "nope" }))).toBeNull();
    expect(parseStoredProfile(JSON.stringify({ ...DEFAULT_PROFILE, ramGb: -3 }))).toBeNull();
  });
  it("يقبل ملفاً صالحاً", () => {
    const p = { ...DEFAULT_PROFILE, cpuId: "ryzen-5-5600x", gpuId: "radeon-rx-6600", ramGb: 16 };
    expect(parseStoredProfile(JSON.stringify(p))).toEqual(p);
  });
});

describe("أغلفة الألعاب", () => {
  it("كل لعبة لها بطاقة مولّدة مختلفة (لا صورة واحدة للجميع)", () => {
    const sigs = new Set(games.map((g) => { const t = coverTheme(g); return `${t.hueA}-${t.hueB}-${t.angle}`; }));
    expect(sigs.size).toBe(games.length);
  });
  it("الثيم ثابت لنفس اللعبة", () => {
    const g = getGame("fortnite") as Game;
    expect(coverTheme(g)).toEqual(coverTheme(g));
  });
  it("الألعاب التي لها معرّف Steam تحصل على روابط غلاف رسمية بالترتيب", () => {
    const g = getGame("cyberpunk-2077") as Game;
    const s = resolveCover(g);
    expect(s.kind === "image" && s.origin).toBe("steam");
    expect(s.kind === "image" && s.srcs.every((u) => u.includes("/apps/1091500/") && u.startsWith("https://"))).toBe(true);
  });
  it("بدون صورة محلية أو Steam أو بعيدة نعود للمولّد وبنص بديل صادق", () => {
    const g = getGame("fortnite") as Game;
    const s = resolveCover(g);
    expect(s.kind).toBe("generated");
    expect(coverAlt(g, s)).toContain("غير متوفر");
  });
  it("الصورة البعيدة تتفوق على المولّد والمحلية تتفوق على البعيدة", () => {
    const g = getGame("fortnite") as Game;
    const r = resolveCover(g, { src: "https://media.rawg.io/x.jpg", credit: "RAWG" });
    expect(r.kind === "image" && r.origin).toBe("rawg");
    const withLocal: Game = { ...g, image: { src: "/covers/fortnite.webp", width: 600, height: 337 } };
    const s = resolveCover(withLocal, { src: "https://media.rawg.io/x.jpg", credit: "RAWG" });
    expect(s.kind === "image" && s.srcs[0]).toBe("/covers/fortnite.webp");
  });
});

describe("JSON-LD", () => {
  it("يهرّب محتوى قد يغلق وسم السكربت", () => {
    const out = safeJsonLd({ a: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).a).toContain("</script>");
  });
  it("VideoGame لا يحتوي تقييمات أو عروضاً مختلقة", () => {
    const s = JSON.stringify(videoGameJsonLd(getGame("elden-ring") as Game));
    expect(s).not.toMatch(/aggregateRating|review|offers/i);
    expect(s).toContain("VideoGame");
  });
  it("FAQPage يطابق الأسئلة المعطاة", () => {
    const f = faqJsonLd([{ q: "س؟", a: "ج" }]);
    expect(f.mainEntity).toHaveLength(1);
  });
});

import { matchGpusFromRenderer, suggestResolution, gpuKey } from "@/lib/detect";
import { gpus } from "@/data/gpus";

describe("اكتشاف الكرت من WebGL", () => {
  const m = (s: string) => matchGpusFromRenderer(s, gpus).map((g) => g.id);
  it("يطابق كرتاً واضحاً", () => {
    expect(m("ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0, D3D11)")).toEqual(["geforce-gtx-1060-6gb"]);
    expect(m("ANGLE (AMD, AMD Radeon RX 580 Series Direct3D11 vs_5_0 ps_5_0, D3D11)")).toEqual(["radeon-rx-580"]);
  });
  it("لا يخمّن عند الغموض (ذاكرة غير مذكورة)", () => {
    expect(m("NVIDIA GeForce GTX 1060")).toEqual([]);
  });
  it("لا يخلط الإصدارات (Ti/Super)", () => {
    expect(m("NVIDIA GeForce GTX 1650 SUPER")).toEqual([]);
    expect(m("NVIDIA GeForce GTX 1660 SUPER")).toEqual(["geforce-gtx-1660-super"]);
    expect(m("NVIDIA GeForce RTX 3060 Ti")).toEqual([]);
  });
  it("يفرّق اللابتوب عن المكتبي", () => {
    expect(m("NVIDIA GeForce RTX 3060 Laptop GPU")).toEqual(["geforce-rtx-3060-laptop"]);
    expect(m("NVIDIA GeForce RTX 3060")).toEqual(["geforce-rtx-3060-12gb"]);
  });
  it("نص مقنّع أو غير معروف يعطي قائمة فارغة", () => {
    expect(m("ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device))")).toEqual([]);
    expect(m("")).toEqual([]);
  });
  it("مفتاح الكرت", () => {
    expect(gpuKey("GeForce RTX 3050 (8GB)")).toBe("rtx 3050");
  });
  it("اقتراح الدقة", () => {
    expect(suggestResolution(1920, 1080)).toBe("1080p");
    expect(suggestResolution(1366, 768)).toBe("720p");
    expect(suggestResolution(2560, 1440)).toBe("1440p");
    expect(suggestResolution(3840, 2160)).toBe("4k");
  });
});
