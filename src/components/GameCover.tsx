/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { coverAlt, coverTheme, type CardGame, type CoverSource } from "@/lib/cover";

function Generated({ game, label }: { game: Pick<CardGame, "slug" | "title" | "genres">; label: string }) {
  const t = coverTheme(game);
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-3"
      style={{ background: `linear-gradient(${t.angle}deg, hsl(${t.hueA} 55% 22%), hsl(${t.hueB} 60% 12%))`, direction: "ltr" }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-4 -top-6 select-none text-[7rem] font-bold leading-none text-white/10">{t.initials}</div>
      <span className="relative z-10 w-fit rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-mist-300">{game.genres[0]}</span>
      <span className="relative z-10 text-start text-base font-bold leading-tight text-white drop-shadow sm:text-lg">{game.title}</span>
    </div>
  );
}

export function GameCover({
  game,
  source,
  priority = false,
  className = "",
}: {
  game: CardGame;
  source: CoverSource;
  priority?: boolean;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const alt = coverAlt(game, source);
  const srcs = source.kind === "image" ? source.srcs : [];
  const failed = idx >= srcs.length;
  const showImage = source.kind === "image" && !failed;
  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-ink-800 ${className}`}>
      {showImage ? (
        <img
          key={srcs[idx]}
          src={srcs[idx]}
          alt={alt}
          width={source.kind === "image" ? source.width : 460}
          height={source.kind === "image" ? source.height : 215}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <Generated game={game} label={coverAlt(game, { kind: "generated" })} />
      )}
    </div>
  );
}
