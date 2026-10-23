"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { normalizeQuery } from "@/lib/search";

export interface DirItem { id: string; name: string; sub: string; badge?: string }

export function DirectoryList({ items, basePath, label }: { items: DirItem[]; basePath: string; label: string }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const nq = normalizeQuery(q);
    return nq ? items.filter((i) => nq.split(" ").every((t) => normalizeQuery(`${i.name} ${i.sub}`).includes(t))) : items;
  }, [items, q]);
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="dir-q" className="label">{label}</label>
        <input id="dir-q" type="search" className="field max-w-md" value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب جزءاً من الاسم، مثل 1060 أو Ryzen" />
      </div>
      <p className="text-sm text-mist-500" role="status" aria-live="polite">{list.length} نتيجة</p>
      {list.length === 0 ? (
        <p className="panel p-6 text-mist-300">لا توجد نتائج. قاعدتنا تغطي عدداً محدوداً من القطع حالياً.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((i) => (
            <li key={i.id}>
              <Link href={`${basePath}/${i.id}`} className="panel block p-4 hover:border-neon/60">
                <span dir="ltr" className="block text-start font-bold">{i.name}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-mist-500">{i.sub}{i.badge && <span className="chip">{i.badge}</span>}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
