import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="مسار التنقل" className="mb-5 text-sm text-mist-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {it.href ? <Link href={it.href} className="hover:text-cyan-glow">{it.name}</Link> : <span aria-current="page" className="text-mist-300">{it.name}</span>}
            {i < items.length - 1 && <ChevronLeft size={14} aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
