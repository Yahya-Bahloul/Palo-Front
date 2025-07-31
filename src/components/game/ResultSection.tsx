// src/components/game/ResultSection.tsx
"use client";

import { Player } from "@/model/player";
import Image from "next/image";
import { theme } from "@/styles/theme";

type Props = {
  players: Player[];
};

export function ResultSection({ players }: Props) {
  const sortedPlayers = [...players]
    .filter((p) => !p.joinedLate)
    .sort((a, b) => b.score - a.score);

  const topScore = sortedPlayers[0]?.score ?? 0;

  const getAvatarUrl = (avatar?: string) =>
    avatar
      ? `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(
          avatar
        )}`
      : "";

  return (
    <div className={theme.resultSection.card}>
      <h2 className={theme.resultSection.title}>{"🏆 Résultats finaux"}</h2>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isTop = player.score === topScore;
          return (
            <div
              key={player.id}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl ${
                isTop
                  ? theme.resultSection.topPlayer
                  : theme.resultSection.player
              }`}
            >
              <div className={theme.resultSection.avatar}>
                <Image
                  src={getAvatarUrl(player.avatar)}
                  alt="Avatar"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <span className={theme.resultSection.playerName}>
                {index === 0 && "🥇 "}
                {player.name}
              </span>
              <span className={theme.resultSection.playerScore}>
                {player.score} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
