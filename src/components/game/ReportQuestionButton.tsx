"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onReport: (message?: string) => void;
  alreadyReported: boolean;
};

// Lets a player flag the current question as wrong/broken/offensive. The
// message is optional — a bare tap reports it, the textarea is just for
// players who want to add context.
export function ReportQuestionButton({ onReport, alreadyReported }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const submit = () => {
    onReport(draft.trim() || undefined);
    setDraft("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={alreadyReported}
        aria-label={t("room.reportQuestion.button", "Signaler la question")}
        className="skin-stepper !w-9 !h-9 disabled:opacity-40"
      >
        <Flag className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xs neon-card !rounded-[var(--skin-radius)] p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-base text-[color:var(--skin-primary)]">
                {t("room.reportQuestion.title", "Signaler cette question")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("close", "Fermer")}
                className="shrink-0 text-[color:var(--skin-muted)] hover:text-[color:var(--skin-text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[color:var(--skin-muted)] font-arcade">
              {t(
                "room.reportQuestion.description",
                "Réponse fausse, faute, contenu choquant... Un message est facultatif."
              )}
            </p>

            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t(
                "room.reportQuestion.placeholder",
                "Précise le problème (facultatif)…"
              )}
              className="neon-input rounded-xl text-sm resize-none"
            />

            <div className="w-full flex flex-col gap-2 pt-1">
              <button onClick={submit} className="neon-btn w-full py-3 rounded-xl text-sm">
                {t("room.reportQuestion.submit", "Signaler")}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl text-sm font-arcade text-[color:var(--skin-muted)] hover:text-[color:var(--skin-text)] transition"
              >
                {t("cancel", "Annuler")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
