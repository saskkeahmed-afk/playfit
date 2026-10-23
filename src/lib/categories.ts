import { games } from "@/data/games";
import type { Category } from "@/data/categories";

export const gamesInCategory = (c: Category) => games.filter((g) => g.genres.includes(c.genre)).sort((a, b) => a.editorialRank - b.editorialRank);
/** نفهرس القسم فقط إن كان فيه ثلاث ألعاب أو أكثر (تجنباً للصفحات الرقيقة). */
export const categoryIsIndexable = (c: Category) => gamesInCategory(c).length >= 3;
