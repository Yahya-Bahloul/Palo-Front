// src/components/game/BluffSection.tsx
"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { theme } from "@/styles/theme";
import { isBluffTooClose, normalizeText } from "@/utils/similarityUtils";

type Props = {
  handleSubmitGuess: (bluff: string) => void;
  question: string;
  answer: string;
};

export function BluffSection({ handleSubmitGuess, question, answer }: Props) {
  const [bluff, setBluff] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [similarBluffDetected, setSimilarBluffDetected] = useState(false);

  const handleSubmit = () => {
    console.log("Submitting bluff:", bluff);
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
      <h2 className={theme.bluffSection.text.heading}>{question}</h2>

      {submitted ? (
        <div className="text-center space-y-3">
          <p className={theme.bluffSection.text.waiting}>
            En attente des autres joueurs...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={bluff}
            onChange={(e) => setBluff(e.target.value)}
            placeholder="Écris ta fausse réponse ici"
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
            <span>Soumettre le bluff</span>
          </button>

          {isExactMatch && (
            <p className={theme.bluffSection.text.error}>
              <AlertTriangle className={theme.bluffSection.icon.warning} />
              Tu as trouvé la bonne réponse ! Essaie un autre bluff 😏
            </p>
          )}

          {similarBluffDetected && !isExactMatch && (
            <p className={theme.bluffSection.text.warning}>
              <AlertTriangle className={theme.bluffSection.icon.warning} />
              Ta réponse est trop proche de la bonne... Essaie d’être plus
              créatif 😉
            </p>
          )}
        </div>
      )}
    </div>
  );
}
