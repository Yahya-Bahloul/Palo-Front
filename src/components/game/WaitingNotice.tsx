// src/components/game/WaitingNotice.tsx
"use client";

import { Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  message: string;
  icon?: ReactNode;
};

export function WaitingNotice({ message, icon }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-md p-6 text-center space-y-4">
      <div className="flex justify-center items-center gap-2 text-amber-800 text-lg font-semibold">
        {icon || <Loader2 className="animate-spin w-5 h-5" />}
        <span>{message}</span>
      </div>
      <p className="text-sm text-amber-700 italic">
        {t("waitingNotice.thanks")}
      </p>
    </div>
  );
}
