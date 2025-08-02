import { QuizzType1Phases } from "@/model/Quizz1Phases";

// src/app/room/Timer.tsx
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
  return (
    <div className="text-center text-xl font-bold text-amber-700 mt-6">
      {timer > 0 ? `Temps restant: ${timer}s` : ""}
    </div>
  );
}
