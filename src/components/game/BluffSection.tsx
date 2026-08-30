// src/components/game/BluffSection.tsx
"use client";

// src/components/game/BluffSection.tsx
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Send, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { isBluffTooClose, normalizeText } from "@/utils/similarityUtils";
import { capitalizeFirst } from "@/lib/utils";

type Props = {
  handleSubmitGuess: (bluff: string) => void;
  question: string;
  answer: string;
  currentQuestionImageUrl?: string;
  /** Bumped when the server refuses a bluff, so the input can re-open. */
  guessRejectedNonce?: number;
};

export function BluffSection({
  handleSubmitGuess,
  question,
  answer,
  currentQuestionImageUrl,
  guessRejectedNonce = 0,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [bluff, setBluff] = useState("");

  // True while the field has focus, i.e. while the on-screen keyboard is up.
  // Drives a compact layout so the image and the question stay visible in the
  // shrunken viewport instead of being pushed above the fold.
  const [typing, setTyping] = useState(false);

  // Wait for the keyboard's slide-in before scrolling, so the browser measures
  // the resized viewport rather than the pre-keyboard one.
  const revealInput = () => {
    setTyping(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 350);
  };
  const [submitted, setSubmitted] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [similarBluffDetected, setSimilarBluffDetected] = useState(false);

  // The server refused the bluff (it matched the answer). Re-open the input
  // rather than leaving the player waiting on a guess that was never recorded.
  useEffect(() => {
    if (guessRejectedNonce === 0) return;
    setSubmitted(false);
    setIsExactMatch(true);
  }, [guessRejectedNonce]);

  const handleSubmit = () => {
    const cleanBluff = normalizeText(bluff);
    const cleanAnswer = normalizeText(answer);

    if (!cleanBluff) return;

    // Guarded on non-empty: when both sides normalized to "" (every non-Latin
    // script did, before the normalizeText fix) this branch swallowed every
    // submission.
    if (cleanAnswer && cleanBluff === cleanAnswer) {
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
      // The input unmounts on submit, so no blur fires to clear this.
      setTyping(false);
    }
  };

  return (
    <div
      className={`${theme.bluffSection.card} ${
        typing ? "gap-3 p-4 sm:gap-5 sm:p-6" : ""
      } transition-[gap,padding] duration-200 motion-reduce:transition-none`}
    >
      {currentQuestionImageUrl && (
        <div className="flex w-full justify-center">
          <span className="inline-block overflow-hidden rounded-xl">
            <Image
              src={currentQuestionImageUrl}
              alt={t("questionImageAlt")}
              width={320}
              height={192}
              // Shrinks only while typing, and only on phones — a desktop
              // browser has no keyboard eating the viewport.
              className={`block max-w-full h-auto w-auto object-contain transition-[max-height] duration-200 motion-reduce:transition-none ${
                typing ? "max-h-24 sm:max-h-44" : "max-h-44"
              }`}
              unoptimized
            />
          </span>
        </div>
      )}

      <div className="space-y-1.5">
        {/* The eyebrow is redundant once the player is answering; dropping it
            while typing buys back a row on a keyboard-shrunk viewport. */}
        <p
          className={`font-arcade text-xs uppercase tracking-[0.2em] text-[color:var(--skin-accent)] ${
            typing ? "hidden sm:block" : ""
          }`}
        >
          {t("bluffSection.questionLabel", "Question")}
        </p>
        <h2
          className={`${theme.bluffSection.text.heading} ${
            typing ? "text-sm sm:text-lg" : ""
          }`}
        >
          {capitalizeFirst(question)}
        </h2>
      </div>

      {submitted ? (
        <p className={theme.bluffSection.text.waiting}>
          <Clock className="inline w-4 h-4 mr-1.5 -mt-0.5" />
          {t("waitingForOthers")}
        </p>
      ) : (
        <div className="w-full space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={bluff}
            onChange={(e) => setBluff(e.target.value)}
            onFocus={revealInput}
            onBlur={() => setTyping(false)}
            placeholder={t("bluffInputPlaceholder")}
            className={theme.bluffSection.input}
            disabled={submitted}
            // Deliberately not autofocused: the keyboard used to cover the
            // image and the question the moment the round started, before the
            // player had read either.
          />

          <button
            onClick={handleSubmit}
            disabled={submitted || bluff.trim().length === 0}
            className={theme.bluffSection.button.base}
          >
            <Send className="h-4 w-4" />
            {t("submitBluff")}
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
