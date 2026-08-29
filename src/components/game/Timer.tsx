// src/components/game/Timer.tsx
"use client";

import { QuizzType1Phases } from "@/model/Quizz1Phases";

// full time per phase — drives the depletion underline
const PHASE_DURATION: Partial<Record<QuizzType1Phases, number>> = {
  [QuizzType1Phases.GUESSING]: 30,
  [QuizzType1Phases.VOTING]: 30,
};

export function Timer({
  timer,
  phase,
}: {
  timer: number;
  phase: QuizzType1Phases;
}) {
  if (
    phase === QuizzType1Phases.RESULTS ||
    phase === QuizzType1Phases.FINAL_RESULTS ||
    phase === QuizzType1Phases.CATEGORIES
  )
    return null;

  const total = PHASE_DURATION[phase] ?? Math.max(timer, 1);
  const pct = Math.max(0, Math.min(100, (timer / total) * 100));

  const warning = timer > 0 && timer <= 10 && timer > 5;
  const critical = timer > 0 && timer <= 5;

  const color = critical
    ? "var(--skin-danger)"
    : warning
    ? "#f59e0b"
    : "var(--skin-accent)";

  const secs = Math.max(timer, 0);
  const label =
    secs >= 60
      ? `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`
      : `${secs}`;

  return (
    <div className="flex justify-center">
      <div
        className={`inline-flex flex-col items-center gap-1 ${
          critical ? "animate-pulse" : ""
        }`}
      >
        <span
          className="font-display tabular-nums leading-none tracking-wider"
          style={{
            fontSize: "0.95rem",
            color,
            textShadow: `0 0 8px color-mix(in srgb, ${color} 70%, transparent)`,
          }}
        >
          {label}
        </span>
        {/* depletion underline — the non-color cue */}
        <span
          className="block h-[3px] w-14 overflow-hidden rounded-full"
          style={{
            background: "color-mix(in srgb, var(--skin-border) 55%, transparent)",
          }}
        >
          <span
            className="block h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: color,
              boxShadow: `0 0 6px color-mix(in srgb, ${color} 80%, transparent)`,
              transition: "width 1s linear, background 0.3s",
            }}
          />
        </span>
      </div>
    </div>
  );
}
