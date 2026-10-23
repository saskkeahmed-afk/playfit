import type { Game } from "./types";

/** تجزئة ثابتة (FNV-1a) لاشتقاق ألوان فريدة ومستقرة لكل لعبة. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export interface CoverTheme {
  hueA: number;
  hueB: number;
  angle: number;
  initials: string;
}

export function coverTheme(game: Pick<Game, "slug" | "title">): CoverTheme {
  const h = hashString(game.slug);
  const words = game.title.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words.slice(0, 2).map((w) => w[0]).join("") : (words[0] ?? game.slug).slice(0, 2)).toUpperCase();
  return { hueA: h % 360, hueB: (h >> 9) % 360, angle: (h >> 3) % 180, initials };
}

export type CoverSource =
  | { kind: "image"; srcs: string[]; width: number; height: number; origin: "local" | "steam" | "rawg"; credit?: string }
  | { kind: "generated" };

/** روابط صورة الغلاف الرسمية لمتجر Steam (نجرّبها بالترتيب عند الفشل). */
export function steamHeaderUrls(appId: number): string[] {
  return [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
    `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
  ];
}

/** الأولوية: صورة محلية مرخّصة ← غلاف Steam ← RAWG (إن وُجد مفتاح) ← بطاقة مولّدة محلياً. */
export function resolveCover(game: Pick<Game, "steamAppId" | "image">, remote?: { src: string; credit: string }): CoverSource {
  if (game.image) return { kind: "image", srcs: [game.image.src], width: game.image.width, height: game.image.height, origin: "local", credit: game.image.credit };
  if (game.steamAppId) return { kind: "image", srcs: steamHeaderUrls(game.steamAppId), width: 460, height: 215, origin: "steam", credit: "Steam" };
  if (remote) return { kind: "image", srcs: [remote.src], width: 600, height: 337, origin: "rawg", credit: remote.credit };
  return { kind: "generated" };
}

export function coverAlt(game: Pick<Game, "title" | "titleAr">, source: CoverSource): string {
  return source.kind === "image"
    ? `غلاف لعبة ${game.titleAr ?? game.title}`
    : `بطاقة تعريفية مولّدة لعبة ${game.titleAr ?? game.title} (الغلاف الرسمي غير متوفر محلياً)`;
}

/** نسخة خفيفة من اللعبة للبطاقات والمكتبة (تقلل ما يُرسل للمتصفح). */
export type CardGame = Pick<Game, "slug" | "title" | "titleAr" | "genres" | "releaseYear" | "descriptionAr" | "steamAppId" | "image" | "editorialRank"> & {
  min: { ramGb: number };
  recommended?: { ramGb: number };
};
export const toCardGame = (g: CardGame): CardGame => ({
  slug: g.slug, title: g.title, titleAr: g.titleAr, genres: g.genres, releaseYear: g.releaseYear, descriptionAr: g.descriptionAr,
  steamAppId: g.steamAppId, image: g.image, editorialRank: g.editorialRank,
  min: { ramGb: g.min.ramGb }, recommended: g.recommended ? { ramGb: g.recommended.ramGb } : undefined,
});
