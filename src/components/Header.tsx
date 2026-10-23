"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/config";
import type { SlimGame } from "@/lib/search-index";
import { Logo } from "./Logo";
import { GameSearch } from "./GameSearch";

export function Header({ items }: { items: SlimGame[] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded focus:bg-neon focus:px-3 focus:py-2 focus:text-ink-950">تخطَّ إلى المحتوى</a>
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="التنقل الرئيسي" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm text-mist-300 hover:bg-ink-800 hover:text-neon">{l.label}</Link>)}
        </nav>
        <div className="ms-auto hidden w-64 md:block lg:ms-0"><GameSearch items={items} compact placeholder="ابحث عن لعبة…" /></div>
        <button className="btn-ghost ms-auto px-3 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="border-t border-ink-700 bg-ink-900 lg:hidden">
          <div className="container-x space-y-3 py-4">
            <GameSearch items={items} compact />
            <nav aria-label="التنقل في الجوال" className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md border border-ink-700 px-3 py-3 text-sm hover:border-neon">{l.label}</Link>)}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
