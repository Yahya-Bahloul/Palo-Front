// src/app/room/Timer.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { QuizzType1Phases } from "@/model/Quizz1Phases";
import { Clock } from "lucide-react";

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

  let badgeColor = "bg-yellow-300 text-black border-black"; // 🟡
  if (timer <= 10 && timer > 5)
    badgeColor = "bg-orange-400 text-black border-black"; // 🟠
  else if (timer <= 5) badgeColor = "bg-red-500 text-white border-black"; // 🔴

  return (
    <div className="flex justify-center mt-6">
      <Badge
        variant="default"
        className={`${badgeColor} border-4 px-4 py-2 rounded-full font-mono text-lg shadow-[3px_3px_0_0_black] flex items-center gap-2`}
      >
        <Clock className="w-5 h-5" />
        {timer > 0 ? `${timer}` : ""}
      </Badge>
    </div>
  );
}
