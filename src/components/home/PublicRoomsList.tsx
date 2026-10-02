"use client";

import { Loader2, RefreshCw, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PublicRoom } from "@/service/publicRoomsService";

const LANG_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

type Props = {
  rooms: PublicRoom[] | null;
  error: boolean;
  gone: boolean;
  canJoin: boolean;
  onJoin: (roomId: string) => void;
  onRetry: () => void;
};

export function PublicRoomsList({ rooms, error, gone, canJoin, onJoin, onRetry }: Props) {
  const { t } = useTranslation("common");

  return (
    <section className="space-y-3" aria-label={t("online.title", "Parties publiques")}>
      <p className="text-center font-arcade text-xs text-[color:var(--skin-muted)]">
        {t("online.subtitle", "Rejoins une partie ouverte et joue avec d’autres joueurs.")}
      </p>

      {gone && (
        <p role="alert" className="text-center font-arcade text-xs text-[color:var(--skin-danger)]">
          {t("online.gone", "Cette partie vient de commencer. Choisis-en une autre.")}
        </p>
      )}

      {rooms === null && !error && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-6 font-arcade text-xs text-[color:var(--skin-muted)]"
        >
          <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {t("online.loading", "Chargement…")}
        </div>
      )}

      {error && rooms === null && (
        <div className="space-y-2 py-3 text-center">
          <p role="alert" className="font-arcade text-xs text-[color:var(--skin-danger)]">
            {t("online.error", "Impossible de charger les parties.")}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--skin-border)] px-4 font-arcade text-xs text-[color:var(--skin-text)]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t("online.retry", "Réessayer")}
          </button>
        </div>
      )}

      {rooms && rooms.length === 0 && (
        <p className="py-4 text-center font-arcade text-xs text-[color:var(--skin-muted)]">
          {t("online.empty", "Aucune partie ouverte pour le moment.")}
        </p>
      )}

      {rooms && rooms.length > 0 && (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="flex items-center gap-3 rounded-xl border border-[color:var(--skin-border)] bg-[color:var(--skin-bg-2)]/50 px-3 py-2"
            >
              <span className="shrink-0 rounded-md bg-[color:var(--skin-primary)]/15 px-2 py-1 font-arcade text-[11px] font-bold uppercase text-[color:var(--skin-primary)]">
                {room.lang}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-arcade text-sm font-semibold text-[color:var(--skin-text)]">
                  {LANG_NAMES[room.lang] ?? room.lang}
                </p>
                <p className="truncate font-arcade text-[11px] text-[color:var(--skin-muted)]">
                  {room.hostName
                    ? t("online.hostedBy", { name: room.hostName, defaultValue: "Hôte : {{name}}" })
                    : t("online.waiting", "En attente de joueurs")}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 font-arcade text-sm text-[color:var(--skin-text)]">
                <Users className="h-4 w-4 text-[color:var(--skin-muted)]" aria-hidden="true" />
                <span className="tabular-nums">{room.playerCount}</span>
                <span className="sr-only">{t("online.players", "joueurs")}</span>
              </span>
              <button
                type="button"
                disabled={!canJoin}
                onClick={() => onJoin(room.id)}
                className="min-h-11 shrink-0 cursor-pointer rounded-lg bg-[color:var(--skin-primary)] px-3 font-arcade text-xs font-bold text-[color:var(--skin-bg)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("online.join", "Rejoindre")}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!canJoin && rooms && rooms.length > 0 && (
        <p className="text-center font-arcade text-[11px] text-[color:var(--skin-muted)]">
          {t("online.nameRequired", "Entre ton nom pour rejoindre.")}
        </p>
      )}
    </section>
  );
}
