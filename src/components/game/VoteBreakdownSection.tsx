// src/components/game/VoteBreakdownSection.tsx
"use client";

import Image from "next/image";
import { Player } from "@/model/player";
import { theme } from "@/styles/theme";

type Props = {
  guesses: Record<string, string>;
  votes: Record<string, string>;
  players: Player[];
  question: string;
  currentPlayerId: string;
};

export function VoteBreakdownSection({
  guesses,
  votes,
  players,
  question,
}: Props) {
  const getAvatarUrl = (avatar?: string) =>
    avatar
      ? `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(
          avatar
        )}`
      : "";

  const guessEntries = Object.entries(guesses).map(([guessId, text]) => {
    const voters = Object.entries(votes)
      .filter(([, targetId]) => targetId === guessId)
      .map(([voterId]) => players.find((p) => p.id === voterId))
      .filter(Boolean) as Player[];

    const player = players.find((p) => p.id === guessId);
    const author =
      player?.name ||
      (guessId.startsWith("CORRECT") ? "La bonne réponse" : "Notre bluff");

    return {
      guessId,
      text,
      voters,
      author,
      isCorrect: guessId.startsWith("CORRECT"),
    };
  });

  const sorted = [
    ...guessEntries.filter((g) => g.isCorrect),
    ...guessEntries.filter((g) => !g.isCorrect),
  ];

  return (
    <div className={theme.voteBreakdownSection.container}>
      <h2 className={theme.voteBreakdownSection.title}>Résultats des votes</h2>
      <p className={theme.voteBreakdownSection.question}>“{question}”</p>

      <div className="space-y-6">
        {sorted.map(({ guessId, text, voters, author, isCorrect }) => (
          <div
            key={guessId}
            className={`${theme.voteBreakdownSection.card.base} ${
              isCorrect
                ? theme.voteBreakdownSection.card.correct
                : theme.voteBreakdownSection.card.bluff
            } ${voters.length > 0 ? "pt-4" : ""} relative`}
          >
            {/* Avatar group top-left */}
            <div className="absolute -top-4 left-4 flex flex-row gap-2">
              {voters.map((voter) => (
                <div
                  key={voter.id}
                  className={`w-10 h-10 rounded-full border-2 border-white shadow-md ${
                    isCorrect ? "bg-green-200" : "bg-red-200"
                  } flex items-center justify-center`}
                  title={voter.name}
                >
                  <Image
                    src={getAvatarUrl(voter.avatar)}
                    alt={voter.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {/* Main guess text */}
            <p className={theme.voteBreakdownSection.text.guess}>{text}</p>

            {/* Author */}
            <p className={theme.voteBreakdownSection.text.author}>{author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
