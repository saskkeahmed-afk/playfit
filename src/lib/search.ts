import type { CardGame } from "./cover";
import type { Game } from "./types";

/** تطبيع النص العربي/اللاتيني للبحث: إزالة التشكيل والتطويل وتوحيد الألف والياء والتاء المربوطة. */
export function normalizeQuery(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SortKey = "popular" | "name" | "year-desc" | "year-asc";

export interface GameFilters {
  query?: string;
  genre?: string;
  yearFrom?: number;
  yearTo?: number;
  hasRecommended?: boolean;
  /** أقصى رام مطلوب في الحد الأدنى */
  maxMinRamGb?: number;
  sort?: SortKey;
}

type Searchable = Pick<CardGame, "slug" | "title" | "titleAr" | "genres" | "releaseYear" | "editorialRank" | "min" | "recommended">;

function haystack(game: Pick<Game, "title" | "titleAr" | "slug" | "genres">): string {
  return normalizeQuery([game.title, game.titleAr ?? "", game.slug.replace(/-/g, " "), ...game.genres].join(" "));
}

export function matchesQuery(game: Pick<Game, "title" | "titleAr" | "slug" | "genres">, query: string): boolean {
  const tokens = normalizeQuery(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const h = haystack(game);
  return tokens.every((t) => h.includes(t));
}

export function filterGames<T extends Searchable>(games: T[], f: GameFilters): T[] {
  let out = games.filter((g) => {
    if (f.query && !matchesQuery(g, f.query)) return false;
    if (f.genre && !g.genres.includes(f.genre)) return false;
    if (f.yearFrom !== undefined && g.releaseYear < f.yearFrom) return false;
    if (f.yearTo !== undefined && g.releaseYear > f.yearTo) return false;
    if (f.hasRecommended && !g.recommended) return false;
    if (f.maxMinRamGb !== undefined && g.min.ramGb > f.maxMinRamGb) return false;
    return true;
  });
  const sort = f.sort ?? "popular";
  out = [...out].sort((a, b) => {
    switch (sort) {
      case "name":
        return a.title.localeCompare(b.title, "en");
      case "year-desc":
        return b.releaseYear - a.releaseYear || a.title.localeCompare(b.title, "en");
      case "year-asc":
        return a.releaseYear - b.releaseYear || a.title.localeCompare(b.title, "en");
      default:
        return a.editorialRank - b.editorialRank;
    }
  });
  return out;
}

export function suggestGames<T extends Pick<Game, "title" | "titleAr" | "slug" | "genres">>(games: T[], query: string, limit = 6): T[] {
  if (!normalizeQuery(query)) return [];
  const q = normalizeQuery(query);
  const starts: T[] = [];
  const contains: T[] = [];
  for (const g of games) {
    if (!matchesQuery(g, query)) continue;
    const t = normalizeQuery(g.title);
    const ta = normalizeQuery(g.titleAr ?? "");
    (t.startsWith(q) || ta.startsWith(q) ? starts : contains).push(g);
  }
  return [...starts, ...contains].slice(0, limit);
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages, total: items.length };
}
