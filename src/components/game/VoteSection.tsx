// src/components/game/VoteSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { capitalizeFirst } from "@/lib/utils";
import { theme } from "@/styles/theme";

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
    <div className={theme.phase.card}>
      <div className="space-y-1.5">
        <p className={theme.phase.eyebrow}>{t("voteSection.title")}</p>
        <h2 className={theme.phase.title}>“{capitalizeFirst(question)}”</h2>
      </div>

      {currentQuestionImageUrl && (
        <Image
          src={currentQuestionImageUrl}
          alt={t("voteSection.imageAlt")}
          width={320}
          height={192}
          className="max-w-full max-h-44 w-auto h-auto object-contain rounded-xl border-2 border-[color:var(--skin-border)]"
          unoptimized
        />
      )}

      <div className="w-full space-y-4">
        {Object.entries(guesses).map(([id, guess]) => (
          <button
            key={id}
            onClick={() => handleVote(id)}
            disabled={!!votedId}
            className={`${
              votedId === id ? theme.phase.option : theme.phase.optionIdle
            } ${votedId && votedId !== id ? "opacity-40" : ""}`}
          >
            {capitalizeFirst(guess)}
          </button>
        ))}
      </div>

      {votedId && <p className={theme.phase.waiting}>{t("voteSection.waiting")}</p>}
    </div>
  );
}
