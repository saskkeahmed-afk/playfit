"use client";

import { useMemo, useState } from "react";
import type { CardGame } from "@/lib/cover";
import type { RemoteCover } from "@/lib/rawg-types";
import { filterGames, paginate, type SortKey } from "@/lib/search";
import { GameCard } from "./GameCard";

const PER_PAGE = 9;

export function GameLibrary({ games, genres, remoteCovers }: { games: CardGame[]; genres: string[]; remoteCovers: Record<string, RemoteCover> }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [hasRec, setHasRec] = useState(false);
  const [maxRam, setMaxRam] = useState("");
  const [page, setPage] = useState(1);

  const years = useMemo(() => Array.from(new Set(games.map((g) => g.releaseYear))).sort((a, b) => b - a), [games]);
  const filtered = useMemo(
    () => filterGames(games, { query, genre: genre || undefined, yearFrom: yearFrom ? Number(yearFrom) : undefined, hasRecommended: hasRec || undefined, maxMinRamGb: maxRam ? Number(maxRam) : undefined, sort }),
    [games, query, genre, yearFrom, hasRec, maxRam, sort],
  );
  const p = paginate(filtered, page, PER_PAGE);
  const set = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };
  const reset = () => { setQuery(""); setGenre(""); setYearFrom(""); setSort("popular"); setHasRec(false); setMaxRam(""); setPage(1); };

  return (
    <div className="space-y-6">
      <form role="search" aria-label="تصفية الألعاب" className="panel grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="lib-q" className="label">اسم اللعبة</label>
          <input id="lib-q" type="search" className="field" placeholder="مثال: Witcher أو سايبربانك" value={query} onChange={(e) => set(setQuery)(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lib-genre" className="label">النوع</label>
          <select id="lib-genre" className="field" value={genre} onChange={(e) => set(setGenre)(e.target.value)}>
            <option value="">كل الأنواع</option>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lib-year" className="label">صدرت منذ سنة</label>
          <select id="lib-year" className="field" value={yearFrom} onChange={(e) => set(setYearFrom)(e.target.value)}>
            <option value="">أي سنة</option>
            {years.map((y) => <option key={y} value={y}>{y} فأحدث</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lib-ram" className="label">الحد الأدنى للرام لا يتجاوز</label>
          <select id="lib-ram" className="field" value={maxRam} onChange={(e) => set(setMaxRam)(e.target.value)}>
            <option value="">أي قيمة</option>
            {[4, 8, 12, 16].map((r) => <option key={r} value={r}>{r}GB</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lib-sort" className="label">الترتيب</label>
          <select id="lib-sort" className="field" value={sort} onChange={(e) => set(setSort)(e.target.value as SortKey)}>
            <option value="popular">الأبرز (ترتيب تحريري)</option>
            <option value="name">الاسم</option>
            <option value="year-desc">الأحدث</option>
            <option value="year-asc">الأقدم</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-mist-300 sm:col-span-2 lg:col-span-4">
          <input type="checkbox" className="h-4 w-4 accent-[#39ff88]" checked={hasRec} onChange={(e) => set(setHasRec)(e.target.checked)} />
          الألعاب التي لها متطلبات موصى بها فقط
        </label>
      </form>

      <p className="text-sm text-mist-500" role="status" aria-live="polite">{p.total} لعبة</p>

      {p.total === 0 ? (
        <div className="panel p-8 text-center">
          <p className="mb-2 text-lg font-bold">لا توجد ألعاب مطابقة</p>
          <p className="mb-4 text-sm text-mist-300">جرّب كلمات أقصر أو أزل بعض عوامل التصفية. قاعدتنا تضم عدداً محدوداً من الألعاب الموثّقة حالياً.</p>
          <button className="btn-primary" onClick={reset}>إعادة ضبط التصفية</button>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.items.map((g, i) => <li key={g.slug}><GameCard game={g} remote={remoteCovers[g.slug]} priority={i < 3 && p.page === 1} /></li>)}
        </ul>
      )}

      {p.totalPages > 1 && (
        <nav aria-label="ترقيم الصفحات" className="flex items-center justify-center gap-3">
          <button className="btn-ghost" disabled={p.page <= 1} onClick={() => setPage(p.page - 1)}>السابق</button>
          <span className="text-sm text-mist-300">صفحة {p.page} من {p.totalPages}</span>
          <button className="btn-ghost" disabled={p.page >= p.totalPages} onClick={() => setPage(p.page + 1)}>التالي</button>
        </nav>
      )}
    </div>
  );
}
