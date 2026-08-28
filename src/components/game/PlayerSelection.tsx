// src/components/game/PlayerSection.tsx
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Player } from "@/model/player";
import { CategoryCatalogEntry } from "@/model/category";
import {
  Users,
  CheckSquare,
  Square,
  Lock,
  X,
  Loader2,
  Crown,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import { RoomQRCode } from "./RoomQRCode";
import type React from "react";

// distinct per-player accent colors (readable on both light & dark skins)
const PLAYER_HUES = [
  "#22d3ee",
  "#f472b6",
  "#a3e635",
  "#fbbf24",
  "#818cf8",
  "#fb7185",
  "#34d399",
  "#c084fc",
];

type Props = {
  players: Player[];
  currentPlayerId?: string;
  myPlayerId?: string;
  hostId?: string;
  availableCategories?: CategoryCatalogEntry[];
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  onRequestUnlockCategory?: (category: CategoryCatalogEntry) => void;
  purchasingCategoryKey?: string | null;
  onKickPlayer?: (playerId: string) => void;
  roomId: string;
  isAdmin: boolean;
};

export function PlayerSection({
  players,
  myPlayerId,
  availableCategories = [],
  selectedCategories,
  setSelectedCategories,
  onRequestUnlockCategory,
  purchasingCategoryKey,
  onKickPlayer,
  roomId,
  isAdmin,
  hostId,
}: Props) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [animateNew, setAnimateNew] = useState<string | null>(null);

  const unlockedCategories = availableCategories
    .filter((cat) => cat.unlocked)
    .map((cat) => cat.key);

  useEffect(() => {
    if (unlockedCategories.length > 0) {
      setSelectedCategories(unlockedCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCategories]);

  useEffect(() => {
    const lastPlayer = players[players.length - 1];
    if (lastPlayer && players.length > 0) {
      setAnimateNew(lastPlayer.id);
      const timer = setTimeout(() => setAnimateNew(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [players]);

  const toggleCategory = (category: string) => {
    if (!isAdmin) return;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleAllCategories = () => {
    if (!isAdmin) return;
    setSelectedCategories((prev) =>
      prev.length === unlockedCategories.length ? [] : [...unlockedCategories]
    );
  };

  return (
    <div className={theme.layout.card}>
      <RoomQRCode roomId={roomId} />

      {/* En-tête joueurs */}
      <div className="flex justify-between items-center mb-3">
        <h2 className={theme.playerSection.title}>
          <Users className={theme.playerSection.icon} />
          {t("playerSection.title", { count: players.length })}
        </h2>
        <span className={theme.playerSection.online}>
          <span className="skin-live-dot" aria-hidden />
          {t("playerSection.online")}
        </span>
      </div>

      {/* Grille de joueurs */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {players.map((player, i) => {
          const isMe = player.id === myPlayerId;
          const isHost = hostId ? player.id === hostId : i === 0;
          const isNew = animateNew === player.id;
          const hue = PLAYER_HUES[i % PLAYER_HUES.length];
          const canKick = isAdmin && !isMe;

          return (
            <div
              key={player.id}
              style={{ "--pc": hue } as React.CSSProperties}
              className={`skin-player-card group ${isNew ? "neon-pulse" : ""}`}
            >
              {isHost && (
                <span
                  className="absolute -top-1.5 -left-1.5 z-10 grid place-items-center w-5 h-5 rounded-full"
                  style={{ background: hue }}
                  title="Host"
                >
                  <Crown className="w-3 h-3 text-black" />
                </span>
              )}

              {canKick && (
                <button
                  onClick={() => onKickPlayer?.(player.id)}
                  aria-label={t("playerSection.kick")}
                  title={t("playerSection.kick")}
                  className="absolute -top-1.5 -right-1.5 z-10 grid place-items-center w-5 h-5 rounded-full bg-[color:var(--skin-danger)] text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              <div
                className="w-12 h-12 rounded-full overflow-hidden bg-[color:var(--skin-bg)] border-2"
                style={{ borderColor: hue }}
              >
                <Image
                  src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${player.avatar}`}
                  alt={player.name}
                  width={48}
                  height={48}
                  unoptimized
                />
              </div>
              <span className="mt-1.5 text-[11px] font-arcade font-semibold text-[color:var(--skin-text)] truncate max-w-full">
                {player.name || "—"}
              </span>
              {isMe && (
                <span
                  className="mt-0.5 text-[9px] font-bold px-1.5 rounded uppercase tracking-wide"
                  style={{ background: hue, color: "#000" }}
                >
                  {t("playerSection.you")}
                </span>
              )}
            </div>
          );
        })}

        {/* Invite slot */}
        <div className="skin-player-card !cursor-default border-dashed opacity-70">
          <div className="w-12 h-12 rounded-full grid place-items-center border-2 border-dashed border-[color:var(--skin-border)]">
            <UserPlus className="w-5 h-5 text-[color:var(--skin-muted)]" />
          </div>
          <span className="mt-1.5 text-[10px] font-arcade text-[color:var(--skin-muted)]">
            {t("playerSection.invite", "Inviter")}
          </span>
        </div>
      </div>

      {/* Catégories */}
      {availableCategories.length > 0 && (
        <div className="mt-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex flex-wrap items-center justify-between mb-3 gap-x-3 gap-y-2">
            <h3 className={theme.lobby.sectionTitle}>{t("choose")}</h3>

            {isAdmin && (
              <button
                onClick={toggleAllCategories}
                className="skin-chip px-3 py-1.5 text-xs inline-flex items-center gap-1.5 shrink-0"
              >
                {selectedCategories.length === unlockedCategories.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    {t("unselectAll")}
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    {t("selectAll")}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Boutons de catégorie */}
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const selected = selectedCategories.includes(cat.key);
              const locked = !cat.unlocked;
              const label = t(`category.${cat.key.toLowerCase()}`);

              if (locked) {
                const purchasing = purchasingCategoryKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() =>
                      isAdmin && !purchasing && onRequestUnlockCategory?.(cat)
                    }
                    disabled={!isAdmin || purchasing}
                    className={`${theme.lobby.chip} skin-catchip-locked`}
                  >
                    {purchasing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[color:var(--skin-accent-2)]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[color:var(--skin-accent-2)]" />
                    )}
                    {label}
                  </button>
                );
              }

              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  disabled={!isAdmin}
                  className={`${theme.lobby.chip} ${
                    selected ? theme.lobby.chipOn : ""
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
