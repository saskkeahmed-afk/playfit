import { describe, expect, it } from "vitest";
import { filterGames, matchesQuery, normalizeQuery, paginate, suggestGames } from "@/lib/search";
import { games, getGame } from "@/data/games";
import type { Game } from "@/lib/types";

describe("البحث والتصفية", () => {
  it("يطبّع الحروف العربية", () => {
    expect(normalizeQuery("  فُورْت  نايت ")).toBe("فورت نايت");
    expect(normalizeQuery("ألعاب")).toBe(normalizeQuery("العاب"));
  });
  it("يجد بالاسم اللاتيني والعربي والـ slug", () => {
    expect(filterGames(games, { query: "witcher" }).map((g) => g.slug)).toContain("the-witcher-3-wild-hunt");
    expect(filterGames(games, { query: "سايبربانك" }).map((g) => g.slug)).toEqual(["cyberpunk-2077"]);
    expect(filterGames(games, { query: "red dead" })[0]?.slug).toBe("red-dead-redemption-2");
  });
  it("نتيجة فارغة لاستعلام غير موجود", () => {
    expect(filterGames(games, { query: "zzzzzz" })).toEqual([]);
  });
  it("تصفية النوع والسنة", () => {
    const r = filterGames(games, { genre: "سباقات" });
    expect(r.length).toBeGreaterThan(1);
    expect(r.every((g) => g.genres.includes("سباقات"))).toBe(true);
    expect(r.map((g) => g.slug)).toContain("forza-horizon-5");
    expect(filterGames(games, { yearFrom: 2023 }).every((g) => g.releaseYear >= 2023)).toBe(true);
  });
  it("تصفية الموصى به والرام", () => {
    expect(filterGames(games, { hasRecommended: true }).every((g) => !!g.recommended)).toBe(true);
    expect(filterGames(games, { maxMinRamGb: 4 }).every((g) => g.min.ramGb <= 4)).toBe(true);
  });
  it("الفرز", () => {
    const names = filterGames(games, { sort: "name" }).map((g) => g.title);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
    const years = filterGames(games, { sort: "year-desc" }).map((g) => g.releaseYear);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });
  it("الاقتراحات تبدأ بما يبدأ بالاستعلام", () => {
    expect(suggestGames(games, "cyber")[0]?.slug).toBe("cyberpunk-2077");
    expect(suggestGames(games, "")).toEqual([]);
  });
  it("matchesQuery يتطلب كل الكلمات", () => {
    const g = getGame("elden-ring") as Game;
    expect(matchesQuery(g, "elden ring")).toBe(true);
    expect(matchesQuery(g, "elden zelda")).toBe(false);
  });
  it("الترقيم يحصر الصفحة في النطاق", () => {
    const p = paginate([1, 2, 3, 4, 5], 99, 2);
    expect(p).toMatchObject({ page: 3, totalPages: 3, items: [5] });
    expect(paginate([], 1, 5).totalPages).toBe(1);
  });
});
