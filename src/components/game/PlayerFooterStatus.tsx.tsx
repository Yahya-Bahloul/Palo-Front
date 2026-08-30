// src/components/game/PlayerFooterList.tsx
"use client";

import Image from "next/image";
import { Player } from "@/model/player";
import { theme } from "@/styles/theme";

type Props = {
  players: Player[];
  phase: "guessing" | "voting" | string;
  guesses: Record<string, string>;
  votes: Record<string, string>;
  currentPlayerId?: string;
};

export function PlayerFooterList({
  players,
  phase,
  guesses,
  votes,
  currentPlayerId,
}: Props) {
  const visible = [...players]
    .filter((p) => !p.joinedLate && p.connected !== false)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    // Hidden on phones: the bar ate a band of an already tight viewport, and
    // roomShell's bottom padding is reduced below `sm` to match.
    <div
      className={`hidden sm:block fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.4rem)] ${theme.footer}`}
    >
      <div className="flex justify-center gap-3 overflow-x-auto no-scrollbar">
        {visible.map((player) => {
          const avatarUrl = `https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`;
          const hasSubmitted =
            phase === "guessing"
              ? !!guesses[player.id]
              : phase === "voting"
              ? !!votes[player.id]
              : true;
          const isCurrent = player.id === currentPlayerId;
          const dim =
            (phase === "guessing" || phase === "voting") &&
            !hasSubmitted &&
            !isCurrent;

          return (
            <div
              key={player.id}
              className={`flex flex-col items-center gap-1 shrink-0 w-14 ${
                dim ? "opacity-35" : "opacity-100"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 ${
                    isCurrent
                      ? "border-[color:var(--skin-accent)]"
                      : "border-[color:var(--skin-border)]"
                  }`}
                >
                  <Image
                    src={avatarUrl}
                    alt={player.name}
                    width={36}
                    height={36}
                    unoptimized
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[color:var(--skin-primary)] text-[color:var(--skin-btn-color)] text-[9px] font-bold flex items-center justify-center leading-none">
                  {player.score}
                </span>
              </div>
              <span className="text-[10px] font-arcade text-[color:var(--skin-text)] truncate max-w-full">
                {player.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
