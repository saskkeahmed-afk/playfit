import Link from "next/link";
import type { Game } from "@/lib/types";

export function HardwareGames({ rows, kind }: { rows: { game: Game; tier: "min" | "recommended" }[]; kind: string }) {
  if (rows.length === 0) return <p className="text-mist-300">لا توجد لعبة في قاعدتنا تذكر هذا {kind} صراحةً ضمن متطلباتها الرسمية.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {rows.map(({ game, tier }) => (
        <li key={`${game.slug}-${tier}`}>
          <Link href={`/games/${game.slug}`} className="panel-soft block p-3 hover:border-neon/60">
            <span dir="ltr" className="block text-start font-bold">{game.title}</span>
            <span className="text-sm text-mist-300">مذكور ضمن {tier === "min" ? "الحد الأدنى" : "المتطلبات الموصى بها"} الرسمي</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
