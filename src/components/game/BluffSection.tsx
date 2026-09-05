// src/components/game/BluffSection.tsx
"use client";

// src/components/game/BluffSection.tsx
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Send, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { isBluffTooClose, normalizeText } from "@/utils/similarityUtils";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { capitalizeFirst } from "@/lib/utils";

type Props = {
  handleSubmitGuess: (bluff: string) => void;
  question: string;
  answer: string;
  currentQuestionImageUrl?: string;
  /** Bumped when the server refuses a bluff, so the input can re-open. */
  guessRejectedNonce?: number;
  /** Reason for the most recent rejection — 'too_late' locks the UI instead of reopening it. */
  guessRejectedReason?: string | null;
};

export function BluffSection({
  handleSubmitGuess,
  question,
  answer,
  currentQuestionImageUrl,
  guessRejectedNonce = 0,
  guessRejectedReason = null,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [bluff, setBluff] = useState("");

  const keyboardInset = useKeyboardInset();
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => () => clearTimeout(blurTimeoutRef.current), []);

  // True while the field has focus, i.e. while the on-screen keyboard is up.
  // Drives a compact layout so the image and the question stay visible in the
  // shrunken viewport instead of being pushed above the fold.
  const [typing, setTyping] = useState(false);

  // Wait for the keyboard's slide-in before scrolling, so the browser measures
  // the resized viewport rather than the pre-keyboard one.
  const revealInput = () => {
    clearTimeout(blurTimeoutRef.current);
    setTyping(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 350);
  };
  const [submitted, setSubmitted] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const [similarBluffDetected, setSimilarBluffDetected] = useState(false);
  // Set once a halve_time malus's real deadline has passed for this player —
  // unlike a plain rejection, retrying is pointless, so the UI locks instead
  // of reopening the input.
  const [timedOut, setTimedOut] = useState(false);

  // The server refused the bluff. A halve_time malus locks the UI for good;
  // any other reason (matched the answer, empty) re-opens the input instead
  // of leaving the player waiting on a guess that was never recorded.
  useEffect(() => {
    if (guessRejectedNonce === 0) return;
    if (guessRejectedReason === "too_late") {
      setSubmitted(true);
      setTimedOut(true);
      return;
    }
    setSubmitted(false);
    setIsExactMatch(true);
  }, [guessRejectedNonce, guessRejectedReason]);

  // Only float when a keyboard is actually occluding the view — on desktop,
  // and on any browser without visualViewport, the button stays in the flow.
  const floatingSubmit = typing && keyboardInset > 0;

  const handleSubmit = () => {
    // Any non-blank text is a valid bluff, even one that's only punctuation or
    // symbols. The answer/similarity checks below still run, but only when the
    // bluff has comparable letters (a symbols-only bluff normalizes to "").
    const raw = bluff.trim();
    if (!raw) return;

    const cleanBluff = normalizeText(bluff);
    const cleanAnswer = normalizeText(answer);

    if (cleanAnswer && cleanBluff && cleanBluff === cleanAnswer) {
      setIsExactMatch(true);
      setSimilarBluffDetected(false);
      return;
    }

    if (cleanBluff && isBluffTooClose(bluff, answer)) {
      setSimilarBluffDetected(true);
      setIsExactMatch(false);
      return;
    }

    setIsExactMatch(false);
    setSimilarBluffDetected(false);
    handleSubmitGuess(raw);
    setSubmitted(true);
    // The input unmounts on submit, so no blur fires to clear this.
    clearTimeout(blurTimeoutRef.current);
    setTyping(false);
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
          {timedOut
            ? t(
                "bonusMalus.timeHalvedExpired",
                "Ton temps réduit est écoulé — trop tard pour répondre."
              )
            : t("waitingForOthers")}
        </p>
      ) : (
        <div className="w-full space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={bluff}
            onChange={(e) => setBluff(e.target.value)}
            onFocus={revealInput}
            // Deferred: tapping the floating submit button blurs the input
            // first. Clearing `typing` synchronously would drop the button back
            // into the flow before the click landed, so the tap would miss.
            onBlur={() => {
              clearTimeout(blurTimeoutRef.current);
              blurTimeoutRef.current = setTimeout(() => setTyping(false), 150);
            }}
            placeholder={t("bluffInputPlaceholder")}
            className={theme.bluffSection.input}
            disabled={submitted}
            // Deliberately not autofocused: the keyboard used to cover the
            // image and the question the moment the round started, before the
            // player had read either.
          />

          {/* While the keyboard is up the button lifts out of the flow and
              parks just above it, so it is reachable without scrolling. The
              spacer keeps the card from collapsing as it leaves. */}
          {floatingSubmit && <div aria-hidden="true" className="h-[3.25rem]" />}
          <div
            className={
              floatingSubmit
                ? "fixed left-0 right-0 z-30 px-5 mx-auto max-w-sm"
                : ""
            }
            style={
              floatingSubmit ? { bottom: keyboardInset + 8 } : undefined
            }
          >
            <button
              onClick={handleSubmit}
              disabled={submitted || bluff.trim().length === 0}
              className={theme.bluffSection.button.base}
            >
              <Send className="h-4 w-4" />
              {t("submitBluff")}
            </button>
          </div>

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
