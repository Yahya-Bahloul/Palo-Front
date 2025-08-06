// src/components/game/VoteSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

type Props = {
  guesses: Record<string, string>;
  handleSubmitVote: (targetId: string) => void;
  question: string;
  currentQuestionImageUrl?: string;
};

export function VoteSection({
  guesses,
  handleSubmitVote,
  question,
  currentQuestionImageUrl,
}: Props) {
  const { t } = useTranslation();
  const [votedId, setVotedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    setVotedId(id);
    handleSubmitVote(id);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200">
      <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">
        {t("voteSection.title")}
      </h2>

      {currentQuestionImageUrl && (
        <div className="flex justify-center my-4">
          <Image
            src={currentQuestionImageUrl}
            alt={t("voteSection.imageAlt")}
            width={320}
            height={192}
            className="max-w-xs max-h-48 w-auto h-auto object-contain rounded-xl border border-white/20"
            unoptimized
          />
        </div>
      )}

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
          {t("voteSection.waiting")}
        </p>
      )}
    </div>
  );
}
