// src/components/game/PlayerFooterList.tsx
"use client";

import Image from "next/image";
import { Player } from "@/model/player";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 px-4 py-2 flex justify-center gap-4 overflow-x-auto z-50 shadow-inner backdrop-blur-sm ${theme.footer}`}
    >
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

          const isCurrent = player.id === currentPlayerId;

          const opacityClass =
            phase === "guessing" || phase === "voting"
              ? hasSubmitted || isCurrent
                ? "opacity-100"
                : "opacity-30"
              : "opacity-100";

          const borderClass = isCurrent
            ? theme.border.current
            : theme.border.default;

          return (
            <div
              key={player.id}
              className="flex flex-col items-center text-center text-xs min-w-[64px]"
            >
              <div
                className={`${theme.avatar.base} ${borderClass} ${opacityClass}`}
              >
                <Image
                  src={avatarUrl}
                  alt={player.name}
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <div className={theme.text.playerName}>{player.name}</div>
              <div className={theme.text.playerScore}>
                {player.score} {t("pointsShort")}
              </div>
            </div>
          );
        })}
    </div>
  );
}
