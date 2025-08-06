// src/components/game/BluffSection.tsx
"use client";

// src/components/game/BluffSection.tsx
import { useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { isBluffTooClose, normalizeText } from "@/utils/similarityUtils";

type Props = {
  handleSubmitGuess: (bluff: string) => void;
  question: string;
  answer: string;
  currentQuestionImageUrl?: string;
};

export function BluffSection({
  handleSubmitGuess,
  question,
  answer,
  currentQuestionImageUrl,
}: Props) {
  const { t } = useTranslation();
  const [bluff, setBluff] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [similarBluffDetected, setSimilarBluffDetected] = useState(false);

  const handleSubmit = () => {
    const cleanBluff = normalizeText(bluff);
    const cleanAnswer = normalizeText(answer);

    if (cleanBluff === cleanAnswer) {
      setIsExactMatch(true);
      setSimilarBluffDetected(false);
      return;
    }

    if (isBluffTooClose(bluff, answer)) {
      setSimilarBluffDetected(true);
      setIsExactMatch(false);
      return;
    }

    if (cleanBluff.length > 0) {
      setIsExactMatch(false);
      setSimilarBluffDetected(false);
      handleSubmitGuess(bluff.trim());
      setSubmitted(true);
    }
  };

  return (
    <div className={theme.bluffSection.card}>
      {currentQuestionImageUrl && (
        <div className="flex justify-center mb-4">
          <Image
            src={currentQuestionImageUrl}
            alt={t("questionImageAlt")}
            width={320}
            height={192}
            className="rounded-xl border border-white/20 max-w-xs max-h-48 h-auto w-auto object-contain"
            unoptimized
          />
        </div>
      )}

      <h2 className={theme.bluffSection.text.heading}>{question}</h2>

      {submitted ? (
        <div className="text-center space-y-3">
          <p className={theme.bluffSection.text.waiting}>
            {t("waitingForOthers")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={bluff}
            onChange={(e) => setBluff(e.target.value)}
            placeholder={t("bluffInputPlaceholder")}
            className={theme.bluffSection.input}
            disabled={submitted}
          />

          <button
            onClick={handleSubmit}
            disabled={submitted || bluff.trim().length === 0}
            className={`${theme.bluffSection.button.base} ${
              bluff.trim().length > 0 && !submitted
                ? theme.bluffSection.button.enabled
                : theme.bluffSection.button.disabled
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t("submitBluff")}</span>
          </button>

          {isExactMatch && (
            <p className={theme.bluffSection.text.error}>
              <AlertTriangle className={theme.bluffSection.icon.warning} />
              {t("exactMatchWarning")}
            </p>
          )}

          {similarBluffDetected && !isExactMatch && (
            <p className={theme.bluffSection.text.warning}>
              <AlertTriangle className={theme.bluffSection.icon.warning} />
              {t("tooCloseWarning")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
