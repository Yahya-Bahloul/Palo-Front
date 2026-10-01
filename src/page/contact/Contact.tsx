"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, HelpCircle, Lightbulb, Loader2, MessageCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FeedbackError, FeedbackType, feedbackService } from "@/service/feedbackService";
import { useAuthStore } from "@/utils/useAuthStore";

const TYPES: { id: FeedbackType; icon: typeof MessageCircle }[] = [
  { id: "contact", icon: MessageCircle },
  { id: "feature", icon: Lightbulb },
  { id: "question", icon: HelpCircle },
];

export function ContactPage() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [type, setType] = useState<FeedbackType>("contact");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "tooMany">("idle");

  const close = () => router.replace("/");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) return;
    setStatus("sending");
    try {
      await feedbackService.sendFeedback(
        { type, message: message.trim(), email: email.trim() || undefined, lang: i18n.language },
        accessToken
      );
      setStatus("sent");
    } catch (err) {
      setStatus(err instanceof FeedbackError && err.status === 429 ? "tooMany" : "error");
    }
  };

  const field =
    "flex flex-col gap-1.5 text-xs uppercase tracking-wider font-arcade text-[color:var(--skin-muted)]";

  return (
    <div className={`${theme.home.wrapper} relative`}>
      <div className={`${theme.home.card} relative`}>
        <button
          type="button"
          onClick={close}
          aria-label={t("purchases.close", "Fermer")}
          className="absolute top-3 end-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[color:var(--skin-muted)] transition hover:text-[color:var(--skin-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--skin-primary)]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="font-display text-xl text-[color:var(--skin-text)]">
              {t("contact.thanksTitle", "Merci !")}
            </h1>
            <p className="font-arcade text-sm text-[color:var(--skin-muted)]">
              {t("contact.thanksText", "Ton message a bien été envoyé.")}
            </p>
            <button type="button" onClick={close} className={theme.home.actionButton}>
              {t("contact.backHome", "Retour à l’accueil")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setStatus("idle");
              }}
              className="min-h-11 cursor-pointer text-xs font-arcade text-[color:var(--skin-muted)] underline"
            >
              {t("contact.another", "Envoyer un autre message")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className={`${theme.home.cardContent} pb-6`}>
            <header className="space-y-1 pt-2 text-center">
              <h1 className="font-display text-2xl text-[color:var(--skin-primary)] neon-text-glow">
                {t("contact.title", "Nous contacter")}
              </h1>
              <p className="font-arcade text-xs text-[color:var(--skin-muted)]">
                {t("contact.subtitle", "Une question, une idée ou une question à proposer ? On te lit.")}
              </p>
            </header>

            <div
              role="radiogroup"
              aria-label={t("contact.typeLabel", "Type de message")}
              className="grid grid-cols-3 gap-2"
            >
              {TYPES.map(({ id, icon: Icon }) => {
                const selected = type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setType(id)}
                    className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center text-[11px] font-arcade leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--skin-primary)] ${
                      selected
                        ? "border-[color:var(--skin-primary)] bg-[color:var(--skin-primary)]/15 text-[color:var(--skin-text)]"
                        : "border-[color:var(--skin-border)] text-[color:var(--skin-muted)] hover:text-[color:var(--skin-text)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {t(`contact.types.${id}`)}
                  </button>
                );
              })}
            </div>

            <label className={field}>
              {t("contact.messageLabel", "Ton message")}
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={3}
                maxLength={2000}
                rows={6}
                placeholder={t(`contact.placeholders.${type}`)}
                className="text-sm normal-case tracking-normal"
              />
            </label>

            <label className={field}>
              {t("contact.emailLabel", "Ton e-mail (facultatif)")}
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm normal-case tracking-normal"
              />
              <span className="text-[11px] normal-case tracking-normal">
                {t("contact.emailHint", "Pour qu’on puisse te répondre.")}
              </span>
            </label>

            {(status === "error" || status === "tooMany") && (
              <p role="alert" className="text-center text-xs font-arcade text-[color:var(--skin-danger)]">
                {status === "tooMany"
                  ? t("contact.tooMany", "Trop de messages envoyés, réessaie dans quelques minutes.")
                  : t("contact.error", "Envoi impossible. Réessaie plus tard.")}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending" || message.trim().length < 3}
              className={`${theme.home.actionButton} flex items-center justify-center gap-2`}
            >
              {status === "sending" && (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              )}
              {status === "sending" ? t("contact.sending", "Envoi…") : t("contact.send", "Envoyer")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
