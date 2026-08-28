"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  onLeave: () => void;
};

/**
 * Shown once when a spectator lands in a room whose game is already running.
 * Dismissible: they can choose to wait (stay in the lobby) or leave.
 */
export function WaitingForGameModal({ onLeave }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xs neon-card !rounded-[var(--skin-radius)] p-6 flex flex-col items-center text-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--skin-primary)]" />
        <div className="space-y-1.5">
          <h2 className="font-display text-base text-[color:var(--skin-primary)]">
            {t("waitingOverlay.title")}
          </h2>
          <p className="text-sm text-[color:var(--skin-muted)] font-arcade">
            {t("waitingOverlay.message")}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-1">
          <button onClick={() => setOpen(false)} className="neon-btn w-full py-3 rounded-xl text-sm">
            {t("waitingOverlay.wait", "Attendre")}
          </button>
          <button
            onClick={onLeave}
            className="w-full py-3 rounded-xl text-sm font-arcade font-semibold text-[color:var(--skin-danger)] hover:bg-[color:var(--skin-danger)]/10 transition inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t("waitingOverlay.leave", "Quitter")}
          </button>
        </div>
      </div>
    </div>
  );
}
