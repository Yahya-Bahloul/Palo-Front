// src/components/game/VoteSection.tsx
"use client";

import { useState } from "react";

type Props = {
  guesses: Record<string, string>;
  handleSubmitVote: (targetId: string) => void;
  question: string;
};

export function VoteSection({ guesses, handleSubmitVote, question }: Props) {
  const [votedId, setVotedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    setVotedId(id);
    handleSubmitVote(id);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200">
      <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
        Votez pour la bonne réponse
      </h2>

      <p className="text-sm text-amber-700 italic text-center mb-6">
        “{question}”
      </p>

      <div className="space-y-3">
        {Object.entries(guesses).map(([id, guess]) => (
          <button
            key={id}
            onClick={() => handleVote(id)}
            disabled={!!votedId}
            className={`w-full px-4 py-3 rounded-lg text-black font-medium transition-all border border-amber-300 shadow-sm ${
              votedId === id
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white hover:bg-amber-100"
            } ${
              votedId && votedId !== id ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {guess}
          </button>
        ))}
      </div>

      {votedId && (
        <p className="mt-4 text-sm text-center text-amber-700 italic">
          Vote enregistré ! En attente des autres...
        </p>
      )}
    </div>
  );
}
