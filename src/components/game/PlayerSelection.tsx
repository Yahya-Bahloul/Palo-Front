"use client";

import { useState, useEffect } from "react";
import { Player } from "@/model/player";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { theme } from "@/styles/theme";

type Props = {
  players: Player[];
  currentPlayerId?: string;
};

export function PlayerSection({ players, currentPlayerId }: Props) {
  const [animateNew, setAnimateNew] = useState<string | null>(null);

  useEffect(() => {
    const lastPlayer = players[players.length - 1];
    if (lastPlayer && players.length > 0) {
      setAnimateNew(lastPlayer.id);
      const timer = setTimeout(() => setAnimateNew(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [players]);

  return (
    <div className={theme.layout.card}>
      <div className="flex justify-between items-center mb-2 text-[#f4a261]">
        <h2 className={theme.playerSection.title}>
          <UserRound className={theme.playerSection.icon} />
          Joueurs ({players.length})
        </h2>
        <span className={theme.playerSection.online}>En ligne</span>
      </div>

      <ul className={theme.playerCard.container}>
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId;
          const isNew = animateNew === player.id;

          return (
            <li
              key={player.id}
              className={[
                theme.playerCard.item,
                theme.playerCard.baseBg,
                isCurrent ? theme.playerCard.highlight : theme.playerCard.hover,
                isNew ? theme.playerCard.newPlayer : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className={theme.playerCard.avatar}>
                  <Image
                    src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`}
                    alt={player.name}
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
                <span className={theme.playerCard.name}>{player.name}</span>
              </div>

              {isCurrent && (
                <span className={theme.playerCard.badge}>VOUS</span>
              )}
            </li>
          );
        })}
      </ul>

      {players.length === 0 && (
        <div className={theme.playerCard.placeholder}>
          En attente de joueurs...
        </div>
      )}
    </div>
  );
}
