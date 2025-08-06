// src/components/game/WaitingOverlay.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function WaitingOverlay() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
        <h2 className="text-xl font-bold text-amber-800 text-center">
          {t("waitingOverlay.title")}
        </h2>
        <p className="text-sm text-gray-600 text-center">
          {t("waitingOverlay.message")}
        </p>
      </div>
    </div>
  );
}
