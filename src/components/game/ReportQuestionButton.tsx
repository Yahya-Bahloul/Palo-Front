"use client";

import { useState } from "react";
import { Check, Flag } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { feedbackService } from "@/service/feedbackService";
import { useAuthStore } from "@/utils/useAuthStore";

type Props = {
  questionId?: string;
  questionText: string;
  category?: string;
  lang?: string;
};

export function ReportQuestionButton({ questionId, questionText, category, lang }: Props) {
  const { t } = useTranslation("common");
  const accessToken = useAuthStore((s) => s.accessToken);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // keep the "thanks" state out of the next report
      setTimeout(() => {
        setComment("");
        setStatus("idle");
      }, 200);
    }
  };

  const submit = async () => {
    setStatus("sending");
    try {
      await feedbackService.reportQuestion(
        { questionId, questionText, category, lang, comment: comment.trim() || undefined },
        accessToken
      );
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-arcade text-[color:var(--skin-muted)] transition hover:text-[color:var(--skin-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--skin-primary)]"
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
        {t("report.button", "Signaler la question")}
      </button>

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="neon-card max-w-sm !rounded-[var(--skin-radius)]">
          {status === "sent" ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="h-6 w-6" aria-hidden="true" />
              </span>
              <DialogTitle className="font-display text-base">
                {t("report.thanks", "Merci, signalement envoyé !")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("report.thanks", "Merci, signalement envoyé !")}
              </DialogDescription>
              <button
                type="button"
                onClick={() => changeOpen(false)}
                className="neon-btn w-full rounded-xl py-3 text-sm"
              >
                {t("ok", "OK")}
              </button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-base">
                  {t("report.title", "Signaler cette question")}
                </DialogTitle>
                <DialogDescription className="font-arcade text-xs text-[color:var(--skin-muted)]">
                  {t("report.description", "Un souci avec cette question ? Dis-nous ce qui ne va pas.")}
                </DialogDescription>
              </DialogHeader>

              <p className="line-clamp-3 rounded-lg border border-[color:var(--skin-border)] px-3 py-2 text-xs text-[color:var(--skin-muted)]">
                {questionText}
              </p>

              <label className="flex flex-col gap-1.5 text-xs font-arcade text-[color:var(--skin-text)]">
                {t("report.commentLabel", "Commentaire (facultatif)")}
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder={t("report.placeholder", "Réponse fausse, faute, question ambiguë…")}
                />
              </label>

              {status === "error" && (
                <p role="alert" className="text-xs font-arcade text-[color:var(--skin-danger)]">
                  {t("report.error", "Envoi impossible. Réessaie plus tard.")}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeOpen(false)}
                  className="min-h-11 flex-1 cursor-pointer rounded-xl border border-[color:var(--skin-border)] text-sm font-arcade text-[color:var(--skin-text)]"
                >
                  {t("report.cancel", "Annuler")}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "sending"}
                  className="neon-btn min-h-11 flex-1 rounded-xl text-sm disabled:opacity-50"
                >
                  {status === "sending" ? t("report.sending", "Envoi…") : t("report.send", "Envoyer")}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
