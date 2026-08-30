// src/components/game/VoteBreakdownSection.tsx
"use client";

import Image from "next/image";
import { Player } from "@/model/player";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { capitalizeFirst } from "@/lib/utils";

type ComputedGuess = {
  key: string;
  text: string;
  authorNames: string[];
  isCorrect: boolean;
  voters: Player[];
};

type Props = {
  computedGuesses: ComputedGuess[];
  question: string;
  currentQuestionImageUrl?: string;
};

export function VoteBreakdownSection({
  computedGuesses,
  question,
  currentQuestionImageUrl,
}: Props) {
  const { t } = useTranslation();

  const getAvatarUrl = (avatar?: string) =>
    avatar
      ? `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(
          avatar
        )}`
      : "";

  const sorted = [
    ...computedGuesses.filter((g) => g.isCorrect),
    ...computedGuesses.filter((g) => !g.isCorrect),
  ];

  return (
    <div className={theme.voteBreakdownSection.container}>
      <h2 className={theme.voteBreakdownSection.title}>
        {t("voteBreakdown.title")}
      </h2>
      <p className={theme.voteBreakdownSection.question}>
        “{capitalizeFirst(question)}”
      </p>
      {currentQuestionImageUrl && (
        <div className="flex w-full justify-center">
          <span className="inline-block overflow-hidden rounded-xl">
            <Image
              src={currentQuestionImageUrl}
              alt="question image"
              width={320}
              height={192}
              className="block max-w-full max-h-44 w-auto h-auto object-contain"
              unoptimized
            />
          </span>
        </div>
      )}
      <div className="space-y-6">
        {sorted.map(({ key, text, voters, authorNames, isCorrect }) => (
          <div
            key={key}
            className={`${theme.voteBreakdownSection.card.base} ${
              isCorrect
                ? theme.voteBreakdownSection.card.correct
                : theme.voteBreakdownSection.card.bluff
            } ${voters.length > 0 ? "pt-4" : ""} relative`}
          >
            {/* Avatar group top-left */}
            <div className="absolute -top-4 left-4 flex flex-row gap-1.5">
              {voters.map((voter) => (
                <div
                  key={voter.id}
                  className={`w-8 h-8 rounded-full border-2 overflow-hidden bg-[color:var(--skin-card)] flex items-center justify-center ${
                    isCorrect
                      ? "border-[color:var(--skin-accent)]"
                      : "border-[color:var(--skin-danger)]"
                  }`}
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
            <p className={theme.voteBreakdownSection.text.guess}>
              {capitalizeFirst(text)}
            </p>

            {/* Author name(s) */}
            <p className={theme.voteBreakdownSection.text.author}>
              {isCorrect
                ? t("voteBreakdown.correctAnswer")
                : authorNames.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
