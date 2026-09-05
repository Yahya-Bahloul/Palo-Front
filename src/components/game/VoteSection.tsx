// src/components/game/VoteSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { capitalizeFirst } from "@/lib/utils";
import { theme } from "@/styles/theme";

type Props = {
  guesses: Record<string, string>;
  handleSubmitVote: (targetId: string) => void;
  question: string;
  currentQuestionImageUrl?: string;
  timer: number;
};

export function VoteSection({
  guesses,
  handleSubmitVote,
  question,
  currentQuestionImageUrl,
  timer,
}: Props) {
  const { t } = useTranslation();
  const [votedId, setVotedId] = useState<string | null>(null);

  // Guards a flash of the timed-out state on the first render, before the
  // countdown effect has produced its first value. VoteSection remounts each
  // voting phase, so this resets on its own.
  const [countdownRunning, setCountdownRunning] = useState(false);
  useEffect(() => {
    if (timer > 0) setCountdownRunning(true);
  }, [timer]);

  // A halve_time malus can run this player's clock out at the halfway mark —
  // once it hits zero the ballot locks, same as the natural end of voting.
  const timedOut = countdownRunning && timer <= 0 && !votedId;
  const locked = !!votedId || timedOut;

  const handleVote = (id: string) => {
    if (locked) return;
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
        <div className="flex w-full justify-center">
          <span className="inline-block overflow-hidden rounded-xl">
            <Image
              src={currentQuestionImageUrl}
              alt={t("voteSection.imageAlt")}
              width={320}
              height={192}
              className="block max-w-full max-h-44 w-auto h-auto object-contain"
              unoptimized
            />
          </span>
        </div>
      )}

      <div className={`w-full space-y-4 ${timedOut ? "opacity-40" : ""}`}>
        {Object.entries(guesses).map(([id, guess]) => (
          <button
            key={id}
            onClick={() => handleVote(id)}
            disabled={locked}
            className={`${
              votedId === id ? theme.phase.option : theme.phase.optionIdle
            } ${votedId && votedId !== id ? "opacity-40" : ""}`}
          >
            {capitalizeFirst(guess)}
          </button>
        ))}
      </div>

      {votedId && (
        <p className={theme.phase.waiting}>{t("voteSection.waiting")}</p>
      )}
      {timedOut && (
        <p className={theme.phase.waiting}>
          {t(
            "bonusMalus.voteTimeOut",
            "Ton temps de vote est écoulé — trop tard pour voter."
          )}
        </p>
      )}
    </div>
  );
}
