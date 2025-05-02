// src/components/game/PlayerFooterList.tsx
"use client";

import Image from "next/image";
import { Player } from "@/model/player";

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
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-500 border-t border-amber-200 px-4 py-2 flex justify-center gap-4 overflow-x-auto z-50 shadow-inner backdrop-blur">
      {players
        .filter((p) => !p.joinedLate)
        .map((player) => {
          const avatarUrl = `https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`;
          const hasSubmitted =
            phase === "guessing"
              ? !!guesses[player.id]
              : phase === "voting"
              ? !!votes[player.id]
              : true;

          const opacityClass =
            phase === "guessing" || phase === "voting"
              ? hasSubmitted || player.id === currentPlayerId
                ? "opacity-100"
                : "opacity-30"
              : "opacity-100";

          return (
            <div
              key={player.id}
              className="flex flex-col items-center text-center text-xs min-w-[64px]"
            >
              <div
                className={`w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow ${opacityClass} transition-opacity duration-300`}
              >
                <Image
                  src={avatarUrl}
                  alt={player.name}
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <div className="text-[11px] text-amber-800 font-semibold mt-1 truncate w-14">
                {player.name}
              </div>
              <div className="text-[10px] text-gray-600 font-medium">
                {player.score} pts
              </div>
            </div>
          );
        })}
    </div>
  );
}
