import { Shield, Sparkles, TimerOff, Eraser, HelpCircle } from "lucide-react";
import type { PowerupType } from "@/model/player";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import type { ComponentType } from "react";

export const POWERUP_ICONS: Record<
  PowerupType,
  ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  shield: Shield,
  double_points: Sparkles,
  halve_time: TimerOff,
  erase_answer: Eraser,
  fake_answer: HelpCircle,
};

export const POWERUP_KIND: Record<PowerupType, "bonus" | "malus"> = {
  shield: "bonus",
  double_points: "bonus",
  halve_time: "malus",
  erase_answer: "malus",
  fake_answer: "malus",
};

// The three malus types require tapping an opponent before they fire; the
// two bonuses are self-only and fire on a single tap.
export const TARGETED_POWERUPS: PowerupType[] = [
  "halve_time",
  "erase_answer",
  "fake_answer",
];

// Mirrors GameService's POWERUP_ALLOWED_PHASES — purely cosmetic here (the
// server is the real gate), used only to grey out a chip that would be
// rejected in the current phase. Every powerup is cast during GUESSING;
// erase_answer/fake_answer are picked then but hit the target's ballot at
// voting time.
export const POWERUP_ALLOWED_PHASES: Record<PowerupType, QuizzType1Phases[]> = {
  shield: [QuizzType1Phases.GUESSING],
  double_points: [QuizzType1Phases.GUESSING],
  halve_time: [QuizzType1Phases.GUESSING],
  erase_answer: [QuizzType1Phases.GUESSING],
  fake_answer: [QuizzType1Phases.GUESSING],
};

export const ALL_POWERUP_TYPES: PowerupType[] = [
  "shield",
  "double_points",
  "halve_time",
  "erase_answer",
  "fake_answer",
];
