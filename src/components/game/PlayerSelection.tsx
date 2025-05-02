"use client";

import { useState, useEffect } from "react";
import { Player } from "@/model/player";
import { UserRound } from "lucide-react";
import Image from "next/image";

type Props = {
  players: Player[];
  currentPlayerId?: string; // To highlight the current player
};

export function PlayerSection({ players, currentPlayerId }: Props) {
  const [animateNew, setAnimateNew] = useState<string | null>(null);

  // Track when new players join to animate them
  useEffect(() => {
    const lastPlayer = players[players.length - 1];
    if (lastPlayer && players.length > 0) {
      setAnimateNew(lastPlayer.id);
      const timer = setTimeout(() => setAnimateNew(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [players]);

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <UserRound className="mr-2 h-5 w-5" />
          Joueurs ({players.length})
        </h2>
        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          En Ligne
        </span>
      </div>

      <ul className="text-white ">
        {players.map((player) => (
          <li
            key={player.id}
            className={`bg-gray-700 px-4 py-3 mt-2 rounded-lg shadow-lg overflow-hidden  flex items-center justify-between 
              ${
                player.id === currentPlayerId
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              } 
              transition-all duration-300
              ${animateNew === player.id ? "animate-pulse bg-green-900" : ""}`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border- border-amber-300 shadow transition-opacity duration-300 mr-2 bg-gray-700">
                <Image
                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`}
                  alt={player.name}
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <span className="font-medium">{player.name}</span>
            </div>

            {player.id === currentPlayerId && (
              <span className="bg-blue-500 text-xs px-2 py-1 rounded text-white font-bold">
                Vous
              </span>
            )}
          </li>
        ))}
      </ul>

      {players.length === 0 && (
        <div className="text-center p-6 text-gray-300 italic bg-gray-800 rounded-lg">
          En attente de joueurs...
        </div>
      )}
    </div>
  );
}
