import "server-only";
import type { Game } from "./types";

/**
 * جلب صورة اللعبة من RAWG (اختياري). المفتاح يبقى على الخادم.
 * شروط RAWG: ضع رابطاً ظاهراً إلى RAWG عند استخدام بياناتهم (يفعل المكوّن RawgAttribution ذلك).
 * عند غياب المفتاح أو فشل الطلب نرجع undefined ويظهر الغلاف المولّد محلياً.
 */
import type { RemoteCover } from "./rawg-types";

export type { RemoteCover };

const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

export async function getRemoteCover(game: Game): Promise<RemoteCover | undefined> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return undefined;
  try {
    const url = new URL("https://api.rawg.io/api/games");
    url.searchParams.set("key", key);
    url.searchParams.set("search", game.title);
    url.searchParams.set("page_size", "5");
    url.searchParams.set("search_precise", "true");
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return undefined; // 429 وغيره: نتراجع للغلاف المحلي
    const data = (await res.json()) as { results?: { name: string; background_image: string | null; released?: string | null }[] };
    const wanted = game.title.toLowerCase();
    // نقبل فقط تطابق الاسم تماماً حتى لا نربط صورة بلعبة خطأ.
    const match = data.results?.find((r) => r.name.toLowerCase() === wanted && r.background_image);
    if (!match?.background_image) return undefined;
    if (!match.background_image.startsWith("https://media.rawg.io/")) return undefined;
    return { src: match.background_image, credit: "RAWG" };
  } catch {
    return undefined;
  }
}

export async function getRemoteCovers(games: Game[]): Promise<Record<string, RemoteCover>> {
  if (!process.env.RAWG_API_KEY) return {};
  const entries = await Promise.all(games.map(async (g) => [g.slug, await getRemoteCover(g)] as const));
  return Object.fromEntries(entries.filter((e): e is readonly [string, RemoteCover] => !!e[1]));
}
