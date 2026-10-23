import Link from "next/link";
import { resolveCover, toCardGame, type CardGame } from "@/lib/cover";
import type { RemoteCover } from "@/lib/rawg-types";
import { GameCover } from "./GameCover";

export function GameCard({ game, remote, priority = false }: { game: CardGame; remote?: RemoteCover; priority?: boolean }) {
  return (
    <article className="panel group flex flex-col overflow-hidden transition-colors hover:border-neon/60">
      <Link href={`/games/${game.slug}`} className="block" aria-label={`صفحة لعبة ${game.titleAr ?? game.title}`}>
        <GameCover game={toCardGame(game)} source={resolveCover(game, remote)} priority={priority} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold leading-snug">
          <Link href={`/games/${game.slug}`} className="hover:text-neon">
            <span dir="ltr" className="block text-start">{game.title}</span>
            {game.titleAr && <span className="block text-sm font-medium text-mist-500">{game.titleAr}</span>}
          </Link>
        </h3>
        <p className="flex flex-wrap gap-1.5 text-xs">
          <span className="chip">{game.releaseYear}</span>
          {game.genres.slice(0, 2).map((g) => <span key={g} className="chip">{g}</span>)}
        </p>
        <p className="line-clamp-3 text-sm text-mist-300">{game.descriptionAr}</p>
        <Link href={`/games/${game.slug}`} className="mt-auto pt-2 text-sm font-bold text-cyan-glow hover:underline">
          المتطلبات وتقدير الأداء
        </Link>
      </div>
    </article>
  );
}
