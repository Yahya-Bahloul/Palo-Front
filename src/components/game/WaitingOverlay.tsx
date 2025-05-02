"use client";

import { Loader2 } from "lucide-react";

export function WaitingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <h2 className="text-xl font-bold text-amber-800 text-center">
          Une partie est en cours
        </h2>
        <p className="text-sm text-gray-600 text-center">
          {`Merci de patienter jusqu'à la prochaine manche...`}
        </p>
      </div>
    </div>
  );
}
