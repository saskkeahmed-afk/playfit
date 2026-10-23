"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SlimGame } from "@/lib/search-index";
import { normalizeQuery } from "@/lib/search";

/** يُبنى على بيانات خفيفة؛ يعمل بدون API. */
function score(g: SlimGame, q: string): number {
  const t = normalizeQuery(g.title);
  const a = normalizeQuery(g.titleAr ?? "");
  const hay = normalizeQuery(`${g.title} ${g.titleAr ?? ""} ${g.slug.replace(/-/g, " ")} ${g.genres.join(" ")}`);
  const tokens = q.split(" ").filter(Boolean);
  if (!tokens.every((x) => hay.includes(x))) return -1;
  return t.startsWith(q) || a.startsWith(q) ? 2 : 1;
}

export function GameSearch({ items, placeholder = "ابحث عن لعبة…", compact = false }: { items: SlimGame[]; placeholder?: string; compact?: boolean }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const nq = normalizeQuery(q);

  const results = useMemo(() => {
    if (!nq) return [];
    return items.map((g) => ({ g, s: score(g, nq) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 6).map((x) => x.g);
  }, [items, nq]);

  const go = (slug: string) => { setOpen(false); setQ(""); router.push(`/games/${slug}`); };

  return (
    <div className="relative w-full">
      <label htmlFor={`${id}-in`} className="sr-only">بحث عن لعبة</label>
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-mist-500" aria-hidden />
        <input
          id={`${id}-in`}
          role="combobox"
          aria-expanded={open && nq.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
          className={`field ps-10 ${compact ? "min-h-10" : "min-h-12 text-base"}`}
          placeholder={placeholder}
          value={q}
          autoComplete="off"
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter") { const g = results[active >= 0 ? active : 0]; if (g) { e.preventDefault(); go(g.slug); } }
            else if (e.key === "Escape") setOpen(false);
          }}
        />
      </div>
      {open && nq && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-ink-600 bg-ink-900 shadow-xl">
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-mist-300">لا توجد لعبة بهذا الاسم في قاعدتنا الحالية. <Link href="/games" className="text-cyan-glow underline">تصفّح كل الألعاب</Link></li>
          ) : results.map((g, i) => (
            <li key={g.slug} id={`${id}-o${i}`} role="option" aria-selected={i === active}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(g.slug)} className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm hover:bg-ink-800 ${i === active ? "bg-ink-800" : ""}`}>
                <span dir="ltr">{g.title}</span>
                <span className="text-xs text-mist-500">{g.releaseYear}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
