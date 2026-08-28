"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "@/model/gameRoom";

type Props = {
  messages: ChatMessage[];
  myPlayerId: string;
  onSend: (text: string) => void;
};

export function ChatPanel({ messages, myPlayerId, onSend }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [seenCount, setSeenCount] = useState(messages.length);
  const listRef = useRef<HTMLDivElement>(null);

  const unread = open ? 0 : Math.max(0, messages.length - seenCount);

  useEffect(() => {
    if (open) {
      setSeenCount(messages.length);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }, [messages, open]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("chat.title", "Chat")}
        className="fixed right-4 z-40 skin-stepper !w-12 !h-12"
        style={{ bottom: "calc(env(safe-area-inset-bottom,0px) + 5.25rem)" }}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[color:var(--skin-accent-2)] text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center px-3"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 4.75rem)",
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md neon-card !rounded-[calc(var(--skin-radius)*0.9)] flex flex-col overflow-hidden max-h-[55dvh]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-[color:var(--skin-border)]">
              <span className="font-display text-sm text-[color:var(--skin-primary)]">
                {t("chat.title", "Chat")}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("close", "Fermer")}
                className="text-[color:var(--skin-muted)] hover:text-[color:var(--skin-text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar"
            >
              {messages.length === 0 && (
                <p className="text-center text-xs text-[color:var(--skin-muted)] font-arcade py-6">
                  {t("chat.empty", "Aucun message pour l’instant")}
                </p>
              )}
              {messages.map((m) => {
                const mine = m.playerId === myPlayerId;
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${
                      mine ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[color:var(--skin-border)] shrink-0">
                      <Image
                        src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${m.avatar}`}
                        alt={m.playerName}
                        width={24}
                        height={24}
                        unoptimized
                      />
                    </div>
                    <div
                      className={`max-w-[75%] px-3 py-1.5 rounded-xl text-sm font-arcade ${
                        mine
                          ? "bg-[color:var(--skin-primary)] text-[color:var(--skin-btn-color)]"
                          : "bg-[color:var(--skin-bg-2)] text-[color:var(--skin-text)] border border-[color:var(--skin-border)]"
                      }`}
                    >
                      {!mine && (
                        <span className="block text-[10px] opacity-70 mb-0.5">
                          {m.playerName}
                        </span>
                      )}
                      <span className="[overflow-wrap:anywhere]">{m.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 p-2.5 border-t-2 border-[color:var(--skin-border)]">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                maxLength={300}
                placeholder={t("chat.placeholder", "Écris un message…")}
                className="neon-input rounded-xl h-10 flex-1 px-3 text-sm"
              />
              <button
                onClick={submit}
                disabled={!draft.trim()}
                aria-label={t("chat.send", "Envoyer")}
                className="skin-stepper !w-10 !h-10 disabled:opacity-40"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
