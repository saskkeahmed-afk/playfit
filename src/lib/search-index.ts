import type { Game } from "./types";

/** نسخة خفيفة من اللعبة تُرسل للمتصفح (للبحث والاقتراحات فقط). */
export interface SlimGame {
  slug: string;
  title: string;
  titleAr?: string;
  genres: string[];
  releaseYear: number;
}

export const toSlim = (g: Game): SlimGame => ({ slug: g.slug, title: g.title, titleAr: g.titleAr, genres: g.genres, releaseYear: g.releaseYear });
