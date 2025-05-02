"use client";

import { Player } from "@/model/player";
import { ThumbsUp, CheckCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  players: Player[];
  votes: Record<string, string>;
  isFinalResult?: boolean;
};

export function ResultSection({
  players,
  votes,
  isFinalResult = false,
}: Props) {
  const sortedPlayers = [...players]
    .filter((p) => !p.joinedLate)
    .sort((a, b) => b.score - a.score);
  const topScore = sortedPlayers[0]?.score ?? 0;

  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return "";
    return `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(
      avatar
    )}`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200 space-y-6">
      <h2 className="text-xl font-bold text-amber-800 text-center">
        {isFinalResult ? "🏆 Résultats finaux" : "📊 Résultats du round"}
      </h2>

      {/* Classement final */}
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              player.score === topScore
                ? "bg-amber-500 text-black font-bold"
                : "bg-amber-300 text-black"
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border">
              <Image
                src={getAvatarUrl(player.avatar)}
                alt="Avatar"
                width={32}
                height={32}
                unoptimized
              />
            </div>
            <span className="flex-1 text-left">
              {index === 0 && isFinalResult ? "🥇 " : ""}
              {player.name}
            </span>
            <span>{player.score} pts</span>
          </div>
        ))}
      </div>

      {/* Votes uniquement en phase intermédiaire */}
      {!isFinalResult && (
        <div className="pt-4 space-y-3 border-t border-amber-300">
          <h3 className="text-md font-semibold text-amber-800 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-amber-700" />
            Votes des joueurs
          </h3>

          {Object.entries(votes).map(([voterId, targetId]) => {
            const voter = players.find((p) => p.id === voterId);
            const target = players.find((p) => p.id === targetId);
            const isCorrectVote = targetId.startsWith("CORRECT_");

            const voteClass = isCorrectVote
              ? "bg-green-100 border-green-300"
              : "bg-red-100 border-red-300";

            return (
              <div
                key={voterId}
                className={`text-sm rounded-md px-4 py-2 shadow-sm border ${voteClass} flex items-center justify-between`}
              >
                <div className="flex items-center gap-3 text-gray-800">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-amber-400">
                    <Image
                      src={getAvatarUrl(voter?.avatar)}
                      alt="Avatar"
                      width={28}
                      height={28}
                      unoptimized
                    />
                  </div>
                  <span className="font-medium text-black">
                    {voter?.name || "Anonyme"}
                  </span>
                  {isCorrectVote ? (
                    <span>a trouvé la bonne réponse</span>
                  ) : (
                    <>
                      <span>a voté pour</span>
                      <span className="font-semibold text-amber-800 ml-1">
                        {target?.name || "?"}
                      </span>
                    </>
                  )}
                </div>

                {isCorrectVote && (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
